import React from 'react';
import { Project } from '../../types/types_project.types';

interface Props {
  project: Project;
  onDelete: (id: string) => void;
  onClick: () => void;
}

const ProjectCard: React.FC<Props> = ({ project, onDelete, onClick }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(project.id);
  };

  const completionRate =
    project.taskCount > 0
      ? Math.round((project.completedTaskCount / project.taskCount) * 100)
      : 0;

  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-header">
        <h3 className="project-title">{project.title}</h3>
        <button 
          onClick={handleDelete} 
          className="btn-icon" 
          title="Delete project"
          aria-label="Delete project"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {project.description && (
        <p className="project-description">{project.description}</p>
      )}

      <div className="project-progress">
        <div className="progress-info">
          <span>Progress</span>
          <span>{completionRate}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionRate}%` }}
            role="progressbar"
            aria-valuenow={completionRate}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
      </div>

      <div className="project-meta">
        <div className="project-stats">
          <div className="stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span>{project.taskCount} tasks</span>
          </div>
          <div className="stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
