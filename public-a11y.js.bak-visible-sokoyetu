(function(){
  if (window.__SOKOYETU_A11Y__) return;
  window.__SOKOYETU_A11Y__ = true;

  function ready(fn){
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function ensureSkipLink(){
    if (document.querySelector(".skip-link")) return;

    var link = document.createElement("a");
    link.className = "skip-link";
    link.href = "#main-content";
    link.textContent = "Skip to main content";
    document.body.insertBefore(link, document.body.firstChild);
  }

  function ensureMainTarget(){
    var main = document.querySelector("main");
    if (!main) return;
    if (!main.id) main.id = "main-content";
    if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
  }

  function improveImages(){
    var images = Array.prototype.slice.call(document.querySelectorAll("img"));
    images.forEach(function(img, index){
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
      if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
      if (!img.getAttribute("alt")) {
        var nearby = "";
        var parent = img.closest("article, .product, .tile, .card, section");
        if (parent) {
          var title = parent.querySelector("h1,h2,h3,b,.title");
          if (title) nearby = title.textContent.trim();
        }
        img.setAttribute("alt", nearby || "SokoYetu image " + (index + 1));
      }
    });
  }

  function improveButtonsAndLinks(){
    var buttons = Array.prototype.slice.call(document.querySelectorAll("button"));
    buttons.forEach(function(button, index){
      var text = button.textContent.trim();
      if (!text && !button.getAttribute("aria-label")) {
        button.setAttribute("aria-label", "Button " + (index + 1));
      }
    });

    var links = Array.prototype.slice.call(document.querySelectorAll("a"));
    links.forEach(function(link, index){
      var text = link.textContent.trim();
      if (!text && !link.getAttribute("aria-label")) {
        link.setAttribute("aria-label", "Link " + (index + 1));
      }
    });
  }

  function addLiveRegion(){
    if (document.querySelector(".sy-a11y-live")) return;

    var live = document.createElement("div");
    live.className = "sy-a11y-live";
    live.setAttribute("aria-live", "polite");
    live.setAttribute("role", "status");
    document.body.appendChild(live);

    document.addEventListener("click", function(event){
      var action = event.target.closest("button,a");
      if (!action) return;
      var text = action.textContent.trim();
      if (!text || text.length > 60) return;
      live.textContent = text;
      live.classList.add("show");
      clearTimeout(window.__SOKOYETU_A11Y_TIMER__);
      window.__SOKOYETU_A11Y_TIMER__ = setTimeout(function(){
        live.classList.remove("show");
      }, 1200);
    });
  }

  function labelUnlabelledInputs(){
    var fields = Array.prototype.slice.call(document.querySelectorAll("input,select,textarea"));
    fields.forEach(function(field){
      if (field.id && document.querySelector('label[for="' + field.id.replace(/"/g, '\"') + '"]')) return;
      if (field.closest("label")) return;
      if (field.getAttribute("aria-label")) return;
      var placeholder = field.getAttribute("placeholder");
      if (placeholder) field.setAttribute("aria-label", placeholder);
    });
  }

  ready(function(){
    ensureSkipLink();
    ensureMainTarget();
    improveImages();
    improveButtonsAndLinks();
    labelUnlabelledInputs();
    addLiveRegion();
  });
})();
