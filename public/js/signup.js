document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", function (event) {
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
      event.preventDefault(); // stop form from submitting
      alert("Passwords do not match.");
    }
    // else: form submits normally to /users/signup
  });
});
