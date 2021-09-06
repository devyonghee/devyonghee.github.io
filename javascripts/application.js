import Zooming from "zooming";

window.addEventListener("DOMContentLoaded", () => {

  new Zooming({ customSize: "150%", scaleBase: 0.9, scaleExtra: 0 })
    .listen(".zooming");

  // Share buttons
  Array.from(document.querySelectorAll(".article-share a")).forEach(button => {
    button.addEventListener("click", e => {
      window.open(e.currentTarget.getAttribute("href"), "Share", "width=200,height=200,noopener");
      return false;
    });
  });
});