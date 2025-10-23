import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToChat } from '../services/geminiService';
import type { ChatMessage, GroundingSource } from '../types';
import { Spinner } from './common/Spinner';
import { Icon } from './Icon';

export const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [useSearch, setUseSearch] = useState(false);
    const [useThinking, setUseThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([{
            role: 'model',
            text: "Hello! I'm your AI assistant. How can I help you with your game development today?"
        }]);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // Pass the up-to-date history (excluding the model's pending response) to the service
            const response = await sendMessageToChat(newMessages, currentInput, useSearch, useThinking);
            const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
            const sources: GroundingSource[] = groundingMetadata?.groundingChunks
                ?.map((chunk: any) => chunk.web)
                .filter(Boolean)
                .map((web: any) => ({ uri: web.uri, title: web.title })) ?? [];
            
            const modelMessage: ChatMessage = { role: 'model', text: response.text, sources };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const Toggle = ({ checked, onChange, label, icon }: { checked: boolean, onChange: (checked: boolean) => void, label: string, icon: React.ReactNode }) => (
        <label className="flex items-center space-x-2 cursor-pointer text-sm text-slate-300">
            <div className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${checked ? 'bg-sky-500' : 'bg-slate-600'}`}>
                <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${checked ? 'translate-x-5' : ''}`}></div>
            </div>
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="hidden" />
             <span className="flex items-center gap-1">{icon}{label}</span>
        </label>
    );

    return (
        <div className="flex flex-col h-[70vh]">
            <h2 className="text-2xl font-bold text-sky-300 mb-1">AI Assistant Chat</h2>
            <p className="text-slate-400 mb-4">Ask questions, get ideas, or solve complex problems.</p>
            
            <div className="flex-grow bg-slate-900/50 rounded-lg p-4 overflow-y-auto mb-4 border border-slate-700">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-lg px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-3 pt-2 border-t border-slate-600">
                                        <h4 className="text-xs font-semibold text-slate-400 mb-1">Sources:</h4>
                                        <ul className="text-xs space-y-1">
                                            {msg.sources.map((source, i) => (
                                                <li key={i}>
                                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline break-all">
                                                        {i+1}. {source.title || source.uri}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-lg px-4 py-2 rounded-lg bg-slate-700 text-slate-200 flex items-center">
                                <Spinner size="sm" /> <span className="ml-2">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
                <Toggle checked={useSearch} onChange={(c) => { setUseSearch(c); if(c) setUseThinking(false); }} label="Grounding" icon={<Icon.Search />} />
                <Toggle checked={useThinking} onChange={(c) => { setUseThinking(c); if(c) setUseSearch(false); }} label="Thinking Mode" icon={<Icon.Brain />} />
            </div>

            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={useThinking ? "Ask a complex question..." : useSearch ? "Ask about current events..." : "Type your message..."}
                    className="flex-grow bg-slate-700 border border-slate-600 rounded-full px-4 py-2 focus:ring-sky-500 focus:border-sky-500"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="bg-sky-500 text-white rounded-full p-2 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                    <Icon.Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};
