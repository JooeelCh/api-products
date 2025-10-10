import express from "express";
import productsRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use("api/products", productsRouter);
app.use("api/carts", cartRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto Nro ${PORT}`);
});
