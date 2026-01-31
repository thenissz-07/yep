
import json
from js import document, window, hideLoading
from pyodide.ffi import create_proxy
from state import AppState
import components

state = AppState()

async def update_ui():
    root = document.getElementById("root")
    root.innerHTML = components.render_navbar(state.xp, len(state.completed_lessons))
    
    main_content = document.createElement("main")
    main_content.className = "flex-1 py-10 px-4 md:px-8"
    
    if state.current_view == "dashboard":
        main_content.innerHTML = components.render_dashboard(state.lessons, len(state.completed_lessons))
    elif state.current_view == "lesson":
        lesson = state.selected_lesson
        # Show loading for lesson generation
        main_content.innerHTML = '<div class="text-center py-20 animate-pulse">Generating Lesson...</div>'
        root.appendChild(main_content)
        
        prompt = f"Generate an English lesson JSON for Day {lesson['day']} on {lesson['topic']}. Include grammar, vocabulary, readingPassage, codeSnippet (Python), and 3 quiz questions."
        raw_json = await window.getGeminiResponse(prompt)
        content = json.loads(raw_json)
        
        main_content.innerHTML = components.render_lesson(lesson, content)
        state.active_lesson_content = content # Cache for summary
    
    root.appendChild(main_content)

def go_dashboard(event):
    state.current_view = "dashboard"
    update_ui_sync()

def go_chat(event):
    window.alert("Live Chat integration coming soon to Python engine!")

def select_lesson(lesson_id):
    for l in state.lessons:
        if l['id'] == lesson_id:
            state.selected_lesson = l
            state.current_view = "lesson"
            break
    update_ui_sync()

async def finish_lesson(event):
    lesson = state.selected_lesson
    content = state.active_lesson_content
    
    # Generate summary
    summary_prompt = f"Provide a brief B1 level performance summary for a developer who finished a lesson on {content['grammar']}. Use words like {', '.join(content['vocabulary'][:3])}."
    summary = await window.getGeminiResponse(summary_prompt)
    
    state.complete_lesson(lesson['id'])
    
    # Re-render with summary
    main_content = document.querySelector("main")
    main_content.innerHTML = components.render_lesson(lesson, content, summary)

def update_ui_sync():
    import asyncio
    asyncio.ensure_future(update_ui())

# Expose functions to window for py-click
window.go_dashboard = create_proxy(go_dashboard)
window.go_chat = create_proxy(go_chat)
window.select_lesson = create_proxy(select_lesson)
window.finish_lesson = create_proxy(finish_lesson)

# Initial boot
async def boot():
    await update_ui()
    hideLoading()

import asyncio
asyncio.ensure_future(boot())
