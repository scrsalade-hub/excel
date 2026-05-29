const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createSession, submitAnswer, completeSession, getSessionHistory, getStudyTopics, generateNewSet, generateFlashcards } = require('../controllers/quizController');

router.get('/topics', auth, getStudyTopics);
router.post('/session', auth, createSession);
router.post('/new-set', auth, generateNewSet);
router.post('/answer', auth, submitAnswer);
router.post('/complete', auth, completeSession);
router.get('/history', auth, getSessionHistory);
router.post('/flashcards', auth, generateFlashcards);

module.exports = router;
