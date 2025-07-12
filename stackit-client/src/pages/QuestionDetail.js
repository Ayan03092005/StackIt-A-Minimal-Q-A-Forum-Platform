import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await axios.get(`http://localhost:5000/api/questions/${id}`);
      setQuestion(res.data);
    };
    const fetchAnswers = async () => {
      const res = await axios.get(`http://localhost:5000/api/answers/question/${id}`);
      setAnswers(res.data);
    };
    fetchQuestion();
    fetchAnswers();
  }, [id]);

  const handleAnswerSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/api/answers/${id}`, { content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent('');
      const res = await axios.get(`http://localhost:5000/api/answers/question/${id}`);
      setAnswers(res.data);
    } catch (err) {
      alert('Error submitting answer');
    }
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{question.title}</h2>
      <p className="mb-4">{question.description}</p>
      <h3 className="text-xl font-semibold">Answers</h3>
      {answers.map((ans) => (
        <div key={ans._id} className="p-2 border-b">
          <div dangerouslySetInnerHTML={{ __html: ans.content }} />
          <small className="text-gray-500">By {ans.answeredBy?.username}</small>
        </div>
      ))}
      <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full mt-4 p-2 border rounded" placeholder="Write your answer..."></textarea>
      <button onClick={handleAnswerSubmit} className="bg-blue-600 text-white mt-2 px-4 py-2 rounded">Submit Answer</button>
    </div>
  );
};

export default QuestionDetail;
