import { useState, useEffect } from "react";
import "./App.css";

import { DEMO_PROJECTS, DEMO_TASKS, DEMO_ACTIVITY } from "./data/demoData.js";

import Header        from "./components/Header.jsx";
import KpiCards      from "./components/KpiCards.jsx";
import ProjectTable  from "./components/ProjectTable.jsx";
import ProjectModal  from "./components/ProjectModal.jsx";
import TaskTable     from "./components/TaskTable.jsx";
import TaskModal     from "./components/TaskModal.jsx";
import BudgetAnalysis from "./components/BudgetAnalysis.jsx";
import ActivityLog   from "./components/ActivityLog.jsx";
import AboutSection  from "./components/AboutSection.jsx";

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let nextId = Date.now();
function genId() { return ++nextId; }

function nowIso() { return new Date().toISOString(); }

export default function App() {
  const [darkMode,   setDarkMode]   = useState(() => load("opsflow_dark", false));
  const [activeTab,  setActiveTab]  = useState("dashboard");
  const [projects,   setProjects]   = useState(() => load("opsflow_projects", DEMO_PROJECTS));
  const [tasks,      setTasks]      = useState(() => load("opsflow_tasks",    DEMO_TASKS));
  const [activities, setActivities] = useState(() => load("opsflow_activity", DEMO_ACTIVITY));

  // Modals
  const [projectModal, setProjectModal] = useState(null); // null | "new" | project object
  const [taskModal,    setTaskModal]    = useState(null); // null | "new" | task object

  // Dark mode
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    save("opsflow_dark", darkMode);
  }, [darkMode]);

  // Persist
  useEffect(() => { save("opsflow_projects", projects); }, [projects]);
  useEffect(() => { save("opsflow_tasks",    tasks);    }, [tasks]);
  useEffect(() => { save("opsflow_activity", activities); }, [activities]);

  function addActivity(message) {
    setActivities((prev) => [{ id: genId(), datetime: nowIso(), message }, ...prev]);
  }

  // ---- Project CRUD ----
  function handleSaveProject(form) {
    if (form.id) {
      setProjects((prev) => prev.map((p) => (p.id === form.id ? { ...form } : p)));
      addActivity(`Project '${form.name}' updated`);
    } else {
      const newP = { ...form, id: genId() };
      setProjects((prev) => [...prev, newP]);
      addActivity(`Project '${form.name}' created`);
    }
    setProjectModal(null);
  }

  function handleDeleteProject(id) {
    const proj = projects.find((p) => p.id === id);
    if (!window.confirm(`Delete project "${proj?.name}"? This will not delete its tasks.`)) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addActivity(`Project '${proj?.name}' deleted`);
  }

  // ---- Task CRUD ----
  function handleSaveTask(form) {
    if (form.id) {
      setTasks((prev) => prev.map((t) => (t.id === form.id ? { ...form } : t)));
      addActivity(`Task '${form.title}' updated`);
    } else {
      const newT = { ...form, id: genId() };
      setTasks((prev) => [...prev, newT]);
      addActivity(`Task '${form.title}' created`);
    }
    setTaskModal(null);
  }

  function handleDeleteTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!window.confirm(`Delete task "${task?.title}"?`)) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addActivity(`Task '${task?.title}' deleted`);
  }

  return (
    <div className="app">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {activeTab === "dashboard" && (
        <div className="page">
          <div className="page__title">Dashboard</div>
          <div className="page__subtitle">Live overview of all projects and tasks</div>
          <KpiCards projects={projects} tasks={tasks} />
          <ActivityLog activities={activities} />
        </div>
      )}

      {activeTab === "projects" && (
        <div className="page">
          <div className="page__title">Projects</div>
          <div className="page__subtitle">Manage all your projects</div>
          <ProjectTable
            projects={projects}
            onAdd={() => setProjectModal("new")}
            onEdit={(p) => setProjectModal(p)}
            onDelete={handleDeleteProject}
          />
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="page">
          <div className="page__title">Tasks</div>
          <div className="page__subtitle">Track all tasks across projects</div>
          <TaskTable
            tasks={tasks}
            projects={projects}
            onAdd={() => setTaskModal("new")}
            onEdit={(t) => setTaskModal(t)}
            onDelete={handleDeleteTask}
          />
        </div>
      )}

      {activeTab === "budget" && (
        <div className="page">
          <div className="page__title">Budget Analysis</div>
          <div className="page__subtitle">Budget vs actual spend across all projects</div>
          <BudgetAnalysis projects={projects} />
        </div>
      )}

      {activeTab === "about" && <AboutSection />}

      {/* Modals */}
      {projectModal && (
        <ProjectModal
          project={projectModal === "new" ? null : projectModal}
          onSave={handleSaveProject}
          onClose={() => setProjectModal(null)}
        />
      )}
      {taskModal && (
        <TaskModal
          task={taskModal === "new" ? null : taskModal}
          projects={projects}
          onSave={handleSaveTask}
          onClose={() => setTaskModal(null)}
        />
      )}
    </div>
  );
}
