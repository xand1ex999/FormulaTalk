import React, { useState } from 'react';
import api from '../../api.js';
import './Chat.css'

const ChatInput = ({ chatId, socket }) => {
  const [ text, setText ] = useState('');

  const handleSendMessage = async () => {
    if (text.trim() === '' || !chatId) return;
    try {
      const res = await api.post(`/messages/${chatId}`, { text });
      const newMessage = res.data;
      socket.emit('send_message', newMessage);
      setText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
      />
      <button onClick={handleSendMessage} disabled={!text.trim()}>
        Send
      </button>
    </div>
  );
};

export default ChatInput;
