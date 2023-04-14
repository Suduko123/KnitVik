// ZOOM EFFECT
const zoomContainer = document.getElementById("zoom-container");
const zoomImage = document.getElementById("zoom-image");
const zoomImage2 = document.querySelector("#zoom-image2 svg");
const content = document.getElementById("content");

let backgroundScale = 1;
let imageScale = 1.6;
const startingScale = 1;
let backgroundFullyRevealed = false;

window.addEventListener("wheel", function (e) {
  if (e.deltaY > 0) {
    // Zoom in
    if (backgroundScale < 4) {
      backgroundScale += 0.5;
      imageScale -= 0.1;
    }
  } else {
    // Zoom out
    if (backgroundScale > startingScale) {
      if (isZoomContainerFullyInView()) {
        backgroundScale -= 0.5;
        imageScale += 0.1;
      }
    } else {
      backgroundScale = startingScale;
      imageScale = 1.6;
      backgroundFullyRevealed = false;
    }
  }

  zoomImage.style.transform = `scale(${backgroundScale})`;
  zoomImage2.style.transform = `scale(${imageScale})`;

  if (backgroundScale >= 4 && !backgroundFullyRevealed) {
    backgroundFullyRevealed = true;
    content.style.display = "block";
    init();
  } else if (backgroundScale < 4 && backgroundFullyRevealed) {
    backgroundFullyRevealed = false;
    content.style.display = "none";
  }
});

function isZoomContainerFullyInView() {
  const zoomContainerRect = zoomContainer.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  return zoomContainerRect.bottom === viewportHeight;
}

// TIMELINE (Horizontal scroll)

// Sets the height of the sticky container element based on the width of the horizontal container element nested within it.
function setStickyContainersSize() {
  const container = document.querySelector("#sticky-container");
  const stikyContainerHeight = container.querySelector("#horizontal-container").scrollWidth;
  container.style.height = `${stikyContainerHeight}px`;
}

// Checks if a given element is currently in the viewport.
const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return rect.top <= 0 && rect.bottom > document.documentElement.clientHeight;
};

// Handles the scrolling behavior for the sticky container element when the user scrolls with the mouse wheel.
// It determines if the container is in the viewport, and if it is, it checks if it can scroll horizontally and updates the
// horizontal scroll position based on the mouse wheel delta.
function wheelHandler(evt) {
  const stickyContainer = document.querySelector("#sticky-container");

  if (!isElementInViewport(stickyContainer)) {
    return;
  }

  const isContainerAboveViewport = stickyContainer.offsetTop < document.documentElement.scrollTop;
  const isContainerBelowViewport =
    stickyContainer.offsetTop + stickyContainer.offsetHeight > document.documentElement.scrollTop;
  let canScrollHorizontally = isContainerAboveViewport && isContainerBelowViewport;

  if (canScrollHorizontally) {
    stickyContainer.querySelector("#horizontal-container").scrollLeft += evt.deltaY;
  }
}

const init = () => {
  setStickyContainersSize();
  window.addEventListener("wheel", wheelHandler);
};
