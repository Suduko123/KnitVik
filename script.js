const zoomContainer = document.getElementById("zoom-container");
const zoomImage = document.getElementById("zoom-image");
const zoomImage2 = document.querySelector("#zoom-image2 svg");
const content = document.getElementById("welcome");

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
    content.style.display = "flex";
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
