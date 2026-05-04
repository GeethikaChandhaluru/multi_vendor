import { useFormik } from "formik";
import React, { useState } from "react";
import { useLoginMutation } from "../services/auth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loginFn, { isLoading }] = useLoginMutation();
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginForm = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: async (values) => {
      setErrorMsg("");
      try {
        const result = await loginFn(values);
        console.log("Login result:", result);

        // RTK Query returns { data } on success, { error } on failure
        if (result.error) {
          const msg =
            result.error?.data?.msg ||
            result.error?.data?.message ||
            result.error?.error ||
            "Login failed. Please check your credentials.";
          setErrorMsg(msg);
          return;
        }

        if (result.data) {
          const { token, role, name, id } = result.data;
          if (!token) {
            setErrorMsg("No token received. Please try again.");
            return;
          }
          dispatch(setCredentials({ token, role, name, id }));
          if (role === "vendor") navigate("/vendor/dashboard");
          else navigate("/buyer/dashboard");
        }
      } catch (err) {
        console.error("Login exception:", err);
        setErrorMsg("Something went wrong. Please try again.");
      }
    },
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">Login</h3>

              {errorMsg && (
                <div className="alert alert-danger py-2">{errorMsg}</div>
              )}

              <form onSubmit={loginForm.handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    {...loginForm.getFieldProps("email")}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    {...loginForm.getFieldProps("password")}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;