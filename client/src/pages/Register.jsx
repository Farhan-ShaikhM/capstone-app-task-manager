import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { validateRegister } from "../utils/validate";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const updated = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updated);
    if (touched[e.target.name]) setErrors(validateRegister(updated));
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validateRegister(formData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foundErrors = validateRegister(formData);
    setErrors(foundErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (Object.keys(foundErrors).length > 0) return;

    try {
      setError("");
      setLoading(true);

      await register(
        formData.name,
        formData.email,
        formData.password
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>Create Account</h1>

      {error && <p className="auth-error">{error}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label htmlFor="register-name">Name</label>
          <input
            id="register-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.name && touched.name)}
            className={errors.name && touched.name ? "input-error" : ""}
          />
          {errors.name && touched.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div>
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.email && touched.email)}
            className={errors.email && touched.email ? "input-error" : ""}
          />
          {errors.email && touched.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div>
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.password && touched.password)}
            className={errors.password && touched.password ? "input-error" : ""}
          />
          {errors.password && touched.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div>
          <label htmlFor="register-confirm-password">Confirm password</label>
          <input
            id="register-confirm-password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.confirmPassword && touched.confirmPassword)}
            className={errors.confirmPassword && touched.confirmPassword ? "input-error" : ""}
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;