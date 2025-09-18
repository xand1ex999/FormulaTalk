import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import './Chat.css'

const ChatList = ({ chats, setChats, setSelectedChat,selectedChat, userId }) => {

  useEffect(()=>{
    async function fetchChats(){
      try {
        const res = await axios.get(`/api/chats`)
        setChats(res.data)
        // console.log('Fetched chats:', res.data);
      } catch (error) {
        console.error('Error fetching chats:', error)
      }
    }
    fetchChats();
  }, []);

  // console.log('ChatList rendering with:', { chats, userId });
  
  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>Messages</h2>
      </div>
      
      {chats.length === 0 ? (
        <div className="empty-chat-list">
          <p>No conversations yet</p>
        </div>
      ) : (
        chats.map(chat => {
          const otherParticipant = chat.participants.find(p => p._id !== userId);
          
          return (
            <div 
              key={chat._id} 
              className={`chat-item ${selectedChat?._id === chat._id ? "active" : ""}`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="chat-item-avatar">
                {otherParticipant?.avatar ? (
                  <img 
                    src={otherParticipant.avatar} 
                    alt={otherParticipant.username}
                    className="chat-item-avatar"
                  />
                ) : (
                  otherParticipant?.username?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              
              <div className="chat-item-info">
                <div className="chat-item-name">
                  {chat.isGroup ? chat.chatName : otherParticipant?.username || 'Unknown User'}
                </div>
                <div className="chat-item-last-message">
                  {chat.lastMessage?.text || 'Start a conversation'}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ChatList