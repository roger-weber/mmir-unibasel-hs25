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

const PercentageSelector = () => {
  const quiz = useQuiz();
  const percentages = [20, 40, 60, 80, 100];
  
  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    quiz.setPercentage(value);
  };
    
  return (
    <div className="percentage-selector">
      <div className="slider-container">
        <input 
          type="range" 
          min="20" 
          max="100" 
          step="20" 
          value={quiz.selectedPercentage} 
          onChange={handleChange}
          className="percentage-slider"
        />
        <div className="slider-labels">
          {percentages.map(percent => (
            <span 
              key={percent} 
              className={quiz.selectedPercentage === percent ? 'active' : ''}
              onClick={() => quiz.setPercentage(percent)}
            >
              {percent}%
            </span>
          ))}
        </div>
      </div>
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
        <span>Start ({quiz.numberOfSelectedQuestions} questions)</span>
      </button>
    </div>
  );
};

const SelectionScreen = ({ onStartQuiz }) => {
  const quiz = useQuiz();

  return (
    <div id="topicSelection">
      <ModeSelector />
      
      {quiz.mode && (
        <>
          <div className="percentage-container">
            <StartButton onStartQuiz={onStartQuiz} />
            <PercentageSelector />
          </div>  

          <h2>Select Topics:</h2>
          <TopicGrid />
        </>
      )}

    </div>
  );
};

export default SelectionScreen;