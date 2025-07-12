import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/questions');
        setQuestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Latest Questions</h1>
      {questions.map((q) => (
        <div key={q._id} className="bg-white p-4 rounded shadow mb-4">
          <Link to={`/questions/${q._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
            {q.title}
          </Link>
          <p className="text-gray-600">Tags: {q.tags.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
