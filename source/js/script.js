"use strict";

var mainNav = document.querySelector(".main-nav");
var mainNavToggle = document.querySelector(".main-nav__toggle");

mainNav.classList.add("main-nav--closed");

mainNavToggle.addEventListener("click", function (evt) {
  evt.preventDefault();
  if (mainNav.classList.contains("main-nav--closed")) {
    mainNav.classList.remove("main-nav--closed");
    mainNav.classList.add("main-nav--opened");
  } else {
    mainNav.classList.add("main-nav--closed");
    mainNav.classList.remove("main-nav--opened");
  }
});
