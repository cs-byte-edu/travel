import "../../index.css";
import { Carousel } from "./Carousel";
import { toggle } from "./switcher";

document.addEventListener("DOMContentLoaded", () => {
  toggle();

  new Carousel("#testimonial-container");

  function intersectionCallback(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");

        // Uncomment for animation once
        // observer.unobserve(entry.target);
      } else {
        entry.target.classList.remove("show");
      }
    });
  }

  const ioOptions = {
    threshold: 0.3,
    // rootMargin: '0px 0px -50px 0px'
  };

  const blocks = document.querySelectorAll(".animated-box");

  if (blocks.length > 0) {
    const observer = new IntersectionObserver(intersectionCallback, ioOptions);
    blocks.forEach((b) => {
      observer.observe(b);
    });
  } else {
    console.warn(
      "Не знайдено елементів з класом .animated-box для IntersectionObserver"
    );
  }

  const logos = document.querySelector(".logos");

  if (logos) {
    logos.insertAdjacentHTML("afterend", logos.outerHTML);

    const duplicate = logos.nextElementSibling;
    if (duplicate) {
      duplicate.setAttribute("aria-hidden", "true");
    }
  }
});

// [...document.querySelectorAll("*")].forEach(
//   (el) => (el.style.outline = "1px solid red")
// );
