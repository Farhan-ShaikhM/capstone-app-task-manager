export default function FilterBar({ filters, onChange, resultCount, totalCount }) {
  return (
    <div className="filter-bar">
      <input
        type="search"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        aria-label="Search tasks"
      />

      <select
        value={filters.status}
        onChange={(event) => onChange({ ...filters, status: event.target.value })}
        aria-label="Filter by status"
      >
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={filters.sort}
        onChange={(event) => onChange({ ...filters, sort: event.target.value })}
        aria-label="Sort tasks"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="priority">By priority</option>
        <option value="title">A-Z</option>
      </select>

      <span className="result-count">{resultCount} of {totalCount}</span>
    </div>
  );
}