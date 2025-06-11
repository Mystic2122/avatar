document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("submitBtn");

  button.addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
      alert("Passwords do not match.");
    } else {
      alert(`Welcome, ${username}!`);
    }
  });
});
