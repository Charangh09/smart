function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass panel h-44 animate-pulse rounded-2xl p-4 ${className}`}>
      <div className="h-5 w-2/5 rounded bg-slate-300/70 dark:bg-slate-700/70" />
      <div className="mt-4 h-3 w-4/5 rounded bg-slate-300/60 dark:bg-slate-700/60" />
      <div className="mt-2 h-3 w-3/5 rounded bg-slate-300/60 dark:bg-slate-700/60" />
      <div className="mt-8 h-3 w-2/5 rounded bg-slate-300/60 dark:bg-slate-700/60" />
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-8 rounded bg-slate-300/70 dark:bg-slate-700/70" />
        <div className="h-8 w-8 rounded bg-slate-300/70 dark:bg-slate-700/70" />
        <div className="h-8 w-8 rounded bg-slate-300/70 dark:bg-slate-700/70" />
      </div>
    </div>
  );
}

export default SkeletonCard;
