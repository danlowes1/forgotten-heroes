// public/contact.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("footer form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        comments: form.comments.value.trim(),
      };

      try {
        // /api/contact
        // http://localhost:3001/api/contact
        // const response = await fetch("http://localhost:3001/api/contact", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(formData),
        // });

          const response = await fetch("http://localhost:3001/api/contact", {
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
