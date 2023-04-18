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

// Two videoes at bottom of page

const twoVids = document.querySelectorAll(".video-container video");

twoVids.forEach((vid) => {
  let videoClicked = false;
  vid.addEventListener("click", () => {
    if (!videoClicked) {
      vid.load();
    }
    vid.play();
    vid.style.filter = "brightness(1)";
    vid.requestFullscreen();
    vid.muted = false;
    videoClicked = true;

    function fullscreenchanged() {
      if (!document.fullscreenElement) {
        vid.pause();
        vid.autoplay = false;
        vid.style.filter = "brightness(0.6)";
      }
    }

    document.addEventListener("fullscreenchange", fullscreenchanged);
  });
});

// Playbutton

const controls = document.querySelector("#controls");
const playBtn = document.querySelector(".fa-play");
const forwardBtn = document.querySelector(".fa-forward");
const backwardBtn = document.querySelector(".fa-backward");
const fulscreenVideo = document.querySelector("#fullscreenVideo video");
const videoContainer = document.querySelector("#fullscreenVideo");
let hideButtonTimer = null;

playBtn.addEventListener("click", () => {
  if (fulscreenVideo.paused) {
    fulscreenVideo.play();
    playBtn.classList.replace("fa-play", "fa-pause");
    hideButtonTimer = setTimeout(hideButton, 3000);
    checkMove();
  } else {
    fulscreenVideo.pause();
    playBtn.classList.replace("fa-pause", "fa-play");
    clearTimeout(hideButtonTimer);
    controls.style.filter = "opacity(1)";
  }
});

function checkMove() {
  videoContainer.addEventListener("mousemove", () => {
    if (!videoContainer.paused) {
      controls.style.filter = "opacity(1)";
      clearTimeout(hideButtonTimer);
      hideButtonTimer = setTimeout(hideButton, 3000);
    }
  });
}

function hideButton() {
  if (!fulscreenVideo.paused) {
    controls.style.filter = "opacity(0)";
  }
}

// Skip forward/backward

forwardBtn.addEventListener("click", () => {
  fulscreenVideo.currentTime += 10;
});

backwardBtn.addEventListener("click", () => {
  fulscreenVideo.currentTime -= 10;
});
