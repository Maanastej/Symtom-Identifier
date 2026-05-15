import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles, Trash2, Activity, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type Message = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const resp = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || 'Something went wrong. Please try again.');
    return;
  }

  if (!resp.body) { onError('No response stream'); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf('\n')) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith('\r')) line = line.slice(0, -1);
      if (line.startsWith(':') || line.trim() === '') continue;
      if (!line.startsWith('data: ')) continue;
      const json = line.slice(6).trim();
      if (json === '[DONE]') { streamDone = true; break; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { buffer = line + '\n' + buffer; break; }
    }
  }
  onDone();
}

const SUGGESTIONS = [
  'What are signs of dehydration?',
  'How can I improve my sleep?',
  'Check my latest health metrics',
  'Search for flu symptoms',
];

export function HealthChatbot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadHistory = useCallback(async () => {
    if (!user || historyLoaded) return;
    const { data, error } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(100);
    if (!error && data && data.length > 0) {
      setMessages(data.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })));
    }
    setHistoryLoaded(true);
  }, [user, historyLoaded]);

  useEffect(() => { if (open) loadHistory(); }, [open, loadHistory]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, open, loading]);

  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!user) return;
    await supabase.from('chat_messages').insert({ user_id: user.id, role, content });
  };

  const clearHistory = async () => {
    if (!user) return;
    await supabase.from('chat_messages').delete().eq('user_id', user.id);
    setMessages([]);
    toast.success('Chat history cleared');
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    await saveMessage('user', userMsg.content);

    let assistantSoFar = '';
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsert,
        onDone: async () => {
          setLoading(false);
          if (assistantSoFar) await saveMessage('assistant', assistantSoFar);
        },
        onError: async (msg) => {
          setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${msg}` }]);
          setLoading(false);
        },
      });
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Connection error. Please try again.' }]);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full gradient-hero text-white shadow-glow flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95",
          open && "rotate-90 opacity-0 pointer-events-none"
        )}
        aria-label="Open health assistant"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded-full animate-pulse" />
      </button>

      <div className={cn(
        "fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[650px] max-h-[calc(100vh-4rem)] rounded-[2.5rem] border border-white/20 bg-card/80 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right",
        open ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-95 opacity-0 pointer-events-none"
      )}>
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 gradient-hero text-white flex-shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-white/5 rounded-full -mr-4 -mt-4 blur-2xl" />
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base">Agentic Health Assistant</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-white/80 text-xs font-medium">Online & Ready to Help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button onClick={clearHistory} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90" title="Clear chat history">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/20">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center relative">
                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold shadow-lg">AI</div>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-xl text-foreground tracking-tight">How can I help you today?</p>
                <p className="text-sm text-muted-foreground px-8 leading-relaxed">I'm your intelligent medical companion. I can analyze symptoms, check your vitals, and help you report health concerns.</p>
              </div>
              <div className="w-full space-y-2.5 max-w-[280px]">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} className="w-full text-left text-xs font-medium px-4 py-3.5 rounded-2xl border border-border/40 bg-white/50 hover:bg-primary hover:text-white hover:border-primary/50 transition-all duration-300 shadow-sm flex items-center gap-3 group">
                    <div className="w-6 h-6 rounded-lg bg-primary/5 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                      {s.includes('metrics') ? <Activity className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                    </div>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-3 animate-in slide-in-from-bottom-2 duration-300", m.role === 'user' ? 'justify-end' : 'justify-start')}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 shadow-inner border border-primary/5">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={cn(
                "max-w-[85%] rounded-[1.5rem] px-5 py-3.5 text-[0.925rem] shadow-sm leading-relaxed",
                m.role === 'user' 
                  ? 'gradient-hero text-white rounded-tr-none shadow-glow' 
                  : 'bg-muted/40 backdrop-blur-md text-foreground rounded-tl-none border border-border/40'
              )}>
                {m.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>p:last-child]:mb-0 selection:bg-primary/20">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : <p className="font-medium">{m.content}</p>}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 shadow-inner border border-primary/5">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 items-center animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/5 shadow-inner">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="flex gap-1.5 px-4 py-3.5 bg-muted/30 backdrop-blur-md rounded-2xl rounded-tl-none border border-border/40">
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms]" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium animate-pulse">Thinking...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-6 pt-2 bg-gradient-to-t from-background to-transparent">
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-3 relative">
            <div className="relative flex-1">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Describe your symptoms or ask a question..."
                className="w-full h-14 pl-5 pr-14 rounded-2xl border border-border/60 bg-white/50 backdrop-blur-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all shadow-inner text-foreground placeholder:text-muted-foreground/60"
                disabled={loading}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!input.trim() || loading} 
                  className="h-10 w-10 rounded-xl gradient-hero border-0 text-white shadow-lg active:scale-90 transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </form>
          <p className="text-[10px] text-center text-muted-foreground/60 mt-3 font-medium uppercase tracking-wider">Medical AI Companion • Privacy Guaranteed</p>
        </div>
      </div>
    </>
  );
}

