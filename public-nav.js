(function(){
  if (window.__sokoyetu_PUBLIC_NAV__) return;
  window.__sokoyetu_PUBLIC_NAV__ = true;

  function path(){
    return (location.pathname || "/").toLowerCase();
  }

  function link(href, label, cls){
    return '<a href="' + href + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + label + '</a>';
  }

  function injectNav(){
    if (document.querySelector(".sy-public-nav")) return;

    var current = path();
    var nav = document.createElement("nav");
    nav.className = "sy-public-nav";
    nav.setAttribute("aria-label", "SokoYetu Mtaani public navigation");
    nav.innerHTML =
      '<div class="sy-wrap">' +
        '<a class="sy-brand" href="/"><span class="sy-logo">SY</span><span>SokoYetu Mtaani</span></a>' +
        '<div class="sy-links">' +
          link("/", "Home") +
          link("/how-it-works.html", "How It Works") +
          link("/categories.html", "Categories") +
          link("/seller-stores.html", "Seller Stores") +
          link("/trust-center.html", "Trust Center") +
          link("/help-center.html", "Help Center") +
          link("/track-order.html", "Track Order") +
          link("/delivery-info.html", "Delivery") +
          link("/support-request.html", "Support", "sy-dark") +
          link("/checkout.html", "Checkout", "sy-primary") +
        '</div>' +
      '</div>';

    document.body.insertBefore(nav, document.body.firstChild);

    if (["/","/index.html"].includes(current) && !document.querySelector(".sy-journey-banner")) {
      var banner = document.createElement("section");
      banner.className = "sy-journey-banner";
      banner.innerHTML =
        '<b>Buyer journey</b>' +
        '<div class="sy-steps">' +
          '<span class="sy-step">1. Browse categories</span>' +
          '<span class="sy-step">2. View product details</span>' +
          '<span class="sy-step">3. Add to cart</span>' +
          '<span class="sy-step">4. Checkout</span>' +
          '<span class="sy-step">5. Track order</span>' +
          '<span class="sy-step">6. Get support</span>' +
        '</div>';
      nav.insertAdjacentElement("afterend", banner);
    }
  }

  function injectFooter(){
    if (document.querySelector(".sy-public-footer")) return;

    var footer = document.createElement("section");
    footer.className = "sy-public-footer";
    footer.innerHTML =
      '<b>Customer service</b>' +
      '<div class="sy-footer-links">' +
        link("/help-center.html", "Help Center") +
        link("/track-order.html", "Track Order") +
        link("/support-request.html", "Submit Support Request") +
        link("/returns-policy.html", "Returns and Refunds") +
        link("/contact-support.html", "Contact Support") +
        link("/privacy-policy.html", "Privacy") +
        link("/terms-of-service.html", "Terms") +
      '</div>';

    document.body.appendChild(footer);
  }

  function ready(fn){
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function(){
    injectNav();
    injectFooter();
  });
})();


