const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Notification = require('../models/Notification');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');

// ✅ Post an answer
router.post('/:questionId', verifyToken, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Answer content is required' });
  }

  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const newAnswer = new Answer({
      question: req.params.questionId,
      answeredBy: req.user.id,
      content
    });

    const savedAnswer = await newAnswer.save();

    // ✅ Notify the question owner
    if (question.askedBy.toString() !== req.user.id) {
      const answerer = await User.findById(req.user.id);

      const newNotif = new Notification({
        user: question.askedBy,
        type: 'answer',
        message: `${answerer.username} answered your question.`,
        link: `/questions/${question._id}`
      });

      await newNotif.save();
    }

    res.status(201).json(savedAnswer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Accept an answer
router.put('/:answerId/accept', verifyToken, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId).populate('question');
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const question = await Question.findById(answer.question._id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (question.askedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to accept this answer' });
    }

    await Answer.updateMany({ question: question._id }, { $set: { isAccepted: false } });
    answer.isAccepted = true;
    await answer.save();

    res.status(200).json({ message: 'Answer accepted', answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get all answers for a specific question
router.get('/question/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('answeredBy', 'username')
      .sort({ isAccepted: -1, createdAt: -1 });

    res.status(200).json(answers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Upvote an answer
router.put('/:answerId/upvote', verifyToken, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const existingVote = answer.votedUsers?.find(
      (v) => v.userId.toString() === req.user.id
    );

    if (existingVote) {
      if (existingVote.voteType === 'upvote') {
        return res.status(400).json({ message: 'Already upvoted' });
      } else {
        answer.downvotes -= 1;
        answer.upvotes += 1;
        existingVote.voteType = 'upvote';
      }
    } else {
      answer.upvotes += 1;
      answer.votedUsers = answer.votedUsers || [];
      answer.votedUsers.push({ userId: req.user.id, voteType: 'upvote' });
    }

    await answer.save();
    res.status(200).json({ message: 'Answer upvoted', answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Downvote an answer
router.put('/:answerId/downvote', verifyToken, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const existingVote = answer.votedUsers?.find(
      (v) => v.userId.toString() === req.user.id
    );

    if (existingVote) {
      if (existingVote.voteType === 'downvote') {
        return res.status(400).json({ message: 'Already downvoted' });
      } else {
        answer.upvotes -= 1;
        answer.downvotes += 1;
        existingVote.voteType = 'downvote';
      }
    } else {
      answer.downvotes += 1;
      answer.votedUsers = answer.votedUsers || [];
      answer.votedUsers.push({ userId: req.user.id, voteType: 'downvote' });
    }

    await answer.save();
    res.status(200).json({ message: 'Answer downvoted', answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
