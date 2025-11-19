import { Router } from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const { docs: products, ...pagination } = await Product.paginate(
      {},
      { page, limit, lean: true }
    );
    res.render("products", { products, pagination, title: "Inicio" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const products = await Product.getProductsById(req.params.pid);

    if (!products)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.render("product", { products, title: "Productos" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.getCartsById(req.params.cid);

    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const populatedCart = await cart.populate("products.product");

    res.render("cart", { cart: populatedCart, title: "Carrito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default viewsRouter;
