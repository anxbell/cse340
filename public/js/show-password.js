const passwordButton = document.getElementById("password-button");
const passwordInput = document.getElementById("account_password");

passwordButton.addEventListener("click", () => {
    passwordButton.classList.toggle("showing")

    if (passwordButton.classList.contains("showing")) {
        passwordInput.setAttribute("type", "text")
    } else {
        passwordInput.setAttribute("type", "password")
    }
})