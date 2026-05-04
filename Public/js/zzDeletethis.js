// Contact form handling
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("footer form");
  
  // Create or select a container for feedback messages
  let statusMsg = document.getElementById("form-status");
  if (!statusMsg && form) {
    statusMsg = document.createElement("p");
    statusMsg.id = "form-status";
    form.appendChild(statusMsg);
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Clear previous messages and styles
      statusMsg.textContent = "Sending...";
      statusMsg.style.color = "inherit";

      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        comments: form.comments.value.trim(),
      };

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          statusMsg.textContent = "Thank you! Your message has been sent.";
          statusMsg.style.color = "#28a745"; // Success green
          form.reset();
        } else {
          const error = await response.json();
          statusMsg.textContent = "Error: " + (error.message || "Something went wrong.");
          statusMsg.style.color = "#dc3545"; // Error red
        }
      } catch (err) {
        statusMsg.textContent = "Unable to send message. Please try again later.";
        statusMsg.style.color = "#dc3545";
      }

      // Optional: Clear the message after 5 seconds
      setTimeout(() => {
        statusMsg.textContent = "";
      }, 5000);
    });
  }
});