document.addEventListener("DOMContentLoaded", function () {
  const gameCards = document.querySelectorAll(".game-card");
  const homeContent = document.querySelector(".home-content");
  const pongPage = document.getElementById("pong-page");
  const backButton = document.getElementById("back-button");

  gameCards.forEach((card) => {
    card.addEventListener("click", function () {
      const targetGame = card.getAttribute("data-target");

      homeContent.style.display = "none";

      if (targetGame === "pong") {
        pongPage.style.visibility = "visible";
      }

      backButton.style.visibility = "visible";
    });
  });

  backButton.addEventListener("click", function () {
    backButton.style.visibility = "hidden";

    pongPage.style.visibility = "hidden";
    homeContent.style.display = "block";
  });
});
