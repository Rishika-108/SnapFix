import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Home, AlertCircle } from 'lucide-react';
import { getModuleById } from '../mockData/modules';
import { getUserData, updateModuleProgress, completeModule, recordQuizTaken, hasQuizBeenTaken, getQuizPoints } from '../mockData/gamification';
import ProgressBar from '../components/eduModule/ProgressBar';

export default function Module() {
  const { id } = useParams();
  const navigate = useNavigate();
  const module = getModuleById(id);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (module) {
      const userData = getUserData();
      const progress = userData.moduleProgress[module.id];
      if (progress?.currentSlide) {
        setCurrentSlide(progress.currentSlide);
      }
    }
  }, [module]);

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Module not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const slide = module.slides[currentSlide];
  const isLastSlide = currentSlide === module.slides.length - 1;
  const isFinalQuiz = slide.type === 'final-quiz';
  const userData = getUserData();
  const quizAlreadyTaken = hasQuizBeenTaken(module.id);

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    if (quizSubmitted || quizAlreadyTaken) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!isFinalQuiz) return;

    let correctCount = 0;
    slide.questions.forEach((question, idx) => {
      if (selectedAnswers[idx] === question.correct) {
        correctCount++;
      }
    });

    setQuizScore(correctCount);
    setShowExplanations({});
    slide.questions.forEach((_, idx) => {
      setShowExplanations(prev => ({
        ...prev,
        [idx]: true,
      }));
    });
    setQuizSubmitted(true);

    const points = getQuizPoints(correctCount, slide.questions.length);
    recordQuizTaken(module.id);
  };

  const handleNext = () => {
    if (isFinalQuiz && quizSubmitted) {
      const userData = getUserData();
      if (!userData.completedModules.includes(module.id)) {
        completeModule(module.id, module.cqiReward);
        setCompleted(true);
      } else {
        navigate('/');
      }
      return;
    }

    if (!isLastSlide) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      updateModuleProgress(module.id, nextSlide, module.slides.length);
      setSelectedAnswers({});
      setShowExplanations({});
      setQuizSubmitted(false);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setSelectedAnswers({});
      setShowExplanations({});
      setQuizSubmitted(false);
    }
  };

  const progress = ((currentSlide + 1) / module.slides.length) * 100;

  if (completed) {
    const correctCount = Object.entries(selectedAnswers).filter(
      ([idx, answer]) => answer === slide.questions[parseInt(idx)]?.correct
    ).length;
    const earnedPoints = getQuizPoints(correctCount, slide.questions.length);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Module Complete!</h2>
            <p className="text-gray-600">Congratulations on completing {module.title}</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Base Reward</p>
            <p className="text-3xl font-bold text-blue-600">+{module.cqiReward} CQI</p>
            <p className="text-sm text-gray-600 mt-3 mb-2">Quiz Bonus</p>
            <p className="text-2xl font-bold text-green-600">+{earnedPoints} CQI</p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800">{module.title}</h1>
            <span className="text-sm font-medium text-gray-600">
              {currentSlide + 1} / {module.slides.length}
            </span>
          </div>
          <ProgressBar progress={progress} color="blue" />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 min-h-[500px] flex flex-col">
          {slide.type === 'intro' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <span className="text-8xl mb-6">{slide.image}</span>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{slide.title}</h2>
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">{slide.content}</p>
            </div>
          )}

          {slide.type === 'content' && (
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{slide.title}</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">{slide.content}</p>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Key Points:</h3>
                <ul className="space-y-3">
                  {slide.facts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {slide.type === 'final-quiz' && (
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{slide.title}</h2>
                {quizAlreadyTaken && (
                  <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-800">Quiz Already Taken</p>
                      <p className="text-sm text-amber-700">You've already completed this quiz. You can review your answers but cannot retake it.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {slide.questions.map((question, qIdx) => (
                  <div key={qIdx} className="bg-gray-50 rounded-xl p-5">
                    <p className="font-semibold text-gray-800 mb-4">{qIdx + 1}. {question.question}</p>

                    <div className="space-y-2">
                      {question.options.map((option, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleQuizAnswer(qIdx, oIdx)}
                          disabled={quizSubmitted || quizAlreadyTaken}
                          className={`w-full text-left p-4 rounded-xl transition-all ${
                            selectedAnswers[qIdx] === oIdx
                              ? showExplanations[qIdx]
                                ? oIdx === question.correct
                                  ? 'bg-green-100 border-2 border-green-500'
                                  : 'bg-red-100 border-2 border-red-500'
                                : 'bg-blue-100 border-2 border-blue-500'
                              : showExplanations[qIdx] && oIdx === question.correct
                              ? 'bg-green-50 border-2 border-green-300'
                              : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                          } ${(quizSubmitted || quizAlreadyTaken) && 'cursor-not-allowed'}`}
                        >
                          <span className="font-medium text-gray-800">{option}</span>
                        </button>
                      ))}
                    </div>

                    {showExplanations[qIdx] && (
                      <div className={`mt-4 p-4 rounded-lg ${
                        selectedAnswers[qIdx] === question.correct ? 'bg-green-50' : 'bg-blue-50'
                      }`}>
                        <p className="font-semibold text-gray-800 mb-2">
                          {selectedAnswers[qIdx] === question.correct ? '✓ Correct!' : 'Explanation:'}
                        </p>
                        <p className="text-gray-700">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {quizSubmitted && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mt-6">
                  <p className="text-sm text-gray-600 mb-2">Your Score</p>
                  <p className="text-4xl font-bold text-blue-600 mb-2">
                    {quizScore} / {slide.questions.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    {Math.round((quizScore / slide.questions.length) * 100)}%
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-100">
            <button
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
              onClick={
                isFinalQuiz && !quizSubmitted ? handleSubmitQuiz : handleNext
              }
              disabled={
                isFinalQuiz && !quizSubmitted && Object.keys(selectedAnswers).length !== slide.questions.length
              }
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg"
            >
              {isFinalQuiz && !quizSubmitted
                ? 'Submit Quiz'
                : isLastSlide
                ? 'Complete Module'
                : 'Next'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
