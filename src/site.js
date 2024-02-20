var flash = document.getElementsByClassName("flash");

function animate() {
  if (flash.length > 0) {
    for (i = 0; i < flash.length; i++) {
      flash[i].style.opacity = Math.random();
    }

    window.requestAnimationFrame(animate);
  }
}

animate();
