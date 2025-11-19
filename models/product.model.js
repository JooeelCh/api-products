import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true },
    description: String,
    code: { type: String, unique: true },
    price: Number,
    stock: Number,
    status: { type: Boolean, default: true },
    category: String,
    thumbnails: { type: [String], default: [] },
  },
  { timestamps: true }
);

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", productSchema);

export default Product;
