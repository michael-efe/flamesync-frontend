import { useState } from 'react';
import { api } from '../services/api';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  sources?: string[]; // Added to store the PDF citations from the backend
}

export default function Assistant() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      content: 'I am FlameSync SI Assistant, How can I assist your research analysis today?'
    }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = input;
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Call the FastAPI RAG endpoint
      const data = await api.post('/assistant/chat', { query: userMessage });

      setMessages([...newMessages, {
        role: 'assistant',
        content: data.answer,
        sources: data.sources
      }]);
    } catch (err) {
      console.error("Chat failed:", err);
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Error: Unable to reach the FlameSync vector database. Please ensure the backend is running.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto font-mono selection:bg-[#FF5500] selection:text-white gap-4 sm:gap-6 p-4 sm:p-0 pb-20 lg:pb-0 overflow-hidden">
      
      {/* Custom CSS for the bouncing typing dots */}
      <style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        .typing-dot {
          animation: typingBounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        .typing-dot:nth-child(3) { animation-delay: 0s; }
      `}</style>

      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-[0.2em] uppercase mb-1">Ask FlameSync</h1>
        <p className="text-gray-400 text-[10px] sm:text-xs font-sans">Get evidence-based answers from the research database.</p>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-[#050505] border border-[#1a1a1a] rounded-xl flex flex-col overflow-hidden min-h-0 shadow-[0_0_15px_rgba(0,0,0,0.5)] lg:shadow-none">

        {/* Scrollable Message Log */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 sm:gap-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 sm:gap-4 max-w-[95%] sm:max-w-[85%] ${msg.role === 'user' ? 'ml-auto justify-end' : ''}`}>

              {/* Avatar for System/Assistant */}
              {msg.role !== 'user' && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded border border-[#FF5500]/30 bg-[#FF5500]/5 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF5500]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2c0 0-4 3.2-6 8.5C6 15.3 9.4 19 12 22c2.6-3 6-6.7 6-11.5C18 5.2 14 2 14 2s-1.5 2.5-2 2.5S12 2 12 2zm0 15.5c-2.3 0-3.5-2.2-3.5-2.2 1.5.5 3 .5 3.5-.5 0 0 1.2 2.7 0 2.7z" />
                  </svg>
                </div>
              )}

              {/* Message Bubble */}
              <div className={`border p-3 sm:p-4 rounded-xl text-[10px] sm:text-[11px] font-sans leading-relaxed ${msg.role === 'user'
                ? 'bg-[#0a0a0a] border-[#1a1a1a] text-gray-300 rounded-tr-sm'
                : 'bg-black border-[#1a1a1a] text-gray-400 rounded-tl-sm w-full'
                }`}>
                {msg.role === 'system' && <span className="text-[#FF5500] font-mono mb-1.5 sm:mb-2 block text-[9px] sm:text-[10px] tracking-widest">// SYSTEM INITIALIZED</span>}

                {/* Markdown Answer Render */}
                <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Render citations if they exist */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 sm:mt-4 pt-3 border-t border-[#1a1a1a] flex flex-col gap-1">
                    <span className="text-[#FF5500] font-mono text-[8px] sm:text-[9px] tracking-widest uppercase">Sources:</span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {msg.sources.map((src, i) => (
                        /^https?:\/\//i.test(src) ? (
                          <a
                            key={i}
                            href={src}
                            target="_blank"
                            rel="noreferrer"
                            className="px-1.5 py-1 sm:px-2 sm:py-1 bg-[#1a1a1a] rounded text-[8px] sm:text-[9px] text-gray-400 font-mono hover:text-[#FF5500] break-all"
                          >
                            {src}
                          </a>
                        ) : (
                          <span key={i} className="px-1.5 py-1 sm:px-2 sm:py-1 bg-[#1a1a1a] rounded text-[8px] sm:text-[9px] text-gray-400 font-mono break-all">
                            {src}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Animated Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 sm:gap-4 max-w-[95%] sm:max-w-[85%] items-end">
               <div className="w-6 h-6 sm:w-8 sm:h-8 rounded border border-[#FF5500]/30 bg-[#FF5500]/5 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF5500] animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2c0 0-4 3.2-6 8.5C6 15.3 9.4 19 12 22c2.6-3 6-6.7 6-11.5C18 5.2 14 2 14 2s-1.5 2.5-2 2.5S12 2 12 2zm0 15.5c-2.3 0-3.5-2.2-3.5-2.2 1.5.5 3 .5 3.5-.5 0 0 1.2 2.7 0 2.7z"/>
                  </svg>
                </div>
               
               <div className="bg-black border border-[#1a1a1a] rounded-xl rounded-tl-sm p-3 sm:p-4 w-20 flex items-center justify-center gap-1.5 h-[42px] sm:h-[48px]">
                 <div className="typing-dot w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full"></div>
                 <div className="typing-dot w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full"></div>
                 <div className="typing-dot w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full"></div>
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-[#1a1a1a] bg-[#050505]">
          <div className="flex gap-2 sm:gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a follow-up question..."
              className="flex-1 bg-black border border-[#1a1a1a] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-300 focus:outline-none focus:border-[#FF5500] transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={isTyping}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-[#FF5500] text-black font-bold text-[10px] sm:text-sm rounded-lg hover:bg-[#ff7733] transition-colors disabled:opacity-50 shrink-0 shadow-[0_0_10px_rgba(255,85,0,0.2)]"
            >
              SEND
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
