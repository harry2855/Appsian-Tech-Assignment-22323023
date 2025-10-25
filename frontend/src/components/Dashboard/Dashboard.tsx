import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook/hook';
import { projectService } from '../../services/services_projectService';
import { Project } from '../../types/types_project.types';
import ProjectCard from './projectCard';
import CreateProjectModal from './projectModal';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
      setError('');
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (project: Project) => {
    setProjects([...projects, project]);
    setShowCreateModal(false);
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project? All tasks will be deleted.')) {
      return;
    }

    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <div className="logo">Project Manager</div>
        <nav className="nav-menu">
          <a href="/dashboard" className="nav-item active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Dashboard
          </a>
          <a href="/projects" className="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Projects
          </a>
          <a href="/tasks" className="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tasks
          </a>
        </nav>
        <div className="user-profile">
          <div className="user-name">{user?.username}</div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="search-bar">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search projects..."
              />
            </div>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              + New Project
            </button>
          </div>
        </header>

        <div className="projects-container">
          <div className="section-header">
            <h2 className="section-title">My Projects</h2>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>No projects yet. Create your first project to get started!</p>
              <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                Create Project
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDeleteProject}
                  onClick={() => navigate(`/projects/${project.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
