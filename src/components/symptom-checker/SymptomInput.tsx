import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Search, Plus, Stethoscope } from 'lucide-react';
import { getAllSymptoms, Disease } from '@/lib/knn';

interface SymptomInputProps {
  diseases: Disease[];
  selectedSymptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
  onPredict: () => void;
  loading?: boolean;
}

export function SymptomInput({ 
  diseases, 
  selectedSymptoms, 
  onSymptomsChange, 
  onPredict,
  loading 
}: SymptomInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const allSymptoms = useMemo(() => getAllSymptoms(diseases), [diseases]);
  
  const filteredSymptoms = useMemo(() => {
    if (!searchTerm) return allSymptoms.slice(0, 20);
    return allSymptoms.filter(s => 
      s.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allSymptoms, searchTerm]);

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      onSymptomsChange([...selectedSymptoms, symptom]);
    }
    setSearchTerm('');
  };

  const removeSymptom = (symptom: string) => {
    onSymptomsChange(selectedSymptoms.filter(s => s !== symptom));
  };

  const addCustomSymptom = () => {
    if (searchTerm.trim() && !selectedSymptoms.includes(searchTerm.trim().toLowerCase())) {
      onSymptomsChange([...selectedSymptoms, searchTerm.trim().toLowerCase()]);
      setSearchTerm('');
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary" />
          <CardTitle>Symptom Checker</CardTitle>
        </div>
        <CardDescription>
          Select your symptoms to get a disease prediction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected symptoms */}
        {selectedSymptoms.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Selected Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <Badge 
                  key={symptom} 
                  variant="secondary"
                  className="px-3 py-1 text-sm"
                >
                  {symptom}
                  <button
                    onClick={() => removeSymptom(symptom)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Search input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Add Symptoms</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search or type a symptom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredSymptoms.length > 0) {
                      addSymptom(filteredSymptoms[0]);
                    } else if (searchTerm.trim()) {
                      addCustomSymptom();
                    }
                  }
                }}
                className="pl-10"
              />
            </div>
            {searchTerm && !allSymptoms.includes(searchTerm.toLowerCase()) && (
              <Button size="icon" variant="outline" onClick={addCustomSymptom}>
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Symptom suggestions */}
        <ScrollArea className="h-[200px] border rounded-md">
          <div className="p-2 space-y-1">
            {filteredSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => addSymptom(symptom)}
                disabled={selectedSymptoms.includes(symptom)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedSymptoms.includes(symptom)
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {symptom}
              </button>
            ))}
            {filteredSymptoms.length === 0 && searchTerm && (
              <p className="text-sm text-muted-foreground p-3">
                No matching symptoms. Press Enter to add "{searchTerm}" as custom symptom.
              </p>
            )}
          </div>
        </ScrollArea>

        {/* Predict button */}
        <Button 
          onClick={onPredict} 
          className="w-full"
          disabled={selectedSymptoms.length === 0 || loading}
          size="lg"
        >
          {loading ? 'Analyzing...' : `Predict Disease (${selectedSymptoms.length} symptoms)`}
        </Button>
      </CardContent>
    </Card>
  );
}
