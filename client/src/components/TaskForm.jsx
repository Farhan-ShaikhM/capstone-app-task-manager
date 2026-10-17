import { useState } from "react";
import api from "../api/axios";
import { useToast } from "../context/useToast";
import { validateTask } from "../utils/validate";

const initialForm = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: ""
};

export default function TaskForm({ onTaskCreated }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const toast = useToast();

  const handleChange = (event) => {
    const updated = { ...form, [event.target.name]: event.target.value };
    setForm(updated);
    if (touched[event.target.name]) setErrors(validateTask(updated));
  };

  const handleBlur = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
    setErrors(validateTask(form));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const foundErrors = validateTask(form);
    setErrors(foundErrors);
    setTouched({ title: true, description: true, dueDate: true });
    if (Object.keys(foundErrors).length > 0) return;

    try {
      setSubmitting(true);
      const response = await api.post("/tasks", form);
      onTaskCreated(response.data.data);
      setForm(initialForm);
      setErrors({});
      setTouched({});
      toast.success("Task created");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create the task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-heading">
        <div>
          <p className="eyebrow">Capture the next step</p>
          <h2>New task</h2>
        </div>
      </div>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="What needs doing?"
        aria-label="Task title"
        aria-invalid={Boolean(errors.title && touched.title)}
        className={errors.title && touched.title ? "input-error" : ""}
      />
      {errors.title && touched.title && <span className="field-error">{errors.title}</span>}
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Details (optional)"
        rows="2"
        aria-label="Task description"
        aria-invalid={Boolean(errors.description && touched.description)}
        className={errors.description && touched.description ? "input-error" : ""}
      />
      {errors.description && touched.description && <span className="field-error">{errors.description}</span>}

      <div className="form-row">
        <select name="priority" value={form.priority} onChange={handleChange} aria-label="Task priority">
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <div className="field-control">
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-label="Due date"
            aria-invalid={Boolean(errors.dueDate && touched.dueDate)}
            className={errors.dueDate && touched.dueDate ? "input-error" : ""}
          />
          {errors.dueDate && touched.dueDate && <span className="field-error">{errors.dueDate}</span>}
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add task"}
        </button>
      </div>
    </form>
  );
}