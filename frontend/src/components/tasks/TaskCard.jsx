import { CalendarClock, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

import Loader from '../common/Loader';

const statusClasses = {
  Todo: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  'In Progress': 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
  Done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
};

const priorityClasses = {
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  High: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
};

const priorityBorderClasses = {
  Low: 'border-l-4 border-l-emerald-500',
  Medium: 'border-l-4 border-l-amber-500',
  High: 'border-l-4 border-l-rose-500',
};

function TaskCard({ task, onEdit, onDelete, onComplete, completing = false, deleting = false }) {
  return (
    <div
      className={`glass panel rounded-2xl p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(12,60,100,0.16)] ${priorityBorderClasses[task.priority]}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{task.description || 'No description'}</p>
        </div>

        <div className="flex gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[task.status]}`}>
            {task.status}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClasses[task.priority]}`}>
            {task.priority}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
        <p className="inline-flex items-center gap-1.5">
          <CalendarClock size={14} />
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
        </p>

        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={() => onEdit(task)}
            whileTap={{ scale: 0.94 }}
            className="rounded-lg bg-cyan-500/15 px-2.5 py-1.5 text-cyan-700 transition hover:bg-cyan-500/25 dark:text-cyan-300"
          >
            <Pencil size={14} />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onDelete(task)}
            disabled={deleting}
            whileTap={{ scale: 0.94 }}
            className="rounded-lg bg-rose-500/15 px-2.5 py-1.5 text-rose-700 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-300"
          >
            {deleting ? <Loader size={14} /> : <Trash2 size={14} />}
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onComplete(task)}
            disabled={task.status === 'Done' || completing}
            whileTap={{ scale: 0.94 }}
            className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-1.5 text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {completing ? <Loader size={14} /> : <CheckCircle2 size={14} />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
