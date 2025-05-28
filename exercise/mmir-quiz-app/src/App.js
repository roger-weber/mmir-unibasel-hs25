import SelectionScreen from './components/SelectionScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import { QuizProvider, useQuiz } from './context/QuizContext';
import './App.css';


const AppContent = () => {
  const quiz = useQuiz();
  return (
    <div className={`app ${quiz.mode}-mode`}>
      <div className="container">
        <div className="card">
          <div style={{display: 'flex', alignItems: 'center'}}>
            <img src="logo.png" alt="Logo" class="logo" />
            <h1>MMIR Learning Application</h1>
          </div>
          {quiz.screen === 'selection'   &&  <SelectionScreen />}
          {quiz.screen === 'quiz'        &&  <QuizScreen />}
          {quiz.screen === 'results'     &&  <ResultsScreen />}
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
