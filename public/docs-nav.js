// the documentation menu and the "On this page" list fold behind a button on a narrow screen: a
// disclosure that shows or hides the list. Without the script both are shown as they are
(function () {
  function disclosure(button, panel) {
    if (!button || !panel) return;
    function isOpen() { return button.getAttribute("aria-expanded") === "true"; }
    function set(open, returnFocus) {
      button.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("open", open);
      if (!open && returnFocus) button.focus();
    }
    button.addEventListener("click", function () { set(!isOpen()); });
    panel.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen() && !event.defaultPrevented) { event.preventDefault(); set(false, true); }
    });
  }
  var menu = document.querySelector(".docs-side .docs-toggle");
  disclosure(menu, document.getElementById("docs-nav-body"));
  disclosure(document.querySelector(".docs-toc-toggle"), document.getElementById("docs-toc-list"));

  // a page reached from the menu on a phone: the heading is the first thing to read
  var current = document.querySelector('.docs-tree a[aria-current="page"]');
  var nav = document.querySelector(".docs-nav");
  if (current && nav && nav.scrollHeight > nav.clientHeight) {
    current.scrollIntoView({ block: "center" });
  }
})();
