document.addEventListener("DOMContentLoaded", function () {
  const gameCards = document.querySelectorAll(".game-card");
  const homeContent = document.querySelector(".home-content");
  const pongPage = document.getElementById("pong-page");
  const backButton = document.getElementById("back-button");

  gameCards.forEach((card) => {
    card.addEventListener("click", function () {
      const targetGame = card.getAttribute("data-target");

      homeContent.classList.remove("slide-up-in");
      homeContent.classList.add("slide-down");

      setTimeout(() => {
        homeContent.style.display = "none";
        if (targetGame === "pong") {
          pongPage.style.visibility = "visible";
          pongPage.classList.remove("slide-up");
          pongPage.classList.add("slide-down-in");
        }
        backButton.style.visibility = "visible";
      }, 500);
    });
  });

  backButton.addEventListener("click", function () {
    pongPage.classList.add("slide-up");
    setTimeout(() => {
      pongPage.style.visibility = "hidden";
      homeContent.style.display = "block";
      homeContent.classList.remove("slide-up-in");
      homeContent.classList.add("slide-up-in");
      pongPage.classList.remove("slide-down-in");
      backButton.style.visibility = "hidden";
    }, 500);
  });
});
