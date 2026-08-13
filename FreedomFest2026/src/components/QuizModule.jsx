import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle2, XCircle, RotateCcw, HelpCircle, Trophy, Medal } from 'lucide-react';
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
      setScore((prev) => prev + 1);
    } else {
      playSoundEffect('error');
    }

    setUserAnswers((prev) => [
      ...prev,
      { questionId: currentQ.id, selectedIndex: index, isCorrect },
    ]);
  };

  const handleNextQuestion = () => {
    playSoundEffect('click');
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (score + (selectedOption === currentQ.correctIndex ? 1 : 0) >= 3) {
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          console.log(e);
        }
      }
      if (onCompleteQuiz) onCompleteQuiz(score + (selectedOption === currentQ.correctIndex ? 1 : 0));
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setUserAnswers([]);
  };

  const handleCloseExplanation = () => {
    playSoundEffect('click');
    handleNextQuestion();
  };

  const modalContent = isAnswered ? (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={handleCloseExplanation}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2147483647,
          background: 'rgba(0,0,0,0.72)',
          pointerEvents: 'auto',
        }}
      />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.18 }}
        style={{
          position: 'fixed',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(420px, calc(100vw - 2rem))',
          zIndex: 2147483648,
        }}
        className="px-4"
      >
        <div className="bg-white rounded-[2rem] border-3 border-[#FF9933] shadow-2xl p-4 sm:p-5 space-y-3 cursor-default">
          <div className="flex items-center space-x-3">
            {selectedOption === currentQ.correctIndex ? (
              <>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="text-lg font-bold text-emerald-600">Correct Answer!</h4>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="text-lg font-bold text-red-600">Not Quite Right</h4>
              </>
            )}
          </div>

          <div className="bg-amber-50 border border-[#FF9933]/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <HelpCircle className="w-4 h-4 text-[#FF9933]" />
              <span className="text-xs font-bold text-[#D97706] uppercase">Historical Insight</span>
            </div>
            <p className="text-sm text-stone-800 leading-relaxed">{currentQ.explanation}</p>
          </div>

          <p className="text-xs text-stone-500 text-center">Click anywhere to continue</p>
        </div>
      </motion.div>
    </>
  ) : null;

  return (
    <>
      <div className="max-w-[32rem] mx-auto w-full py-2 px-2 sm:px-3 overflow-y-auto h-full flex flex-col min-h-0">
        {!isFinished ? (
          <div className="parchment-card p-3 sm:p-3.5 rounded-[1.4rem] border border-[#FF9933]/20 shadow-[0_10px_20px_rgba(0,0,0,0.05)] space-y-2.5 flex-1 overflow-hidden flex flex-col min-h-0 bg-[#fffdf9] text-stone-800">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] font-bold text-stone-600 uppercase tracking-[0.14em]">
                <span className="text-[#000080]">Q{currentIndex + 1}/{quizQuestions.length}</span>
                <span className="text-[#138808]">Score: {score}</span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden border border-stone-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <div className="space-y-2 flex-1 overflow-hidden flex flex-col min-h-0">
              <div className="bg-[#fff8ed] border border-[#FF9933]/20 rounded-[1rem] p-2.5 shadow-inner">
                <h3 className="text-sm sm:text-base font-bold font-heading text-stone-900 leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-1.5 pt-0 flex-1 overflow-y-auto">
                {currentQ.options.map((option, idx) => {
                  let btnStyle = 'bg-white border-stone-200 text-stone-800 hover:border-[#FF9933]/50 hover:bg-[#fff7ef]';

                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm ring-2 ring-emerald-200';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-red-500 text-white border-red-500 font-bold shadow-sm';
                    } else {
                      btnStyle = 'bg-stone-100 text-stone-400 border-stone-200 opacity-70';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-2 rounded-lg border text-left text-[11px] sm:text-[12px] font-medium transition-all duration-200 flex items-center justify-between shadow-sm ${btnStyle}`}
                    >
                      <span className="flex items-center space-x-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="truncate">{option}</span>
                      </span>

                      {isAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-1" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <XCircle className="w-4 h-4 text-white shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="max-h-10 overflow-hidden p-1.5 rounded-lg bg-[#fff4dc] border border-[#FF9933]/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#B15B00]">{selectedOption === currentQ.correctIndex ? '✓ Correct!' : '✗ Incorrect'}</span>
                    <span className="text-[9px] text-stone-600">Click to see insight</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="parchment-card-gold p-6 sm:p-8 rounded-3xl border-4 border-[#FF9933] shadow-2xl text-center space-y-5 relative overflow-hidden"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#000080] via-[#FF9933] to-[#138808] p-1 shadow-2xl flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-[#FF9933]" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold font-heading text-stone-900">Quiz Completed!</h3>
              <p className="text-sm text-stone-700 font-medium">
                You scored <strong className="text-xl text-[#138808]">{score}</strong> out of <strong className="text-xl text-[#000080]">{quizQuestions.length}</strong>
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-stone-300 shadow-md max-w-lg mx-auto space-y-2">
              <div className="flex items-center justify-center space-x-2 text-[#000080] font-heading font-bold text-base">
                <Medal className="w-5 h-5 text-[#FF9933]" />
                <span>Mother of the Revolution Scholar</span>
              </div>
              <p className="text-xs text-stone-600">
                Presented at Freedom Fest 2026 for outstanding knowledge of Madam Bhikaji Cama's life and national legacy.
              </p>
            </div>

            <div className="flex justify-center pt-1">
              <button
                onClick={handleRestartQuiz}
                className="flex items-center space-x-2 px-6 py-2 bg-[#138808] hover:bg-[#0D5C05] text-white font-bold text-sm rounded-2xl transition-all shadow-lg hover:scale-105"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isAnswered && typeof document !== 'undefined' && createPortal(modalContent, document.body)}
      </AnimatePresence>
    </>
  );
}
