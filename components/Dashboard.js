
import React from 'react';
import { CheckCircle, Lock, Play, TrendingUp, BookOpen, MessageSquare } from 'lucide-react';

export const Dashboard = ({ lessons, progress, onSelectLesson, onStartChat }) => {
  const completionRate = Math.round((progress.completedLessons.length / 30) * 100);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass p-6 flex items-center space-x-4">
          <div className="bg-blue-500/20 p-3 rounded-xl">
            <TrendingUp className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Monthly Progress</p>
            <h3 className="text-2xl font-bold">{completionRate}%</h3>
          </div>
        </div>
        <div className="card-glass p-6 flex items-center space-x-4">
          <div className="bg-green-500/20 p-3 rounded-xl">
            <BookOpen className="text-green-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Lessons Completed</p>
            <h3 className="text-2xl font-bold">{progress.completedLessons.length} / 30</h3>
          </div>
        </div>
        <div className="card-glass p-6 flex items-center space-x-4 cursor-pointer hover:bg-orange-500/10 border-orange-500/20 group" onClick={onStartChat}>
          <div className="bg-orange-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
            <MessageSquare className="text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">AI Speaking Practice</p>
            <h3 className="text-xl font-bold">Go Live</h3>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Play className="mr-2 text-indigo-500" fill="currentColor" size={20} />
          Your 30-Day B1 Accelerator
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {lessons.map((lesson) => (
            <div 
              key={lesson.id}
              onClick={() => lesson.status !== 'locked' && onSelectLesson(lesson)}
              className={`relative p-5 card-glass ${
                lesson.status === 'locked' 
                  ? 'opacity-60 cursor-not-allowed' 
                  : lesson.status === 'completed'
                    ? 'border-green-500/30 bg-green-500/5 cursor-pointer'
                    : 'lesson-card-active cursor-pointer'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                  lesson.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-300'
                }`}>
                  DAY {lesson.day}
                </span>
                {lesson.status === 'completed' ? (
                  <CheckCircle className="text-green-500" size={18} />
                ) : lesson.status === 'locked' ? (
                  <Lock className="text-slate-600" size={18} />
                ) : null}
              </div>
              <h4 className="font-semibold text-slate-100 line-clamp-2">
                {lesson.title}
              </h4>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                {lesson.description}
              </p>
              
              {lesson.status === 'available' && (
                <div className="mt-4 flex justify-end">
                   <div className="text-xs bg-indigo-500 text-white px-3 py-1 rounded-full">Start Now</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
