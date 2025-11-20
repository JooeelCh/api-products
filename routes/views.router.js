import { Router } from "express";
import dotenv from "dotenv";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

dotenv.config();

const viewsRouter = Router();
const cartId = process.env.CART_ID;

viewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const { docs: products, ...pagination } = await Product.paginate(
      {},
      { page, limit, lean: true }
    );

    res.render("products", {
      products,
      pagination,
      title: "Inicio",
      cartId: cartId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.getProductsById(req.params.pid).lean();

    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.render("product", { product, title: product.title, cartId: cartId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    res.render("cart", { cart, title: "Carrito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default viewsRouter;
