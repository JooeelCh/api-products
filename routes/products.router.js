import { Router } from "express";
import Product from "../models/product.model.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query === "available") {
      filter.status = true;
    } else if (query === "unavailable") {
      filter.status = false;
    } else if (query) {
      filter.category = query;
    }

    const options = {
      limit: Number(limit),
      page: Number(page),
      lean: true,
    };

    if (sort) {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const products = await Product.paginate(filter, options);

    res.json({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/products?limit=${limit}&page=${products.prevPage}`
        : null,
      nextLink: products.hasNextPage
        ? `/products?limit=${limit}&page=${products.nextPage}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    );
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (deletedProduct) {
      res.json({ message: "Producto eliminado" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

export default productsRouter;
