import React, { useState } from 'react';
import { Input, Button } from 'antd';

const ChatBox = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (inputValue.trim()) {
            setMessages([...messages, { sender: 'user', text: inputValue }]);
            setInputValue('');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 80, // Positioned above the "Ask" button
            right: 20,
            width: 300,
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 5,
            padding: 10,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}>
            <div style={{ marginBottom: 10 }}>
                <Button type="primary" onClick={onClose} style={{ float: 'right' }}>Close</Button>
                <h3>Chat with Bot</h3>
            </div>
            <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
                {messages.map((message, index) => (
                    <div key={index} style={{ marginBottom: 5 }}>
                        <strong>{message.sender}: </strong>{message.text}
                    </div>
                ))}
            </div>
            <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onPressEnter={handleSend}
                placeholder="Type a message"
                style={{ marginBottom: 10 }}
            />
            <Button type="primary" onClick={handleSend} block>Send</Button>
        </div>
    );
};

export default ChatBox;
