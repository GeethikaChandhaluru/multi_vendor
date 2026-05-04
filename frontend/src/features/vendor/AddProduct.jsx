import React, { useState } from "react";
import { useFormik } from "formik";
import { useCreateProductMutation } from "../../services/productsAPI";
import { useNavigate } from "react-router-dom";

function AddProduct() {
    const [createProduct, { isLoading }] = useCreateProductMutation();
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const form = useFormik({
        initialValues: {
            name: "",
            description: "",
            price: "",
            stock: "",
            image: "",
        },
        validate: (values) => {
            const errors = {};
            if (!values.name) errors.name = "Product name is required";
            if (!values.description) errors.description = "Description is required";
            if (!values.price || isNaN(values.price) || Number(values.price) <= 0)
                errors.price = "Valid price is required";
            if (!values.stock || isNaN(values.stock) || Number(values.stock) < 0)
                errors.stock = "Valid stock quantity is required";
            if (!values.image) errors.image = "Image URL is required";
            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            setErrorMsg("");
            setSuccessMsg("");
            const result = await createProduct({
                ...values,
                price: Number(values.price),
                stock: Number(values.stock),
            });
            if (result.error) {
                setErrorMsg(result.error?.data?.msg || "Failed to add product.");
            } else {
                setSuccessMsg("Product added successfully!");
                resetForm();
                setTimeout(() => navigate("/vendor/products"), 1500);
            }
        },
    });

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center mb-4 gap-2">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/vendor/dashboard")}>
                    ← Back
                </button>
                <h3 className="mb-0">📦 Add New Product</h3>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-7">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            {successMsg && <div className="alert alert-success">{successMsg}</div>}
                            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

                            <form onSubmit={form.handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Product Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${form.touched.name && form.errors.name ? "is-invalid" : ""}`}
                                        placeholder="e.g. Wireless Headphones"
                                        {...form.getFieldProps("name")}
                                    />
                                    {form.touched.name && form.errors.name && (
                                        <div className="invalid-feedback">{form.errors.name}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Description</label>
                                    <textarea
                                        className={`form-control ${form.touched.description && form.errors.description ? "is-invalid" : ""}`}
                                        rows={3}
                                        placeholder="Describe your product..."
                                        {...form.getFieldProps("description")}
                                    />
                                    {form.touched.description && form.errors.description && (
                                        <div className="invalid-feedback">{form.errors.description}</div>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Price (₹)</label>
                                        <input
                                            type="number"
                                            className={`form-control ${form.touched.price && form.errors.price ? "is-invalid" : ""}`}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            {...form.getFieldProps("price")}
                                        />
                                        {form.touched.price && form.errors.price && (
                                            <div className="invalid-feedback">{form.errors.price}</div>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Stock Quantity</label>
                                        <input
                                            type="number"
                                            className={`form-control ${form.touched.stock && form.errors.stock ? "is-invalid" : ""}`}
                                            placeholder="0"
                                            min="0"
                                            {...form.getFieldProps("stock")}
                                        />
                                        {form.touched.stock && form.errors.stock && (
                                            <div className="invalid-feedback">{form.errors.stock}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Image URL</label>
                                    <input
                                        type="url"
                                        className={`form-control ${form.touched.image && form.errors.image ? "is-invalid" : ""}`}
                                        placeholder="https://example.com/image.jpg"
                                        {...form.getFieldProps("image")}
                                    />
                                    {form.touched.image && form.errors.image && (
                                        <div className="invalid-feedback">{form.errors.image}</div>
                                    )}
                                    {form.values.image && (
                                        <div className="mt-2">
                                            <img
                                                src={form.values.image}
                                                alt="Preview"
                                                style={{ height: 100, objectFit: "cover", borderRadius: 8 }}
                                                onError={(e) => (e.target.style.display = "none")}
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success w-100"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Adding..." : "➕ Add Product"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;