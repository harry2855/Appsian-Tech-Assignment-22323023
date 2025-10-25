import React, { useState } from 'react';
import { projectService } from '../../services/services_projectService';
import { Project } from '../../types/types_project.types';

interface Props {
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const CreateProjectModal: React.FC<Props> = ({ onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.title.length < 1 || formData.title.length > 10) {
      setError('Title must be 1-10 characters');
      return;
    }

    if (formData.description && formData.description.length > 90) {
      setError('Description must be less than 90 characters');
      return;
    }

    setLoading(true);

    try {
      const project = await projectService.createProject({
        title: formData.title,
        description: formData.description || undefined,
      });
      onProjectCreated(project);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-project" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-content">
            <svg className="modal-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 7V17M7 12H17M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <h2>Create New Project</h2>
              <p className="modal-subtitle">Add a new project to your dashboard</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label htmlFor="title">
              <div className="label-content">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 5H6C4.89543 5 4 5.89543 4 7V18C4 19.1046 4.89543 20 6 20H17C18.1046 20 19 19.1046 19 18V13M17.5858 3.58579C18.3668 2.80474 19.6332 2.80474 20.4142 3.58579C21.1953 4.36683 21.1953 5.63316 20.4142 6.41421L11.8284 15H9L9 12.1716L17.5858 3.58579Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Project Title
                <span className="required">*</span>
              </div>
            </label>
            <div className="input-container">
              <input
                type="text"
                id="title"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                minLength={1}
                maxLength={10}
                placeholder="Enter a concise title for your project"
              />
              <div className="input-info">
                <small className="character-count">{formData.title.length}/10 characters</small>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <div className="label-content">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Description
                <span className="optional">(optional)</span>
              </div>
            </label>
            <div className="input-container">
              <textarea
                id="description"
                className="form-input form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                maxLength={90}
                rows={3}
                placeholder="Describe your project's goals and scope"
              />
              <div className="input-info">
                <small className="character-count">{formData.description.length}/90 characters</small>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? (
                <span className="loading-spinner">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 5L16.24 7.83M7.76 16.17L4.93 19M19.07 19L16.24 16.17M7.76 7.83L4.93 5" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Creating Project...
                </span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7V17M7 12H17M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
