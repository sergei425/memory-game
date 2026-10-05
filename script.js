const body = document.body;
let counter = 0;
let oneOpenedCard = null;
let twoOpenedCard = null;

const cards = [
  {
    src: "./images/fallout-artwork.jpg",
    title: "Fallout Artwork",
  },
  {
    src: "./images/nuka-cola.jpg",
    title: "Nuka Cola",
  },
  {
    src: "./images/ranger.jpg",
    title: "Ranger",
  },
  {
    src: "./images/recipe.jpg",
    title: "Recipe",
  },
  {
    src: "./images/safety.jpg",
    title: "Safety",
  },
  {
    src: "./images/sunset-sarsaparilla.jpg",
    title: "Sunset Sarsaparilla",
  },
  {
    src: "./images/tommy-gun.jpg",
    title: "Tommy Gun",
  },
  {
    src: "./images/yes-man-fallout.jpg",
    title: "Yes Man",
  },
];

function getElement(tagName, className = []) {
  const element = document.createElement(tagName);
  if (className.length) {
    element.classList.add(...className);
  }
  return element;
}

const header = getElement("header", ["header"]);
const list = getElement("ul", ["card-list"]);

body.prepend(header, list);

const closeBtn = getElement("button", ["header__close-btn"]);
closeBtn.textContent = "new game";
const leaderBtn = getElement("button", ["header__leader-btn"]);
leaderBtn.textContent = "leader table";
header.append(closeBtn, leaderBtn);

function startNewGame() {
  [...list.children].forEach((item) => item.remove());
  counter = 0;

  shuffleArray([...cards, ...cards]).forEach((card) => {
    const listItem = getElement("li", ["card-item"]);
    listItem.setAttribute("data-title", card.title);
    const divFront = getElement("div", ["card-item--front"]);
    const divBack = getElement("div", ["card-item--back"]);
    listItem.append(divFront, divBack);

    divBack.style.backgroundImage = `url(${card.src})`;

    list.append(listItem);
  });
}
startNewGame()
function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

list.addEventListener("click", openCard);

function openCard(event) {
  const target = event.target;
  if (target.classList.contains("card-item--front") && counter < 2) {
    target.parentElement.classList.add("card-item--flipped");
    counter++;
    if (counter === 1) {
      oneOpenedCard = target.parentElement.dataset.title;
    }
    if (counter === 2) {
      list.disabled = true;
      twoOpenedCard = target.parentElement.dataset.title;
      if (oneOpenedCard === twoOpenedCard) {
        [...list.children].forEach((item) => {
          if (item.dataset.title === oneOpenedCard) {
            item.classList.add("card-item--opened");
          }
        });
        oneOpenedCard = null;
        twoOpenedCard = null;
      }
      timer();
    }
  }
}

function timer() {
  const timerId = setTimeout(() => {
    [...list.children].forEach((item) =>
      item.classList.remove("card-item--flipped"),
    );
    counter = 0;
    list.disabled = false;
  }, 2500);
  if (oneOpenedCard === twoOpenedCard) {
    clearTimeout(timerId);
    counter = 0;
    list.disabled = false;
  }
}

closeBtn.addEventListener("click", startNewGame);