let inventory_drop = document.querySelector(".drop_menu");
let inventory = document.querySelector(".sidebar");
let gamePanel = document.querySelector(".game-panel");
let container = document.querySelector(".container");
inventory_drop.addEventListener("click", (e) => {
	inventory.classList.toggle("show");
});
