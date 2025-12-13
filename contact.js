document.addEventListener("DOMContentLoaded", () => {
  const whatsappBtn = document.getElementById("whatsappBtn");
  const emailBtn = document.getElementById("emailBtn");

  function validateForm() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (message === "") {
      alert("Please type your message before sending.");
      return false;
    }

    return { name, email, message };
  }

  whatsappBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const formData = validateForm();
    if (!formData) return;

    const { name, email, message } = formData;
    const phoneNumber = "2348037202816"; // your WhatsApp number
    const text = `Hello, my name is ${name || "Anonymous"} (Email: ${
      email || "N/A"
    })%0A%0A${encodeURIComponent(message)}`;

    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
  });

  emailBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const formData = validateForm();
    if (!formData) return;

    const { name, email, message } = formData;
    const subject = `New message from ${name || "Visitor"}`;
    const body = `Name: ${name}%0AEmail: ${email}%0A%0A${encodeURIComponent(
      message
    )}`;
    window.location.href = `mailto:Samsonitemarble62@yahoo.com?subject=${subject}&body=${body}`;
  });
});
