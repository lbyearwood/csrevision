(() => {
  window.CSRevision = window.CSRevision || {};

  const topicGroups = window.gcseJ277TopicGroups || [];
  const resourceStatus = window.gcseJ277ResourceStatus || {};
  const resourceButtons = window.CSRevision.resourceButtons;

const groupIconMap = {
  "1.1 Systems architecture": "cpu",
  "1.2 Memory and storage": "storage",
  "1.3 Computer networks, connections and protocols": "network",
  "1.4 Network security": "security",
  "1.5 Systems software": "software",
  "1.6 Impacts of digital technology": "impact",
  "2.1 Algorithms": "algorithm",
  "2.2 Programming fundamentals": "code",
  "2.3 Producing robust programs": "debug",
  "2.4 Boolean logic": "logic",
  "2.5 Programming languages and IDEs": "ide",
  "2.6 Writing programs": "program"
};

const iconMarkup = {
  cpu: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5"></rect><path d="M4 9h3M4 15h3M17 9h3M17 15h3M9 4v3M15 4v3M9 17v3M15 17v3"></path><rect x="10" y="10" width="4" height="4" rx=".8"></rect></svg>',
  storage: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h10l2 5v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8l2-5Z"></path><path d="M8 10h8M8 16h.1M12 16h.1"></path></svg>',
  network: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M4 12h16M12 4c2.2 2.3 3.3 5 3.3 8s-1.1 5.7-3.3 8M12 4c-2.2 2.3-3.3 5-3.3 8s1.1 5.7 3.3 8"></path></svg>',
  security: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 5.5 6.5v5.3c0 4.1 2.6 7.2 6.5 8.7 3.9-1.5 6.5-4.6 6.5-8.7V6.5L12 4Z"></path><path d="M12 10v5M12 8h.1"></path></svg>',
  software: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="12" rx="2"></rect><path d="M8 20h8M10 17v3M14 17v3M8 9h8M8 12h5"></path></svg>',
  impact: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M4 8h16M6 8c0 6 2 10 6 13M18 8c0 6-2 10-6 13"></path><path d="M8 5h8"></path></svg>',
  algorithm: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h10v5H7zM5 18h6v3H5zM13 18h6v3h-6zM12 10v4M8 14h8M8 14v4M16 14v4"></path></svg>',
  code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 7-5 5 5 5M15 7l5 5-5 5M13 5l-2 14"></path></svg>',
  debug: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h8v7a4 4 0 0 1-8 0V8ZM9 4l2 2M15 4l-2 2M4 13h4M16 13h4M5 19l3-2M19 19l-3-2"></path><path d="M10 11h.1M14 11h.1"></path></svg>',
  logic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h5c4 0 7 3 7 6s-3 6-7 6H4V6Z"></path><path d="M16 12h4M4 9H2M4 15H2"></path></svg>',
  ide: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M8 9h8M8 13h4M14 13h2M8 16h6"></path></svg>',
  program: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h8M8 12h8M8 16h5"></path><rect x="5" y="4" width="14" height="16" rx="2"></rect></svg>'
};

  function routeTo(path) {
    const helper = window.CSRevision.routeTo || window.routeTo;
    return helper ? helper(path) : path;
  }

  function routesForSite() {
    return window.CSRevision.routes || window.siteRoutes;
  }

  function groupNumber(heading) {
    const match = heading.match(/^\d+\.\d+/);
    return match ? match[0] : "";
  }

  function groupName(heading) {
    return heading.replace(/^\d+\.\d+\s*/, "");
  }

  function resourcePath(type, topicId, status = {}) {
    const customHref = status[`${type}Href`];
    if (customHref) return routeTo(customHref);

    const routes = routesForSite();
    if (!routes?.gcseJ277) return "#";
    return routeTo(routes.gcseJ277[type](topicId));
  }

  function unitAnchorId(heading) {
    return `unit-${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  }

  function buildUnitNav() {
    const view = document.getElementById("home-view");
    if (!view || view.querySelector(".gcse-unit-nav")) return;

    const nav = document.createElement("nav");
    nav.className = "gcse-unit-nav";
    nav.setAttribute("aria-label", "Unit navigation");

    const title = document.createElement("h2");
    title.textContent = "Units Navigation";
    nav.appendChild(title);

    topicGroups.forEach((paperGroup) => {
      const paperLabel = document.createElement("p");
      paperLabel.className = "gcse-unit-nav-paper";
      paperLabel.textContent = paperGroup.paper;
      nav.appendChild(paperLabel);

      const list = document.createElement("ol");
      list.className = "gcse-unit-nav-list";

      paperGroup.groups.forEach((group) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#${unitAnchorId(group.heading)}`;
        link.innerHTML = `<span>${groupNumber(group.heading)}</span>${groupName(group.heading)}`;
        item.appendChild(link);
        list.appendChild(item);
      });

      nav.appendChild(list);
    });

    view.prepend(nav);
  }

  function initGCSEDashboard() {
    if (!resourceButtons) return;
    buildUnitNav();

    topicGroups.forEach((paperGroup) => {
      const grid = document.getElementById(paperGroup.gridId);
      if (!grid) return;
      grid.innerHTML = "";

      paperGroup.groups.forEach((group) => {
        const article = document.createElement("article");
        article.className = "topic-card";
        article.id = unitAnchorId(group.heading);
        const iconKey = groupIconMap[group.heading] || "code";

        const header = document.createElement("div");
        header.className = "topic-card-header";

        const icon = document.createElement("span");
        icon.className = "topic-icon";
        icon.innerHTML = iconMarkup[iconKey];
        header.appendChild(icon);

        const kicker = document.createElement("p");
        kicker.className = "topic-number";
        kicker.textContent = groupNumber(group.heading);

        const heading = document.createElement("h3");
        heading.textContent = groupName(group.heading);

        const headingWrap = document.createElement("div");
        headingWrap.append(kicker, heading);
        header.appendChild(headingWrap);
        article.appendChild(header);

        const list = document.createElement("ul");
        list.className = "topic-list";

        group.topics.forEach((topic) => {
          const item = document.createElement("li");
          const title = document.createElement("button");
          title.className = "topic-title";
          title.type = "button";
          title.textContent = topic.title;
          title.setAttribute("aria-expanded", "false");

          const actions = document.createElement("div");
          actions.className = "topic-actions";
          actions.hidden = true;
          const status = resourceStatus[topic.id] || {};
          const actionsId = `topic-actions-${topic.id.replace(/[^a-z0-9_-]/gi, "-")}`;
          actions.id = actionsId;
          title.setAttribute("aria-controls", actionsId);

          resourceButtons.order.forEach((type) => {
            if (status.hideUnavailable && !status[type]) return;
            actions.appendChild(resourceButtons.create({
              type,
              href: resourcePath(type, topic.id, status),
              topicTitle: topic.title,
              disabled: !status[type]
            }));
          });

          title.addEventListener("click", () => {
            const isExpanded = title.getAttribute("aria-expanded") === "true";
            title.setAttribute("aria-expanded", String(!isExpanded));
            actions.hidden = isExpanded;
            item.classList.toggle("is-expanded", !isExpanded);
          });

          item.append(title, actions);
          list.appendChild(item);
        });

        article.appendChild(list);
        grid.appendChild(article);
      });
    });
  }

  window.CSRevision.dashboard = { initGCSEDashboard };
})();
