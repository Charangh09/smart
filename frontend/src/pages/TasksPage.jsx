import { Inbox, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import { createTaskApi, deleteTaskApi, getTasksApi, updateTaskApi } from '../api/taskApi';
import ConfirmDialog from '../components/common/ConfirmDialog';
import SkeletonCard from '../components/common/SkeletonCard';
import TaskCard from '../components/tasks/TaskCard';
import FilterChips from '../components/tasks/FilterChips';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskFormModal from '../components/tasks/TaskFormModal';
import { notifyError, notifySuccess } from '../utils/notify';

const defaultFilters = {
  search: '',
  status: '',
  priority: '',
  sortBy: 'createdAt-desc',
};

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [filters, setFilters] = useState(defaultFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [pendingCompleteIds, setPendingCompleteIds] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, task: null, loading: false });

  const [sortBy, order] = typeof filters.sortBy === 'string' ? filters.sortBy.split('-') : ['createdAt', 'desc'];

  const query = useMemo(
    () => ({
      ...filters,
      sortBy: sortBy || 'createdAt',
      order: order === 'asc' ? 'asc' : 'desc',
      page: meta.page,
      limit: meta.limit,
    }),
    [filters, meta.page, meta.limit, sortBy, order]
  );

  const hasActiveFilters = Boolean(filters.search || filters.status || filters.priority);

  const fetchTasks = async () => {
    setFetching(true);
    try {
      const data = await getTasksApi(query);
      setTasks(data.data);
      setMeta((prev) => ({ ...prev, ...data.meta }));
    } catch (error) {
      notifyError('Failed to load tasks');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [query.search, query.status, query.priority, query.sortBy, query.page]);

  const handleCreateOrUpdate = async (form) => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        dueDate: form.dueDate || null,
      };

      if (selectedTask) {
        await updateTaskApi(selectedTask._id, payload);
        notifySuccess('Task updated');
      } else {
        await createTaskApi(payload);
        notifySuccess('Task created');
      }

      setIsModalOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      notifyError(error?.response?.data?.message || 'Unable to save task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key.toLowerCase() !== 'n') {
        return;
      }

      const targetTag = event.target?.tagName?.toLowerCase();
      const isTyping = ['input', 'textarea', 'select'].includes(targetTag) || event.target?.isContentEditable;
      if (isTyping || isModalOpen) {
        return;
      }

      event.preventDefault();
      setSelectedTask(null);
      setIsModalOpen(true);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen]);

  const handleDelete = async () => {
    if (!deleteDialog.task?._id || deleteDialog.loading) {
      return;
    }

    const taskId = deleteDialog.task._id;
    const prevTasks = tasks;
    const prevMeta = meta;

    setDeleteDialog((prev) => ({ ...prev, loading: true }));
    setTasks((prev) => prev.filter((task) => task._id !== taskId));
    setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));

    try {
      await deleteTaskApi(taskId);
      notifySuccess('Task deleted');
      setDeleteDialog({ open: false, task: null, loading: false });
      fetchTasks();
    } catch (error) {
      setTasks(prevTasks);
      setMeta(prevMeta);
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
      notifyError('Unable to delete task');
    }
  };

  const handleMarkComplete = async (task) => {
    if (task.status === 'Done') {
      return;
    }

    const prevTasks = tasks;
    setPendingCompleteIds((prev) => [...prev, task._id]);
    setTasks((prev) =>
      prev.map((item) =>
        item._id === task._id
          ? {
              ...item,
              status: 'Done',
            }
          : item
      )
    );

    try {
      await updateTaskApi(task._id, { status: 'Done' });
      notifySuccess('Task marked complete');
    } catch (error) {
      setTasks(prevTasks);
      notifyError('Unable to update task status');
    } finally {
      setPendingCompleteIds((prev) => prev.filter((id) => id !== task._id));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Task Manager</h2>
        <motion.button
          type="button"
          onClick={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
          whileTap={{ scale: 0.96 }}
          className="gradient-btn inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-soft"
        >
          <Plus size={16} />
          Add Task
        </motion.button>
      </div>

      <TaskFilters
        filters={filters}
        setFilters={(updater) => {
          setMeta((prev) => ({ ...prev, page: 1 }));
          setFilters(updater);
        }}
      />

      <div className="flex items-center justify-between gap-2">
        <FilterChips
          filters={filters}
          setFilters={(updater) => {
            setMeta((prev) => ({ ...prev, page: 1 }));
            setFilters(updater);
          }}
        />
        <p className="hidden text-xs text-slate-500 md:block dark:text-slate-400">Shortcut: Press N to create a task</p>
      </div>

      {fetching ? (
        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard className="hidden md:block" />
          <SkeletonCard className="hidden md:block" />
        </div>
      ) : tasks.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={(targetTask) => {
                setSelectedTask(targetTask);
                setIsModalOpen(true);
              }}
              onDelete={(targetTask) => setDeleteDialog({ open: true, task: targetTask, loading: false })}
              onComplete={handleMarkComplete}
              completing={pendingCompleteIds.includes(task._id)}
              deleting={deleteDialog.loading && deleteDialog.task?._id === task._id}
            />
          ))}
        </div>
      ) : (
        <div className="glass panel rounded-2xl p-10 text-center text-slate-500 dark:text-slate-300">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-500/15 text-blue-700 dark:text-blue-300">
            <Inbox size={26} />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
            {hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet 🚀'}
          </p>
          <p className="mt-2 text-sm">
            {hasActiveFilters
              ? 'Try removing filters to see more results.'
              : 'Create your first task to start tracking your work.'}
          </p>
        </div>
      )}

      <div className="glass panel flex items-center justify-between rounded-2xl p-3">
        <p className="text-sm text-slate-600 dark:text-slate-300">Total tasks: {meta.total}</p>
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            disabled={meta.page <= 1}
            onClick={() => setMeta((prev) => ({ ...prev, page: prev.page - 1 }))}
            whileTap={{ scale: 0.96 }}
            className="rounded-lg bg-cyan-500/15 px-3 py-1.5 text-sm text-cyan-700 disabled:opacity-50 dark:text-cyan-300"
          >
            Prev
          </motion.button>
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {meta.page} / {meta.totalPages || 1}
          </span>
          <motion.button
            type="button"
            disabled={meta.page >= meta.totalPages}
            onClick={() => setMeta((prev) => ({ ...prev, page: prev.page + 1 }))}
            whileTap={{ scale: 0.96 }}
            className="rounded-lg bg-orange-500/15 px-3 py-1.5 text-sm text-orange-700 disabled:opacity-50 dark:text-orange-300"
          >
            Next
          </motion.button>
        </div>
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        selectedTask={selectedTask}
        loading={loading}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete task?"
        message={`This will permanently delete "${deleteDialog.task?.title || 'this task'}".`}
        onCancel={() => setDeleteDialog({ open: false, task: null, loading: false })}
        onConfirm={handleDelete}
        loading={deleteDialog.loading}
      />
    </div>
  );
}

export default TasksPage;
