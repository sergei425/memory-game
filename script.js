const body = document.body;

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
]

function getElement(tagName, className = []) {
  const element = document.createElement(tagName);
  if (className.length) {
    element.classList.add(...className);
  }
  return element;
}

const list = getElement("ul", ["card-list"]);
body.prepend(list);
body.prepend(getElement("header", ["header"]));


shuffleArray([...cards, ...cards]).forEach((card) => {
  const listItem = getElement("li", ["card-item"]);
  const divFront = getElement("div", ["card-item--front"]);
  const divBack = getElement("div", ["card-item--back"]);
  listItem.append(divFront, divBack);
  
  const img = getElement("img");
  img.src = card.src;
  img.alt = card.title;
  
  divBack.append(img)
  
  list.append(listItem);
}); 

function shuffleArray(array) {
  return array.map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
