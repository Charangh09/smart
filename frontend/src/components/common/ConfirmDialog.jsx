import { motion } from 'framer-motion';

import Loader from './Loader';

function ConfirmDialog({ open, title, message, onCancel, onConfirm, loading = false }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/45 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="glass panel w-full max-w-md rounded-2xl p-5"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>

        <div className="mt-5 flex justify-end gap-2">
          <motion.button
            type="button"
            onClick={onCancel}
            disabled={loading}
            whileTap={{ scale: 0.96 }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </motion.button>
          <motion.button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            whileTap={{ scale: 0.96 }}
            className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
          >
            <span className="inline-flex items-center gap-2">
              {loading ? <Loader size={14} /> : null}
              {loading ? 'Deleting...' : 'Delete'}
            </span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default ConfirmDialog;
