import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './Login';
import Notes from './Notes';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsub;
  }, []);

  if (!user) return <Login onLogin={() => {}} />;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <button onClick={() => signOut(auth)}>Logout</button>
    </div>
  );
}

export default App;
