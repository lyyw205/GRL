const stickyMenu = document.getElementById("stickyMenu");

window.addEventListener("scroll", () => {
  const scrollTrigger = 1100; // ✅ 몇 픽셀 이상 스크롤하면 나타날지 설정

  if (window.scrollY > scrollTrigger) {
    stickyMenu.classList.add("visible");
  } else {
    stickyMenu.classList.remove("visible");
  }
});