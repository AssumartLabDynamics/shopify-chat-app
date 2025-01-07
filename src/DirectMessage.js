import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, or, where } from 'firebase/firestore';

function DirectMessage({ user, db }) {
  const [dmMessages, setDmMessages] = useState([]);
  const [newDm, setNewDm] = useState('');
  const [targetUser, setTargetUser] = useState('');

  useEffect(() => {
    if (targetUser === '') return;
    const q = query(collection(db, "directMessages"), 
      where("participants", "array-contains", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDmMessages(snapshot.docs
        .filter(doc => doc.data().participants.includes(targetUser))
        .map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, [db, user.uid, targetUser]);

  const sendDm = async () => {
    await addDoc(collection(db, "directMessages"), {
      text: newDm,
      from: user.uid,
      to: targetUser,
      participants: [user.uid, targetUser],
      createdAt: new Date()
    });
    setNewDm('');
  };

  return (
    <div>
      <h2>Direct Message</h2>
      <input 
        type="text" 
        value={targetUser} 
        onChange={(e) => setTargetUser(e.target.value)} 
        placeholder="User ID to message" 
      />
      <div>
        {dmMessages.map((msg, index) => (
          <p key={index}><strong>{msg.from}:</strong> {msg.text}</p>
        ))}
      </div>
      <input 
        type="text" 
        value={newDm} 
        onChange={(e) => setNewDm(e.target.value)} 
        placeholder="Type a message" 
      />
      <button onClick={sendDm}>Send DM</button>
    </div>
  );
}

export default DirectMessage;
