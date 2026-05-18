(() => {
  if (window.location.hash && window.history.replaceState) {
    window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    window.addEventListener("load", () => {
      window.scrollTo(0, 0);
    }, { once: true });
  }

  const body = document.body;
  const menu = document.querySelector("[data-menu]");
  const menuButton = document.querySelector("[data-menu-button]");
  const menuCloseButton = document.querySelector("[data-menu-close]");
  const slides = Array.from(document.querySelectorAll("[data-slide]"));
  const membersList = document.querySelector("[data-members-list]");
  const itemLists = Array.from(document.querySelectorAll("[data-items-list]"));

  const escapeHtml = (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const closeMenu = () => {
    if (!menu || !menuButton) return;
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "メニューを開く");
    body.classList.remove("menu-open");
    menuButton.focus({ preventScroll: true });
  };

  const openMenu = () => {
    if (!menu || !menuButton) return;
    menu.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "メニューを閉じる");
    body.classList.add("menu-open");
  };

  if (menu && menuButton) {
    menuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menuCloseButton?.addEventListener("click", (event) => {
      event.stopPropagation();
      closeMenu();
    });

    menu.addEventListener("click", (event) => {
      event.stopPropagation();
      if (event.target instanceof HTMLAnchorElement) {
        closeMenu();
      }
    });

    document.addEventListener("click", () => {
      if (menuButton.getAttribute("aria-expanded") === "true") {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let activeIndex = 0;

    window.setInterval(() => {
      slides[activeIndex].classList.remove("is-active");
      activeIndex = (activeIndex + 1) % slides.length;
      slides[activeIndex].classList.add("is-active");
    }, 5200);
  }

  if (membersList && Array.isArray(window.GY_MEMBERS)) {
    membersList.innerHTML = window.GY_MEMBERS.map((member) => `
      <article class="person-card">
        <img src="${escapeHtml(member.image)}" alt="${escapeHtml(member.name)}" width="768" height="1024" loading="lazy">
        <div>
          <p class="person-role">${escapeHtml(member.role)}</p>
          <h3>${escapeHtml(member.name)}</h3>
          <p>${escapeHtml(member.intro)}</p>
        </div>
      </article>
    `).join("");
  }

  if (itemLists.length > 0 && Array.isArray(window.GY_ITEMS)) {
    itemLists.forEach((list) => {
      const mode = list.dataset.itemsMode || "all";
      const items = mode === "featured"
        ? window.GY_ITEMS.filter((item) => item.featured)
        : window.GY_ITEMS;

      list.innerHTML = items.map((item) => `
        <article class="product-card">
          <img class="product-card__image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" width="768" height="1024" loading="lazy">
          <div class="product-card__body">
            <p class="product-label product-card__meta">
              <span>${escapeHtml(item.label)}</span>
              <span>${escapeHtml(item.origin || "Ishigaki")}</span>
            </p>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.intro)}</p>
            <a class="product-card__link" href="./products.html" aria-label="${escapeHtml(item.name)}を見る"></a>
          </div>
        </article>
      `).join("");
    });
  }
})();
