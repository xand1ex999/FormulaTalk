import React, { useEffect, useState } from 'react'
import './Chat.css'
import { io } from 'socket.io-client'
import { useAuth } from '../../context/AuthContext.jsx'
import ChatList from './ChatList.jsx'
import ChatWindow from './ChatWindow.jsx'
import ChatInput from './ChatInput.jsx'

const socket = io("http://localhost:5000")

const Chat = () => {
  const { user } = useAuth();
  const [ chats, setChats ] = useState([]);
  const [ selectedChat, setSelectedChat ] = useState(null);
  const [ messages, setMessages ] = useState([]);

  useEffect(()=>{
    if(!selectedChat) return;
    socket.emit("join_chat", selectedChat._id);
    socket.on("receive_message", (message)=>{
      setMessages(prev => [...prev, message])
    });

    return () => {
      socket.off("receive_message");
    }
  }, [selectedChat]);


  if(!user){
    return <div>Loading...</div>
  }

   return (
    <div className="chat-container">
      <ChatList 
        userId={user.id}
        chats={chats} 
        setChats={setChats} 
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat} 
      />

      {selectedChat ? (
        <div className="chat-main">
          <ChatWindow 
            chatId={selectedChat._id} 
            messages={messages} 
            setMessages={setMessages} 
            currentUserId={user.id}
          />
          <ChatInput 
            chatId={selectedChat._id} 
            socket={socket} 
          />
        </div>
      ) : (
        <div className="no-chat-selected">
          <div>
            <h3>Welcome to Messages</h3>
            <p>Select a conversation to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat