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
    .order("title", { ascending: true });

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
// ✅ Swiper 초기화 (수정된 버전)
function initSwiper() {
  // 기존에 Swiper 인스턴스가 있다면 파괴하여 메모리 누수 방지
  if (document.querySelector('.cardSwiper').swiper) {
    document.querySelector('.cardSwiper').swiper.destroy(true, true);
  }

  new Swiper(".cardSwiper", {
    // [핵심] PC 화면에서는 2.5개를 보여주어 양옆이 보이게 함
    slidesPerView: 2.5,
    // [핵심] 활성 슬라이드를 항상 가운데로 정렬
    centeredSlides: true,
    // 카드 사이의 간격
    spaceBetween: 20,
    // [핵심] 무한 루프는 이 디자인과 잘 어울립니다.
    loop: false,
    // 마우스 커서를 잡는 모양으로 변경
    grabCursor: true,

    // 페이지네이션 설정
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    
    // 네비게이션(좌우 화살표) 설정 - 필요하다면 small-arrow 대신 보이게 할 수 있습니다.
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },

    // [핵심] 반응형 설정
    breakpoints: {
      // 모바일 (가장 작은 화면 ~ 479px)
      0: {
        slidesPerView: 1,
        spaceBetween: 10, // 간격을 조금 더 줘서 답답함 해소
      },
      380: {
        slidesPerView: 1.5, // 2개는 꽉차고 3번째가 살짝 보이게
        spaceBetween: 20,
      },

      // 큰 모바일 (480px ~ 767px)
      480: {
        slidesPerView: 1.8, // 2개는 꽉차고 3번째가 살짝 보이게
        spaceBetween: 20,
      },
      // 태블릿 (768px ~ 1023px)
      768: {
        slidesPerView: 3,
        spaceBetween: 25,
      },
      // 작은 데스크탑 (1024px ~ 1279px)
      1024: {
        slidesPerView: 3,
        spaceBetween: 0,
      },
      // 일반 데스크탑 (1280px 이상)
      1280: {
        slidesPerView: 4, // 화면이 넓으니 더 많이 보여줌
        spaceBetween: 20,
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", loadCards);
