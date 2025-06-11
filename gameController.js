document.addEventListener("DOMContentLoaded", function () {
  const gameCards = document.querySelectorAll(".game-card");
  const homeContent = document.querySelector(".home-content");
  const pongPage = document.getElementById("pong-page");
  const snakePage = document.getElementById("snake-page");
  const backButton = document.getElementById("back-button");

  let currentGame = null; // Track current active game

  gameCards.forEach((card) => {
    card.addEventListener("click", function () {
      const targetGame = card.getAttribute("data-target");
      let targetPage;

      // Cleanup previous game if any
      if (currentGame) {
        if (currentGame === "pong" && window.pongCleanup) {
          window.pongCleanup();
        } else if (currentGame === "snake" && window.snakeCleanup) {
          window.snakeCleanup();
        }
      }

      // Determine which game page to show
      switch (targetGame) {
        case "pong":
          targetPage = pongPage;
          break;
        case "snake":
          targetPage = snakePage;
          break;
        default:
          return;
      }

      currentGame = targetGame;

      // Hide home and show game
      homeContent.classList.remove("slide-up-in");
      homeContent.classList.add("slide-down");
      targetPage.classList.remove("slide-up");
      targetPage.classList.add("slide-down-in");
      targetPage.style.visibility = "visible";

      setTimeout(() => {
        homeContent.style.display = "none";
        backButton.style.visibility = "visible";

        // Initialize the selected game
        if (targetGame === "pong" && window.pongInit) {
          window.pongInit();
        } else if (targetGame === "snake" && window.snakeInit) {
          window.snakeInit();
        }
      }, 500);
    });
  });

  backButton.addEventListener("click", function () {
    // Cleanup current game
    if (currentGame) {
      if (currentGame === "pong" && window.pongCleanup) {
        window.pongCleanup();
      } else if (currentGame === "snake" && window.snakeCleanup) {
        window.snakeCleanup();
      }
    }
    currentGame = null;

    // Hide all game pages
    const gamePages = document.querySelectorAll(".game-page");
    gamePages.forEach((page) => {
      page.classList.add("slide-up");
      setTimeout(() => {
        page.style.visibility = "hidden";
      }, 500);
    });

    // Show home
    homeContent.classList.remove("slide-down");
    homeContent.classList.add("slide-up-in");
    homeContent.style.display = "block";
    backButton.style.visibility = "hidden";
  });
});
