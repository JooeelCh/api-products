import express from "express";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto Nro ${PORT}`);
});
