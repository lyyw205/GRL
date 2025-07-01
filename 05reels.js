const reelsTrack = document.getElementById("reelsTrack");
const reelsSources = [
  "/video/reel1.mp4",
  "/video/reel2.mp4",
  "/video/reel3.mp4",
  "/video/reel4.mp4",
  "/video/reel5.mp4",
];

let reelsCurrentIndex = 0;
let reelsVisibleCount = 3; // 초기값은 데스크탑 기준
const MAX_AUTO_PLAY_INDEX = 2;

let startX = 0;
let isDragging = false;
let currentTranslate = 0;
let previousTranslate = 0;

function updateReelsVisibleCount() {
  const w = window.innerWidth;
  if (w < 600) reelsVisibleCount = 1;
  else if (w < 1024) reelsVisibleCount = 2;
  else reelsVisibleCount = 3;
}

function renderReelsVideos() {
  reelsTrack.innerHTML = "";

  reelsSources.forEach((src, i) => {
    const video = document.createElement("video");
    video.src = src;
    video.setAttribute("data-index", i);
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    video.addEventListener("click", () => {
      const centerIndex = Math.floor(reelsVisibleCount / 2);
      reelsCurrentIndex = Math.max(
        centerIndex,
        Math.min(i, reelsSources.length - (reelsVisibleCount - centerIndex))
      );

      updateReelsPosition();
      playCenterVideo();
    });

    reelsTrack.appendChild(video);
  });

  const firstVideo = reelsTrack.querySelector("video");
  if (firstVideo) {
    firstVideo.onloadedmetadata = () => {
      updateReelsPosition();
      playCenterVideo();
    };
  }
}

function updateReelsPosition() {
  const videos = reelsTrack.querySelectorAll("video");
  if (!videos.length) return;

  const videoWidth = videos[0].offsetWidth;
  const style = window.getComputedStyle(videos[0]);
  const gap = parseInt(style.marginRight || 30);
  const fullItemWidth = videoWidth + gap;

  const container = reelsTrack.parentElement;
  const containerWidth = container.offsetWidth;
  const centerOfContainer = containerWidth / 2;

  const positionOfCurrentVideo = (reelsCurrentIndex + 0.5) * fullItemWidth;
  const translateX = centerOfContainer - positionOfCurrentVideo;

  reelsTrack.style.transition = "transform 0.5s ease";
  reelsTrack.style.transform = `translateX(${translateX}px)`;

  videos.forEach(v => v.classList.remove("reels-active"));
  videos[reelsCurrentIndex]?.classList.add("reels-active");

  // 드래그 기준값 저장
  previousTranslate = translateX;

  // 디버깅
  console.log("🎯 translateX:", translateX);
}

function playCenterVideo() {
  const videos = reelsTrack.querySelectorAll("video");
  videos.forEach(v => {
    v.pause();
    v.currentTime = 0;
  });

  const currentVideo = videos[reelsCurrentIndex];
  if (!currentVideo || !document.body.contains(currentVideo)) return;

  if (reelsCurrentIndex <= MAX_AUTO_PLAY_INDEX) {
    currentVideo.play().catch(err => {
      console.warn("⚠️ video play() interrupted:", err.message);
    });
  }

  currentVideo.onended = () => {
    if (reelsCurrentIndex < reelsSources.length - 1) {
      reelsCurrentIndex++;
      updateReelsPosition();
      playCenterVideo();
    }
  };
}

// 👉 터치 드래그 처리
reelsTrack.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;

  const transform = getComputedStyle(reelsTrack).transform;
  if (transform !== "none") {
    const matrix = new WebKitCSSMatrix(transform);
    previousTranslate = matrix.m41;
  } else {
    previousTranslate = 0;
  }

  reelsTrack.style.transition = "none";
}, { passive: true });

reelsTrack.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const currentX = e.touches[0].clientX;
  const deltaX = currentX - startX;

  currentTranslate = previousTranslate + deltaX;
  reelsTrack.style.transform = `translateX(${currentTranslate}px)`;
}, { passive: true });

reelsTrack.addEventListener("touchend", (e) => {
  isDragging = false;

  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - startX;
  const swipeThreshold = 50;

  if (deltaX > swipeThreshold && reelsCurrentIndex > 0) {
    reelsCurrentIndex--;
  } else if (deltaX < -swipeThreshold && reelsCurrentIndex < reelsSources.length - 1) {
    reelsCurrentIndex++;
  }

  updateReelsPosition();  // 중앙 정렬로 스냅
  playCenterVideo();      // 새 비디오 재생
});

// 반응형
window.addEventListener("resize", () => {
  updateReelsVisibleCount();
  updateReelsPosition();
});

// 초기 실행
updateReelsVisibleCount();
renderReelsVideos();
