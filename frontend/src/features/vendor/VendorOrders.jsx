import React, { useState } from "react";
import {
    useGetVendorOrdersQuery,
    useUpdateOrderStatusMutation,
} from "../../services/ordersAPI";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS = {
    pending: "warning",
    processing: "info",
    shipped: "primary",
    delivered: "success",
    cancelled: "danger",
};

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

function VendorOrders() {
    const { data: orders, isLoading, refetch } = useGetVendorOrdersQuery();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const navigate = useNavigate();
    const [msg, setMsg] = useState({ type: "", text: "" });
    const [updatingId, setUpdatingId] = useState(null);

    const handleStatusChange = async (orderId, status) => {
        setUpdatingId(orderId);
        const result = await updateOrderStatus({ orderId, status });
        if (result.error) {
            setMsg({ type: "danger", text: "Failed to update status." });
        } else {
            setMsg({ type: "success", text: `Order status updated to "${status}".` });
            refetch();
        }
        setUpdatingId(null);
        setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center gap-2 mb-4">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/vendor/dashboard")}>
                    ← Back
                </button>
                <h3 className="mb-0">🧾 Customer Orders</h3>
            </div>

            {msg.text && (
                <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>
            )}

            {isLoading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-warning" role="status" />
                    <p className="mt-2 text-muted">Loading orders...</p>
                </div>
            )}

            {!isLoading && (!orders || orders.length === 0) && (
                <div className="text-center py-5">
                    <div className="fs-1">🧾</div>
                    <p className="text-muted">No orders received yet.</p>
                </div>
            )}

            {!isLoading && orders?.length > 0 && (
                <>
                    {/* Summary cards */}
                    <div className="row g-3 mb-4">
                        {STATUS_OPTIONS.map((status) => {
                            const count = orders.filter((o) => o.status === status).length;
                            return (
                                <div className="col" key={status}>
                                    <div className={`card border-${STATUS_COLORS[status]} text-center p-2`}>
                                        <div className={`fw-bold fs-4 text-${STATUS_COLORS[status]}`}>{count}</div>
                                        <div className="small text-capitalize text-muted">{status}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Orders table */}
                    <div className="card shadow-sm border-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <img
                                                        src={order.image}
                                                        alt={order.name}
                                                        style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
                                                        onError={(e) => (e.target.src = "https://placehold.co/40x40?text=?")}
                                                    />
                                                    <span className="fw-semibold small">{order.name}</span>
                                                </div>
                                            </td>
                                            <td>{order.quantity}</td>
                                            <td>₹{order.price}</td>
                                            <td className="fw-bold">₹{order.price * order.quantity}</td>
                                            <td className="small text-muted">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className={`badge bg-${STATUS_COLORS[order.status]} text-capitalize`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    className="form-select form-select-sm"
                                                    style={{ minWidth: 130 }}
                                                    value={order.status}
                                                    disabled={updatingId === order._id || order.status === "delivered" || order.status === "cancelled"}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                >
                                                    {STATUS_OPTIONS.map((s) => (
                                                        <option key={s} value={s} className="text-capitalize">
                                                            {s}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default VendorOrders;