import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';

function ChatRoom({ user, db }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const userTag = "your-tag"; // Replace with dynamic tag logic if needed

  useEffect(() => {
    const q = query(collection(db, "messages"), where("tag", "==", userTag));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, [db, userTag]);

  const sendMessage = async () => {
    await addDoc(collection(db, "messages"), {
      text: newMsg,
      uid: user.uid,
      tag: userTag,
      createdAt: new Date()
    });
    setNewMsg('');
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.uid}:</strong> {msg.text}</p>
        ))}
      </div>
      <input 
        type="text" 
        value={newMsg} 
        onChange={(e) => setNewMsg(e.target.value)} 
        placeholder="Type a message" 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatRoom;
