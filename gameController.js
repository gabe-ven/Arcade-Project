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
      pongPage.classList.remove("slide-up");
      pongPage.classList.add("slide-down-in");
      pongPage.style.visibility = "visible";

      setTimeout(() => {
        homeContent.style.display = "none";
        backButton.style.visibility = "visible";
      }, 500);
    });
  });

  backButton.addEventListener("click", function () {
    pongPage.classList.add("slide-up");
    homeContent.classList.remove("slide-down");
    homeContent.classList.add("slide-up-in");
    homeContent.style.display = "block";
    backButton.style.visibility = "hidden";

    setTimeout(() => {
      pongPage.style.visibility = "hidden";
    }, 500);
  });
});
