import { useState } from 'react';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function Assistant() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'system', 
      content: 'I am the FlameSync AI Assistant. I can analyze n-Heptane burn rates, cross-reference microgravity datasets, or summarize findings from the BASS-II and FLEX investigations. How can I assist your mission analysis today?' 
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Placeholder: This is where you will eventually call POST /api/assistant/chat
    setTimeout(() => {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Backend pipeline is currently under construction. RAG vector database connectivity will be established in the next deployment phase.' 
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto font-mono selection:bg-[#FF5500] selection:text-white gap-6 overflow-hidden">
      
      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-xl font-bold text-white tracking-[0.2em] uppercase mb-1">Ask FlameSync</h1>
        <p className="text-gray-400 text-[10px] font-sans">Get evidence-based answers from the research database.</p>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-[#050505] border border-[#1a1a1a] rounded-xl flex flex-col overflow-hidden min-h-0 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        
        {/* Scrollable Message Log */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto justify-end' : ''}`}>
              
              {/* Avatar for System/Assistant */}
              {msg.role !== 'user' && (
                <div className="w-8 h-8 rounded border border-[#FF5500]/30 bg-[#FF5500]/5 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#FF5500]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2c0 0-4 3.2-6 8.5C6 15.3 9.4 19 12 22c2.6-3 6-6.7 6-11.5C18 5.2 14 2 14 2s-1.5 2.5-2 2.5S12 2 12 2zm0 15.5c-2.3 0-3.5-2.2-3.5-2.2 1.5.5 3 .5 3.5-.5 0 0 1.2 2.7 0 2.7z"/>
                  </svg>
                </div>
              )}

              {/* Message Bubble */}
              <div className={`border p-4 rounded-xl text-[11px] font-sans leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#0a0a0a] border-[#1a1a1a] text-gray-300 rounded-tr-sm' 
                  : 'bg-black border-[#1a1a1a] text-gray-400 rounded-tl-sm w-full'
              }`}>
                {msg.role === 'system' && <span className="text-[#FF5500] font-mono mb-2 block text-[10px] tracking-widest">// SYSTEM INITIALIZED</span>}
                {msg.content}
              </div>

              {/* Avatar for User */}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded border border-[#1a1a1a] bg-black flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
             <div className="flex gap-4 max-w-[85%]">
               <div className="w-8 h-8 rounded border border-[#FF5500]/30 bg-[#FF5500]/5 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#FF5500] animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2c0 0-4 3.2-6 8.5C6 15.3 9.4 19 12 22c2.6-3 6-6.7 6-11.5C18 5.2 14 2 14 2s-1.5 2.5-2 2.5S12 2 12 2zm0 15.5c-2.3 0-3.5-2.2-3.5-2.2 1.5.5 3 .5 3.5-.5 0 0 1.2 2.7 0 2.7z"/>
                  </svg>
                </div>
                <div className="flex items-center gap-1 p-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[#1a1a1a] bg-[#020202] shrink-0 flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="flex-1 bg-black border border-[#1a1a1a] rounded flex items-center px-4 focus-within:border-[#FF5500]/50 transition-colors">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a follow-up question..." 
                className="w-full bg-transparent border-none outline-none text-[11px] text-white py-3.5 placeholder-gray-600 font-sans" 
              />
            </div>
            <button 
              onClick={handleSend}
              className="w-13 h-13 bg-[#FF5500] rounded flex items-center justify-center shrink-0 hover:bg-[#FF5500]/80 transition-colors shadow-[0_0_10px_rgba(255,85,0,0.2)]"
            >
              <svg className="w-5 h-5 text-black ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="text-center text-[7px] text-gray-600 font-bold tracking-[0.2em] uppercase mt-1">
            Answers are grounded in the available research data and include source citations.
          </div>
        </div>
        
      </div>
    </div>
  );
}