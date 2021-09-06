//Theme initialize
if (!localStorage.getItem("theme")) {
  localStorage.setItem("theme", "light");
}

// Theme toggle
const toggle = () => {
  if (localStorage.getItem("theme") === "light")
    localStorage.setItem("theme", "dark");
  else if (localStorage.getItem("theme") === "dark") {
    localStorage.setItem("theme", "light");
  }
  themer();
};

// Theme set
const themer = () => {
  const theme = localStorage.getItem("theme");
  const dark = document.getElementById("dark");
  const light = document.getElementById("light");

  if (theme === "dark") {
    light.setAttribute("disabled", "true");
    dark.removeAttribute("disabled");
    return;
  }
  light.removeAttribute("disabled");
  dark.setAttribute("disabled", "true");
};

themer();
document.getElementById("toggleBtn").addEventListener("click", toggle);