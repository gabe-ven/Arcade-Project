// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const gameCards = document.querySelectorAll(".game-card"); // Select all game cards
  const homePage = document.getElementById("home-page"); // Home page container
  const pongPage = document.getElementById("pong-page"); // Pong game page container
  // Add additional pages for other games, like Snake and Tetris
  const snakePage = document.getElementById("snake-page");
  const tetrisPage = document.getElementById("tetris-page");

  const backButton = document.getElementById("back-button"); // Back button

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
        tetrisPage.style.visibility = "visible";
      }

      // Show the back button
      backButton.style.visibility = "visible";
    });
  });

  // Listen for clicks on the back button
  backButton.addEventListener("click", function () {
    // Hide the back button
    backButton.style.visibility = "hidden";

    // Show the home page
    homePage.style.display = "block";

    // Hide all game pages
    pongPage.style.visibility = "hidden";
    snakePage.style.visibility = "hidden";
    tetrisPage.style.visibility = "hidden";
  });
});
