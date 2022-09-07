function Game(opt) {
	this.inventory = opt.inventory;
	this.inventoryCont = document.querySelector(".sidebar");

	this.cursorElement = document.querySelector(".cursor");
	this.gamePanel = document.querySelector(".game-panel");
	this.container = document.querySelector(".container");
	this.dropPos = document.querySelectorAll(".item_pos");
	this.leftReset = this.container.offsetLeft;
	this.topReset = this.container.offsetTop;
	this.width = window.innerWidth;
	this.activeItem;

	this.gameState = 0;
	// KREIRAJ INVENTAR
	this.createInventory = function () {
		let text = "";
		let i = 0;

		for (prop in this.inventory) {
			this[prop] = this.inventory[prop];
			text += `<div class="thumb" data-index="${i}" data-item="${prop}">
            <img src="${this.inventory[prop]}" alt=""/>
            </div>`;
			i++;
		}
		this.inventoryCont.innerHTML = text;
		this.items = document.querySelectorAll(".thumb");
	};

	// DATEKTUJ KLIKTANJE NA INVETAR
	this.itemsClicked = function (ev) {
		let clicked = ev.target.getAttribute("data-item");
		let index = ev.target.getAttribute("data-index");

		this.items.forEach((item) => {
			item.classList.remove("activated");
		});
		if (clicked === this.activeItem) {
			this.dropItem();
			return;
		} else {
			this.activeItem = clicked;
			this.items[index].classList.add("activated");
			this.cursorElement.innerHTML = `<img src ="${
				this[this.activeItem]
			}" alt=""/>`;
			if (this.width > 521) {
				this.cursorElement.classList.add("active");
				this.cursorElement.style.left = ev.clientX - this.leftReset + "px";
				this.cursorElement.style.top = ev.clientY - this.topReset + "px";
				this.trackItem();
			}
			this.checkGameState();
		}
	};

	this.trackItem = function () {
		window.addEventListener("mousemove", (ev) => {
			this.cursorElement.style.left = ev.clientX - this.leftReset + "px";
			this.cursorElement.style.top = ev.clientY - this.topReset + "px";
		});
	};

	// UPOTREBI ITEM
	this.checkItem = function (posName) {
		if (!this.activeItem) {
			console.log("nemam nista");
			return;
		}
		if (posName === this.activeItem) {
			console.log(this.checkGameState());
		} else if (
			posName === "mouth" &&
			(this.activeItem === "bonBon" ||
				this.activeItem === "cane" ||
				this.activeItem === "lolly")
		) {
			console.log(this.checkGameState());
		} else {
			console.log("wrong Item");
		}
	};
	// IZBACUEM ITEM
	this.dropItem = function () {
		this.activeItem = null;
		this.cursorElement.innerHTML = "";
		this.cursorElement.classList.remove("active");
		this.items.forEach((item) => {
			item.classList.remove("activated");
		});
	};
	this.fed = 0;
	this.useItem = function (ev) {
		// console.log(this);

		if (
			ev.target.getAttribute("data-item") === "mouth" &&
			(this.activeItem === "lolly" ||
				this.activeItem === "cane" ||
				this.activeItem === "bonBon")
		) {
			if (
				this.fed <= 2 &&
				this.dropPos[this.gameState].getAttribute("data-listen") === "true"
			) {
				console.log("game state", this.gameState);
				this.dropItem();
				this.fed++;
				if (this.fed === 3) {
					this.gameState++;
					console.log("DOSTA", this.gameState);
					this.checkGameState();
					return;
				}
			}
		}
		if (ev.target.getAttribute("data-item") === this.activeItem) {
			console.log(this.dropPos[this.gameState]);

			this.dropItem();
			this.gameState++;

			return;
		}
	};

	this.init = function () {
		console.log(this.stick);
	};
	this.checkGameState = function () {
		console.log(this.gameState);
		let posName;
		switch (this.gameState) {
			case 0:
				console.log("stavljam kapu");
				this.dropPos[this.gameState].classList.add("activated");
				posName = this.dropPos[this.gameState].getAttribute("data-item");
				this.dropPos[this.gameState].addEventListener(
					"click",
					this.useItem.bind(this)
				);
				break;
			case 1:
				console.log("stavljam krpu");

				this.dropPos[this.gameState - 1].removeEventListener(
					"click",
					this.useItem.bind(this)
				);
				this.dropPos[this.gameState].classList.add("activated");
				posName = this.dropPos[this.gameState].getAttribute("data-item");
				this.dropPos[this.gameState].addEventListener(
					"click",
					this.useItem.bind(this)
				);

				break;
			case 2:
				console.log("stavljam hranim");
				this.dropPos[this.gameState - 1].removeEventListener(
					"click",
					this.useItem.bind(this)
				);
				this.dropPos[this.gameState].classList.add("activated");
				posName = this.dropPos[this.gameState].getAttribute("data-item");
				this.dropPos[this.gameState].addEventListener(
					"click",
					this.useItem.bind(this)
				);
				this.dropPos[this.gameState].setAttribute("data-listen", true);
				break;
			case 3:
				this.dropPos[this.gameState - 1].removeEventListener(
					"click",
					this.useItem.bind(this)
				);
				console.log("TUCI");
				break;
			default:
			// code block
		}
	};

	// EVENTS

	this.events = function () {
		this.items.forEach((item) => {
			item.addEventListener("click", this.itemsClicked.bind(this));
		});
		window.addEventListener("resize", (e) => {
			this.width = window.innerWidth;
			this.leftReset = this.container.offsetLeft;
			this.topReset = this.container.offsetTop;
		});
		// this.dropPos.forEach((pos) => {
		// 	let posName = pos.getAttribute("data-item");
		// 	pos.addEventListener("click", this.checkItem.bind(this, posName));
		// });
	};
}

let options = {
	hero: "/assets/log.png",
	inventory: {
		hat: "/assets/hat.png",
		blanket: "/assets/blanket_thumb.png",
		stick: "/assets/stick.png",
		lolly: "/assets/lolly.png",
		bonBon: "/assets/bonbon.png",
		cane: "/assets/cane.png",
	},
};

let game = new Game(options);
game.createInventory();

game.events();
