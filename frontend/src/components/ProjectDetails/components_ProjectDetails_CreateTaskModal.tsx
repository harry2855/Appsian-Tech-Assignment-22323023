import React, { useState } from 'react';
import { taskService } from '../../services/services_taskService';
import { Task } from '../../types/types_task.types';

interface Props {
  projectId: string;
  existingTasks: Task[];
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

const CreateTaskModal: React.FC<Props> = ({ projectId, existingTasks, onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    isCompleted: false,
    estimatedHours: '8',
    dependencies: [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);

    try {
      const task = await taskService.createTask(projectId, {
        title: formData.title.trim(),
        dueDate: formData.dueDate || undefined,
        isCompleted: formData.isCompleted,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : 8,
        dependencies: formData.dependencies.length > 0 ? formData.dependencies : [''],
      });
      onTaskCreated(task);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Task</h2>
          <button onClick={onClose} className="btn-close" aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-task-form" noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">
                Task Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                maxLength={200}
                placeholder="Enter task title"
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date (optional)</label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="estimatedHours">Estimated Hours (optional)</label>
              <input
                type="number"
                id="estimatedHours"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                min="1"
                max="1000"
                placeholder="e.g., 8"
                className="input"
              />
              <small className="help">Used for smart scheduling</small>
            </div>

            <div className="form-group">
              <label htmlFor="dependencies">Dependencies (optional)</label>
              <select
                id="dependencies"
                multiple
                value={formData.dependencies}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                  setFormData({ ...formData, dependencies: selected });
                }}
                className="select-multiple"
                aria-label="Dependencies"
              >
                {existingTasks
                  .filter((t) => !t.isCompleted)
                  .map((task) => (
                    <option key={task.id} value={task.title}>
                      {task.title}
                    </option>
                  ))}
              </select>
              <small className="help">Hold Ctrl/Cmd to select multiple tasks that must be completed first</small>
            </div>
          </div>

          <div className="form-row checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="isCompleted"
                checked={formData.isCompleted}
                onChange={(e) => setFormData({ ...formData, isCompleted: e.target.checked })}
                className="checkbox-input"
              />
              <span>Mark as completed</span>
            </label>
          </div>

          {error && <div className="error-message" role="alert">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        :root{
          --bg: #0f1724;
          --card: #ffffff;
          --muted: #6b7280;
          --accent: #0ea5a4;
          --accent-600: #09968f;
          --danger: #ef4444;
          --glass: rgba(255,255,255,0.9);
          --shadow: 0 8px 30px rgba(2,6,23,0.35);
          --radius: 12px;
          --gap: 14px;
          --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        .modal-overlay{
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, rgba(2,6,23,0.6), rgba(2,6,23,0.75));
          backdrop-filter: blur(6px);
          z-index: 1200;
          padding: 24px;
        }

        .modal-content{
          width: 100%;
          max-width: 820px;
          background: linear-gradient(180deg, var(--glass), rgba(255,255,255,0.92));
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          overflow: hidden;
          padding: 20px;
          font-family: var(--font-sans);
          color: #0b1220;
          animation: pop .14s ease-out;
        }

        @keyframes pop { from { transform: translateY(8px) scale(.995); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }

        .modal-header{
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 6px;
        }

        .modal-header h2{
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #06121a;
        }

        .btn-close{
          background: transparent;
          border: none;
          font-size: 22px;
          line-height: 1;
          padding: 6px 8px;
          cursor: pointer;
          color: var(--muted);
          border-radius: 8px;
          transition: background .12s, color .12s, transform .06s;
        }

        .btn-close:hover{ background: rgba(6,18,26,0.04); color: #0b1220; transform: translateY(-1px) }

        .create-task-form{ margin-top: 8px; }

        .form-grid{
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--gap);
        }

        .form-group{
          display: flex;
          flex-direction: column;
        }

        .form-group label{
          font-size: 13px;
          color: #0b1220;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .required{ color: var(--danger); margin-left: 4px; font-weight: 700; }

        .input{
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(9,30,66,0.08);
          background: #fff;
          font-size: 14px;
          transition: box-shadow .12s, border-color .12s, transform .06s;
          outline: none;
          color: #06121a;
        }

        .input:focus{
          border-color: var(--accent);
          box-shadow: 0 4px 18px rgba(14,165,164,0.08);
        }

        .select-multiple{
          padding: 10px;
          border-radius: 10px;
          border: 1px solid rgba(9,30,66,0.06);
          background: #fff;
          font-size: 14px;
          min-height: 100px;
        }

        .help{
          display: block;
          margin-top: 6px;
          font-size: 12px;
          color: var(--muted);
        }

        .checkbox-row{
          margin-top: 12px;
          margin-bottom: 6px;
        }

        .checkbox-label{
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #0b1220;
        }

        .checkbox-input{
          width: 18px;
          height: 18px;
          accent-color: var(--accent);
        }

        .error-message{
          margin-top: 12px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.12);
          color: var(--danger);
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13px;
        }

        .modal-actions{
          margin-top: 18px;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          align-items: center;
        }

        .btn{
          cursor: pointer;
          border: none;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          transition: transform .06s ease, box-shadow .12s ease, opacity .12s;
        }

        .btn:active{ transform: translateY(1px) }

        .btn-primary{
          background: linear-gradient(180deg, var(--accent), var(--accent-600));
          color: white;
          box-shadow: 0 8px 20px rgba(9,166,162,0.12), inset 0 -1px rgba(0,0,0,0.06);
        }

        .btn-primary[disabled]{
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-secondary{
          background: transparent;
          border: 1px solid rgba(9,30,66,0.08);
          color: #0b1220;
        }

        /* Responsive */
        @media (max-width: 720px){
          .form-grid{ grid-template-columns: 1fr; }
          .modal-content{ padding: 16px; border-radius: 10px; }
        }
      `}</style>
    </div>
  );
};

export default CreateTaskModal;
