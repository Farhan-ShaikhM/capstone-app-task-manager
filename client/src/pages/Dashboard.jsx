import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import FilterBar from "../components/FilterBar";
import TaskSkeleton from "../components/TaskSkeleton";
import { useToast } from "../context/useToast";

const defaultFilters = {
  search: "",
  status: "all",
  sort: "newest"
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyIds, setBusyIds] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const toast = useToast();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/tasks", {
        params: {
          search: filters.search.trim() || undefined,
          status: filters.status === "all" ? undefined : filters.status,
          sort: filters.sort
        }
      });
      setTasks(response.data.data);
      setTotalCount(response.data.totalCount ?? response.data.count);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get("/tasks", {
          params: {
            search: filters.search.trim() || undefined,
            status: filters.status === "all" ? undefined : filters.status,
            sort: filters.sort
          },
          signal: controller.signal
        });

        if (active) {
          setTasks(response.data.data);
          setTotalCount(response.data.totalCount ?? response.data.count);
          setError("");
        }
      } catch (err) {
        if (active && err.code !== "ERR_CANCELED") {
          setError(err.response?.data?.message || "Could not load your tasks");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [filters]);

  const handleTaskCreated = async () => {
    await fetchTasks();
  };

  const handleUpdate = async (id, updates) => {
    try {
      setError("");
      await api.put(`/tasks/${id}`, updates);
      await fetchTasks();
      toast.success("Task updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update the task");
      return false;
    }

    return true;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;

    try {
      setBusyIds((previousIds) => [...previousIds, id]);
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete the task");
    } finally {
      setBusyIds((previousIds) => previousIds.filter((busyId) => busyId !== id));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="dashboard">
      <header className="dash-header">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h1>Hello, {user?.name}</h1>
        </div>
        <button onClick={handleLogout} className="btn-ghost">Log out</button>
      </header>

      <TaskForm onTaskCreated={handleTaskCreated} />

      {loading && (
        <div aria-label="Loading tasks">
          <TaskSkeleton />
          <TaskSkeleton />
          <TaskSkeleton />
        </div>
      )}

      {error && (
        <div className="alert-error">
          <span>{error}</span>
          <button onClick={fetchTasks} className="btn-retry">Try again</button>
        </div>
      )}

      {!loading && !error && totalCount === 0 && (
        <div className="empty-state">
          <h2>No tasks yet</h2>
          <p>Add your first task above to get started.</p>
        </div>
      )}

      {!loading && !error && totalCount > 0 && (
        <>
          <FilterBar
            filters={filters}
            onChange={setFilters}
            resultCount={tasks.length}
            totalCount={totalCount}
          />

          {tasks.length > 0 ? (
            <TaskList
              tasks={tasks}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              busyIds={busyIds}
            />
          ) : (
            <div className="empty-state filter-empty">
              <h2>No tasks match your filters</h2>
              <button onClick={() => setFilters(defaultFilters)}>Clear filters</button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Dashboard;