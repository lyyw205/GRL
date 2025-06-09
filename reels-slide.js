const reelsTrack = document.getElementById("reelsTrack");
const reelsSources = [
  "/video/reel1.mp4",
  "/video/reel2.mp4",
  "/video/reel3.mp4",
  "/video/reel4.mp4",
  "/video/reel5.mp4",
]; // 영상 많아져도 문제 없음

let reelsCurrentIndex = 0;
let reelsVisibleCount = 3;

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

    video.addEventListener("click", () => {
      if (i === reelsCurrentIndex) {
        video.currentTime = 0;
        video.play();
      } else {
        reelsCurrentIndex = i;
        updateReelsPosition();
        playCenterVideo();
      }
    });

    reelsTrack.appendChild(video);
  });

  updateReelsPosition();
  playCenterVideo();
}

function updateReelsPosition() {
  const videos = reelsTrack.querySelectorAll("video");
  if (!videos.length) return;

  const wrapperWidth = reelsTrack.parentElement.offsetWidth;
  const centerIndex = reelsCurrentIndex;

  const centerVideo = videos[centerIndex];
  const centerLeft = centerVideo.offsetLeft;
  const centerWidth = centerVideo.offsetWidth;

  const translateX = centerLeft - (wrapperWidth / 2) + (centerWidth / 2);

  reelsTrack.style.transition = "transform 0.5s ease";
  reelsTrack.style.transform = `translateX(${-translateX}px)`;

  videos.forEach(v => v.classList.remove("reels-active"));
  centerVideo.classList.add("reels-active");
}



const MAX_AUTO_PLAY_INDEX = 2; // 0,1,2까지만 자동재생

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

window.addEventListener("resize", () => {
  updateReelsVisibleCount();
  renderReelsVideos();
});

updateReelsVisibleCount();
renderReelsVideos();
