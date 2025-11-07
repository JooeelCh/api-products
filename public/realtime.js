const socket = io();

socket.on("updateProducts", (products) => {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.tittle} - $${p.price}`;
    productList.appendChild(li);
  });
});

const form = document.getElementById("productForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.price = parseFloat(data.price);
  data.stock = parseInt(data.stock);
  socket.emit("newProduct", data);
  form.reset();
});

const deleteForm = document.getElementById("deleteForm");
deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = new FormData(deleteForm).get("id");
  socket.emit("deleteProduct", id);
  deleteForm.reset();
});
