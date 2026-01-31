
import React, { useState, useEffect } from 'react';
import { generateLessonContent, generatePerformanceSummary } from '../services/geminiService.js';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Code2, Lightbulb, TrendingUp } from 'lucide-react';

export const LessonView = ({ lesson, onBack, onComplete }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

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

  const handleQuizAnswer = async (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    
    let currentScore = quizScore;
    if (idx === content.quiz[currentQuizIndex].correctAnswer) {
      currentScore += 1;
      setQuizScore(currentScore);
    }

    setTimeout(async () => {
      if (currentQuizIndex < content.quiz.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setQuizFinished(true);
        setSummaryLoading(true);
        try {
          const summaryText = await generatePerformanceSummary(currentScore, content.quiz.length, content);
          setSummary(summaryText);
        } catch (err) {
          console.error("Failed to generate summary", err);
          setSummary("Excellent effort today! You are making steady progress towards B1 proficiency.");
        } finally {
          setSummaryLoading(false);
        }
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fade-in">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
        <p className="text-slate-400 font-medium">Generating your technical English lesson...</p>
      </div>
    );
  }

  if (!content) return <div>Failed to load lesson.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in pb-24">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Dashboard
      </button>

      <div className="space-y-12">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="card-glass p-6">
            <h3 className="text-xl font-bold text-indigo-400 mb-4">Grammar Focus</h3>
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{content.grammar}</p>
          </section>

          <section className="card-glass p-6">
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

        <section className="card-glass p-8 border-sky-500/30">
          <h3 className="text-xl font-bold text-sky-400 mb-4">Reading: Dev Life</h3>
          <p className="text-slate-300 leading-relaxed italic border-l-4 border-sky-500/30 pl-4">
            "{content.readingPassage}"
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-orange-400 flex items-center">
            <Code2 size={24} className="mr-2" />
            Applied Practice ({content.codeSnippet.language})
          </h3>
          <div className="code-container">
            <pre className="text-emerald-400 overflow-x-auto">
              <code>{content.codeSnippet.code}</code>
            </pre>
          </div>
          <p className="text-sm text-slate-400 card-glass p-4 italic">
            <strong>Context:</strong> {content.codeSnippet.explanation}
          </p>
        </section>

        <section className="card-glass bg-indigo-900/10 p-8 border-indigo-500/20">
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

              <div className="mt-8 space-y-4">
                {summaryLoading ? (
                  <div className="flex items-center justify-center space-x-2 py-6 card-glass">
                    <Loader2 className="animate-spin text-indigo-400" size={20} />
                    <span className="text-slate-400 text-sm">Evaluating performance...</span>
                  </div>
                ) : summary ? (
                  <div className="card-glass p-6 text-left border-indigo-500/30 animate-in fade-in zoom-in duration-500">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="text-indigo-400" size={20} />
                      <h5 className="font-bold text-indigo-100 uppercase tracking-wider text-xs">Performance Summary</h5>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      {summary}
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center space-x-2 text-indigo-400">
                      <Lightbulb size={16} />
                      <span className="text-[10px] uppercase font-bold tracking-tighter">Coach Tip: Focus on consistent usage in daily code comments.</span>
                    </div>
                  </div>
                ) : null}
              </div>

              <button
                onClick={() => onComplete(lesson.id)}
                className="btn-primary mt-8"
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
