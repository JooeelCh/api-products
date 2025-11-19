import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/cart.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

export default app;
