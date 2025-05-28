import React from 'react';
import { useQuiz } from '../context/QuizContext';
import './ResultsScreen.css';

const ResultsScreen = () => {
  const { 
    currentMode, 
    currentQuestions, 
    userAnswers, 
    backToTopics 
  } = useQuiz();

  // Calculate score
  const correctAnswers = userAnswers.reduce((count, answer, index) => {
    return answer === currentQuestions[index].correct ? count + 1 : count;
  }, 0);
  
  const percentage = Math.round((correctAnswers / currentQuestions.length) * 100);
  const passed = percentage >= 80;
  
  return (
    <div id="resultsScreen">
      <div className="results-container">
        <h2>Quiz Complete!</h2>
        <div className={`score-display ${passed ? 'pass' : 'fail'}`}>
          {percentage}%
        </div>
        <div className={`pass-status ${passed ? 'pass' : 'fail'}`}>
          {passed ? 'PASSED' : 'FAILED'}
        </div>
        <button className="next-btn" onClick={backToTopics}>
          Try Another Quiz
        </button>
      </div>
      
      {(currentMode === 'test' || true) && (
        <div className="review-section">
          <h3>Review:</h3>
          {currentQuestions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correct;
            
            return (
              <div key={index} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                <strong>Q{index + 1}: {question.question}</strong><br />
                <span className="topic-tag">{question.topic}</span><br />
                <span>Your answer: {question.options[userAnswer]}</span><br />
                {!isCorrect && (
                  <span>Correct answer: {question.options[question.correct]}<br /></span>
                )}
                <em>{question.explanation}</em>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResultsScreen;