import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  buyer: mongoose.Types.ObjectId;

  productId: mongoose.Types.ObjectId;   // ✅ FIX ADDED

  name: string;
  description: string;
  price: number;

  vendorId: mongoose.Types.ObjectId;

  image: string;
  quantity: number;

  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema = new Schema(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },

    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    image: { type: String, required: true },

    quantity: { type: Number, default: 1 },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);