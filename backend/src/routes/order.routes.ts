import { Router } from "express";
import {
  createOrder,
  buyNow,
  getCart,
  getMyOrders,
  getVendorOrders,
  updateCart,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller";
import { auth, isBuyer, isVendor } from "../middleware/auth.middleware";

const router = Router();

// ─── Cart (no auth — uses userId from body/params) ───────────────────────────
router.post("/addToCart", updateCart);
router.get("/cart/:userId", getCart);

// ─── Buyer ───────────────────────────────────────────────────────────────────
router.post("/buyNow", [auth, isBuyer], buyNow);          // Buy Now (skip cart)
router.post("/", [auth, isBuyer], createOrder);     // Place from cart
router.get("/myorders", [auth, isBuyer], getMyOrders);
router.patch("/:orderId/cancel", [auth, isBuyer], cancelOrder);     // Cancel pending order

// ─── Vendor ──────────────────────────────────────────────────────────────────
router.get("/", [auth, isVendor], getVendorOrders);
router.patch("/:orderId", [auth, isVendor], updateOrderStatus);

export default router;