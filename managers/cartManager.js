import fs from "fs/promises";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); //Ruta completa del archivo actual
const __dirname = path.dirname(__filename); //Ruta del directorio actual

class CartManager {
  constructor(pathFile = path.join(__dirname, "../data/carts.json")) {
    this.path = pathFile;
  }

  async readFile() {
    try {
      const content = await fs.readFile(this.path, "utf-8");
      return JSON.parse(content || "[]");
    } catch (error) {
      throw new Error(`Error al leer el archivo: ${error.message}`);
    }
  }

  async writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async createCart() {
    const carts = await this.readFile();
    const newCart = {
      id: this.generateNewId(),
      products: [],
    };
    carts.push(newCart);
    await this.writeFile(carts);
    return newCart;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.readFile();
    const index = carts.findIndex((c) => c.id === cid);
    if (index === -1) {
      throw new Error(`El carrito con id ${cid} no existe`);
    }

    const cart = carts[index];
    const pindex = cart.products.findIndex((p) => p.product === pid);
    if (pindex) {
      cart.products[pindex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    carts[index] = cart;
    await this.writeFile(carts);
    return cart;
  }

  async getCartById(cid) {
    const carts = await this.readFile();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) {
      throw new Error(`El carrito con id ${cid} no existe`);
    }
  }
}

export default CartManager;
