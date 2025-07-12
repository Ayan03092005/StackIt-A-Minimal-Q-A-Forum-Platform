import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AskQuestion = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/questions', {
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim())
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      alert('Error asking question');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mb-4 p-2 border rounded" required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mb-4 p-2 border rounded" required></textarea>
      <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full mb-4 p-2 border rounded" required />
      <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Submit Question</button>
    </form>
  );
};

export default AskQuestion;