// FILTER PRODUK

const filterButtons = document.querySelectorAll(".filter button");
const products = document.querySelectorAll(".product-card");

filterButtons.forEach(button => {

button.addEventListener("click", () => {

document.querySelector(".active").classList.remove("active");
button.classList.add("active");

let category = button.getAttribute("data-filter");

products.forEach(product => {

if(category === "all"){
product.style.display = "block";
}
else if(product.classList.contains(category)){
product.style.display = "block";
}
else{
product.style.display = "none";
}

});

});

});


// TOMBOL TAMBAH

const buttons = document.querySelectorAll(".btn");

buttons.forEach(btn => {

btn.addEventListener("click", () => {

btn.innerText = "Ditambahkan ✓";
btn.style.background = "#4CAF50";

setTimeout(()=>{
btn.innerText = "Tambah";
btn.style.background = "#c48a5a";
},2000);

});

});