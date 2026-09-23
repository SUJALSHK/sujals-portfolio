const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".navbar a");
const header = document.querySelector(".header");
const menuToggle = document.querySelector("#check");
const menuButton = document.querySelector(".checkbtn");
const roleText = document.querySelector(".role-text");
const projectCarousel = document.querySelector("[data-project-carousel]");
const projects = (window.portfolioProjects || []).filter(
  (project) => project.featured !== false
);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileNavigation = window.matchMedia("(max-width: 820px)");
const isExternalUrl = (url) => typeof url === "string" && /^https?:/.test(url);
const resolveSiteUrl = (url) =>
  url && url.startsWith("/") ? `.${url}` : url;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function updateActiveNavigation() {
  const scrollPosition = window.scrollY + Math.min(window.innerHeight * 0.45, 500);

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${sectionId}`
        );
      });
    }
  });

  header?.classList.toggle("sticky", window.scrollY > 40);
}

function updateMenuState() {
  if (!menuToggle) return;

  const isOpen = menuToggle.checked;
  const menuIsOffCanvas = mobileNavigation.matches;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuButton?.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );

  navLinks.forEach((link) => {
    if (menuIsOffCanvas && !isOpen) link.setAttribute("tabindex", "-1");
    else link.removeAttribute("tabindex");
  });
}

window.addEventListener("scroll", updateActiveNavigation, { passive: true });
window.addEventListener("load", updateActiveNavigation);
mobileNavigation.addEventListener("change", updateMenuState);
menuToggle?.addEventListener("change", updateMenuState);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (menuToggle) {
      menuToggle.checked = false;
      updateMenuState();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.checked) {
    menuToggle.checked = false;
    updateMenuState();
    menuToggle.focus();
  }
});

updateMenuState();

if (roleText && !reducedMotion.matches) {
  const roles = roleText.dataset.roles
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
  let roleIndex = 0;

  if (roles.length > 1) {
    window.setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleText.style.opacity = "0";

      window.setTimeout(() => {
        roleText.textContent = roles[roleIndex];
        roleText.style.opacity = "1";
      }, 220);
    }, 3200);
  }
}

function projectAction(url, label, iconClass, accessibleLabel) {
  if (!url) {
    return `
      <span class="project-link-disabled" aria-disabled="true">
        <i class="fa-solid fa-clock" aria-hidden="true"></i>
        Coming Soon
      </span>
    `;
  }

  const externalAttributes = isExternalUrl(url)
    ? ' target="_blank" rel="noopener noreferrer"'
    : "";

  return `
    <a href="${escapeHtml(resolveSiteUrl(url))}"${externalAttributes} aria-label="${escapeHtml(accessibleLabel)}">
      <i class="${iconClass}" aria-hidden="true"></i>
      ${escapeHtml(label)}
    </a>
  `;
}

function initProjectCarousel() {
  if (!projectCarousel || projects.length === 0) return;

  const stage = projectCarousel.querySelector("[data-carousel-stage]");
  const dots = projectCarousel.querySelector("[data-carousel-dots]");
  const prevButton = projectCarousel.querySelector("[data-carousel-prev]");
  const nextButton = projectCarousel.querySelector("[data-carousel-next]");
  const toggleButton = projectCarousel.querySelector("[data-carousel-toggle]");
  const slideDelay = 5000;
  let activeIndex = 0;
  let autoSlideId;
  let userPaused = reducedMotion.matches;

  stage.innerHTML = projects
    .map(
      (project, index) => `
        <article class="carousel-card" data-project-card aria-hidden="${
          index === 0 ? "false" : "true"
        }">
          <img
            src="${escapeHtml(project.image)}"
            width="${project.imageWidth || 1200}"
            height="${project.imageHeight || 750}"
            alt="${escapeHtml(project.alt)}"
            loading="lazy"
            decoding="async"
          />
          <div class="carousel-card-content">
            <div>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(project.description)}</p>
            </div>
            <div class="project-tags">
              ${project.tech
                .map((item) => `<span>${escapeHtml(item)}</span>`)
                .join("")}
            </div>
            <div class="project-links">
              ${projectAction(
                project.liveUrl,
                "View Project",
                "fa-solid fa-arrow-up-right-from-square",
                `View ${project.title}`
              )}
              ${projectAction(
                project.githubUrl,
                "GitHub",
                "fa-brands fa-github",
                `Open ${project.title} on GitHub`
              )}
            </div>
          </div>
        </article>
      `
    )
    .join("");

  dots.innerHTML = projects
    .map(
      (project, index) => `
        <button class="carousel-dot" type="button" data-carousel-dot="${index}" aria-label="Show ${escapeHtml(
          project.title
        )}"></button>
      `
    )
    .join("");

  const cards = projectCarousel.querySelectorAll("[data-project-card]");
  const dotButtons = projectCarousel.querySelectorAll("[data-carousel-dot]");
  const normalizeIndex = (index) =>
    (index + projects.length) % projects.length;

  function updateCarousel() {
    const prevIndex = normalizeIndex(activeIndex - 1);
    const nextIndex = normalizeIndex(activeIndex + 1);

    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      card.className = "carousel-card";
      card.setAttribute("aria-hidden", String(!isActive));
      card.inert = !isActive;

      card.querySelectorAll("a").forEach((link) => {
        if (isActive) link.removeAttribute("tabindex");
        else link.setAttribute("tabindex", "-1");
      });

      if (isActive) card.classList.add("is-active");
      else if (index === prevIndex) card.classList.add("is-prev");
      else if (index === nextIndex) card.classList.add("is-next");
    });

    dotButtons.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);
      if (isActive) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function goToProject(index) {
    activeIndex = normalizeIndex(index);
    updateCarousel();
  }

  function stopAutoSlide() {
    window.clearInterval(autoSlideId);
    autoSlideId = undefined;
  }

  function startAutoSlide() {
    stopAutoSlide();
    if (!userPaused && !document.hidden) {
      autoSlideId = window.setInterval(
        () => goToProject(activeIndex + 1),
        slideDelay
      );
    }
  }

  function updatePauseButton() {
    if (!toggleButton) return;
    const label = userPaused ? "Resume" : "Pause";
    toggleButton.setAttribute(
      "aria-label",
      `${label} automatic project rotation`
    );
    toggleButton.innerHTML = `
      <i class="fa-solid ${
        userPaused ? "fa-play" : "fa-pause"
      }" aria-hidden="true"></i>
      <span>${label}</span>
    `;
  }

  prevButton?.addEventListener("click", () => {
    goToProject(activeIndex - 1);
    startAutoSlide();
  });

  nextButton?.addEventListener("click", () => {
    goToProject(activeIndex + 1);
    startAutoSlide();
  });

  dotButtons.forEach((dot) => {
    dot.addEventListener("click", () => {
      goToProject(Number(dot.dataset.carouselDot));
      startAutoSlide();
    });
  });

  toggleButton?.addEventListener("click", () => {
    userPaused = !userPaused;
    updatePauseButton();
    startAutoSlide();
  });

  projectCarousel.addEventListener("mouseenter", stopAutoSlide);
  projectCarousel.addEventListener("mouseleave", startAutoSlide);
  projectCarousel.addEventListener("focusin", stopAutoSlide);
  projectCarousel.addEventListener("focusout", (event) => {
    if (!projectCarousel.contains(event.relatedTarget)) startAutoSlide();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoSlide();
    else startAutoSlide();
  });

  updateCarousel();
  updatePauseButton();
  startAutoSlide();
}

initProjectCarousel();

function initRevealAnimations() {
  if (
    reducedMotion.matches ||
    !("IntersectionObserver" in window) ||
    typeof Element.prototype.animate !== "function"
  ) {
    return;
  }

  const revealGroups = [
    {
      selector: ".home-content, .section-heading",
      from: "translate3d(0, -32px, 0)",
    },
    {
      selector: ".home-visual, .project-carousel",
      from: "translate3d(0, 32px, 0)",
    },
    {
      selector: ".summary-item, .skill-card",
      from: "translate3d(0, 28px, 0)",
      interval: 90,
    },
    {
      selector: ".about-img",
      from: "translate3d(-32px, 0, 0)",
    },
    {
      selector: ".about-content, .contact-panel",
      from: "translate3d(32px, 0, 0)",
    },
  ];

  const revealOptions = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const options = revealOptions.get(entry.target);
        const animation = entry.target.animate(
          [
            { opacity: 0, transform: options.from },
            { opacity: 1, transform: "translate3d(0, 0, 0)" },
          ],
          {
            duration: 780,
            delay: options.delay,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "both",
          },
        );

        animation.addEventListener("finish", () => animation.cancel(), {
          once: true,
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  revealGroups.forEach(({ selector, from, interval = 0 }) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      revealOptions.set(element, {
        from,
        delay: 80 + Math.min(index * interval, 270),
      });
      observer.observe(element);
    });
  });
}

initRevealAnimations();
