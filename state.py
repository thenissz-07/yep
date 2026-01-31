
class AppState:
    def __init__(self):
        self.current_view = "dashboard"
        self.selected_lesson = None
        self.completed_lessons = []
        self.xp = 0
        self.lessons = self._initialize_lessons()

    def _initialize_lessons(self):
        base_lessons = [
            {"id": "1", "day": 1, "title": "Defining Your Environment", "description": 'Mastering "To Be" and present simple in technical setups.', "level": "A2", "topic": "Initial Setup", "status": "available"},
            {"id": "2", "day": 2, "title": "The Loop Concept", "description": "Using present continuous to describe running processes.", "level": "A2", "topic": "Runtime Description", "status": "locked"},
            {"id": "3", "day": 3, "title": "Debugging the Past", "description": "Past simple vs Past continuous for error logs.", "level": "B1", "topic": "Past Logs", "status": "locked"},
            {"id": "4", "day": 4, "title": "Predicting Outputs", "description": 'Future with "will" and "going to" for app outcomes.', "level": "B1", "topic": "Project Roadmap", "status": "locked"},
            {"id": "5", "day": 5, "title": "HTML Semantics", "description": "Describing structure using relative clauses.", "level": "B1", "topic": "Web Structure", "status": "locked"},
        ]
        for i in range(6, 31):
            base_lessons.append({
                "id": str(i),
                "day": i,
                "title": f"Step {i}: Advanced Dev Flow",
                "description": f"Leveling up your English communication for Day {i}.",
                "level": "B1",
                "topic": "Continuous Improvement",
                "status": "locked"
            })
        return base_lessons

    def complete_lesson(self, lesson_id):
        if lesson_id not in self.completed_lessons:
            self.completed_lessons.append(lesson_id)
            self.xp += 10
            
            # Unlock next
            next_id = str(int(lesson_id) + 1)
            for lesson in self.lessons:
                if lesson["id"] == lesson_id:
                    lesson["status"] = "completed"
                if lesson["id"] == next_id and lesson["status"] == "locked":
                    lesson["status"] = "available"
