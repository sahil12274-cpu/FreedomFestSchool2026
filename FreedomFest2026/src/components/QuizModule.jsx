import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle2, XCircle, RotateCcw, Sparkles, HelpCircle, Trophy, Medal, ArrowRight, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect } from '../utils/audioSynthesizer';

export default function QuizModule({ quizQuestions, onCompleteQuiz }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const currentQ = quizQuestions[currentIndex];

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    playSoundEffect('click');
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      playSoundEffect('success');
      setScore(prev => prev + 1);
    } else {
      playSoundEffect('error');
    }

    setUserAnswers(prev => [...prev, { questionId: currentQ.id, selectedIndex: index, isCorrect }]);
  };

  const handleNextQuestion = () => {
    playSoundEffect('click');
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (score + (selectedOption === currentQ.correctIndex ? 1 : 0) >= 3) {
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) { console.log(e); }
      }
    }
  };

  const handleRestartQuiz = () => {
    playSoundEffect('click');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setUserAnswers([]);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Quiz Header & Progress */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#138808]/15 border border-[#138808]/40 text-[#138808] text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4 text-[#138808]" /> Freedom Fest Trivia Challenge
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-stone-900 tracking-tight">
          Madam Cama Heritage Quiz
        </h2>
        <p className="text-sm text-stone-600">
          Test your knowledge on her global revolutionary network, historic flag, and selfless legacy.
        </p>
      </div>

      {!isFinished ? (
        <div className="parchment-card p-6 sm:p-10 rounded-3xl border-2 border-[#FF9933]/30 shadow-2xl space-y-6">
          
          {/* Progress Bar & Counter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-stone-600">
              <span className="text-[#000080]">Question {currentIndex + 1} of {quizQuestions.length}</span>
              <span className="text-[#138808]">Score: {score}</span>
            </div>
            <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden p-0.5 border border-stone-300">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 leading-snug">
              {currentQ.question}
            </h3>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-3.5 pt-2">
              {currentQ.options.map((option, idx) => {
                let btnStyle = "bg-white border-stone-300 text-stone-800 hover:border-[#FF9933] hover:bg-stone-50";
                
                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = "bg-emerald-600 text-white border-emerald-600 font-bold shadow-lg ring-2 ring-emerald-300";
                  } else if (idx === selectedOption) {
                    btnStyle = "bg-red-600 text-white border-red-600 font-bold shadow-md";
                  } else {
                    btnStyle = "bg-stone-100 text-stone-400 border-stone-200 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-medium text-sm sm:text-base transition-all duration-200 flex items-center justify-between shadow-sm ${btnStyle}`}
                  >
                    <span className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-xs">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </span>

                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-6 h-6 text-white shrink-0 ml-2" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <XCircle className="w-6 h-6 text-white shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Card (Appears after answer) */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-amber-500/10 border-2 border-[#FF9933]/40 space-y-3"
              >
                <div className="flex items-center space-x-2 text-[#D97706] font-bold text-sm font-heading">
                  <HelpCircle className="w-5 h-5 text-[#FF9933]" />
                  <span>Historical Insight:</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                  {currentQ.explanation}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center space-x-2 px-6 py-2.5 bg-[#FF9933] hover:bg-[#D97706] text-white font-bold rounded-xl text-sm transition-all shadow-md"
                  >
                    <span>{currentIndex < quizQuestions.length - 1 ? "Next Question" : "See Final Score"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      ) : (
        /* END OF QUIZ SCORE SUMMARY & CERTIFICATE CARD */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="parchment-card-gold p-8 sm:p-12 rounded-3xl border-4 border-[#FF9933] shadow-2xl text-center space-y-8 relative overflow-hidden"
        >
          {/* Certificate Badge Accent */}
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-[#000080] via-[#FF9933] to-[#138808] p-1 shadow-2xl flex items-center justify-center animate-bounce">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Trophy className="w-12 h-12 text-[#FF9933]" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-extrabold font-heading text-stone-900">
              Quiz Completed!
            </h3>
            <p className="text-base text-stone-700 font-medium">
              You scored <strong className="text-2xl text-[#138808]">{score}</strong> out of <strong className="text-2xl text-[#000080]">{quizQuestions.length}</strong>
            </p>
          </div>

          {/* Certificate Box */}
          <div className="bg-white p-6 rounded-2xl border-2 border-stone-300 shadow-md max-w-lg mx-auto space-y-3">
            <div className="flex items-center justify-center space-x-2 text-[#000080] font-heading font-bold text-lg">
              <Medal className="w-6 h-6 text-[#FF9933]" />
              <span>Mother of the Revolution Scholar</span>
            </div>
            <p className="text-xs text-stone-600">
              Presented at Freedom Fest 2026 for outstanding knowledge of Madam Bhikaji Cama's life and national legacy.
            </p>
          </div>

          {/* Retake Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleRestartQuiz}
              className="flex items-center space-x-2 px-8 py-3 bg.138808 bg-[#138808] hover:bg-[#0D5C05] text-white font-bold text-base rounded-2xl transition-all shadow-lg hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Retake Freedom Fest Quiz</span>
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
