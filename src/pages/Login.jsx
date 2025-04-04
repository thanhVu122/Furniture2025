import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../utils/api.js";
import { Footer, Navbar } from "../components";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login({ email, password });
      localStorage.setItem("token", response.token);
      navigate("/");
    } catch (error) {
      setError(error.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Đăng nhập</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleLogin}>
              <div className="form my-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form my-3">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-danger mb-3">{error}</div>}
              <div className="my-3">
                <button disabled={loading} className="btn btn-primary" type="submit">
                  {loading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
              </div>
              <div className="my-3">
                <p>
                  Chưa có tài khoản? <Link to="/register" className="text-decoration-underline">Đăng ký</Link>
                </p>
                {/* <p className="mt-2">
                  <Link to="/home" className="btn btn-outline-secondary me-2">Quay về trang chủ</Link>
                  <Link to="/admin-login" className="text-decoration-underline text-primary">Đăng nhập Admin</Link>
                </p> */}
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
