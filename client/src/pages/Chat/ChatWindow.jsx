import React from 'react'
import { useEffect, useRef } from 'react'
import axios from 'axios'
import './Chat.css'

const ChatWindow = ({chatId, messages, setMessages, currentUserId}) => {
  const chatEndRef = useRef(null);

  useEffect(()=>{
    if(!chatId) return;
    async function fetchMessages(){
      try {
        const res = await axios.get(`/api/messages/${chatId}`)
        setMessages(res.data)
        console.log("Fetched messages:", res.data);
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }
    fetchMessages();
  }, [chatId]);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

  console.log('ChatWindow rendering with:', { chatId, messages });

  return (
    <div className="chat-window">
      {messages.map(msg => (
        <>
        <div
          key={msg._id}
          className={`message ${
            msg.sender._id === currentUserId ? 'message-own' : 'message-other'
          }`}
        >
          {msg.sender._id !== currentUserId && (
            <div className="message-sender">{msg.sender.username}</div>
          )}
          <div className="message-text">{msg.text}</div>
          <div className="message-time">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
        </>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatWindow