import { useQuiz } from '../context/QuizContext';
import './SelectionScreen.css';

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
      {quiz.getTopics().map(topic => (
        <div 
          key={topic}
          className={`topic-card ${quiz.isTopicSelected(topic) ? 'selected' : ''}`}
          onClick={() => quiz.toggleTopic(topic)}
        >
          <div className="topic-selection-icon">✓</div>
          <div className="topic-title">{topic}</div>
          <p>{quiz.getNumberOfQuestions(topic)} questions</p>
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
          <p>{Math.ceil((percentage / 100) * quiz.getNumberOfQuestions())} questions</p>
        </div>
      ))}
    </div>
  );
};

const StartButton = () => {
  const quiz = useQuiz();
  
  return (
    <div className="start-button-container">
      <button 
        className="next-btn" 
        disabled={quiz.getNumberOfSelectedQuestions() === 0}
        onClick={quiz.startQuiz}
      >
        Start Quiz ({quiz.getNumberOfSelectedQuestions()} questions)
      </button>
    </div>
  );
};

const SelectionScreen = () => {
  const quiz = useQuiz();

  return (
    <div id="topicSelection">
      <ModeSelector />
      
      <h2 class={quiz.mode || 'hidden'}>{quiz.mode === 'learn' ? 'Select Topics:' : 'Select Percentage:'}</h2>
      
      {quiz.mode === 'learn' ? (
        <TopicGrid />
      ) : (
        <PercentageGrid />
      )}
      
      <StartButton/>
    </div>
  );
};

export default SelectionScreen;