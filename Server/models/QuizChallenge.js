const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question: {type: String, required: true},
    options: [{type: String, required: true}],
    correctAnswerIndex: {type: Number, required: true},
});

const QuizChallengeSchema = new mongoose.Schema({
    challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  opponent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'in-progress', 'completed'],
    default: 'pending'
  },
  difficulty: { // Add this
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  questionCount: { type: Number, default: 5 }, // Add this
  questions: [QuestionSchema],
  challengerScore: { type: Number, default: 0 },
  opponentScore: { type: Number, default: 0 },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true});

module.exports = mongoose.model("QuizChallenge", QuizChallengeSchema);