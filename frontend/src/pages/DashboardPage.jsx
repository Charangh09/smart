import { CheckCircle2, Clock3, ListTodo, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { getAnalyticsApi } from '../api/taskApi';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';
import { notifyError } from '../utils/notify';

function DashboardPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionPercentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getAnalyticsApi();
        setCards(data.cards);
      } catch (error) {
        setCards({ total: 0, completed: 0, pending: 0, completionPercentage: 0 });
        notifyError('Unable to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass panel rounded-3xl p-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back, {user?.name || 'User'} 👋</h2>
        <p className="mt-1 text-slate-600 dark:text-slate-300">Track, prioritize, and complete tasks with focus.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<ListTodo size={20} />} label="Total Tasks" value={loading ? '...' : cards.total} tone="" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Completed Tasks" value={loading ? '...' : cards.completed} tone="" />
        <StatCard icon={<Clock3 size={20} />} label="Pending Tasks" value={loading ? '...' : cards.pending} tone="" />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Completion %"
          value={loading ? '...' : `${cards.completionPercentage}%`}
          tone=""
        />
      </div>
    </div>
  );
}

export default DashboardPage;
