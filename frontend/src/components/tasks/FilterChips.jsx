import { X } from 'lucide-react';
import { motion } from 'framer-motion';

function FilterChip({ label, onRemove }) {
  return (
    <motion.button
      type="button"
      onClick={onRemove}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-500/25 dark:text-blue-300"
    >
      {label}
      <X size={12} />
    </motion.button>
  );
}

function FilterChips({ filters, setFilters }) {
  const chips = [];

  if (filters.status) {
    chips.push({
      key: 'status',
      label: `Status: ${filters.status}`,
      onRemove: () => setFilters((prev) => ({ ...prev, status: '' })),
    });
  }

  if (filters.priority) {
    chips.push({
      key: 'priority',
      label: `Priority: ${filters.priority}`,
      onRemove: () => setFilters((prev) => ({ ...prev, priority: '' })),
    });
  }

  if (filters.search) {
    chips.push({
      key: 'search',
      label: `Search: ${filters.search}`,
      onRemove: () => setFilters((prev) => ({ ...prev, search: '' })),
    });
  }

  if (!chips.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
      ))}
      <motion.button
        type="button"
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            search: '',
            status: '',
            priority: '',
          }))
        }
        whileTap={{ scale: 0.95 }}
        className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-500/25 dark:text-rose-300"
      >
        Clear all
      </motion.button>
    </div>
  );
}

export default FilterChips;
