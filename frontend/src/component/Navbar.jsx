import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserRole,
  selectUserName,
  logout,
} from "../features/auth/authSlice";

function Navbar() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const name = useSelector(selectUserName);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2">
      <Link className="navbar-brand fw-bold" to="/">
        🛍️ MultiVendor
      </Link>

      <div className="d-flex gap-3 ms-auto align-items-center flex-wrap">

        {/* Vendor-specific links */}
        {isAuthenticated && role === "vendor" && (
          <>
            <Link to="/vendor/dashboard" className="nav-link text-success fw-semibold">
              Dashboard
            </Link>
            <Link to="/vendor/add-product" className="nav-link text-white-50">
              Add Product
            </Link>
            <Link to="/vendor/orders" className="nav-link text-white-50">
              Orders
            </Link>
          </>
        )}

        {/* Buyer-specific links */}
        {isAuthenticated && role === "buyer" && (
          <>
            <Link to="/buyer/dashboard" className="nav-link text-info fw-semibold">
              Dashboard
            </Link>
            <Link to="/buyer/cart" className="nav-link text-white-50">
              🛒 Cart
            </Link>
            <Link to="/buyer/orders" className="nav-link text-white-50">
              My Orders
            </Link>
          </>
        )}

        {/* Auth buttons */}
        {isAuthenticated ? (
          <>
            <span className="text-white-50 small border-start border-secondary ps-3">
              👤 {name}
            </span>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
            <Link to="/signup" className="btn btn-secondary btn-sm">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;