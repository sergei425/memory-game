const body = document.body;
let counter = 0;
let counterSteps = 0;
let counterOpenedCards = 0;
let oneOpenedCard = null;
let twoOpenedCard = null;
let leaders = JSON.parse(localStorage.getItem("leaders")) ?? [];

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
const modal = getElement("div", ["modal"]);
const main = getElement("main", ["main"]);

body.prepend(header, main, modal);

const scorer = getElement("p", ["main__counter"]);
const scorerPair = getElement("p", ["main__counter-pair"]);

main.append(scorer, scorerPair, list);

const closeBtn = getElement("button", ["btn", "header__close-btn"]);
closeBtn.textContent = "new game";
const leaderBtn = getElement("button", ["btn", "header__leader-btn"]);
leaderBtn.textContent = "leader table";
header.append(closeBtn, leaderBtn);

function startNewGame() {
  [...list.children].forEach((item) => item.remove());
  counter = 0;
  counterSteps = 0;
  counterOpenedCards = 0;
  modal.classList.remove("modal--opened");
  scorer.textContent = `Scorer: ${counterSteps}`;
  scorerPair.textContent = `Number of pairs: ${counterOpenedCards}`;
  

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

startNewGame();

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
    counterSteps++;
    scorer.textContent = `Scorer: ${Math.floor(counterSteps / 2)}`;
    if (counter === 1) {
      oneOpenedCard = target.parentElement.dataset.title;
    }
    if (counter === 2) {
      list.disabled = true;
      twoOpenedCard = target.parentElement.dataset.title;
      equalCards();
      timer();
      if (
        [...list.children].every((item) =>
          item.classList.contains("card-item--opened"),
        )
      ) {
        let winTimeout = setTimeout(() => {
          yourWin();
          clearTimeout(winTimeout);
        }, 1000);
      }
    }
  }
}

function equalCards() {
  if (oneOpenedCard === twoOpenedCard) {
    [...list.children].forEach((item) => {
      if (item.dataset.title === oneOpenedCard) {
        item.classList.add("card-item--opened");
      }
    });
    oneOpenedCard = null;
    twoOpenedCard = null;
    counterOpenedCards++;
    scorerPair.textContent = `Number of pairs: ${counterOpenedCards}`;
  }
}

function timer() {
  const timerId = setTimeout(() => {
    [...list.children].forEach((item) =>
      item.classList.remove("card-item--flipped"),
    );
    counter = 0;
    list.disabled = false;
  }, 2000);
  if (oneOpenedCard === twoOpenedCard) {
    clearTimeout(timerId);
    counter = 0;
    list.disabled = false;
  }
}

closeBtn.addEventListener("click", startNewGame);

function yourWin() {
  list.disabled = true;
  modal.classList.add("modal--opened");
  const modalContent = getElement("div", ["modal__content"]);
  const message = getElement("p", ["modal__message"]);
  message.textContent = `You won, number of moves ${counterSteps}`;
  const closeModalBtn = getElement("button", ["btn", "modal__close-btn"]);
  closeModalBtn.textContent = "close";
  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("modal--opened");
    modalContent.remove();
  });
  const newGameBtn = getElement("button", ["btn", "modal__new-game-btn"]);
  newGameBtn.textContent = "new game";
  modalContent.append(message, closeModalBtn, newGameBtn);
  modal.append(modalContent);
  saveStorage();
  newGameBtn.addEventListener("click", () => {
    modal.classList.remove("modal--opened");
    modalContent.remove();
    startNewGame();
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("modal--opened")) {
    modal.classList.remove("modal--opened");
    [...modal.children].forEach((item) => item.remove());
  }
});

modal.addEventListener("click", (evt) => {
  if (modal.classList.contains("modal--opened") && evt.target === modal) {
    modal.classList.remove("modal--opened");
    [...modal.children].forEach((item) => item.remove());
  }
});

leaderBtn.addEventListener("click", showLeaderTable);

function showLeaderTable() {
  modal.classList.add("modal--opened");
  const modalContent = getElement("div", ["modal__content-leader"]);
  const closeBtn = getElement("button", ["btn", "modal__leader-btn"]);
  closeBtn.textContent = "close";
  modalContent.append(closeBtn);
  leaders = JSON.parse(localStorage.getItem("leaders")) ?? []
  
  
  
  if (leaders.length) {
    const leaderList = getElement("ul", ["modal__leader-list"]);
    
    leaders
      .toSorted((prev, next) => prev.counterSteps - next.counterSteps)
      .slice(0, 10)
      .forEach((leader, index) => {
        const leaderItem = getElement("li", ["modal__leader-item"]);
        leaderItem.textContent = `${index + 1}. Moves: ${leader.counterSteps / 2}, Date: ${leader.date}`;
        leaderList.append(leaderItem);
      });

    modalContent.prepend(leaderList);
  } else {
    const message = getElement("p", ["leader-text"]);
    message.textContent = "No results yet.";
    modalContent.prepend(message);
  }

  modal.append(modalContent);
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("modal--opened");
    modalContent.remove();
  });
}

function saveStorage() {
  leaders.push({
    counterSteps,
    date: new Date().toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  });
  localStorage.setItem("leaders", JSON.stringify(leaders));
}
