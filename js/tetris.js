import BLOCKS from "./blocks.js";

const playground = document.querySelector(".playground > ul");

// Settubg
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables

let score = 0;
let duration = 0;
let downInterval;
let tempMovingItem;

const movingItem = {
  type: "tree",
  direction: 0,
  top: 0,
  left: 0,
};

// functions

// 게임 시작
const init = () => {
  tempMovingItem = { ...movingItem };
  for (let i = 0; i < GAME_ROWS; i++) {
    perpendNewLine();
  }
  renderBlocks();
};

// 격자 생성
const perpendNewLine = () => {
  const li = document.createElement("li");
  const ul = document.createElement("ul");
  for (let j = 0; j < GAME_COLS; j++) {
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }
  li.prepend(ul);
  playground.prepend(li);
};

// 블록 생성

const renderBlocks = (moveType = "") => {
  const { type, direction, top, left } = tempMovingItem;
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove(type, "moving");
  });
  BLOCKS[type][direction].some((block) => {
    const x = block[0] + left;
    const y = block[1] + top;
    const target = playground.childNodes[y]
      ? playground.childNodes[y].childNodes[0].childNodes[x]
      : null;
    const isAvailable = checkEmpty(target);
    if (isAvailable) {
      target.classList.add(type, "moving");
    } else {
      tempMovingItem = { ...movingItem };
      setTimeout(() => {
        renderBlocks();
        if (moveType === "top") {
          seizeBlock();
        }
      }, 0);
      return true;
    }
  });
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
};

const seizeBlock = () => {
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });
  generateNewBlock();
};

const generateNewBlock = () => {
  const blockArray = Object.entries(BLOCKS);
  const randomIndex = Math.floor(Math.random() * blockArray.length);
  movingItem.type = blockArray[randomIndex][0];
  movingItem.top = 0;
  movingItem.left = 3;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
  renderBlocks();
};

const checkEmpty = (target) => {
  if (!target || target.classList.contains("seized")) {
    return false;
  }
  return true;
};

const moveBlock = (moveType, amount) => {
  tempMovingItem[moveType] += amount;
  renderBlocks(moveType);
};

const changeDirection = () => {
  const direction = tempMovingItem.direction;
  direction === 3 ? (tempMovingItem.direction = 0) : tempMovingItem.direction++;
  renderBlocks();
};

// event.handling
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowRight":
      moveBlock("left", 1);
      break;
    case "ArrowLeft":
      moveBlock("left", -1);
      break;
    case "ArrowDown":
      moveBlock("top", 1);
      break;
    case "ArrowUp":
      changeDirection();
    default:
      break;
  }
});

init();
