import React, { useState } from "react";
import { useGetAllProductsQuery } from "../../services/productsAPI";
import {
    useUpdateCartMutation,
    useGetCartQuery,
    useBuyNowMutation,
} from "../../services/ordersAPI";
import { useNavigate } from "react-router-dom";

function BrowseProducts() {
    const { data: products, isLoading, refetch: refetchProducts } = useGetAllProductsQuery();
    const userId = localStorage.getItem("userId");
    const { data: cartData, refetch: refetchCart } = useGetCartQuery(userId);
    const [updateCart] = useUpdateCartMutation();
    const [buyNowFn, { isLoading: isBuyingNow }] = useBuyNowMutation();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [addedId, setAddedId] = useState(null);
    const [buyingId, setBuyingId] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const cartItems = cartData?.cart || [];

    const getCartItem = (productId) =>
        cartItems.find((item) => (item.productId || item._id) === productId);

    const handleAddToCart = async (product) => {
        const existing = getCartItem(product._id);
        const newCart = existing
            ? cartItems.map((item) =>
                (item.productId || item._id) === product._id
                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                    : item
            )
            : [
                ...cartItems,
                {
                    productId: product._id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    vendor: product.vendor?._id || product.vendor,
                    stock: product.stock,
                    image: product.image,
                    quantity: 1,
                },
            ];

        await updateCart({ userId, cartItems: newCart });
        refetchCart();
        setAddedId(product._id);
        setTimeout(() => setAddedId(null), 1500);
    };

    const handleBuyNow = async (product) => {
        setBuyingId(product._id);
        setErrorMsg("");
        const result = await buyNowFn({ productId: product._id, quantity: 1 });
        setBuyingId(null);
        if (result.error) {
            setErrorMsg(result.error?.data?.msg || "Buy Now failed. Please try again.");
            setTimeout(() => setErrorMsg(""), 3000);
        } else {
            refetchProducts(); // update stock badge immediately
            navigate("/buyer/orders");
        }
    };

    const filtered = products?.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => navigate("/buyer/dashboard")}
                    >
                        ← Back
                    </button>
                    <h3 className="mb-0">🔍 Browse Products</h3>
                </div>
                <button
                    className="btn btn-outline-success btn-sm position-relative"
                    onClick={() => navigate("/buyer/cart")}
                >
                    🛒 Cart
                    {cartItems.length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartItems.length}
                        </span>
                    )}
                </button>
            </div>

            {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

            <input
                type="text"
                className="form-control mb-4"
                placeholder="🔍 Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {isLoading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-2 text-muted">Loading products...</p>
                </div>
            )}

            {!isLoading && filtered?.length === 0 && (
                <div className="text-center py-5">
                    <div className="fs-1">😕</div>
                    <p className="text-muted">No products found.</p>
                </div>
            )}

            <div className="row g-3">
                {filtered?.map((product) => {
                    const outOfStock = product.stock === 0;
                    const inCart = !!getCartItem(product._id);
                    const isBuyingThis = buyingId === product._id;
                    const isAddedThis = addedId === product._id;

                    return (
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
                                <div className="card-body d-flex flex-column">
                                    <h6 className="card-title fw-bold">{product.name}</h6>
                                    <p className="card-text text-muted small flex-grow-1">
                                        {product.description.length > 80
                                            ? product.description.slice(0, 80) + "..."
                                            : product.description}
                                    </p>
                                    <p className="small text-secondary mb-2">
                                        Sold by: <strong>{product.vendor?.name || "Vendor"}</strong>
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="fw-bold text-success fs-5">₹{product.price}</span>
                                        <span className={`badge ${outOfStock ? "bg-danger" : "bg-success"}`}>
                                            {outOfStock ? "Out of Stock" : `${product.stock} in stock`}
                                        </span>
                                    </div>

                                    {/* Add to Cart */}
                                    <button
                                        className={`btn btn-sm w-100 mb-2 ${isAddedThis
                                                ? "btn-success"
                                                : inCart
                                                    ? "btn-outline-success"
                                                    : "btn-primary"
                                            }`}
                                        disabled={outOfStock}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        {isAddedThis
                                            ? "✅ Added!"
                                            : inCart
                                                ? "➕ Add More"
                                                : "🛒 Add to Cart"}
                                    </button>

                                    {/* Buy Now */}
                                    <button
                                        className="btn btn-warning btn-sm w-100"
                                        disabled={outOfStock || isBuyingThis}
                                        onClick={() => handleBuyNow(product)}
                                    >
                                        {isBuyingThis ? "Processing..." : "⚡ Buy Now"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BrowseProducts;