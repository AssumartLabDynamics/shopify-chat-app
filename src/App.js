import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, query, where } from 'firebase/firestore';
import ChatRoom from './ChatRoom';
import DirectMessage from './DirectMessage';
import firebaseConfig from './firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    signInAnonymously(auth)
      .catch((error) => console.error(error));

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Shopify Chat App</h1>
      <ChatRoom user={user} db={db} />
      <DirectMessage user={user} db={db} />
    </div>
  );
}

export default App;
