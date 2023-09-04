import React from 'react';
import ChatsList from '@/components/chat/ChatsList';

const ChatPage = () => {
  return (
    <div>
      <h1>Chat Page</h1>
      <ChatsList selectedChat={''} />
    </div>
  );
};

export default ChatPage;
