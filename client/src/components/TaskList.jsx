import TaskCard from "./TaskCard";

export default function TaskList({ tasks, onUpdate, onDelete, busyIds }) {
  return (
    <section className="task-list" aria-label="Your tasks">
      <div className="section-heading">
        <h2>Your tasks</h2>
        <span>{tasks.length} total</span>
      </div>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isBusy={busyIds.includes(task._id)}
        />
      ))}
    </section>
  );
}