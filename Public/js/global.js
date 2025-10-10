// Contact form handling
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("footer form");
console.log("Contact form script loaded.");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        comments: form.comments.value.trim(),
      };
      console.log("Submitting form data:", formData);
      try {
        // ✅ Always use relative URL — works in dev and production
        console.log("Sending form data to /api/contact:", formData);
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Thank you! Your message has been sent.");
          form.reset();
        } else {
          const error = await response.json();
          alert("Error: " + (error.message || "Something went wrong."));
        }
      } catch (err) {
        console.error("Form submission failed:", err);
        alert("Unable to send your message. Please try again later.");
      }
    });
  }
});

// Custom Elements for Navbar
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
