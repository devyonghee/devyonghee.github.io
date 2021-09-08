window.addEventListener("DOMContentLoaded", () => {
  let appearElements = [];

  const refreshVisibility = () => {
    appearElements = [...appearElements.filter(node => {
      if (node.getBoundingClientRect().top > window.innerHeight) {
        return true;
      }
      node.classList.add("appeared");
      return false;
    })];
  };

  const scrollAppearEvent = elements => {
    appearElements.push(...elements);
    refreshVisibility();
    window.addEventListener("scroll", refreshVisibility);
  };

  scrollAppearEvent(document.getElementsByClassName("scrollappear"));
});
