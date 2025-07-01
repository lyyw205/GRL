document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("heroVideo");
  const overlay = document.getElementById("heroOverlay");
  const watchBtn = document.getElementById("watchVideoBtn");

  watchBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // ✅ 1. 부드럽게 사라지도록 클래스 추가
    overlay.classList.add("hidden");

    // ✅ 2. 0.3초 후 완전히 display: none
    setTimeout(() => {
      overlay.style.display = "none";
    }, 300);

    // ✅ 3. 영상 컨트롤러 보여주고 재생
    video.setAttribute("controls", "true");
    video.play();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll('.drop-anim').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }, 100);
});

