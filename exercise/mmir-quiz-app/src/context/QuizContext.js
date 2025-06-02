import { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext();
export const useQuiz = () => useContext(QuizContext);


// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const QuizProvider = ({ children }) => {
  // state managed by this provider
  const [mode, setMode] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedPercentage, setSelectedPercentage] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [results, setResults] = useState({});
  const [quizData, setQuizData] = useState({});
  const [metaData, setMetaData] = useState({});

  // effects
  useEffect(() => {
    if (mode === 'learn') {
      setQuestions(selectedTopics.reduce((set, t) => set.concat(quizData[t]), []))
    } else {
      const questions = Object.values(quizData).flat();
      const numQuestions = Math.ceil((selectedPercentage/100) * questions.length);
      setQuestions(shuffleArray(questions).slice(0, numQuestions))
    }
  }, [mode, selectedTopics, selectedPercentage, quizData]);


  // export access obejct
  const value = {
    // set learning/testing mode
    mode,
    isLearningMode: () => mode === 'learn',
    isTestingMode: () => mode === 'test',
    setLearningMode: () => setMode('learn'),
    setTestingMode: () => setMode('test'),

    // access to question data, topics, and managing selections
    async load() {
      const response = await fetch('quiz-data.json');
      const data = await response.json();
      setQuizData(data['questions']);
      setMetaData(data['meta-data']);
    },
    get data() {
      return quizData;
    },
    get topics() {
      return Object.keys(quizData);
    },
    get numberOfQuestions() {
      return Object.values(quizData).reduce((count, questions) => count + questions.length, 0)
    },
    getNumberOfTopicQuestions: (topic) => quizData[topic].length,
    get metaData() {
      return metaData
    },

    // handle selection of questions
    questions,
    reset: () => {
      setSelectedTopics([]);
      setSelectedPercentage(0);
      setQuestions([]);
    },
    get numberOfSelectedQuestions() {
      return questions.length;
    },

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
    setPercentage: setSelectedPercentage,

    // quiz state
    startQuiz: () => {
      for(const q of questions) {
        q.tries = 0;
        q.answer = null;
      }    
      setPendingQuestions(shuffleArray(questions));
    },
    nextQuestion: () => {
      if (!pendingQuestions.length) return;
      const lastQuestion = pendingQuestions.shift();
      lastQuestion.tries += 1
      if (mode === 'learn' && lastQuestion.answer !== lastQuestion.correct) {
        // push question back and reshuffle
        pendingQuestions.push(lastQuestion);
      }
      setPendingQuestions([...pendingQuestions])
    },
    answerQuestion: (answer) => {
      if (!pendingQuestions.length) return;
      pendingQuestions[0].answer = answer;
    },
    get currentQuestion() {
      return pendingQuestions[0];
    },
    get numberOfRemainingQuestions() {
      return pendingQuestions.length;
    },
    get progress() {
      return (questions.length - pendingQuestions.length) / questions.length;
    },
    results,
    evaluateResults: () => {
      const results = {};

      results.correct = questions.filter(q => q.answer === q.correct).length;
      results.total = questions.reduce((count,q) => (count + q.tries),0);
      results.score = Math.round(results.correct / results.total * 100);
      results.topics = {};
      for(const topic of Object.keys(quizData)) {
        const topicQuestions = questions.filter(q => q.topic === topic);
        const total = topicQuestions.reduce((count,q) => (count + q.tries),0);
        if (total === 0) continue;
        const correct = topicQuestions.filter(q => q.answer === q.correct).length;
        const score = Math.round(correct / total * 100);
        results.topics[topic] = { correct, total, score };
      }
      setResults(results.total >0 ? results : null);
    },
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};