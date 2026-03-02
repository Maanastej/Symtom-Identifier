import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, CheckCircle, Pill, Shield, ExternalLink, FileText, Brain, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export interface AIPrediction {
  disease_name: string;
  confidence: number;
  matched_symptoms: string[];
  severity: string;
  is_communicable: boolean;
  precautions: string[];
  medications: string[];
  reasoning: string;
}

interface PredictionResultsProps {
  results: AIPrediction[];
  generalAdvice: string;
  urgency: string;
  onReportCase: (result: AIPrediction) => void;
}

const severityColors = {
  mild: 'bg-green-500/10 text-green-700 border-green-200',
  moderate: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  severe: 'bg-orange-500/10 text-orange-700 border-orange-200',
  critical: 'bg-red-500/10 text-red-700 border-red-200'
};

const urgencyColors = {
  low: 'border-green-500 bg-green-50 text-green-800',
  medium: 'border-yellow-500 bg-yellow-50 text-yellow-800',
  high: 'border-orange-500 bg-orange-50 text-orange-800',
  emergency: 'border-red-500 bg-red-50 text-red-800'
};

const pharmacyLinks = [
  { name: 'Apollo Pharmacy', url: 'https://www.apollopharmacy.in/search-medicines/' },
  { name: '1mg', url: 'https://www.1mg.com/search/all?name=' },
  { name: 'PharmEasy', url: 'https://pharmeasy.in/search/all?name=' },
  { name: 'Netmeds', url: 'https://www.netmeds.com/catalogsearch/result?q=' }
];

export function PredictionResults({ results, generalAdvice, urgency, onReportCase }: PredictionResultsProps) {
  if (results.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Prediction Results
          </CardTitle>
          <CardDescription>
            Enter your symptoms to get AI-powered disease predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mb-4 opacity-50" />
          <p>No predictions yet</p>
          <p className="text-sm">Add symptoms and click predict</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Prediction Results
        </CardTitle>
        <CardDescription>
          Powered by Custom Prediction Model - Found {results.length} possible condition{results.length > 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Urgency Alert */}
        {urgency && (
          <Alert className={urgencyColors[urgency as keyof typeof urgencyColors] || urgencyColors.medium}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="capitalize">{urgency} Urgency</AlertTitle>
            <AlertDescription>
              {urgency === 'emergency' && 'Seek immediate medical attention!'}
              {urgency === 'high' && 'Please consult a doctor soon.'}
              {urgency === 'medium' && 'Consider scheduling a doctor visit.'}
              {urgency === 'low' && 'Monitor your symptoms and rest.'}
            </AlertDescription>
          </Alert>
        )}

        {/* General Advice */}
        {generalAdvice && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>AI Advice:</strong> {generalAdvice}
            </p>
          </div>
        )}

        <Accordion type="single" collapsible defaultValue="item-0" className="space-y-2">
          {results.map((result, index) => (
            <AccordionItem
              key={`${result.disease_name}-${index}`}
              value={`item-${index}`}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div className="text-left">
                      <p className="font-semibold">{result.disease_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={severityColors[result.severity as keyof typeof severityColors] || severityColors.moderate}
                        >
                          {result.severity}
                        </Badge>
                        {result.is_communicable && (
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-200">
                            Communicable
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{result.confidence}%</p>
                    <p className="text-xs text-muted-foreground">confidence</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                {/* Confidence bar */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Match Score</p>
                  <Progress value={result.confidence} className="h-2" />
                </div>

                {/* AI Reasoning */}
                {result.reasoning && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium flex items-center gap-2 mb-1">
                      <Brain className="w-4 h-4 text-primary" />
                      AI Analysis
                    </p>
                    <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                  </div>
                )}

                {/* Matched symptoms */}
                {result.matched_symptoms && result.matched_symptoms.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Matched Symptoms ({result.matched_symptoms.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {result.matched_symptoms.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Precautions */}
                {result.precautions && result.precautions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      Precautions
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {result.precautions.map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Medications */}
                {result.medications && result.medications.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Pill className="w-4 h-4 text-pink-500" />
                      Common Medications
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.medications.map((med) => (
                        <div key={med} className="flex items-center gap-1">
                          <Badge variant="outline">{med}</Badge>
                          <div className="flex gap-1">
                            {pharmacyLinks.slice(0, 2).map((pharmacy) => (
                              <a
                                key={pharmacy.name}
                                href={`${pharmacy.url}${encodeURIComponent(med)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {pharmacyLinks.map((pharmacy) => (
                        <a
                          key={pharmacy.name}
                          href={`${pharmacy.url}${encodeURIComponent(result.medications[0] || '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                          {pharmacy.name}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warning */}
                <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <p className="text-yellow-700">
                    This is an AI-based prediction. Please consult a healthcare professional for accurate diagnosis.
                  </p>
                </div>

                {/* Report case button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onReportCase(result)}
                >
                  Report This Case for Epidemic Tracking
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
