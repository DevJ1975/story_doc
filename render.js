/* =========================================================================
   Soteria Forge story-doc reader — renders the canonical seed JSON.
   The renderer is a pure function of docs/seed/soteria-forge-atl.json:
   a `type -> render` block registry mirroring HANDOFF.md §11.
   ========================================================================= */
(function () {
  "use strict";

  var SEED_URL = "docs/seed/soteria-forge-atl.json";

  /* ---- helpers ---------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function ytId(url) {
    var m = String(url || "").match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/);
    return m ? m[1] : "";
  }

  /* ---- block registry --------------------------------------------------- */
  var registry = {
    hero: function (p) {
      var cta = p.cta ? '<a class="cta cta--accent" href="' + esc(p.cta.href) + '">' + esc(p.cta.label) + "</a>" : "";
      return '<div class="hero">' +
        (p.eyebrow ? '<p class="hero__eyebrow">' + esc(p.eyebrow) + "</p>" : "") +
        '<h1 class="hero__title">' + esc(p.title) + "</h1>" +
        (p.subtitle ? '<p class="hero__subtitle">' + esc(p.subtitle) + "</p>" : "") +
        cta + "</div>";
    },
    heading: function (p) {
      var lvl = Math.min(Math.max(parseInt(p.level, 10) || 2, 2), 4);
      var cls = "heading" + (p.align === "center" ? " heading--center" : "");
      return "<h" + lvl + ' class="' + cls + '">' + esc(p.text) + "</h" + lvl + ">";
    },
    richText: function (p) { return '<div class="rich">' + (p.html || "") + "</div>"; },
    image: function (p) {
      return '<figure><img src="' + esc(p.src) + '" alt="' + esc(p.alt) +
        '" loading="lazy">' + (p.caption ? "<figcaption>" + esc(p.caption) + "</figcaption>" : "") + "</figure>";
    },
    video: function (p) {
      var id = ytId(p.url);
      var poster = p.poster ? ' style="background-image:url(\'' + esc(p.poster) + "')\"" : "";
      if (!id) {
        return '<div class="video"' + poster + '><div class="video__play"><div class="video__btn"></div></div>' +
          '<span class="video__label">Product walkthrough — coming soon</span></div>';
      }
      return '<div class="video" data-yt="' + esc(id) + '"' + poster + ' role="button" tabindex="0" aria-label="Play product walkthrough">' +
        '<div class="video__play"><div class="video__btn"></div></div>' +
        '<span class="video__label">Product walkthrough (2 min)</span></div>';
    },
    cta: function (p) {
      var v = "cta--" + (p.variant || "primary");
      var attr = p.trackingId ? ' data-track="' + esc(p.trackingId) + '"' : "";
      return '<a class="cta ' + v + '" href="' + esc(p.href) + '"' + attr + ">" + esc(p.label) + "</a>";
    },
    callout: function (p) {
      return '<div class="callout callout--' + esc(p.tone || "info") + '">' +
        (p.title ? '<p class="callout__title">' + esc(p.title) + "</p>" : "") +
        '<p class="callout__body">' + esc(p.body) + "</p></div>";
    },
    stats: function (p) {
      var items = (p.items || []).map(function (it) {
        return '<div class="stat"><div class="stat__value">' + esc(it.value) +
          '</div><div class="stat__label">' + esc(it.label) + "</div></div>";
      }).join("");
      return '<div class="stats">' + items + "</div>";
    },
    list: function (p) {
      var tag = p.style === "number" ? "ol" : "ul";
      var items = (p.items || []).map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("");
      return "<" + tag + ' class="list list--' + esc(p.style || "bullet") + '">' + items + "</" + tag + ">";
    },
    divider: function (p) { return '<hr class="divider divider--' + esc(p.size || "md") + '">'; },
    table: function (p) {
      var head = "<tr>" + (p.headers || []).map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") + "</tr>";
      var body = (p.rows || []).map(function (r) {
        return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>";
      }).join("");
      return '<div class="table-wrap"><table><thead>' + head + "</thead><tbody>" + body + "</tbody></table></div>";
    },
    quote: function (p) {
      return '<blockquote class="quote"><p class="quote__text">' + esc(p.text) + "</p>" +
        (p.attribution ? '<cite class="quote__cite">' + esc(p.attribution) + "</cite>" : "") + "</blockquote>";
    },
    contact: function (p) {
      var lines = "";
      if (p.phone) lines += '<a href="tel:' + esc(String(p.phone).replace(/[^\d+]/g, "")) + '">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1z"/></svg>' +
        esc(p.phone) + "</a>";
      if (p.email) lines += '<a href="mailto:' + esc(p.email) + '">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7L4 7v.2l8 5 8-5V7z"/></svg>' +
        esc(p.email) + "</a>";
      return '<div class="contact">' +
        (p.photo ? '<img class="contact__photo" src="' + esc(p.photo) + '" alt="' + esc(p.name || "") + '">' : "") +
        '<div class="contact__body">' +
        '<p class="contact__name">' + esc(p.name) + (p.credential ? ', <span>' + esc(p.credential) + "</span>" : "") + "</p>" +
        (p.role ? '<p class="contact__role">' + esc(p.role) + "</p>" : "") +
        '<p class="contact__lines">' + lines + "</p></div></div>";
    }
  };

  /* ---- section + document render --------------------------------------- */
  function renderBlock(b) {
    var fn = registry[b.type];
    if (!fn) return null;              // unknown types render nothing (forward-compatible)
    var wrap = el("div", "block");
    wrap.setAttribute("data-block", b.type);
    wrap.innerHTML = fn(b.props || {});
    return wrap;
  }

  function renderDoc(doc) {
    var root = document.getElementById("doc");
    root.innerHTML = "";
    (doc.sections || []).forEach(function (s) {
      var bg = s.background ? " band--" + s.background : "";
      var section = el("section", "band" + bg);
      if (s.anchor) section.id = s.anchor;
      section.setAttribute("data-section-id", s.id);
      var inner = el("div", "band__inner");
      (s.blocks || []).forEach(function (b) {
        var node = renderBlock(b);
        if (node) inner.appendChild(node);
      });
      section.appendChild(inner);
      root.appendChild(section);
    });
    if (doc.meta && doc.meta.title) document.title = doc.meta.title;
    enhance();
  }

  /* ---- progressive enhancement: reveal, progress, video ---------------- */
  function enhance() {
    var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    var blocks = document.querySelectorAll(".block");
    if (reduce || !("IntersectionObserver" in window)) {
      blocks.forEach(function (b) { b.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      blocks.forEach(function (b) { io.observe(b); });
    }

    var bar = document.getElementById("progress");
    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function loadVideo(v) {
      var id = v.getAttribute("data-yt");
      if (!id) return;
      v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
        '?autoplay=1&rel=0" title="Product walkthrough" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
    }
    document.querySelectorAll(".video[data-yt]").forEach(function (v) {
      v.addEventListener("click", function () { loadVideo(v); });
      v.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); loadVideo(v); } });
    });
  }

  /* ---- boot ------------------------------------------------------------- */
  fetch(SEED_URL, { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(renderDoc)
    .catch(function (err) {
      document.getElementById("doc").innerHTML =
        '<div class="doc-status">Could not load the document (' + esc(err.message) +
        ').<br>Open this page over HTTP (e.g. the Vercel preview), not from a file path.</div>';
    });
})();
