
import React, { useState, useEffect } from 'react';
import { Lesson, LessonContent } from '../types';
import { generateLessonContent } from '../services/geminiService';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Code2 } from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (id: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onBack, onComplete }) => {
  const [content, setContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await generateLessonContent(lesson.day, lesson.topic);
        setContent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [lesson]);

  const handleQuizAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === content!.quiz[currentQuizIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuizIndex < content!.quiz.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
        <p className="text-slate-400 font-medium">Generating your technical English lesson...</p>
      </div>
    );
  }

  if (!content) return <div>Failed to load lesson.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-500 pb-24">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Dashboard
      </button>

      <div className="space-y-12">
        {/* Header */}
        <header>
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full">
              DAY {lesson.day}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-sm">{lesson.topic}</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">{lesson.title}</h1>
          <p className="text-lg text-slate-300 leading-relaxed">{lesson.description}</p>
        </header>

        {/* Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-indigo-400 mb-4">Grammar Focus</h3>
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{content.grammar}</p>
          </section>

          <section className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">Core Vocabulary</h3>
            <ul className="space-y-3">
              {content.vocabulary.map((word, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="text-slate-200">{word}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <h3 className="text-xl font-bold text-sky-400 mb-4">Reading: Dev Life</h3>
          <p className="text-slate-300 leading-relaxed italic border-l-4 border-sky-500/30 pl-4">
            "{content.readingPassage}"
          </p>
        </section>

        {/* Code Section */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-orange-400 flex items-center">
            <Code2 size={24} className="mr-2" />
            Applied Practice ({content.codeSnippet.language})
          </h3>
          <div className="bg-[#1e1e1e] p-6 rounded-xl font-mono text-sm overflow-x-auto border border-slate-700 shadow-2xl">
            <pre className="text-emerald-400">
              {content.codeSnippet.code}
            </pre>
          </div>
          <p className="text-sm text-slate-400 bg-slate-800/50 p-4 rounded-lg border border-slate-700 italic">
            <strong>Context:</strong> {content.codeSnippet.explanation}
          </p>
        </section>

        {/* Quiz Section */}
        <section className="bg-indigo-900/10 border border-indigo-500/20 p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-white mb-6">Quick Quiz</h3>
          
          {!quizFinished ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm text-slate-400 mb-2">
                <span>Question {currentQuizIndex + 1} of {content.quiz.length}</span>
                <span>Score: {quizScore}</span>
              </div>
              <p className="text-xl text-slate-100 font-medium">
                {content.quiz[currentQuizIndex].question}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {content.quiz[currentQuizIndex].options.map((option, i) => (
                  <button
                    key={i}
                    disabled={selectedOption !== null}
                    onClick={() => handleQuizAnswer(i)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      selectedOption === i 
                        ? i === content.quiz[currentQuizIndex].correctAnswer
                          ? 'bg-green-500/20 border-green-500 text-green-300'
                          : 'bg-red-500/20 border-red-500 text-red-300'
                        : selectedOption !== null && i === content.quiz[currentQuizIndex].correctAnswer
                          ? 'bg-green-500/20 border-green-500 text-green-300'
                          : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {selectedOption !== null && (
                <div className="flex items-start space-x-2 p-4 bg-slate-800/80 rounded-xl animate-in fade-in duration-300">
                  <AlertCircle size={20} className="text-indigo-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-300">{content.quiz[currentQuizIndex].explanation}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
                <CheckCircle2 size={48} className="text-green-500" />
              </div>
              <h4 className="text-3xl font-bold text-white">Lesson Completed!</h4>
              <p className="text-slate-300 text-lg">
                You got {quizScore} out of {content.quiz.length} correct.
              </p>
              <button
                onClick={() => onComplete(lesson.id)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/20"
              >
                Finish Lesson
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
