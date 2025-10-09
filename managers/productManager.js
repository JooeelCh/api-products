import fs from "fs/promises";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); //Ruta completa del archivo actual
const __dirname = path.dirname(__filename); //Ruta del directorio actual

class ProductManager {
  constructor(pathFile = path.join(__dirname, "../data/products.json")) {
    this.path = pathFile;
  }

  //Funcion reutilizable
  async readFile() {
    try {
      const content = await fs.readFile(this.path, "utf-8");
      return JSON.parse(content || "[]");
    } catch (error) {
      throw new Error(`Error al leer el archivo: ${error.message}`);
    }
  }
  //Funcion reutilizable
  async writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async getProducts() {
    return await this.readFile();
  }

  async addProduct({
    tittle,
    description,
    code,
    price,
    status = true,
    stock = 0,
    category = "",
    thumbnails = [],
  }) {
    const products = await this.readFile();

    if (products.some((p) => p.code === code)) {
      throw new Error(`El codigo ${code} ya existe`);
    }

    const newProduct = {
      id: this.generateNewId(),
      tittle,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    products.push(newProduct);
    await this.writeFile(products);
    return newProduct;
  }

  async updateProduct(pid, updates) {
    const products = await this.readFile();
    const index = products.findIndex((p) => p.id === pid);
    if (index === -1) {
      throw new Error(`Producto con id ${pid} no encontrado`);
    }
    const updatedProduct = { ...products[index], ...updates, id: pid };
    products[index] = updatedProduct;
    await this.writeFile(products);
    return updatedProduct;
  }

  async getProductById(pid) {
    const products = await this.readFile();
    const product = products.find((p) => p.id === pid);
  }

  async deleteProduct(pid) {
    const products = await this.readFile();
    const index = products.findIndex((p) => p.id === pid);
    if (index === -1) {
      throw new Error(`Producto con id ${pid} no encontrado`);
    }
    products.splice(index, 1);
    await this.writeFile(products);
    return { message: `Producto con id ${pid} eliminado` };
  }
}

export default ProductManager;
