
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Terminal } from 'lucide-react';
import { Message } from './types';

interface ChatSanctuaryProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  language: 'en' | 'ar';
}

const isArabicText = (text: string): boolean => {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
  return arabicPattern.test(text);
};

const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 group rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between px-3 py-1.5 bg-black/80 border-b border-white/10 text-[9px] uppercase font-black tracking-widest text-white/40">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-indigo-400" />
          <span>{language || 'code'}</span>
        </div>
        <button onClick={handleCopy} className="hover:text-white transition-colors flex items-center gap-1">
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={atomDark}
        customStyle={{ margin: 0, background: '#000000', padding: '1.25rem', fontSize: '14px', lineHeight: '1.6' }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export const ChatSanctuary: React.FC<ChatSanctuaryProps> = ({ messages, onSendMessage, isProcessing, language }) => {
  const [input, setInput] = useState('');
  const [copiedMsgIdx, setCopiedMsgIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgIdx(idx);
    setTimeout(() => setCopiedMsgIdx(null), 2000);
  };

  const placeholders = {
    en: "Engage with the manuscript...",
    ar: "تفاعل مع المخطوطة..."
  };

  const FixedInputBar = (
    <div className="fixed bottom-0 left-0 right-0 z-[500] pointer-events-none">
      <div className="w-full bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/98 to-transparent pt-8 pb-4 md:pb-8 px-4 pointer-events-auto">
        <div className="max-w-5xl mx-auto w-full px-4">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-[1px] bg-indigo-600/20 rounded-[22px] blur-sm opacity-30 group-focus-within:opacity-80 transition-all duration-700"></div>
            <div className="relative bg-[#0f172a] rounded-[22px] p-1.5 flex items-center shadow-2xl border border-white/10 group-focus-within:border-indigo-500/40 transition-all duration-300">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                dir={isArabicText(input) ? 'rtl' : 'ltr'}
                placeholder={placeholders[language]}
                className="flex-1 bg-transparent border-none py-3 px-5 focus:outline-none text-slate-100 placeholder-slate-500 text-[16px] font-medium resize-none min-h-[52px] max-h-[160px] custom-scrollbar"
                disabled={isProcessing}
              />
              <button 
                type="submit" 
                disabled={isProcessing || !input.trim()}
                className="w-11 h-11 bg-indigo-600 text-white rounded-full flex items-center justify-center disabled:opacity-20 transition-all hover:scale-105 active:scale-95 shadow-xl shrink-0 mr-1.5"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen relative flex flex-col overflow-hidden bg-transparent">
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto px-4 md:px-12 pt-24 pb-48 custom-scrollbar scroll-smooth"
      >
        <div className="max-w-5xl mx-auto w-full flex flex-col space-y-12">
          {messages.map((msg, idx) => {
            const isModel = msg.role === 'model';
            const isAr = isArabicText(msg.text);
            
            return (
              <div key={idx} className={`flex w-full ${isModel ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex gap-4 md:gap-8 max-w-full w-full ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-[10px] font-black border border-white/10 shadow-lg select-none ${
                    !isModel ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isModel ? 'AI' : 'YOU'}
                  </div>

                  <div className="flex-1 min-w-0 relative group/msg">
                    <div className={`prose prose-invert max-w-none text-[16px] break-words ${
                        isModel ? 'text-slate-200 leading-relaxed' : 'text-indigo-50 font-medium leading-relaxed'
                      } ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                            ) : (
                              <code className="bg-white/5 px-2 py-1 rounded text-indigo-300 font-mono text-[14px]" {...props}>
                                {children}
                              </code>
                            );
                          },
                          h1: ({children}) => <h1 className="text-3xl font-black mb-6 text-white border-b border-white/10 pb-2 uppercase tracking-wide">{children}</h1>,
                          h2: ({children}) => <h2 className="text-2xl font-bold mb-4 text-white/90">{children}</h2>,
                          p: ({children}) => <p className="mb-6 last:mb-0 leading-loose text-[16px]">{children}</p>,
                          ul: ({children}) => <ul className="list-disc pl-6 mb-6 space-y-3 text-[16px]">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal pl-6 mb-6 space-y-3 text-[16px]">{children}</ol>,
                          li: ({children}) => <li className="text-[16px]">{children}</li>,
                          strong: ({children}) => <strong className="text-indigo-300 font-black">{children}</strong>
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                      
                      {isModel && msg.text && (
                        <button 
                          onClick={() => copyToClipboard(msg.text, idx)}
                          className="mt-6 flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-400 transition-all opacity-0 group-hover/msg:opacity-100"
                        >
                          {copiedMsgIdx === idx ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                          <span>{copiedMsgIdx === idx ? 'Captured' : 'Copy Discourse'}</span>
                        </button>
                      )}

                      {isProcessing && idx === messages.length - 1 && !msg.text && (
                        <div className="flex gap-2 items-center mt-3">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={endRef} className="h-10" />
        </div>
      </div>

      {createPortal(FixedInputBar, document.body)}
    </div>
  );
};
