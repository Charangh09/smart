function TaskFilters({ filters, setFilters }) {
  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glass panel grid gap-3 rounded-2xl p-4 md:grid-cols-4">
      <input
        type="text"
        value={filters.search}
        onChange={(event) => updateFilter('search', event.target.value)}
        placeholder="Search by title"
        className="field rounded-xl px-3 py-2 text-sm"
      />

      <select
        value={filters.status}
        onChange={(event) => updateFilter('status', event.target.value)}
        className="field rounded-xl px-3 py-2 text-sm"
      >
        <option value="">All Status</option>
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <select
        value={filters.priority}
        onChange={(event) => updateFilter('priority', event.target.value)}
        className="field rounded-xl px-3 py-2 text-sm"
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        value={filters.sortBy}
        onChange={(event) => updateFilter('sortBy', event.target.value)}
        className="field rounded-xl px-3 py-2 text-sm"
      >
        <option value="createdAt-desc">Newest</option>
        <option value="createdAt-asc">Oldest</option>
        <option value="priority-desc">Priority</option>
        <option value="dueDate-asc">Due Date</option>
      </select>
    </div>
  );
}

export default TaskFilters;
