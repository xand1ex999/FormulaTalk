import React, { useState } from 'react';
import { BotMessageSquare, X } from "lucide-react";
import api from '../../api.js'
import './AIHelper.css';

const AIHelper = () => {
  const [ open, setOpen ] = useState(false);
  const [ message, setMessage ] = useState('');
  const [ messages, setMessages ] = useState([]);

  async function sendMessage() {
    if (!message) return;
    const userMessage = { type: 'user', text: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    try {
      const res = await api.post(`/ai/chat`, {
        message: userMessage.text
      })
      const aiMessage = { type: 'ai', text: res.data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = { type: 'ai', text: "Error sending message" };
      setMessages(prev => [...prev, errorMessage]);
    }
  }

  return (
    <>
      <div className="ai-helper-button" onClick={() => setOpen(true)}>
        <BotMessageSquare size={40} color="#fff" />
      </div>

      {open && (
        <div className='ai-helper-modal'>
          <div className='ai-helper-close-button'>
            <p className='pitstop-ask'>PitStop ASK</p>
            <X size={28} color="#333" cursor="pointer" onClick={() => setOpen(false)} />
          </div>

          <div className='ai-responses'>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className='ai-input'>
            <input
              type="text"
              placeholder='Please, put down your prompt to AI helper'
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIHelper;