import React from "react";
import { useSelector } from "react-redux";
import { selectUserName } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useGetCartQuery } from "../../services/ordersAPI";
import { useGetMyOrdersQuery } from "../../services/ordersAPI";

function BuyerDashboard() {
    const name = useSelector(selectUserName);
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();
    const { data: cartData } = useGetCartQuery(userId);
    const { data: orders } = useGetMyOrdersQuery();

    const cartCount = cartData?.cart?.length || 0;
    const orderCount = orders?.length || 0;
    const delivered = orders?.filter((o) => o.status === "delivered").length || 0;
    const pending = orders?.filter((o) => o.status === "pending").length || 0;

    const cards = [
        {
            icon: "🔍",
            title: "Browse Products",
            desc: "Discover items from vendors",
            btn: "Browse",
            btnClass: "btn-primary",
            path: "/buyer/browse",
            border: "border-primary",
        },
        {
            icon: "🛒",
            title: "My Cart",
            desc: "Review and checkout your items",
            btn: `View Cart${cartCount > 0 ? ` (${cartCount})` : ""}`,
            btnClass: "btn-success",
            path: "/buyer/cart",
            border: "border-success",
        },
        {
            icon: "📋",
            title: "My Orders",
            desc: "Track your order history",
            btn: "View Orders",
            btnClass: "btn-warning",
            path: "/buyer/orders",
            border: "border-warning",
        },
    ];

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                    <h2 className="text-primary mb-1">🛍️ Buyer Dashboard</h2>
                    <p className="text-muted mb-4">
                        Welcome back, <strong>{name}</strong>!
                    </p>

                    {/* Stats row */}
                    <div className="row g-3 mb-4">
                        <div className="col-6 col-md-3">
                            <div className="card bg-primary bg-opacity-10 border-0 text-center p-3">
                                <div className="fs-2 fw-bold text-primary">{orderCount}</div>
                                <div className="small text-muted">Total Orders</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="card bg-warning bg-opacity-10 border-0 text-center p-3">
                                <div className="fs-2 fw-bold text-warning">{pending}</div>
                                <div className="small text-muted">Pending</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="card bg-success bg-opacity-10 border-0 text-center p-3">
                                <div className="fs-2 fw-bold text-success">{delivered}</div>
                                <div className="small text-muted">Delivered</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="card bg-info bg-opacity-10 border-0 text-center p-3">
                                <div className="fs-2 fw-bold text-info">{cartCount}</div>
                                <div className="small text-muted">Items in Cart</div>
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

export default BuyerDashboard;