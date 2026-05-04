import React, { useState } from "react";
import {
    useGetMyOrdersQuery,
    useCancelOrderMutation,
} from "../../services/ordersAPI";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS = {
    pending: "warning",
    processing: "info",
    shipped: "primary",
    delivered: "success",
    cancelled: "danger",
};

const STATUS_ICONS = {
    pending: "⏳",
    processing: "⚙️",
    shipped: "🚚",
    delivered: "✅",
    cancelled: "❌",
};

// Only "pending" orders can be cancelled
const canCancel = (status) => status === "pending";

function MyOrders() {
    const { data: orders, isLoading, refetch } = useGetMyOrdersQuery();
    const [cancelOrder] = useCancelOrderMutation();
    const navigate = useNavigate();

    const [cancellingId, setCancellingId] = useState(null);
    const [confirmId, setConfirmId] = useState(null);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const handleCancel = async (orderId) => {
        setCancellingId(orderId);
        const result = await cancelOrder(orderId);
        setCancellingId(null);
        setConfirmId(null);

        if (result.error) {
            setMsg({ type: "danger", text: result.error?.data?.msg || "Cancellation failed." });
        } else {
            setMsg({ type: "success", text: "Order cancelled and stock restored." });
            refetch();
        }
        setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    };

    const sorted = orders
        ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center gap-2 mb-4">
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate("/buyer/dashboard")}
                >
                    ← Back
                </button>
                <h3 className="mb-0">📋 My Orders</h3>
            </div>

            {msg.text && (
                <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>
            )}

            {isLoading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-2 text-muted">Loading your orders...</p>
                </div>
            )}

            {!isLoading && sorted.length === 0 && (
                <div className="text-center py-5">
                    <div className="fs-1">📋</div>
                    <p className="text-muted">You haven't placed any orders yet.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/buyer/browse")}
                    >
                        Start Shopping
                    </button>
                </div>
            )}

            {!isLoading && sorted.length > 0 && (
                <>
                    {/* Status summary strip */}
                    <div className="row g-2 mb-4">
                        {Object.keys(STATUS_COLORS).map((status) => {
                            const count = sorted.filter((o) => o.status === status).length;
                            return (
                                <div className="col" key={status}>
                                    <div
                                        className={`card border-${STATUS_COLORS[status]} text-center py-2 px-1`}
                                    >
                                        <div className="fs-5">{STATUS_ICONS[status]}</div>
                                        <div className={`fw-bold text-${STATUS_COLORS[status]}`}>
                                            {count}
                                        </div>
                                        <div className="small text-muted text-capitalize" style={{ fontSize: 11 }}>
                                            {status}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order cards */}
                    <div className="d-flex flex-column gap-3">
                        {sorted.map((order) => (
                            <div className="card shadow-sm border-0" key={order._id}>
                                <div className="card-body">
                                    <div className="d-flex gap-3 align-items-start">
                                        {/* Product image */}
                                        <img
                                            src={order.image}
                                            alt={order.name}
                                            style={{
                                                width: 80,
                                                height: 80,
                                                objectFit: "cover",
                                                borderRadius: 8,
                                                flexShrink: 0,
                                            }}
                                            onError={(e) =>
                                                (e.target.src = "https://placehold.co/80x80?text=?")
                                            }
                                        />

                                        {/* Details */}
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                                                {/* Left: order info */}
                                                <div>
                                                    <h6 className="mb-1 fw-bold">{order.name}</h6>
                                                    <p className="mb-1 text-muted small">
                                                        {order.description?.slice(0, 70)}
                                                        {order.description?.length > 70 ? "..." : ""}
                                                    </p>
                                                    <div className="d-flex flex-wrap gap-3 small mb-1">
                                                        <span>
                                                            Qty:{" "}
                                                            <strong className="text-dark">{order.quantity}</strong>
                                                        </span>
                                                        <span>
                                                            Price:{" "}
                                                            <strong className="text-dark">₹{order.price}</strong>
                                                        </span>
                                                        <span>
                                                            Total:{" "}
                                                            <strong className="text-success">
                                                                ₹{order.price * order.quantity}
                                                            </strong>
                                                        </span>
                                                    </div>
                                                    <div className="small text-muted">
                                                        Ordered:{" "}
                                                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Right: status badge */}
                                                <span
                                                    className={`badge bg-${STATUS_COLORS[order.status]} fs-6 px-3 py-2 text-capitalize`}
                                                >
                                                    {STATUS_ICONS[order.status]} {order.status}
                                                </span>
                                            </div>

                                            {/* Cancel section — only for pending orders */}
                                            {canCancel(order.status) && (
                                                <div className="mt-3">
                                                    {confirmId === order._id ? (
                                                        <div className="d-flex gap-2 align-items-center">
                                                            <span className="small text-muted">
                                                                Confirm cancellation?
                                                            </span>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                disabled={cancellingId === order._id}
                                                                onClick={() => handleCancel(order._id)}
                                                            >
                                                                {cancellingId === order._id
                                                                    ? "Cancelling..."
                                                                    : "Yes, Cancel"}
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-secondary btn-sm"
                                                                onClick={() => setConfirmId(null)}
                                                            >
                                                                Keep Order
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => setConfirmId(order._id)}
                                                        >
                                                            ✕ Cancel Order
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default MyOrders;