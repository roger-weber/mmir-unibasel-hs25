import { useState, useMemo } from 'react';
import { useQuiz } from '../context/QuizContext';
import './QuizScreen.css';
import { StepForward, CircleStop } from 'lucide-react';

const QuizHeader = ({ currentQuestionIndex, totalQuestions }) => {
  const quiz = useQuiz();
  return (
    <>
      <div className="quiz-header">
        {quiz.numberOfRemainingQuestions} questions remaining
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${quiz.progress*100}%` }}
        />
      </div>
    </>
  );
};

const Option = ({ option, index, revealAnswer, onSelect }) => {
  const className = `option-btn ${revealAnswer != null ? (revealAnswer ? 'correct' : 'incorrect') : ''}`;

  return (
    <button className={className} onClick={onSelect}>
      <span className="option-index">{String.fromCharCode(65 + index)}</span>
      <span className="option-text">{option}</span>
    </button>
  );
};

const RevealAnswer = ({ correct, explanation, onClick }) => {
  const className = `feedback ${correct ? 'correct' : 'incorrect'}`;

  return (
    <div className={className} onClick={onClick}>
      <strong>{correct ? 'Correct!' : 'Incorrect!'}</strong><br />
      {explanation}
    </div>
  );
}; 

const Buttons = ({ showNext, handleNext, handleFinish }) => {  
  return (
    <div className="quiz-button-container">
      {showNext ? (
        <button 
          className={`button next ${showNext ? '' : 'hidden'}`} 
          onClick={handleNext}
        >
          <StepForward />
          <span>Next</span>
        </button>
      ) : <div/>}

      <button 
        className="button finish" 
        onClick={handleFinish}
      >
        <CircleStop />
        <span>Finish</span>
      </button>
    </div>
  );
};


const Question = ({question, revealAnswer, onSelect}) => {
  // Create shuffled indices array while preserving original options order
  const shuffledIndices = useMemo(() => (
    [...Array(question.options.length).keys()].sort(() => Math.random() - 0.5)
  ), [question.question, question.tries]);

  return (
    <div className="question-container">
      <div className="question-text">{question.question}</div>

      <div className="options-container">
        {shuffledIndices.map((originalIndex, index) => (
          <Option
            key={originalIndex}
            option={question.options[originalIndex]} 
            index={index}
            revealAnswer={revealAnswer ? question.correct === originalIndex : null}
            onSelect={() => onSelect(originalIndex)}
          />
        ))}
      </div>

    </div>
  );
};  


const QuizScreen = ({ onFinish }) => {
  const quiz = useQuiz();
  const question = quiz.currentQuestion;
  const [selected, setSelected] = useState(null);

  const handleSelection = (index) => {
    quiz.answerQuestion(index);
    if (quiz.isTestingMode())
      handleNext()
    else
      setSelected(index);
  };
  const handleNext = () => {
    quiz.nextQuestion();
    setSelected(null);
    if (!quiz.numberOfRemainingQuestions) 
      onFinish()
  };
  const revealAnswer = () => quiz.isLearningMode() && selected != null

  return (
    <>
      <QuizHeader />      
      <Question 
        question={question}
        revealAnswer={revealAnswer()}
        onSelect={revealAnswer() ? handleNext : handleSelection}
      />

      {revealAnswer() && (
          <RevealAnswer correct={question.correct === selected} explanation={question.explanation} onClick={handleSelection}></RevealAnswer>
      )} 

      <Buttons showNext={quiz.isLearningMode() && selected != null} handleNext={handleNext} handleFinish={onFinish} />

    </>
  );
};

export default QuizScreen;