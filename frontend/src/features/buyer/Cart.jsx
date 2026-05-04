import React, { useState } from "react";
import {
    useGetCartQuery,
    useUpdateCartMutation,
    useCreateOrderMutation,
} from "../../services/ordersAPI";
import { useGetAllProductsQuery } from "../../services/productsAPI";
import { useNavigate } from "react-router-dom";

function Cart() {
    const userId = localStorage.getItem("userId");
    const { data: cartData, isLoading, refetch: refetchCart } = useGetCartQuery(userId);
    const { refetch: refetchProducts } = useGetAllProductsQuery();
    const [updateCart] = useUpdateCartMutation();
    const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();
    const navigate = useNavigate();

    const [orderSuccess, setOrderSuccess] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const cartItems = cartData?.cart || [];
    const total = cartItems.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
    );

    const getKey = (item) => item.productId || item._id;

    const updateQty = async (item, delta) => {
        const key = getKey(item);
        const newQty = (item.quantity || 1) + delta;
        const newCart =
            newQty <= 0
                ? cartItems.filter((c) => getKey(c) !== key)
                : cartItems.map((c) =>
                    getKey(c) === key ? { ...c, quantity: newQty } : c
                );
        await updateCart({ userId, cartItems: newCart });
        refetchCart();
    };

    const removeItem = async (item) => {
        const key = getKey(item);
        const newCart = cartItems.filter((c) => getKey(c) !== key);
        await updateCart({ userId, cartItems: newCart });
        refetchCart();
    };

    const handlePlaceOrder = async () => {
        const result = await createOrder();
        if (result.error) {
            setMsg({
                type: "danger",
                text: result.error?.data?.msg || "Failed to place order. Please try again.",
            });
            setTimeout(() => setMsg({ type: "", text: "" }), 3000);
        } else {
            refetchCart();
            refetchProducts(); // update stock counts on browse page
            setOrderSuccess(true);
        }
    };

    if (orderSuccess) {
        return (
            <div className="container mt-5 text-center">
                <div
                    className="card shadow-sm border-0 p-5 mx-auto"
                    style={{ maxWidth: 480 }}
                >
                    <div className="fs-1 mb-3">🎉</div>
                    <h4 className="text-success fw-bold">Order Placed Successfully!</h4>
                    <p className="text-muted">
                        Your items are being processed by the vendor.
                    </p>
                    <div className="d-flex gap-2 justify-content-center mt-3">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/buyer/orders")}
                        >
                            View My Orders
                        </button>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => navigate("/buyer/browse")}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center gap-2 mb-4">
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate("/buyer/dashboard")}
                >
                    ← Back
                </button>
                <h3 className="mb-0">🛒 My Cart</h3>
            </div>

            {msg.text && (
                <div className={`alert alert-${msg.type}`}>{msg.text}</div>
            )}

            {isLoading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status" />
                </div>
            )}

            {!isLoading && cartItems.length === 0 && (
                <div className="text-center py-5">
                    <div className="fs-1">🛒</div>
                    <p className="text-muted">Your cart is empty.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/buyer/browse")}
                    >
                        Browse Products
                    </button>
                </div>
            )}

            {!isLoading && cartItems.length > 0 && (
                <div className="row">
                    {/* Cart items */}
                    <div className="col-md-8">
                        {cartItems.map((item) => (
                            <div
                                className="card mb-3 shadow-sm border-0"
                                key={getKey(item)}
                            >
                                <div className="card-body">
                                    <div className="d-flex gap-3 align-items-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: 80,
                                                height: 80,
                                                objectFit: "cover",
                                                borderRadius: 8,
                                            }}
                                            onError={(e) =>
                                                (e.target.src = "https://placehold.co/80x80?text=?")
                                            }
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1 fw-bold">{item.name}</h6>
                                            <p className="mb-1 text-muted small">
                                                {item.description?.slice(0, 60)}...
                                            </p>
                                            <span className="text-success fw-bold">
                                                ₹{item.price} each
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column align-items-end gap-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => updateQty(item, -1)}
                                                >
                                                    −
                                                </button>
                                                <span className="fw-bold px-1">
                                                    {item.quantity || 1}
                                                </span>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => updateQty(item, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="fw-bold text-dark">
                                                ₹{item.price * (item.quantity || 1)}
                                            </span>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeItem(item)}
                                            >
                                                🗑️ Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order summary */}
                    <div className="col-md-4">
                        <div
                            className="card shadow-sm border-0 p-3 sticky-top"
                            style={{ top: 20 }}
                        >
                            <h5 className="fw-bold mb-3">Order Summary</h5>
                            {cartItems.map((item) => (
                                <div
                                    className="d-flex justify-content-between small mb-1"
                                    key={getKey(item)}
                                >
                                    <span>
                                        {item.name} × {item.quantity || 1}
                                    </span>
                                    <span>₹{item.price * (item.quantity || 1)}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                                <span>Total</span>
                                <span className="text-success">₹{total}</span>
                            </div>
                            <button
                                className="btn btn-success w-100"
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                            >
                                {isPlacingOrder ? "Placing Order..." : "✅ Place Order"}
                            </button>
                            <button
                                className="btn btn-outline-primary w-100 mt-2"
                                onClick={() => navigate("/buyer/browse")}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;