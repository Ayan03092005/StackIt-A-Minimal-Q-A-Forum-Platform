const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const verifyToken = require('../middleware/authMiddleware');

// ✅ Ask a new question
router.post('/', verifyToken, async (req, res) => {
  const { title, description, tags } = req.body;

  if (!title || !description || !tags || tags.length === 0) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newQuestion = new Question({
      title,
      description,
      tags,
      askedBy: req.user.id
    });

    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('askedBy', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get a question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('askedBy', 'username');
    if (!question) return res.status(404).json({ message: 'Question not found' });

    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Edit a question
router.put('/:id', verifyToken, async (req, res) => {
  const { title, description, tags } = req.body;

  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    // Check permission: only the owner or admin
    if (question.askedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this question' });
    }

    // Update fields if they exist
    if (title) question.title = title;
    if (description) question.description = description;
    if (tags && tags.length > 0) question.tags = tags;

    const updated = await question.save();
    res.status(200).json({ message: 'Question updated', updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete a question (only owner or admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (question.askedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    await question.deleteOne();
    res.status(200).json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
