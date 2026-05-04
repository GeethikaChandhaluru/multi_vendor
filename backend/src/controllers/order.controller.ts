import { Request, Response } from "express";
import Order from "../models/order.model";
import Product from "../models/product.model";
import User from "../models/user.model";

interface AuthRequest extends Request {
  user?: any;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export const getCart = async (req: any, res: Response) => {
  const { userId } = req.params;
  const user = await User.findById(userId, { cart: 1 });
  res.send({ cart: user?.cart || [] });
};

export const updateCart = async (req: any, res: Response) => {
  const { userId, cartItems } = req.body;
  await User.findByIdAndUpdate(userId, { $set: { cart: [...cartItems] } });
  res.send({ msg: "Cart updated" });
};

// ─── Orders ──────────────────────────────────────────────────────────────────

// POST /api/orders — place order from cart (decrements stock immediately)
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id, { cart: 1 });

    if (!user?.cart || user.cart.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    for (const item of user.cart as any[]) {
      // Verify stock before creating each order
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const qty = item.quantity || 1;
      // ✅ CHECK STOCK
      if (product.stock < qty) {
        return res.status(400).json({
          msg: `${product.name} is out of stock`,
        });
      }

      // Create the order document
      await new Order({
        buyer: req.user.id,
        status: "pending",
        productId: item.productId,   // ← correct field, NOT item._id
        quantity: qty,
        vendorId: item.vendor,
        price: item.price,
        name: item.name,
        description: item.description,
        image: item.image,
      }).save();

      // Decrement stock immediately on purchase
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -qty },
      });
    }

    // Clear the cart
    await User.findByIdAndUpdate(req.user.id, { $set: { cart: [] } });

    res.json({ msg: "Order placed successfully" });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};

// POST /api/orders/buyNow — place a single product order instantly (no cart)
export const buyNow = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    if (product.stock < quantity)
      return res.status(400).json({ msg: "Insufficient stock" });

    await new Order({
      buyer: req.user.id,
      status: "pending",
      productId: product._id,
      quantity,
      vendorId: product.vendor,
      price: product.price,
      name: product.name,
      description: product.description,
      image: product.image,
    }).save();

    // Decrement stock
    await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });

    res.json({ msg: "Order placed successfully" });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};

// GET /api/orders/myorders — buyer's own orders
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    // Simple find — no broken populate on non-existent "products.product" path
    const orders = await Order.find({ buyer: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};

// GET /api/orders — vendor's orders
export const getVendorOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ vendorId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};

// PATCH /api/orders/:orderId — vendor updates status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    await Order.findByIdAndUpdate(orderId, { $set: { status } }, { new: true });
    res.json({ msg: "Order status updated" });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};

// PATCH /api/orders/:orderId/cancel — buyer cancels (pending only, restores stock)
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    // Only pending orders can be cancelled
    if (order.status !== "pending") {
      return res.status(400).json({ msg: "Only pending orders can be cancelled" });
    }

    // Make sure the buyer owns this order
    if (order.buyer.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorised" });
    }

    await Order.findByIdAndUpdate(orderId, { $set: { status: "cancelled" } });

    // Restore stock
    await Product.findByIdAndUpdate(order.productId, {
      $inc: { stock: order.quantity },
    });

    res.json({ msg: "Order cancelled and stock restored" });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};