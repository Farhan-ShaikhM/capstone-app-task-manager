export default function TaskSkeleton() {
  return (
    <div className="task-card skeleton" aria-hidden="true">
      <div className="skeleton-line" style={{ width: "60%" }} />
      <div className="skeleton-line" style={{ width: "85%" }} />
      <div className="skeleton-badges">
        <div className="skeleton-badge" />
        <div className="skeleton-badge" />
      </div>
    </div>
  );
}
