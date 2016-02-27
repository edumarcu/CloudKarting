//------------------------------------------------------------------------------------------------------------ main
function setNavActive(navId) {
    navElement = document.querySelector("#nav-" + navId);
    siblings = navElement.parentNode.children;
    for (var i = 0, l = siblings.length; i < l; i++) {
        siblings[i].classList.remove("active");
    }
    navElement.classList.add("active");
}