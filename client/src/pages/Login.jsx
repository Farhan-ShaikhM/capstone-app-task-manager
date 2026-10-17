import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { validateLogin } from "../utils/validate";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    if (touched[e.target.name]) setErrors(validateLogin(updated));
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validateLogin(formData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foundErrors = validateLogin(formData);
    setErrors(foundErrors);
    setTouched({ email: true, password: true });
    if (Object.keys(foundErrors).length > 0) return;

    try {
      setError("");
      setLoading(true);
      
      await login(
        formData.email,
        formData.password
      );
      
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>

      {error && <p className="auth-error">{error}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
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
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
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

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;