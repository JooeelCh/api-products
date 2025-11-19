import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, default: 1 },
      _id: false,
    },
  ],
});

cartSchema.statics.getCartsById = function (id) {
  return this.findById(id);
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
