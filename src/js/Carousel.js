export class Carousel {
  constructor(containerSelector, config = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      throw new Error("Container not found");
    }

    this.carousel = this.container.querySelector(".carousel");
    this.wrapper = this.container.closest(".carousel-wrapper");
    this.slides = Array.from(this.container.querySelectorAll(".slide"));
    this.prevBtn = this.wrapper?.querySelector("#btn-prev");
    this.nextBtn = this.wrapper?.querySelector("#btn-next");
    this.currentIndex = 0;
    this.transitionActive = false;

    if (this.carousel) {
      // this.carousel.style.transition = "transform 0.5s ease";
    }
    this.slides[0]?.classList.add("active");
    this.bindEvents();
    this.updateActiveStateWithTransition();
  }

  bindEvents() {
    this.prevBtn?.addEventListener("click", () => this.move(-1));
    this.nextBtn?.addEventListener("click", () => this.move(1));
    window.addEventListener("resize", () => this.updateTransform(false));
  }

  move(direction) {
    const newIndex = this.currentIndex + direction;
    if (newIndex < 0 || newIndex >= this.slides.length) return;

    this.currentIndex = newIndex;
    this.updateActiveStateWithTransition();
  }

  updateActiveStateWithTransition() {
    if (!this.slides.length || this.transitionActive) return;

    this.updateButtons(false);
    this.transitionActive = true;

    const handleTransitionEnd = () => {
      this.slides.forEach((slide, index) =>
        slide.classList.toggle("active", index === this.currentIndex)
      );
      this.updateButtons(true);
      this.transitionActive = false;
      this.carousel.removeEventListener("transitionend", handleTransitionEnd);
    };

    this.carousel.addEventListener("transitionend", handleTransitionEnd);
    this.updateTransform(true);
  }

  updateButtons(enabled) {
    if (this.prevBtn) {
      this.prevBtn.disabled = !enabled || this.currentIndex === 0;

      this.prevBtn.classList.toggle("disabled", this.currentIndex === 0);
    }

    if (this.nextBtn) {
      this.nextBtn.disabled =
        !enabled || this.currentIndex === this.slides.length - 1;
      this.nextBtn.classList.toggle(
        "disabled",
        this.currentIndex === this.slides.length - 1
      );
    }
  }

  updateTransform(animated = true) {
    const targetOffset = this.calculateTargetOffset();
    // this.carousel.style.transition = animated ? "transform 0.5s ease" : "none";
    this.carousel.style.transform = `translateY(-${targetOffset}px)`;
  }

  calculateTargetOffset() {
    return this.slides.slice(0, this.currentIndex).reduce((sum, slide) => {
      const style = window.getComputedStyle(slide);
      const marginBottom = parseInt(style.marginBottom) || 0;
      return sum + slide.offsetHeight + marginBottom;
    }, 0);
  }
}
