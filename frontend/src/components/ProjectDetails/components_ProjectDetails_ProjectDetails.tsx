import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../../services/services_projectService';
import { taskService } from '../../services/services_taskService';
import { Project } from '../../types/types_project.types';
import { Task } from '../../types/types_task.types';
import TaskList from './components_ProjectDetails_TaskList';
import CreateTaskModal from './components_ProjectDetails_CreateTaskModal';
import SmartSchedulerModal from './components_ProjectDetails_SmartSchedulerModal';
import './components_ProjectDetails_ProjectDetails.css';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSchedulerModal, setShowSchedulerModal] = useState(false);

  useEffect(() => {
    loadProjectDetails();
  }, [id]);

  const loadProjectDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError('');
      const projectData = await projectService.getProject(id);
      setProject(projectData);

      // Load tasks separately (you can modify backend to include tasks in project details)
      const tasksData = await taskService.getProjectTasks(id);
      setTasks(tasksData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (task: Task) => {
    setTasks([...tasks, task]);
    setShowCreateModal(false);
  };

  const handleTaskUpdated = async (taskId: string, updates: any) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, updates);
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleTaskDeleted = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  if (loading) {
    return <div className="loading">Loading project...</div>;
  }

  if (error || !project) {
    return (
      <div className="error-container">
        <p>{error || 'Project not found'}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="project-details">
      <header className="project-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
        <div className="project-info">
          <h1>{project.title}</h1>
          {project.description && <p className="project-desc">{project.description}</p>}
        </div>
      </header>

      <main className="project-content">
        <div className="tasks-header">
          <div className="tasks-header-left">
        <h2 className="tasks-title">
          Tasks <span className="task-count">({tasks.length})</span>
        </h2>
        {project?.description && <p className="tasks-subtitle">{project.description}</p>}
          </div>

          <div className="tasks-controls">
        <div className="controls-row">
          <input
            type="search"
            className="task-search"
            placeholder="Search tasks..."
            aria-label="Search tasks"
            onChange={() => {}}
          />
          <select className="task-sort" aria-label="Sort tasks">
            <option value="priority">Priority</option>
            <option value="dueDate">Due date</option>
            <option value="createdAt">Created</option>
          </select>
        </div>

        <div className="controls-actions">
          <button
            onClick={() => setShowSchedulerModal(true)}
            className="btn btn-secondary"
            disabled={tasks.filter((t) => !t.isCompleted).length === 0}
            title="Generate optimal task order"
            aria-disabled={tasks.filter((t) => !t.isCompleted).length === 0}
          >
            <span className="btn-icon" aria-hidden>🧭</span>
            <span>Smart Schedule</span>
          </button>

          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <span className="btn-icon" aria-hidden>＋</span>
            <span>Add Task</span>
          </button>
        </div>
          </div>
        </div>

        <TaskList
          tasks={tasks}
          onTaskUpdate={handleTaskUpdated}
          onTaskDelete={handleTaskDeleted}
        />
      </main>

      {showCreateModal && (
        <CreateTaskModal
          projectId={id!}
          existingTasks={tasks}
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {showSchedulerModal && (
        <SmartSchedulerModal
          projectId={id!}
          tasks={tasks}
          onClose={() => setShowSchedulerModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
