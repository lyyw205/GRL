const toggleBtn = document.getElementById("toggleTab");
const expandTab = document.getElementById("expandTab");

let isOpen = false;

toggleBtn.addEventListener("click", () => {
  isOpen = !isOpen;
  expandTab.classList.toggle("active", isOpen);
  toggleBtn.textContent = isOpen ? "▼" : "▲";  // ▼ 접기 / ▲ 열기
});