import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const user = auth.currentUser;

  const notesRef = collection(db, "users", user.uid, "notes");

  useEffect(() => {
    const q = query(notesRef, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(data);
    });
    return unsub;
  }, []);

  const addNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    await addDoc(notesRef, {
      title,
      content,
      createdAt: new Date()
    });
    setTitle('');
    setContent('');
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "notes", id));
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📝 My Notes</h2>
      <form onSubmit={addNote}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        /><br />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        /><br />
        <button type="submit">Add Note</button>
      </form>

      <ul>
        {notes.map(note => (
          <li key={note.id}>
            <strong>{note.title}</strong>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
