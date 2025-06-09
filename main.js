const client = supabase.createClient(
  "https://wqxmvqqkbxiykiotbusd.supabase.co",      // ← 너의 Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxeG12cXFrYnhpeWtpb3RidXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NDcyOTYsImV4cCI6MjA2NDAyMzI5Nn0.RmB92YtjLPMx4tkQibuRVT_T4DL3_O8Pny3ZA9DU0tk"                   // ← 너의 Public 키
);

console.log("✅ Supabase 연결 시작");

// ✅ 카드 불러오기
async function loadCards() {
  const { data, error } = await client
    .from("party_cards")
    .select("*")
    .order("deadline", { ascending: true });

  if (error) {
    console.error("❌ Supabase 오류:", error);
    return;
  }

  console.log("📦 불러온 데이터:", data);

const wrapper = document.getElementById("swiper-wrapper");
wrapper.innerHTML = ""; // 기존 내용 비우기

data.forEach(item => {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";
  slide.innerHTML = `
    <div class="party-card">
      <div class="party-date-wrap">
        <img src="https://cdn.jsdelivr.net/gh/lyyw205/my-assets/logo.png" />
        <div class="party-date-text">
          <div class="party-time">${item.time}</div>
          <div class="party-date">${item.date}</div>
        </div>
      </div>
      <div class="party-count">예약현황</div>
      <div class="party-sex">${item.gender}</div>
      <div class="location-tags">
        ${item.location.split(',').map(tag => `<div class="location-tag">${tag.trim()}</div>`).join('')}
      </div>
      <div class="divider"></div>
      <div class="timer-label">사전할인 종료까지</div>
      <div class="timer-count" data-deadline="${item.deadline}">00:00:00</div>
      <a href="${item.form_url}" class="cta-button" target="_blank">사전할인받고 신청하기</a>
    </div>
  `;
  wrapper.appendChild(slide);
});

  startCountdown();
  initSwiper();
}

// ✅ 타이머
function startCountdown() {
    document.querySelectorAll('.timer-count').forEach(el => {
        const deadlineStr = el.getAttribute('data-deadline');
        const deadline = new Date(deadlineStr);

        function update() {
            const now = new Date();
            const diff = deadline.getTime() - now.getTime();

            if (diff <= 0) {
                el.textContent = '마감됨';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

            el.textContent = `${days}d ${hours}:${minutes}:${seconds}`;
        }

        update();
        setInterval(update, 1000);
    });
}

// ✅ Swiper 초기화
function initSwiper() {
  new Swiper(".cardSwiper", {
    slidesPerView: "auto",
    spaceBetween: 16,
    centeredSlides: false,
    loop: false,
    grabCursor: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      type: "bullets"
    },

    breakpoints: {
      0: {
        slidesPerView: 1,
        centeredSlides: false,
        spaceBetween: 0
      },
      768: {
        slidesPerView: "auto",
        centeredSlides: false,
        spaceBetween: 16
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", loadCards);
