import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import productsRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import ProductManager from "./managers/productManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

const realTimeServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto Nro ${PORT}`);
});

const io = new Server(realTimeServer);
const productManager = new ProductManager();

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  socket.emit("updateProducts", await productManager.getProducts());

  socket.on("newProduct", async (data) => {
    await productManager.addProduct(data);
    io.emit("updateProducts", await productManager.getProducts());
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    io.emit("updateProducts", await productManager.getProducts());
  });
});
