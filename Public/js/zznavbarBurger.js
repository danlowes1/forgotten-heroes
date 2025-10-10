document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".menu-bar");
  const links = document.querySelectorAll(".menu-bar a");

  if (burger && menu) {
    // Toggle menu when clicking burger
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      menu.classList.toggle("active");
    });

    // Close menu when clicking a link
    links.forEach(link => {
      link.addEventListener("click", () => {
        burger.classList.remove("active");
        menu.classList.remove("active");
      });
    });
  }
});
