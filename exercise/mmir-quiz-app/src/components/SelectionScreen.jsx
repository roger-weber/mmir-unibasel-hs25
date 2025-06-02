import { useQuiz } from '../context/QuizContext';
import './SelectionScreen.css';
import { Play } from 'lucide-react';

const ModeSelector = () => {
  const quiz = useQuiz();
  
  return (
    <div className="mode-selector">
      <button 
        className={`mode-btn learn ${quiz.isLearningMode() ? 'active' : ''}`} 
        onClick={() => quiz.setLearningMode()}
      >
        Learn Mode
      </button>
      <button 
        className={`mode-btn test ${quiz.isTestingMode() ? 'active' : ''}`} 
        onClick={() => quiz.setTestingMode()}
      >
        Test Mode
      </button>
    </div>
  );
};

const TopicGrid = () => {
  const quiz = useQuiz();
  
  return (
    <div className="topic-grid">
      {quiz.topics.map(topic => (
        <div 
          key={topic}
          className={`topic-card ${quiz.isTopicSelected(topic) ? 'selected' : ''}`}
          onClick={() => quiz.toggleTopic(topic)}
        >
          <div className="topic-selection-icon">✓</div>
          <div className="topic-title">{topic}</div>
          <p>{quiz.getNumberOfTopicQuestions(topic)} questions</p>
        </div>
      ))}
    </div>
  );
};

const PercentageGrid = () => {
  const quiz = useQuiz();
  
  return (
    <div className="percentage-grid">
      {[20, 40, 60, 80, 100].map(percentage => (
        <div 
          key={percentage}
          className={`percentage-card ${quiz.selectedPercentage === percentage ? 'selected' : ''}`}
          onClick={() => quiz.setPercentage(percentage)}
        >
          <div className="topic-selection-icon">✓</div>
          <div className="topic-title">{percentage}<span className="percent-sign">%</span></div>
          <p>{Math.ceil((percentage / 100) * quiz.numberOfQuestions)} questions</p>
        </div>
      ))}
    </div>
  );
};

const StartButton = ({ onStartQuiz }) => {
  const quiz = useQuiz();
  
  return (
    <div className="start-button-container">
      <button 
        className="button start" 
        disabled={quiz.numberOfSelectedQuestions === 0}
        onClick={onStartQuiz}
      >
        <Play />
        <span>Start Quiz ({quiz.numberOfSelectedQuestions} questions)</span>
      </button>
    </div>
  );
};

const SelectionScreen = ({ onStartQuiz }) => {
  const quiz = useQuiz();

  return (
    <div id="topicSelection">
      <ModeSelector />
      
      <h2 className={quiz.mode || 'hidden'}>{quiz.isLearningMode() ? 'Select Topics:' : 'Select Percentage:'}</h2>
      
      {quiz.isLearningMode() && <TopicGrid /> }
      {quiz.isTestingMode() && <PercentageGrid /> }
      {quiz.numberOfSelectedQuestions>0 && <StartButton onStartQuiz={onStartQuiz} /> }
    </div>
  );
};

export default SelectionScreen;