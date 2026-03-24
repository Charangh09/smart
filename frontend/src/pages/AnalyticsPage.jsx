import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { getAnalyticsApi } from '../api/taskApi';
import SkeletonCard from '../components/common/SkeletonCard';
import { notifyError } from '../utils/notify';

const pieColors = ['#1484e4', '#6bbcfb', '#0c3c64', '#816664', '#9cb4c8'];

const defaultAnalytics = {
  cards: { total: 0, completed: 0, pending: 0, completionPercentage: 0 },
  statusChart: [],
  priorityChart: [],
  completionTrend: [],
};

const normalizeAnalytics = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return defaultAnalytics;
  }

  const cards = payload.cards && typeof payload.cards === 'object' ? payload.cards : {};

  return {
    cards: {
      total: Number.isFinite(Number(cards.total)) ? Number(cards.total) : 0,
      completed: Number.isFinite(Number(cards.completed)) ? Number(cards.completed) : 0,
      pending: Number.isFinite(Number(cards.pending)) ? Number(cards.pending) : 0,
      completionPercentage: Number.isFinite(Number(cards.completionPercentage))
        ? Number(cards.completionPercentage)
        : 0,
    },
    statusChart: Array.isArray(payload.statusChart) ? payload.statusChart : [],
    priorityChart: Array.isArray(payload.priorityChart) ? payload.priorityChart : [],
    completionTrend: Array.isArray(payload.completionTrend) ? payload.completionTrend : [],
  };
};

const labelFormatter = (value) => {
  if (typeof value !== 'string') {
    return value;
  }
  return value.length > 14 ? `${value.slice(0, 14)}...` : value;
};

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(defaultAnalytics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalyticsApi();
        setAnalytics(normalizeAnalytics(data));
      } catch (error) {
        notifyError('Unable to load analytics');
        setAnalytics(defaultAnalytics);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics Dashboard</h2>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="glass panel rounded-2xl p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Tasks</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{analytics.cards.total}</p>
          </div>
          <div className="glass panel rounded-2xl p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-300">{analytics.cards.completed}</p>
          </div>
          <div className="glass panel rounded-2xl p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
            <p className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-300">{analytics.cards.pending}</p>
          </div>
          <div className="glass panel rounded-2xl p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">Completion Rate</p>
            <p className="mt-2 text-3xl font-bold text-blue-700 dark:text-blue-300">{analytics.cards.completionPercentage}%</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass panel rounded-2xl p-5">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Task Status Distribution</h3>
          <div className="h-72">
            {loading ? (
              <div className="h-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            ) : !analytics.statusChart.length ? (
              <div className="grid h-full place-items-center rounded-xl bg-slate-100/60 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                No status data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analytics.statusChart} dataKey="value" nameKey="name" outerRadius={100} label>
                    {analytics.statusChart.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={24} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass panel rounded-2xl p-5">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Priority Breakdown</h3>
          <div className="h-72">
            {loading ? (
              <div className="h-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            ) : !analytics.priorityChart.length ? (
              <div className="grid h-full place-items-center rounded-xl bg-slate-100/60 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                No priority data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.priorityChart}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis dataKey="name" tickFormatter={labelFormatter} />
                  <YAxis allowDecimals={false} />
                  <Legend verticalAlign="top" height={24} />
                  <Tooltip />
                  <Bar dataKey="value" name="Tasks" fill="#1484e4" radius={[8, 8, 0, 0]}>
                    <LabelList dataKey="value" position="top" className="fill-slate-700 dark:fill-slate-200" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="glass panel rounded-2xl p-5">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Completion Trend (Last 7 Days)</h3>
        <div className="h-72">
          {loading ? (
            <div className="h-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          ) : !analytics.completionTrend.length ? (
            <div className="grid h-full place-items-center rounded-xl bg-slate-100/60 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
              No completion trend available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.completionTrend}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={24} />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke="#1484e4"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#1484e4' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
