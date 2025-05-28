import { createContext, useContext, useState, useEffect } from 'react';
import { quizData } from '../data/quizData';

const QuizContext = createContext();
export const useQuiz = () => useContext(QuizContext);


export const QuizProvider = ({ children }) => {
  // state managed by this provider
  const [mode, setMode] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedPercentage, setSelectedPercentage] = useState(0);
  const [questions, setQuestions] = useState([]);





  // other stuff

  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [screen, setScreen] = useState('selection');

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startQuiz = () => {
    let questions = [];
    
    if (mode === 'learn') {
      // Combine questions from selected topics
      selectedTopics.forEach(topic => {
        const topicQuestions = quizData[topic].map(q => ({...q, topic}));
        questions = [...questions, ...topicQuestions];
      });
    } else {
      // Get all questions for test mode
      const allQuestions = [];
      Object.keys(quizData).forEach(topic => {
        const topicQuestions = quizData[topic].map(q => ({...q, topic}));
        allQuestions.push(...topicQuestions);
      });
      
      // Take percentage of questions
      const numQuestions = Math.ceil((selectedPercentage / 100) * allQuestions.length);
      questions = shuffleArray(allQuestions).slice(0, numQuestions);
    }
    
    setCurrentQuestions(shuffleArray(questions));
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setScreen('quiz');
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    // Save current answer
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      return newAnswers;
    });
    
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setScreen('results');
    }
  };

  const backToTopics = () => {
    setScreen('selection');
  };

  // effects
  useEffect(() => {
    setQuestions(shuffleArray(selectedTopics.reduce((set, t) => set.concat(quizData[t]),[])))
  }, [selectedTopics]);

  useEffect(() => {
    if (selectedPercentage > 0) {
      const questions = Object.values(quizData).flat();
      const numQuestions = Math.ceil((selectedPercentage/100) * questions.length);
      setQuestions(shuffleArray(questions).slice(0, numQuestions))
    }
  }, [selectedPercentage]);

  // export access obejct
  const value = {
    // set learning/testing mode
    mode,
    isLearningMode: () => mode === 'learn',
    isTestingMode: () => mode === 'test',
    setLearningMode: () => setMode('learn'),
    setTestingMode: () => setMode('test'),

    // access to question data, topics, and managing selections
    data: quizData,
    getTopics: () => Object.keys(quizData),
    getNumberOfQuestions: (topic) => (
      topic ? quizData[topic].length 
            : Object.values(quizData).reduce((count, questions) => count + questions.length, 0)
    ),

    // handle selection of questions
    questions,
    resetSelections: () => {
      setSelectedTopics([]);
      setSelectedPercentage(0);
      setQuestions([]);
    },
    getNumberOfSelectedQuestions: () => questions.length,

    // selection of topics
    selectedTopics,
    isTopicSelected: (topic) => selectedTopics.includes(topic),
    toggleTopic: (topic) => {
      setSelectedTopics(prev => 
        prev.includes(topic) 
          ? prev.filter(t => t !== topic) 
          : [...prev, topic]
      );
    },

    // percentage selection
    selectedPercentage,
    setPercentage: (percentage) => {
      setSelectedPercentage(percentage)
    },

    
    // other stuff
    currentQuestions,
    currentQuestionIndex,
    userAnswers,
    selectedAnswer,
    screen,
    quizData,
    // handleModeChange,
    startQuiz,
    handleAnswerSelect,
    handleNextQuestion,
    backToTopics
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};