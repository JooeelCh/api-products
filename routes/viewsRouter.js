import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products, title: "Home" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/realTimeProducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products, title: "Productos" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
