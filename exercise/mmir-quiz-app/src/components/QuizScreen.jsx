import React from 'react';
import { useQuiz } from '../context/QuizContext';
import './QuizScreen.css';

const QuizScreen = () => {
  const {
    currentMode,
    currentQuestions,
    currentQuestionIndex,
    selectedAnswer,
    handleAnswerSelect,
    handleNextQuestion,
    backToTopics
  } = useQuiz();

  const question = currentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
  const isCorrect = selectedAnswer === question.correct;
  
  return (
    <div id="quizScreen">
      <div className="quiz-header">
        <button className="back-btn" onClick={backToTopics}>← Back</button>
        <div id="questionCounter">
          Question {currentQuestionIndex + 1} of {currentQuestions.length}
        </div>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="question-container">
        <div className="question-text">{question.question}</div>
        
        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${selectedAnswer === index ? 'selected' : ''} 
                ${selectedAnswer !== null && currentMode === 'learn' && index === question.correct ? 'correct' : ''}
                ${selectedAnswer === index && selectedAnswer !== question.correct && currentMode === 'learn' ? 'incorrect' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>
        
        {currentMode === 'learn' && selectedAnswer !== null && (
          <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            <strong>{isCorrect ? 'Correct!' : 'Incorrect!'}</strong><br />
            {question.explanation}
          </div>
        )}
        
        <button 
          className="next-btn" 
          disabled={selectedAnswer === null}
          onClick={handleNextQuestion}
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default QuizScreen;