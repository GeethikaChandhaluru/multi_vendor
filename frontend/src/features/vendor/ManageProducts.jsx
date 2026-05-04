import React, { useState } from "react";
import {
    useGetVendorProductsQuery,
    useDeleteProductMutation,
    useUpdateProductMutation,
} from "../../services/productsAPI";
import { useSelector } from "react-redux";
import { selectToken } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";

function ManageProducts() {
    const vendorId = localStorage.getItem("userId");
    const { data: products, isLoading, refetch } = useGetVendorProductsQuery(vendorId);
    const [deleteProduct] = useDeleteProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const navigate = useNavigate();

    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const startEdit = (product) => {
        setEditingProduct(product._id);
        setEditForm({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image: product.image,
        });
    };

    const handleUpdate = async () => {
        const result = await updateProduct({
            id: editingProduct,
            ...editForm,
            price: Number(editForm.price),
            stock: Number(editForm.stock),
        });
        if (result.error) {
            setMsg({ type: "danger", text: result.error?.data?.msg || "Update failed." });
        } else {
            setMsg({ type: "success", text: "Product updated successfully!" });
            setEditingProduct(null);
        }
        setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    };

    const handleDelete = async (id) => {
        const result = await deleteProduct(id);
        if (result.error) {
            setMsg({ type: "danger", text: "Failed to delete product." });
        } else {
            setMsg({ type: "success", text: "Product deleted." });
            setDeleteConfirm(null);
        }
        setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/vendor/dashboard")}>
                        ← Back
                    </button>
                    <h3 className="mb-0">🗂️ Manage Products</h3>
                </div>
                <button className="btn btn-success btn-sm" onClick={() => navigate("/vendor/add-product")}>
                    ➕ Add New
                </button>
            </div>

            {msg.text && (
                <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>
            )}

            {isLoading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status" />
                    <p className="mt-2 text-muted">Loading your products...</p>
                </div>
            )}

            {!isLoading && (!products || products.length === 0) && (
                <div className="text-center py-5">
                    <div className="fs-1">📦</div>
                    <p className="text-muted">You have no products yet.</p>
                    <button className="btn btn-success" onClick={() => navigate("/vendor/add-product")}>
                        Add Your First Product
                    </button>
                </div>
            )}

            {!isLoading && products?.length > 0 && (
                <div className="row g-3">
                    {products.map((product) => (
                        <div className="col-md-6 col-lg-4" key={product._id}>
                            <div className="card h-100 shadow-sm border-0">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="card-img-top"
                                    style={{ height: 180, objectFit: "cover" }}
                                    onError={(e) => {
                                        e.target.src = "https://placehold.co/300x180?text=No+Image";
                                    }}
                                />
                                <div className="card-body">
                                    {editingProduct === product._id ? (
                                        <div>
                                            <input
                                                className="form-control form-control-sm mb-2"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                placeholder="Name"
                                            />
                                            <textarea
                                                className="form-control form-control-sm mb-2"
                                                rows={2}
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                placeholder="Description"
                                            />
                                            <div className="row g-2 mb-2">
                                                <div className="col">
                                                    <input
                                                        className="form-control form-control-sm"
                                                        type="number"
                                                        value={editForm.price}
                                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                                        placeholder="Price"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <input
                                                        className="form-control form-control-sm"
                                                        type="number"
                                                        value={editForm.stock}
                                                        onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                                        placeholder="Stock"
                                                    />
                                                </div>
                                            </div>
                                            <input
                                                className="form-control form-control-sm mb-2"
                                                value={editForm.image}
                                                onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                                placeholder="Image URL"
                                            />
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-success btn-sm flex-grow-1"
                                                    onClick={handleUpdate}
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? "Saving..." : "✅ Save"}
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => setEditingProduct(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h6 className="card-title fw-bold">{product.name}</h6>
                                            <p className="card-text text-muted small" style={{ minHeight: 40 }}>
                                                {product.description.length > 60
                                                    ? product.description.slice(0, 60) + "..."
                                                    : product.description}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <span className="fw-bold text-success fs-5">₹{product.price}</span>
                                                <span className={`badge ${product.stock > 0 ? "bg-info" : "bg-danger"}`}>
                                                    Stock: {product.stock}
                                                </span>
                                            </div>
                                            {deleteConfirm === product._id ? (
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-danger btn-sm flex-grow-1"
                                                        onClick={() => handleDelete(product._id)}
                                                    >
                                                        Confirm Delete
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => setDeleteConfirm(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-outline-primary btn-sm flex-grow-1"
                                                        onClick={() => startEdit(product)}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => setDeleteConfirm(product._id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageProducts;