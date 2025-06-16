'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { SendIcon, BotIcon, XIcon, Copy } from 'lucide-react';
import { toast } from 'react-toastify';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function AiChatDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Chào bạn! Tôi là trợ lý AI của Penguin. Bạn cần giúp gì hôm nay?',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const currentInput = input;
        
        const userMessage: Message = { role: 'user', content: currentInput };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gemma3',
                    prompt: currentInput,
                    stream: true,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No response body reader available');
            }

            const decoder = new TextDecoder();
            let streamedContent = '';

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            if (data.response) {
                                streamedContent += data.response;
                                

                                setMessages((prev) => {
                                    const newMessages = [...prev];
                                    const lastMessage = newMessages[newMessages.length - 1];
                                    if (lastMessage.role === 'assistant') {
                                        lastMessage.content = streamedContent;
                                    }
                                    return newMessages;
                                });
                            }
                        } catch {
        
                            console.warn('Failed to parse JSON line:', line);
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Error calling Ollama API:', error);
            
            setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                    lastMessage.content = 'Xin lỗi, tôi không thể kết nối với Ollama API. Vui lòng kiểm tra xem Ollama đang chạy trên localhost:11434 hay không.';
                }
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50 p-0 flex items-center justify-center bg-[#002D74] hover:bg-[#00408f]"
                aria-label="Open AI Chat"
            >
                <BotIcon className="w-6 h-6" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-[80vh] flex flex-col">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle className="flex items-center gap-2">
                            <BotIcon className="w-5 h-5" />
                            PENGUIN AI CHAT
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 rounded-full"
                        >
                            <XIcon className="w-4 h-4" />
                        </Button>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto mb-4 p-2 space-y-4 max-h-[50vh]">
                        {messages.length === 0 ? (
                            <div className="text-center text-muted-foreground p-4">
                                Ask me anything and I&apos;ll try to help!
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <Card
                                        className={`p-3 max-w-[80%] ${
                                            message.role === 'user'
                                                ? 'bg-[#002D74] text-white'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            {message.role === 'assistant' && (
                                                <Avatar className="w-6 h-6">
                                                    <BotIcon className="w-4 h-4" />
                                                </Avatar>
                                            )}
                                            <div className="break-words relative">
                                                <span>{message.content}</span>
                                                <Copy
                                                size={16}
                                                    className="absolute -bottom-2 right-0 cursor-pointer text-gray-500 hover:text-gray-700"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(message.content);
                                                        toast.success('Đã sao chép nội dung!', {
                                                            position: 'top-right',
                                                            autoClose: 2000,
                                                            hideProgressBar: false,
                                                            closeOnClick: true,
                                                            pauseOnHover: false,
                                                            draggable: false,
                                                            progress: undefined,
                                                            theme: 'light',
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            ))
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={isLoading || input.trim() === ''}
                            className="bg-[#002D74] hover:bg-[#00408f]"
                        >
                            <SendIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
