import express from "express";
import productsRouter from "./routes/products.router.js";
import connectDB from "./config/db";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

connectDB();

export default app;
