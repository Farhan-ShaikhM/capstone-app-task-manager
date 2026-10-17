export const validateTask = (form) => {
  const errors = {};
  const title = form.title.trim();

  if (!title) {
    errors.title = "Title is required";
  } else if (title.length < 3) {
    errors.title = "Title must be at least 3 characters";
  } else if (title.length > 100) {
    errors.title = "Title must be under 100 characters";
  }

  if (form.description.length > 500) {
    errors.description = "Description must be under 500 characters";
  }

  if (form.dueDate) {
    const due = new Date(form.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (due < today) {
      errors.dueDate = "Due date cannot be in the past";
    }
  }

  return errors;
};

export const validateLogin = (form) => {
  const errors = {};

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!form.password) {
    errors.password = "Password is required";
  }

  return errors;
};

export const validateRegister = (form) => {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
