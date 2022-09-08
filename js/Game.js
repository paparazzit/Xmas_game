function Game(opt) {
	this.hero = opt.hero;
	this.inventory = opt.inventory;
	this.activeItem = null;
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.faceImg = document.querySelector(".face img");

	this.logMessages = {
		msg0: `Hola, I'm Catalonian Christmas log...`,
		msg1: "I'm part of some unique Christmas traditions",
		msg2: "What you have there...",
		msg3: "A hat, some candy, blanket...nice!",
		stick: "Oh no... what you have there... a stick... put it back please",
	};
	this.gameStates = {
		placeHat: false,
		putBlanket: false,
		feedCandy: false,
		beatTheLog: false,
	};
	this.candyFed = 0;
	this.beatingLog = 0;
	// HTML ELEMENTS
	this.sidebar = document.querySelector(".sidebar");
	this.dropPos = document.querySelectorAll(".item-pos");
	this.container = document.querySelector(".container");
	this.cursorElement = document.querySelector(".cursor");
	this.gamePanel = document.querySelector(".game-panel");
	this.mainImage = document.querySelector(".main-img");
	this.logClicks = 0;
	// DIMENSION RESET
	this.leftReset = this.container.offsetLeft;
	this.topReset = this.container.offsetTop;

	// AUDIO SETUP
	this.generalClicks = new Audio("./assets/clickSound.wav");
	this.generalClicks.volume = 0.7;
	this.placeItem = new Audio("./assets/useItem.wav");
	this.eatCandy = new Audio("./assets/eat.wav");
	this.eatCandy.volume = 0.5;
	this.burp = new Audio("./assets/burp.wav");
	this.burp.volume = 0.2;
	this.hitting = new Audio("./assets/hitting.wav");
	this.fart = new Audio("./assets/fart_2.wav");

	this.createInventory = function () {
		let text = "";
		for (let prop in this.inventory) {
			this[prop] = this.inventory[prop];
			text += `<div class="thumb" data-destination="${this[prop].destination}" data-item="${prop}"><img src="./${this[prop].img}" alt=""></div>`;
			console.log(this[prop].img);
		}
		text += '<div class="thumb" data-item="drop" ><p>DROP</p></div>';
		this.sidebar.innerHTML = text;
		this.items = document.querySelectorAll(".thumb");
	};

	this.itemsClicked = function (ev) {
		console.log(ev.target);
		if (ev.target.className !== "thumb") {
			return;
		}
		if (ev.target.getAttribute("data-item") === "drop" && this.activeItem) {
			this.dropItem();
			return;
		}
		if (ev.target.getAttribute("data-item") !== "drop") {
			this.activeItem = {
				name: ev.target.getAttribute("data-item"),
				destination: ev.target.getAttribute("data-destination"),
				img: ev.target.children[0].getAttribute("src"),
			};

			this.createCursorElement(ev);
			return;
		}
	};

	this.createCursorElement = function (ev) {
		this.cursorElement.innerHTML = `<img src="${this.activeItem.img}">`;

		this.cursorElement.classList.add("active");
		// position element on click
		if (this.width > 521) {
			if (this.activeItem.name === "stick") {
				this.cursorElement.classList.add("stick");
			} else {
				this.cursorElement.classList.remove("stick");
			}
			this.cursorElement.style.left = ev.clientX - this.leftReset + "px";
			this.cursorElement.style.top = ev.clientY - this.topReset + "px";
			this.trackItem();
		}
	};
	// TRACK ITEM
	this.trackItem = function () {
		window.addEventListener("mousemove", (ev) => {
			this.cursorElement.style.left = ev.clientX - this.leftReset + "px";
			this.cursorElement.style.top = ev.clientY - this.topReset + "px";
		});
	};

	// DROPING ITEM
	this.dropItem = function () {
		if (this.gameStates.putBlanket) {
			console.log("BACI ITEM");
			window.removeEventListener("dblclick", this.dropItem, true);
		}
		this.activeItem = null;
		this.cursorElement.innerHTML = "";
	};

	// MAIN IMAGE CLICKS
	this.mainImageClicks = function (ev) {
		if (
			!this.activeItem &&
			this.logMessages[`msg${this.logClicks}`] &&
			!this.gameStates.placeHat
		) {
			console.log(this.logMessages[`msg${this.logClicks}`]);
			this.logClicks++;
			return;
		}
		if (
			this.activeItem &&
			this.activeItem.name === "stick" &&
			this.logMessages.stick &&
			!this.gameStates.putBlanket
		) {
			console.log(this.logMessages.stick);
			delete this.logMessages.stick;
			return;
		}
		if (this.activeItem && ev.target.getAttribute("data-item")) {
			this.checkItem(ev);
			return;
		}

		if (
			this.gameStates.putBlanket &&
			this.activeItem &&
			this.activeItem.name === "stick" &&
			!this.gameStates.beatTheLog
		) {
			console.log(ev.target);
			this.beatingLog++;
			if (this.beatingLog > 0) {
				this.faceImg.src = "./assets/angry face.png";
			}
			if (this.beatingLog > 6) {
				console.log("FINISH");

				this.fart.volume = 0.6;
				this.hitting.play();
				setTimeout(() => {
					this.fart.play();
					this.faceImg.src = "./assets/face.png";
				}, 600);
				this.gameStates.beatTheLog = true;
				this.removeItem();
				this.dropItem();
				return;
			}
			this.faceImg.parentElement.classList.add("beating");

			this.hitting.play();
			console.log("LUPAJ BRATE ", this.beatingLog);

			return;
		}
	};

	// CHEKING ITEMS
	this.checkItem = function (ev) {
		if (
			!this.gameStates.placeHat &&
			this.activeItem.name === "hat" &&
			ev.target.getAttribute("data-item") === "hat"
		) {
			console.log("spustam kapicu");
			console.log(this.activeItem);
			this.gameStates.placeHat = true;
			this.removeItem();
			this.useItem(ev.target);

			this.placeItem.play();
			return;
		}
		if (
			this.gameStates.placeHat &&
			!this.gameStates.feedCandy &&
			this.activeItem.destination === "mouth" &&
			ev.target.getAttribute("data-item") === "mouth" &&
			this.candyFed !== 3
		) {
			this.candyFed++;
			console.log("DAJEM CANDY", this.activeItem, " fedd: ", this.candyFed);
			this.checkCandy(ev.target);

			this.dropItem();
			this.placeItem.play();
			return;
		}
		if (
			this.gameStates.feedCandy &&
			this.activeItem.name === "blanket" &&
			ev.target.getAttribute("data-item") === "blanket" &&
			!this.gameStates.putBlanket
		) {
			console.log("OBUCI CEBE");
			this.removeItem();
			this.useItem(ev.target, "./assets/blanket2.png");
			this.gameStates.putBlanket = true;
			this.dropItem();
			this.placeItem.play();

			setTimeout(() => {
				this.faceImg.src = "./assets/sleepyFace.png";
			}, 400);
			return;
		}
	};
	this.checkCandy = function (target) {
		if (this.candyFed === 3) {
			console.log("NAHRANIO SAM DRVO");
			this.gameStates.feedCandy = true;
			target.style.pointerEvents = "none";
			this.eatCandy.play();
			setTimeout(() => {
				this.burp.play();
			}, 900);
			this.removeItem();
			return;
		}
		this.removeItem();
		this.eatCandy.play();
	};

	this.useItem = function (target, img) {
		console.log(this.activeItem.img);
		let imgSrc = img;
		if (!img) {
			imgSrc = this.activeItem.img;
		}
		target.innerHTML = `<img src="${imgSrc}" alt=""/>`;
		target.style.pointerEvents = "none";

		this.dropItem();
	};
	this.removeItem = function () {
		this.items.forEach((item) => {
			if (item.getAttribute("data-item") === this.activeItem.name) {
				item.classList.add("deactivate");
			}
		});
	};

	// #REGION EVENT
	this.events = function () {
		this.sidebar.addEventListener("click", this.itemsClicked.bind(this));
		window.addEventListener("resize", () => {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
		});
		this.container.addEventListener("mousedown", (e) => {
			if (!this.activeItem) this.generalClicks.play();
		});

		this.mainImage.addEventListener("click", this.mainImageClicks.bind(this));
	};
	// #END REGION
}

let opt = {
	hero: "/assets/log.png",
	inventory: {
		hat: {
			img: "/assets/hat.png",
			destination: "hat",
		},
		stick: {
			img: "/assets/stick.png",
			destination: "log",
		},
		blanket: {
			img: "/assets/blanket_thumb.png",
			destination: "blanket",
		},
		lolly: {
			img: "/assets/lolly.png",
			destination: "mouth",
		},

		bonBon: {
			img: "/assets/bonbon.png",
			destination: "mouth",
		},
		cane: {
			img: "/assets/cane.png",
			destination: "mouth",
		},
	},
};

let game = new Game(opt);
game.createInventory();
game.events();
