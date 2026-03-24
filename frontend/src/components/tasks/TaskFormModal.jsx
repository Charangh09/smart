import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

import Loader from '../common/Loader';

const defaultFormState = {
  title: '',
  description: '',
  status: 'Todo',
  priority: 'Medium',
  dueDate: '',
};

function TaskFormModal({ isOpen, onClose, onSubmit, selectedTask, loading }) {
  const [form, setForm] = useState(defaultFormState);
  const titleRef = useRef(null);

  useEffect(() => {
    if (selectedTask) {
      setForm({
        title: selectedTask.title,
        description: selectedTask.description || '',
        status: selectedTask.status,
        priority: selectedTask.priority,
        dueDate: selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setForm(defaultFormState);
    }
  }, [selectedTask, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeout = setTimeout(() => titleRef.current?.focus(), 60);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  const trimmedTitle = form.title.trim();
  const titleError = useMemo(() => {
    if (!trimmedTitle) {
      return 'Title is required';
    }
    if (trimmedTitle.length < 3) {
      return 'Title should be at least 3 characters';
    }
    return '';
  }, [trimmedTitle]);

  const submitHandler = (event) => {
    event.preventDefault();
    if (titleError || loading) {
      return;
    }
    onSubmit(form);
  };

  const updateValue = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !loading) {
              onClose();
            }
          }}
        >
          <motion.form
            onSubmit={submitHandler}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.2 }}
            className="glass panel w-full max-w-xl rounded-2xl p-6"
            onKeyDown={(event) => {
              if (event.key === 'Escape' && !loading) {
                onClose();
              }
            }}
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {selectedTask ? 'Edit Task' : 'Create Task'}
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <input
                  ref={titleRef}
                  value={form.title}
                  onChange={(event) => updateValue('title', event.target.value)}
                  placeholder="Task title"
                  required
                  className={`field w-full rounded-xl px-4 py-2.5 ${titleError ? 'border-rose-400' : ''}`}
                />
                {titleError ? <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-300">{titleError}</p> : null}
              </div>

              <textarea
                value={form.description}
                onChange={(event) => updateValue('description', event.target.value)}
                placeholder="Description"
                rows="3"
                className="field w-full rounded-xl px-4 py-2.5"
              />

              <div className="grid gap-3 md:grid-cols-3">
                <select
                  value={form.status}
                  onChange={(event) => updateValue('status', event.target.value)}
                  className="field rounded-xl px-4 py-2.5"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>

                <select
                  value={form.priority}
                  onChange={(event) => updateValue('priority', event.target.value)}
                  className="field rounded-xl px-4 py-2.5"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) => updateValue('dueDate', event.target.value)}
                  className="field rounded-xl px-4 py-2.5"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <motion.button
                type="button"
                onClick={onClose}
                disabled={loading}
                whileTap={{ scale: 0.96 }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading || Boolean(titleError)}
                whileTap={{ scale: 0.96 }}
                className="gradient-btn rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-soft disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  {loading ? <Loader size={14} /> : null}
                  {loading ? 'Saving...' : selectedTask ? 'Update' : 'Create'}
                </span>
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default TaskFormModal;
