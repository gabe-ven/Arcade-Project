// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const gameCards = document.querySelectorAll(".game-card"); // Select all game cards
  const homePage = document.getElementById("home-page"); // Home page container
  const pongPage = document.getElementById("pong-page"); // Pong game page container
  // Add additional pages for other games, like Snake and Tetris
  const snakePage = document.getElementById("snake-page");
  const tetrisPage = document.getElementById("tetris-page");

  // Listen for clicks on game cards
  gameCards.forEach((card) => {
    card.addEventListener("click", function () {
      const targetGame = card.getAttribute("data-target"); // Get the target game from data attribute

      // Hide the home page
      homePage.style.display = "none";

      // Show the selected game page based on the target game
      if (targetGame === "pong") {
        pongPage.style.visibility = "visible";
      } else if (targetGame === "snake") {
        snakePage.style.visibility = "visible";
      } else if (targetGame === "tetris") {
        snakePage.style.visibility = "visible";
      }
    });
  });
});
