(()=>{localStorage.getItem("theme")||localStorage.setItem("theme","light");var e=function e(t){var a=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=document.querySelector("iframe.utterances-frame");if(o){var r=t?"github-dark":"github-light";o.contentWindow.postMessage({type:"set-theme",theme:r},"https://utteranc.es")}else a||setTimeout((function(){e(t,!0)}),1e3)},t=function(){var t="dark"===localStorage.getItem("theme");e(t);var a=document.getElementById("dark");t?a.removeAttribute("disabled"):a.setAttribute("disabled","true")};t(),document.getElementById("toggleBtn").addEventListener("click",(function(){"light"===localStorage.getItem("theme")?localStorage.setItem("theme","dark"):"dark"===localStorage.getItem("theme")&&localStorage.setItem("theme","light"),t()}))})();