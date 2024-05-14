import ProductCard from "./productCard.js";

const iconCart = document.querySelector(".icon-cart");
const body = document.querySelector("body");
const closeCart = document.querySelector(".close");
const listProdutHTML = document.querySelector(".listProducts");
const listCartHTML = document.querySelector(".listCart");
const iconCartSpan = document.querySelector(".icon-cart span");
const cartTotal = document.querySelector(".cartTotal span");

let listProducts = [];
let carts = [];
iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

const addDataToHTML = () => {
  listProdutHTML.innerHTML = "";
  if (listProducts.length > 0) {
    listProducts.forEach((product) => {
      const productCard = new ProductCard(product);
      listProdutHTML.appendChild(productCard.element);
    });
  }
};

listProdutHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("addCart")) {
    let product_id = positionClick.parentElement.dataset.id;
    addToCart(product_id);
  }
});

////////
const addToCart = (product_id) => {
  let positionThisProductInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (carts.length <= 0) {
    carts = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    carts[positionThisProductInCart].quantity++;
  }
  addCartToHTML();
};

const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let total = 0;
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.dataset.id = cart.product_id;
      let positionProduct = listProducts.findIndex(
        (value) => value.id == cart.product_id
      );
      let info = listProducts[positionProduct];
      total += listProducts[positionProduct].price * cart.quantity;
      newCart.innerHTML = `
      <div class="image">
        <img src="${info.image}" alt="" />
      </div>
      <div class="name">${info.name}</div>
      <div class="totalPrice">$${info.price * cart.quantity}</div>
      <div class="quantity">
        <span class="minus"><</span>
        <span>${cart.quantity}</span>
        <span class="plus">></span>
      </div>
      `;
      listCartHTML.appendChild(newCart);
    });
  }
  cartTotal.innerText = total;
  iconCartSpan.innerText = totalQuantity;
  addCartToMemory();
};

const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    // let product_id = positionClick.parentElement.dataset.id;
    let product_id = positionClick.closest(".item").dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantity(product_id, type);
  }
});

const changeQuantity = (product_id, type) => {
  let positionItemInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionItemInCart >= 0) {
    switch (type) {
      case "plus":
        carts[positionItemInCart].quantity++;
        break;
      default:
        let valueChange = --carts[positionItemInCart].quantity;
        if (valueChange > 0) {
          carts[positionItemInCart].quantity = valueChange;
        } else {
          carts.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToMemory();
  addCartToHTML();
};

const initApp = async () => {
  const data = await fetch("products.json");
  listProducts = await data.json();
  // console.log(listProducts);
  addDataToHTML();

  if (localStorage.getItem("cart")) {
    carts = JSON.parse(localStorage.getItem("cart"));
    addCartToHTML();
  }
};
initApp();