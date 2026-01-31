
def render_navbar(xp, completed_count):
    return f"""
    <nav class="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <div class="flex items-center space-x-2 cursor-pointer" py-click="go_dashboard">
                <div class="bg-indigo-600 p-2 rounded-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                </div>
                <span class="text-xl font-black tracking-tight text-white">DEV<span class="text-indigo-400">ENGLISH</span></span>
            </div>
            <div class="flex items-center space-x-4">
                <div class="flex items-center bg-slate-800 px-3 py-1.5 rounded-full space-x-2">
                    <span class="text-xs font-bold text-slate-200">{xp} XP</span>
                </div>
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-slate-700"></div>
            </div>
        </div>
    </nav>
    """

def render_dashboard(lessons, completed_count):
    completion_rate = int((completed_count / 30) * 100)
    
    lesson_html = ""
    for l in lessons:
        status_cls = "opacity-60 cursor-not-allowed" if l['status'] == 'locked' else "lesson-card-active cursor-pointer"
        if l['status'] == 'completed': status_cls = "border-green-500/30 bg-green-500/5 cursor-pointer"
        
        click_handler = f"py-click=\"select_lesson('{l['id']}')\"" if l['status'] != 'locked' else ""
        
        lesson_html += f"""
        <div {click_handler} class="relative p-5 card-glass {status_cls}">
            <div class="flex justify-between items-start mb-3">
                <span class="text-xs font-bold px-2 py-1 rounded-md bg-slate-700 text-slate-300">DAY {l['day']}</span>
            </div>
            <h4 class="font-semibold text-slate-100 line-clamp-2">{l['title']}</h4>
            <p class="text-xs text-slate-400 mt-2 line-clamp-2">{l['description']}</p>
        </div>
        """

    return f"""
    <div class="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="card-glass p-6 flex items-center space-x-4">
                <div>
                    <p class="text-sm text-slate-400">Progress</p>
                    <h3 class="text-2xl font-bold">{completion_rate}%</h3>
                </div>
            </div>
            <div class="card-glass p-6 flex items-center space-x-4 cursor-pointer hover:bg-orange-500/10 border-orange-500/20" py-click="go_chat">
                <div>
                    <p class="text-sm text-slate-400">AI Coaching</p>
                    <h3 class="text-xl font-bold">Start Live Practice</h3>
                </div>
            </div>
        </div>
        <div>
            <h2 class="text-2xl font-bold mb-6">Your 30-Day B1 Accelerator</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {lesson_html}
            </div>
        </div>
    </div>
    """

def render_lesson(lesson, content, summary=None):
    vocab_html = "".join([f"<li class='text-slate-200'>• {v}</li>" for v in content['vocabulary']])
    
    summary_html = ""
    if summary:
        summary_html = f"""
        <div class="card-glass p-6 border-indigo-500/30 animate-fade-in mt-8">
            <h5 class="font-bold text-indigo-400 mb-2">Performance Summary</h5>
            <p class="text-sm text-slate-300 leading-relaxed">{summary}</p>
        </div>
        """

    return f"""
    <div class="max-w-4xl mx-auto p-6 animate-fade-in pb-24">
        <button py-click="go_dashboard" class="text-slate-400 hover:text-white mb-8 transition-colors flex items-center">
            ← Back to Dashboard
        </button>
        <div class="space-y-12">
            <header>
                <div class="flex items-center space-x-3 mb-2">
                    <span class="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full">DAY {lesson['day']}</span>
                    <span class="text-slate-400 text-sm">{lesson['topic']}</span>
                </div>
                <h1 class="text-4xl font-extrabold text-white mb-4">{lesson['title']}</h1>
            </header>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section class="card-glass p-6">
                    <h3 class="text-xl font-bold text-indigo-400 mb-4">Grammar Focus</h3>
                    <p class="text-slate-200">{content['grammar']}</p>
                </section>
                <section class="card-glass p-6">
                    <h3 class="text-xl font-bold text-emerald-400 mb-4">Core Vocabulary</h3>
                    <ul class="space-y-2">{vocab_html}</ul>
                </section>
            </div>
            <section class="code-container">
                <pre class="text-emerald-400"><code>{content['codeSnippet']['code']}</code></pre>
            </section>
            <div class="card-glass p-8 bg-indigo-900/10">
                <h3 class="text-2xl font-bold mb-4">Quick Quiz</h3>
                <p class="text-slate-400 italic mb-4">Answer the generated questions mentally, then click finish to see your summary.</p>
                {summary_html}
                <button py-click="finish_lesson" class="btn-primary mt-4">Finish & Evaluate</button>
            </div>
        </div>
    </div>
    """
