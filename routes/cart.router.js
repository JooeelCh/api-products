import { Router } from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

cartRouter.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().populate("products.product").lean();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

cartRouter.put("/:cid", async (req, res) => {
  try {
    if (!Array.isArray(req.body.products)) {
      return res.status(400).json({ error: "Formato invalido" });
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products: req.body.products },
      { new: true }
    );

    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.cid);
    if (deletedCart) {
      res.json({ message: "Carrito eliminado" });
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (cart) {
      const productExists = await Product.findById(req.params.pid);
      if (!productExists) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === req.params.pid
      );
      if (productIndex > -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
      }
      const updatedCart = await cart.save();
      const puppulatedCart = await updatedCart.populate("products.product");
      res.json(puppulatedCart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

cartRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ error: "Cantidad invalida" });
    }

    if (cart) {
      const productExists = await Product.findById(req.params.pid);
      if (!productExists) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === req.params.pid
      );
      if (productIndex > -1) {
        cart.products[productIndex].quantity = req.body.quantity;
        const updatedCart = await cart.save();
        res.json(updatedCart);
      } else {
        res.status(404).json({ error: "Producto no encontrado en el carrito" });
      }
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (cart) {
      cart.products = cart.products.filter(
        (p) => p.product.toString() !== req.params.pid
      );
      const updatedCart = await cart.save();
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

export default cartRouter;
