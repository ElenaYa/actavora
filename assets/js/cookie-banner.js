document.addEventListener("DOMContentLoaded", function() {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const declineBtn = document.getElementById("cookie-decline");

  if (!localStorage.getItem("cookieConsent")) {
    banner.style.display = "block";
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted");
    banner.style.display = "none";
  });

  declineBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "declined");
    banner.style.display = "none";
  });
});
