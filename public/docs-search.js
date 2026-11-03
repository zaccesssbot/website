// search over the documentation, served by the Pagefind index the build writes to /pagefind. The
// field only appears with the script; typing shows the matching pages in place of the page list
(function () {
  var form = document.querySelector(".docs-search");
  var input = document.getElementById("docs-q");
  var results = document.getElementById("docs-results");
  var tree = document.querySelector(".docs-tree");
  if (!form || !input || !results || !tree) return;
  var count = results.querySelector(".docs-results-count");
  var list = results.querySelector(".docs-results-list");
  var pagefind = null;
  var timer;

  function load() {
    if (!pagefind) {
      pagefind = import("/pagefind/pagefind.js").then(function (module) {
        return module.init().then(function () { return module; });
      });
    }
    return pagefind;
  }

  // the excerpt is the page's own text with the matches wrapped in <mark>, built as nodes here
  function excerpt(html) {
    var p = document.createElement("p");
    var parts = html.split(/<\/?mark>/);
    parts.forEach(function (part, i) {
      if (!part) return;
      if (i % 2) { var m = document.createElement("mark"); m.textContent = part; p.appendChild(m); }
      else p.appendChild(document.createTextNode(part));
    });
    return p;
  }

  function show(query, hits) {
    list.textContent = "";
    hits.forEach(function (hit) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = hit.url;
      a.textContent = hit.meta && hit.meta.title ? hit.meta.title : hit.url;
      li.appendChild(a);
      li.appendChild(excerpt(hit.excerpt || ""));
      list.appendChild(li);
    });
    count.textContent = hits.length === 1 ? "1 page matches \"" + query + "\"" : hits.length + " pages match \"" + query + "\"";
    results.hidden = false;
    tree.classList.add("searching");
  }

  function clear() {
    results.hidden = true;
    list.textContent = "";
    count.textContent = "";
    tree.classList.remove("searching");
  }

  function run() {
    var query = input.value.trim();
    if (!query) { clear(); return; }
    load().then(function (pf) {
      return pf.search(query);
    }).then(function (search) {
      if (input.value.trim() !== query) return;
      return Promise.all(search.results.slice(0, 10).map(function (r) { return r.data(); })).then(function (hits) {
        show(query, hits);
      });
    }).catch(function () {
      count.textContent = "Search is not available right now.";
      results.hidden = false;
    });
  }

  input.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(run, 200);
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearTimeout(timer);
    run();
  });
  input.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && input.value) { event.preventDefault(); input.value = ""; clear(); }
  });

  // a search arrives in the address when the overview form was sent without the script
  var q = new URLSearchParams(location.search).get("q");
  if (q) { input.value = q; run(); }
})();
