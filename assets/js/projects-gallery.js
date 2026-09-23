(function () {
  const page = document.body.dataset.page;
  const siteRoot = document.body.dataset.siteRoot || "";
  const projects = window.portfolioProjects || [];
  const positions = [
    {
      "--x": "-45vw",
      "--y": "-31vh",
      "--z": "120px",
      "--rx": "6deg",
      "--ry": "17deg",
      "--rz": "-7deg",
      "--s": "0.9",
      "--float-x": "1vw",
      "--float-y": "-1.6vh",
      animationDelay: "0s",
    },
    {
      "--x": "22vw",
      "--y": "-34vh",
      "--z": "40px",
      "--rx": "8deg",
      "--ry": "-18deg",
      "--rz": "6deg",
      "--s": "0.88",
      "--float-x": "-0.8vw",
      "--float-y": "-1.2vh",
      animationDelay: "-1.4s",
    },
    {
      "--x": "-36vw",
      "--y": "13vh",
      "--z": "80px",
      "--rx": "-5deg",
      "--ry": "15deg",
      "--rz": "5deg",
      "--s": "1.02",
      "--float-x": "0.7vw",
      "--float-y": "1.1vh",
      animationDelay: "-2.2s",
    },
    {
      "--x": "31vw",
      "--y": "13vh",
      "--z": "110px",
      "--rx": "-7deg",
      "--ry": "-14deg",
      "--rz": "-5deg",
      "--s": "0.96",
      "--float-x": "-1vw",
      "--float-y": "1vh",
      animationDelay: "-3.2s",
    },
    {
      "--x": "0vw",
      "--y": "32vh",
      "--z": "-20px",
      "--rx": "7deg",
      "--ry": "0deg",
      "--rz": "2deg",
      "--s": "0.78",
      "--float-x": "0.6vw",
      "--float-y": "-1vh",
      animationDelay: "-4s",
    },
  ];

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function imagePath(project) {
    if (/^(https?:|data:|blob:)/.test(project.image)) return project.image;
    return `${siteRoot}${project.image.replace(/^\/+/, "")}`;
  }

  function addExternalAttributes(anchor, url) {
    if (/^https?:/.test(url)) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
  }

  function projectUrl(url) {
    if (!url || /^(https?:|mailto:|tel:|#)/.test(url)) return url;
    return `${siteRoot}${url.replace(/^\/+/, "")}`;
  }

  function createProjectImage(project, className) {
    const image = createElement("img", className);
    image.src = imagePath(project);
    image.alt = project.alt || `${project.title} project preview`;
    image.width = project.imageWidth || 1200;
    image.height = project.imageHeight || 750;
    image.loading = "lazy";
    image.decoding = "async";
    return image;
  }

  function createTags(project) {
    const tags = createElement("div", "project-tags");
    project.tech.forEach((technology) => {
      tags.append(createElement("span", "", technology));
    });
    return tags;
  }

  function createAction(url, label, unavailableLabel, ariaLabel) {
    if (!url) {
      const unavailable = createElement(
        "span",
        "action-unavailable",
        unavailableLabel
      );
      unavailable.setAttribute("aria-disabled", "true");
      return unavailable;
    }

    const anchor = createElement("a", "theme-button", label);
    anchor.href = projectUrl(url);
    anchor.setAttribute("aria-label", ariaLabel);
    addExternalAttributes(anchor, url);
    return anchor;
  }

  function renderGallery() {
    const container = document.querySelector("[data-gallery-projects]");
    if (!container) return;

    projects
      .filter((project) => project.featured !== false)
      .forEach((project, index) => {
        const rawUrl = project.liveUrl || project.githubUrl;
        const card = createElement(rawUrl ? "a" : "article", "floating-card");
        const style = positions[index % positions.length];

        Object.entries(style).forEach(([property, value]) => {
          if (property.startsWith("--")) card.style.setProperty(property, value);
          else card.style[property] = value;
        });

        if (rawUrl) {
          card.href = projectUrl(rawUrl);
          card.setAttribute("aria-label", `View ${project.title}`);
          addExternalAttributes(card, rawUrl);
        } else {
          card.setAttribute("aria-label", `${project.title}, coming soon`);
        }

        const meta = createElement("div", "card-meta");
        meta.append(
          createElement(
            "p",
            "card-label",
            rawUrl ? "View Project" : "Coming Soon"
          ),
          createElement("h2", "card-title", project.title),
          createTags(project)
        );

        card.append(createProjectImage(project, ""), meta);
        container.append(card);
      });
  }

  function renderAllProjects() {
    const container = document.querySelector("[data-all-projects]");
    if (!container) return;

    projects.forEach((project, index) => {
      const article = createElement("article", "project-card");
      article.style.animationDelay = `${Math.min(index * 0.06, 0.42)}s`;

      const imageWrap = createElement("div", "project-image-wrap");
      imageWrap.append(createProjectImage(project, "project-image"));

      const content = createElement("div", "project-card-content");
      content.append(
        createElement("p", "project-category", project.category),
        createElement("h2", "project-card-title", project.title),
        createElement("p", "project-description", project.description),
        createTags(project)
      );

      const actions = createElement("div", "project-actions");
      actions.append(
        createAction(
          project.liveUrl,
          "View Project",
          "Demo Coming Soon",
          `View ${project.title}`
        ),
        createAction(
          project.githubUrl,
          "GitHub",
          "Repository Coming Soon",
          `Open ${project.title} on GitHub`
        )
      );
      content.append(actions);
      article.append(imageWrap, content);
      container.append(article);
    });
  }

  if (page === "gallery") renderGallery();
  if (page === "all-projects") renderAllProjects();
})();
