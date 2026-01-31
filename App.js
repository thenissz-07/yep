
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard.js';
import { LessonView } from './components/LessonView.js';
import { ChatPractice } from './components/ChatPractice.js';
import { Terminal, Github, Trophy, Calendar } from 'lucide-react';

const INITIAL_LESSONS = [
  { id: '1', day: 1, title: 'Defining Your Environment', description: 'Mastering "To Be" and present simple in technical setups.', level: 'A2', topic: 'Initial Setup', status: 'available' },
  { id: '2', day: 2, title: 'The Loop Concept', description: 'Using present continuous to describe running processes.', level: 'A2', topic: 'Runtime Description', status: 'locked' },
  { id: '3', day: 3, title: 'Debugging the Past', description: 'Past simple vs Past continuous for error logs.', level: 'B1', topic: 'Past Logs', status: 'locked' },
  { id: '4', day: 4, title: 'Predicting Outputs', description: 'Future with "will" and "going to" for app outcomes.', level: 'B1', topic: 'Project Roadmap', status: 'locked' },
  { id: '5', day: 5, title: 'HTML Semantics', description: 'Describing structure using relative clauses.', level: 'B1', topic: 'Web Structure', status: 'locked' },
];

for (let i = 6; i <= 30; i++) {
  INITIAL_LESSONS.push({
    id: i.toString(),
    day: i,
    title: `Step ${i}: Advanced Dev Flow`,
    description: `Leveling up your English communication for Day ${i}.`,
    level: 'B1',
    topic: 'Continuous Improvement',
    status: 'locked'
  });
}

const App = () => {
  const [view, setView] = useState('dashboard');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState({
    currentDay: 1,
    completedLessons: [],
    streak: 0,
    vocabularyMastered: []
  });
  const [lessons, setLessons] = useState(INITIAL_LESSONS);

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setView('lesson');
  };

  const handleCompleteLesson = (id) => {
    setProgress(prev => {
      const newCompleted = prev.completedLessons.includes(id) 
        ? prev.completedLessons 
        : [...prev.completedLessons, id];
      
      return {
        ...prev,
        completedLessons: newCompleted,
        currentDay: Math.max(prev.currentDay, parseInt(id) + 1),
      };
    });

    setLessons(prev => prev.map(l => {
      if (l.id === id) return { ...l, status: 'completed' };
      if (parseInt(l.id) === parseInt(id) + 1) return { ...l, status: 'available' };
      return l;
    }));

    setView('dashboard');
    setSelectedLesson(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Terminal className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">DEV<span className="text-indigo-400">ENGLISH</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <button className="hover:text-white transition-colors" onClick={() => setView('dashboard')}>Daily Plan</button>
            <button className="hover:text-white transition-colors" onClick={() => setView('chat')}>AI Coach</button>
            <button className="hover:text-white transition-colors">Vocabulary Bank</button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-full space-x-2">
              <Trophy size={16} className="text-yellow-500" />
              <span className="text-xs font-bold text-slate-200">{progress.completedLessons.length * 10} XP</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-slate-700" />
          </div>
        </div>
      </nav>

      <main className="flex-1 py-10 px-4 md:px-8">
        {view === 'dashboard' && (
          <Dashboard 
            lessons={lessons} 
            progress={progress} 
            onSelectLesson={handleSelectLesson} 
            onStartChat={() => setView('chat')}
          />
        )}
        {view === 'lesson' && selectedLesson && (
          <LessonView 
            lesson={selectedLesson} 
            onBack={() => setView('dashboard')} 
            onComplete={handleCompleteLesson} 
          />
        )}
        {view === 'chat' && (
          <ChatPractice onBack={() => setView('dashboard')} />
        )}
      </main>

      <footer className="border-t border-slate-800 py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Calendar size={18} />
            <span>Target: B1 Proficiency in 30 Days</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-indigo-400 transition-colors">Support</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a>
            <a href="https://github.com" target="_blank" className="hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
