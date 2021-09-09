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

const changeUtterancesTheme = (isDarkTheme, isRetry = false) => {
  const utterances = document.querySelector("iframe.utterances-frame");
  if (utterances) {
    const utterancesTheme = isDarkTheme ? "github-dark" : "github-light";
    utterances.contentWindow.postMessage({ type: "set-theme", theme: utterancesTheme }, "https://utteranc.es");
    return;
  }

  if (isRetry) return;
  setTimeout(() => {
    changeUtterancesTheme(isDarkTheme, true);
  }, 1000);
};

// Theme set
const themer = () => {
  const isDarkTheme = localStorage.getItem("theme") === "dark";
  changeUtterancesTheme(isDarkTheme);

  const dark = document.getElementById("dark");
  isDarkTheme ? dark.removeAttribute("disabled") : dark.setAttribute("disabled", "true");
};

themer();
document.getElementById("toggleBtn").addEventListener("click", toggle);