import {useState, useEffect} from 'react';
import { useQuiz } from '../context/QuizContext';
import Fireworks from './Fireworks';
import './ResultsScreen.css';
import {RotateCcw, RefreshCw} from 'lucide-react';


const Score = ({ title, score, detailsText }) => {
  return (
      <div className="score-container">
        <div className="score-label">{title}</div>
        <div className="score-bar-container">
          <div className="score-bar" style={{ width: `${score}%` }} />
          <div className="score-text">{score}%</div>
        </div>
        <div className="score-details">
          {detailsText}
        </div>
      </div>
  );
};


const QuizStats = ({ results }) => {
  const [expandedTopics, setExpandedTopics] = useState(false);
  
  if (!results) return <h2>No results available</h2>;

  return (
    <>
      <h2>Quiz Complete!</h2>
      
      <Score 
        title="Overall Score" 
        score={results.score} 
        detailsText={`${results.correct} correct out of ${results.total} questions`}
        key="total"
      />

      <div className="topic-score-container">
        <div 
          className="topic-score-header" 
          onClick={() => setExpandedTopics(!expandedTopics)}
        >
          <span className="topic-score-name">Topic Breakdown</span>
          <span className="expand-icon">{expandedTopics ? '▼' : '►'}</span>
        </div>
        {expandedTopics && Object.keys(results.topics).map(topic => (
          <Score
            title={topic}
            score={results.topics[topic].score}
            detailsText={`${results.topics[topic].correct} correct out of ${results.topics[topic].total} questions`}
            key={topic}
          />
        ))}
      </div>
    </>
  );
};

const ReviewAnswers = () => {
  const quiz = useQuiz();

  return (
    <div className="review-section">
      <h3>Review:</h3>
      {quiz.questions.map((question, index) => {
        const isCorrect = question.answer === question.correct;

        return question.answer != null && (
          <div key={index} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="review-q-title">Q: {question.question}</div>
            <div className="review-q-topic">{question.topic}</div>
            <div className="review-answer-container">
              <div className="review-answer-header">
                Your answer:
              </div>
              <div className="review-answer-content">
                {question.options[question.answer]} 
              </div>
              {!isCorrect && (
                <>
                  <div className="review-answer-header">
                    Correct answer:
                  </div>
                  <div className="review-answer-content">
                    {question.options[question.correct]} 
                  </div>
                </>
              )}
            </div>
            <div className="review-explanation">
              {question.explanation}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ResultsScreen = ({ onTryAgain, onReset }) => {
  const quiz = useQuiz();
  const [showConfetti, setShowConfetti] = useState(false);
  const celebrations = quiz.isTestingMode() && quiz.score >= 0.8;
  
  useEffect(() => {
    if (celebrations) {
      setShowConfetti(true);
      
      // Hide confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [celebrations]);

  return (
    <div className="quiz-stats">
      {showConfetti && <Fireworks />}
      <QuizStats results={quiz.results} />

      <div className="action-buttons">
        <button className="button restart" onClick={onTryAgain}>
          <RotateCcw />
          <span>Try Again</span>
        </button>
        <button className="button reset" onClick={onReset}>
          <RefreshCw />
          <span>Reset Quiz</span>
        </button>
      </div>

      {quiz.isTestingMode() && quiz.results && <ReviewAnswers /> }
    </div>
  );
};

export default ResultsScreen;