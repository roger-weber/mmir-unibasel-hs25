import { useState, useEffect } from 'react';
import SelectionScreen from './components/SelectionScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import ParticlesBackground from './components/Particles';
import { QuizProvider, useQuiz } from './context/QuizContext';
import './App.css';

const AppContent = () => {
  const quiz = useQuiz();
  const [screen, setScreen] = useState('selection');
  
  const startQuiz = () => {
    quiz.startQuiz();
    setScreen('quiz');
  };
  
  const finishQuiz = () => {
    quiz.evaluateResults()
    setScreen('results');
  };
  
  const restartQuiz = () => {
    quiz.startQuiz();
    setScreen('quiz');
  };

  const resetQuiz = () => {
    quiz.reset();
    setScreen('selection');
  };
  
  // Update document title when quiz metadata changes
  useEffect(() => {
    document.title = quiz.metaData.title;
  }, [quiz.metaData.title]);

  useEffect(() => {
    quiz.load()
  }, []);

  return (
    <div className={`app ${quiz.mode}-mode`}>
      <ParticlesBackground />
      <div className="container">
        <div className="card">
          <header className="app-header">
            <img src="logo.png" alt="Logo" className="logo" />
            <h1>{quiz.metaData.title}</h1>
          </header>
          {screen === 'selection' && <SelectionScreen onStartQuiz={startQuiz} />}
          {screen === 'quiz' && <QuizScreen onFinish={finishQuiz} />}
          {screen === 'results' && <ResultsScreen onTryAgain={restartQuiz} onReset={resetQuiz} />}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
};

export default App;
