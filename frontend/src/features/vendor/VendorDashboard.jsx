import React from "react";
import { useSelector } from "react-redux";
import { selectUserName } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useGetVendorProductsQuery } from "../../services/productsAPI";
import { useGetVendorOrdersQuery } from "../../services/ordersAPI";

function VendorDashboard() {
    const name = useSelector(selectUserName);
    const vendorId = localStorage.getItem("userId");
    const navigate = useNavigate();
    const { data: products } = useGetVendorProductsQuery(vendorId);
    const { data: orders } = useGetVendorOrdersQuery();

    const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;
    const totalRevenue = orders
        ?.filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + o.price * o.quantity, 0) || 0;

    const cards = [
        {
            icon: "📦",
            title: "Add Product",
            desc: "List a new product for sale",
            btn: "Add Product",
            btnClass: "btn-success",
            path: "/vendor/add-product",
            border: "border-success",
        },
        {
            icon: "🗂️",
            title: "Manage Products",
            desc: "Edit, update or remove listings",
            btn: "Manage",
            btnClass: "btn-primary",
            path: "/vendor/products",
            border: "border-primary",
        },
        {
            icon: "🧾",
            title: "View Orders",
            desc: "Track and fulfil customer orders",
            btn: "View Orders",
            btnClass: "btn-warning",
            path: "/vendor/orders",
            border: "border-warning",
        },
    ];

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                    <h2 className="text-success mb-1">🏪 Vendor Dashboard</h2>
                    <p className="text-muted mb-4">
                        Welcome back, <strong>{name}</strong>!
                    </p>

                    {/* Stats row */}
                    <div className="row g-3 mb-4">
                        <div className="col-6 col-md-3">
                            <div className="card bg-success bg-opacity-10 border-0 text-center p-3">
                                <div className="fs-2 fw-bold text-success">{products?.length || 0}</div>
                                <div className="small text-muted">Total Products</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="card bg-warning bg-opacity-10 border-0 text-center p-3">
                                <div className="fs-2 fw-bold text-warning">{pendingOrders}</div>
                                <div className="small text-muted">Pending Orders</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="card bg-info bg-opacity-10 border-0 text-center p-3">
                                <div className="fs-2 fw-bold text-info">{orders?.length || 0}</div>
                                <div className="small text-muted">Total Orders</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="card bg-primary bg-opacity-10 border-0 text-center p-3">
                                <div className="fs-2 fw-bold text-primary">₹{totalRevenue}</div>
                                <div className="small text-muted">Revenue Earned</div>
                            </div>
                        </div>
                    </div>

                    {/* Action cards */}
                    <div className="row g-3">
                        {cards.map((card) => (
                            <div className="col-md-4" key={card.title}>
                                <div className={`card ${card.border} h-100`}>
                                    <div className="card-body text-center p-4">
                                        <div className="fs-1 mb-2">{card.icon}</div>
                                        <h5 className="card-title">{card.title}</h5>
                                        <p className="card-text text-muted small">{card.desc}</p>
                                        <button
                                            className={`btn ${card.btnClass} btn-sm mt-1`}
                                            onClick={() => navigate(card.path)}
                                        >
                                            {card.btn}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VendorDashboard;