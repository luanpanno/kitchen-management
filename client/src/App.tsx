import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import './App.css';

const socket = io('http://localhost:3001');

interface Message {
  id: string;
  userId: string;
  message: string;
}

function App() {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (userId) return;

    socket.on('user_id', (userId) => setUserId(userId));
  }, []);

  useEffect(() => {
    socket.on('receive_message', (data) =>
      setMessages((prevState) => [...prevState, data]),
    );
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit('send_message', message);
  };

  return (
    <div className='App'>
      <h2>Your ID: {userId}</h2>
      <form onSubmit={sendMessage}>
        <input
          type='text'
          placeholder='Send message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>Send</button>
      </form>
      <div>
        <h2>Messages</h2>
        {!messages.length && <p>No messages received yet</p>}
        <ul>
          {messages.map((x) => (
            <li key={x.id}>
              <span className='sender'>
                {x.userId === userId ? 'You' : 'Anon'}:{' '}
              </span>
              {x.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
