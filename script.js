(function () {
  "use strict";

  const RECIPES = [
    {
      id: "1",
      title: "Herb roasted chicken",
      category: "dinner",
      time: "1 hr 15 min",
      emoji: "🍗",
      description: "Crispy skin, juicy meat, and a simple pan sauce from the drippings.",
      ingredients: ["1 whole chicken (3–4 lb)", "2 tbsp olive oil", "1 lemon, halved", "Fresh rosemary and thyme", "Salt and pepper"],
      steps: [
        "Pat chicken dry and season inside and out.",
        "Stuff cavity with lemon and herbs; tie legs.",
        "Roast at 425°F until thigh reads 165°F.",
        "Rest 15 minutes before carving.",
      ],
    },
    {
      id: "2",
      title: "Avocado toast bar",
      category: "breakfast",
      time: "20 min",
      emoji: "🥑",
      description: "Set out toppings so everyone builds their own perfect slice.",
      ingredients: ["Sourdough bread", "Ripe avocados", "Sea salt", "Optional: eggs, radish, chili flakes"],
      steps: ["Toast bread.", "Mash avocado with salt and lime.", "Spread and add toppings."],
    },
    {
      id: "3",
      title: "Mediterranean grain bowl",
      category: "lunch",
      time: "35 min",
      emoji: "🥗",
      description: "Feta, chickpeas, cucumbers, and a lemon-herb dressing.",
      ingredients: ["Cooked farro or quinoa", "Chickpeas", "Cucumber, tomato", "Feta", "Olive oil, lemon, oregano"],
      steps: ["Whisk dressing.", "Combine grains and vegetables.", "Top with feta and drizzle dressing."],
    },
    {
      id: "4",
      title: "One-pan creamy pasta",
      category: "dinner",
      time: "30 min",
      emoji: "🍝",
      description: "No separate sauce pot—everything finishes in one skillet.",
      ingredients: ["Short pasta", "Heavy cream", "Parmesan", "Garlic", "Spinach"],
      steps: ["Sauté garlic, add cream and simmer.", "Add partially cooked pasta and finish in pan.", "Stir in cheese and spinach."],
    },
    {
      id: "5",
      title: "Berry crumble cups",
      category: "dessert",
      time: "45 min",
      emoji: "🫐",
      description: "Individual portions with oat streusel and vanilla ice cream.",
      ingredients: ["Mixed berries", "Sugar and cornstarch", "Butter, oats, flour, brown sugar"],
      steps: ["Toss berries with sugar and starch.", "Top with streusel.", "Bake until bubbling and golden."],
    },
    {
      id: "6",
      title: "Fluffy pancakes",
      category: "breakfast",
      time: "25 min",
      emoji: "🥞",
      description: "Buttermilk-style stack with a hint of vanilla.",
      ingredients: ["Flour, baking powder, sugar, salt", "Milk, egg, melted butter", "Vanilla extract"],
      steps: ["Mix dry and wet separately.", "Combine with a few lumps remaining.", "Cook on griddle until bubbles form, then flip."],
    },
  ];

  const TIPS = [
    "Rest meat after cooking so juices redistribute.",
    "Taste and season at every stage, not only at the end.",
    "Read the whole recipe once before you start cooking.",
    "Sharp knives are safer than dull ones—hone often.",
    "Room-temperature dairy mixes more evenly into batters.",
  ];

  const header = document.querySelector(".site-header");
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const layout = document.getElementById("layout");
  const sidebarOpen = document.getElementById("sidebar-open");
  const sidebarClose = document.getElementById("sidebar-close");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  const featuredGrid = document.getElementById("featured-grid");
  const menuGrid = document.getElementById("menu-grid");
  const menuEmpty = document.getElementById("menu-empty");
  const recipeSearch = document.getElementById("recipe-search");
  const categoryBtns = document.querySelectorAll(".category-btn");
  const modal = document.getElementById("recipe-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalClose = document.getElementById("modal-close");
  const modalTitle = document.getElementById("modal-title");
  const modalMeta = document.getElementById("modal-meta");
  const modalDesc = document.getElementById("modal-desc");
  const modalIngredients = document.getElementById("modal-ingredients");
  const modalSteps = document.getElementById("modal-steps");
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  let currentCategory = "all";
  let searchQuery = "";

  const dailyTip = document.getElementById("daily-tip");
  if (dailyTip) {
    const dayIndex = new Date().getDate() % TIPS.length;
    dailyTip.textContent = TIPS[dayIndex];
  }

  function setNavOpen(open) {
    if (!navToggle || !header) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    header.classList.toggle("is-nav-open", open);
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      const open = !header.classList.contains("is-nav-open");
      setNavOpen(open);
    });
  }

  if (siteNav) {
    siteNav.addEventListener("click", function (e) {
      const link = e.target.closest("a[data-nav]");
      if (link && window.innerWidth <= 768) setNavOpen(false);
    });
  }

  function setSidebarOpen(open) {
    if (!layout) return;
    layout.classList.toggle("is-sidebar-open", open);
    if (sidebarBackdrop) {
      sidebarBackdrop.hidden = !open;
      sidebarBackdrop.setAttribute("aria-hidden", open ? "false" : "true");
    }
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (sidebarOpen) sidebarOpen.addEventListener("click", function () { setSidebarOpen(true); });
  if (sidebarClose) sidebarClose.addEventListener("click", function () { setSidebarOpen(false); });
  if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", function () { setSidebarOpen(false); });

  function showSection(id) {
    document.querySelectorAll(".page-section").forEach(function (section) {
      const match = section.getAttribute("data-section") === id;
      section.hidden = !match;
      section.classList.toggle("is-visible", match);
    });
    document.querySelectorAll(".nav-link").forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("data-nav") === id);
    });
    if (id === "menu") renderMenuGrid();
    window.scrollTo(0, 0);
  }

  function navigateToHash() {
    const hash = (window.location.hash || "#home").slice(1);
    const allowed = ["home", "menu", "services", "about", "contact"];
    showSection(allowed.includes(hash) ? hash : "home");
  }

  document.querySelectorAll("[data-nav]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      const id = el.getAttribute("data-nav");
      if (!id) return;
      if (el.getAttribute("href") && el.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        window.location.hash = id;
        navigateToHash();
      }
    });
  });

  window.addEventListener("hashchange", navigateToHash);
  navigateToHash();

  function filterRecipes() {
    const q = searchQuery.trim().toLowerCase();
    return RECIPES.filter(function (r) {
      const catOk = currentCategory === "all" || r.category === currentCategory;
      const text = (r.title + " " + r.description + " " + r.category).toLowerCase();
      const searchOk = !q || text.includes(q);
      return catOk && searchOk;
    });
  }

  function recipeCardHtml(recipe, tagName) {
    const el = document.createElement(tagName);
    el.className = "recipe-card";
    el.type = tagName === "button" ? "button" : undefined;
    el.setAttribute("data-recipe-id", recipe.id);
    el.innerHTML =
      '<div class="recipe-card-image" aria-hidden="true">' + recipe.emoji + "</div>" +
      '<div class="recipe-card-body">' +
      '<h3 class="recipe-card-title">' + escapeHtml(recipe.title) + "</h3>" +
      '<p class="recipe-card-meta">' + escapeHtml(recipe.time) + " · " + escapeHtml(recipe.category) + "</p>" +
      "</div>";
    el.addEventListener("click", function () { openModal(recipe); });
    return el;
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function renderFeatured() {
    if (!featuredGrid) return;
    featuredGrid.innerHTML = "";
    RECIPES.slice(0, 3).forEach(function (r) {
      featuredGrid.appendChild(recipeCardHtml(r, "button"));
    });
  }

  function renderMenuGrid() {
    if (!menuGrid) return;
    const list = filterRecipes();
    menuGrid.innerHTML = "";
    list.forEach(function (r) {
      menuGrid.appendChild(recipeCardHtml(r, "button"));
    });
    if (menuEmpty) {
      menuEmpty.hidden = list.length > 0;
    }
  }

  categoryBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentCategory = btn.getAttribute("data-category") || "all";
      categoryBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });
      renderMenuGrid();
    });
  });

  if (recipeSearch) {
    recipeSearch.addEventListener("input", function () {
      searchQuery = recipeSearch.value;
      renderMenuGrid();
    });
  }

  function openModal(recipe) {
    if (!modal) return;
    modalTitle.textContent = recipe.title;
    modalMeta.textContent = recipe.time + " · " + recipe.category;
    modalDesc.textContent = recipe.description;
    modalIngredients.innerHTML = "";
    recipe.ingredients.forEach(function (ing) {
      const li = document.createElement("li");
      li.textContent = ing;
      modalIngredients.appendChild(li);
    });
    modalSteps.innerHTML = "";
    recipe.steps.forEach(function (step) {
      const li = document.createElement("li");
      li.textContent = step;
      modalSteps.appendChild(li);
    });
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = layout.classList.contains("is-sidebar-open") ? "hidden" : "";
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
      setSidebarOpen(false);
      setNavOpen(false);
    }
  });

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("contact-name");
      const email = document.getElementById("contact-email");
      const message = document.getElementById("contact-message");
      const errName = document.getElementById("err-name");
      const errEmail = document.getElementById("err-email");
      const errMessage = document.getElementById("err-message");
      if (errName) errName.textContent = "";
      if (errEmail) errEmail.textContent = "";
      if (errMessage) errMessage.textContent = "";

      let ok = true;
      if (!name.value.trim()) {
        if (errName) errName.textContent = "Please enter your name.";
        ok = false;
      }
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        if (errEmail) errEmail.textContent = "Please enter a valid email.";
        ok = false;
      }
      if (!message.value.trim()) {
        if (errMessage) errMessage.textContent = "Please enter a message.";
        ok = false;
      }
      if (!ok) return;

      if (formSuccess) {
        formSuccess.hidden = false;
        contactForm.reset();
        setTimeout(function () { formSuccess.hidden = true; }, 5000);
      }
    });
  }

  renderFeatured();
  renderMenuGrid();
})();
