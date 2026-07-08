import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { Search, Send, User, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RecruiterSidebar from '../components/RecruiterSidebar';
import AnimatedPage from '../components/AnimatedPage';
import api from '../api/api';
import './RecruiterMessages.css';

export default function RecruiterMessages() {
    const { user, logout } = useAuth();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [msgLoading, setMsgLoading] = useState(false);

    useEffect(() => {
        fetchChats();
        const interval = setInterval(fetchChats, 5000); // Polling for new chats
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchHistory(selectedChat.id);
            const interval = setInterval(() => fetchHistory(selectedChat.id), 3000); // Faster polling for active chat
            return () => clearInterval(interval);
        }
    }, [selectedChat]);

    const fetchChats = async () => {
        try {
            const res = await api.get('/message/chats');
            setChats(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching chats:', err);
        }
    };

    const fetchHistory = async (otherId) => {
        try {
            const res = await api.get(`/message/history/${otherId}`);
            setMessages(res.data);
        } catch (err) {
            console.error('Error fetching history:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedChat) return;

        try {
            setMsgLoading(true);
            const res = await api.post('/message/send', {
                receiverId: selectedChat.id,
                receiverRole: selectedChat.role,
                content: messageInput
            });
            setMessages([...messages, res.data]);
            setMessageInput('');
            setMsgLoading(false);
        } catch (err) {
            console.error('Error sending message:', err);
            setMsgLoading(false);
        }
    };

    return (
        <div className="recruiter-layout">
            <RecruiterSidebar user={user} onLogout={logout} />

            <AnimatedPage className="recruiter-content messages-page">
                <header className="content-header">
                    <div>
                        <h1 className="welcome-text">Talent Comms</h1>
                        <p className="welcome-sub">Secure messaging pipeline between you and verified talent.</p>
                    </div>
                </header>

                <div className="messages-grid">
                    <aside className="chat-list-sidebar glass-panel">
                        <div className="chat-search">
                            <Search size={18} />
                            <input type="text" placeholder="Search conversations..." />
                        </div>
                        <div className="chats-container">
                            {loading ? (
                                <div className="loader-center"><Loader2 className="animate-spin" /></div>
                            ) : chats.length > 0 ? (
                                chats.map(chat => (
                                    <div
                                        key={chat.id}
                                        className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                                        onClick={() => setSelectedChat(chat)}
                                    >
                                        <div className="chat-avatar">
                                            <User size={20} />
                                        </div>
                                        <div className="chat-info">
                                            <div className="chat-head">
                                                <span className="chat-name">{chat.name}</span>
                                                <span className="chat-time">
                                                    {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="chat-preview">{chat.lastMessage}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-chats text-center mt-4 opacity-50">No active conversations</p>
                            )}
                        </div>
                    </aside>

                    <main className="chat-window glass-panel">
                        {selectedChat ? (
                            <>
                                <div className="chat-header">
                                    <div className="chat-header-info">
                                        <div className="chat-avatar-sm">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <h4>{selectedChat.name}</h4>
                                            <span className="online-status">Active Pipeline</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="chat-body">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`message ${msg.senderId === user.id ? 'outgoing' : 'incoming'}`}>
                                            <p>{msg.content}</p>
                                            <span className="msg-time">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <form className="chat-footer" onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={messageInput}
                                        onChange={e => setMessageInput(e.target.value)}
                                        disabled={msgLoading}
                                    />
                                    <button className="send-btn" type="submit" disabled={msgLoading || !messageInput.trim()}>
                                        <Send size={18} />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="no-chat-selected">
                                <MessageSquare size={64} opacity={0.1} />
                                <p>Select a candidate to start messaging</p>
                            </div>
                        )}
                    </main>
                </div>
            </AnimatedPage>
        </div>
    );
}
