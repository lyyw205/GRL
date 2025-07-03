// 1. YouTube Iframe API 스크립트를 비동기적으로 로드합니다.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. 플레이어 변수들을 준비합니다.
var players = {}; // 여러 개의 플레이어를 관리할 객체

// 3. API 코드가 다운로드되면 이 함수가 실행됩니다.
function onYouTubeIframeAPIReady() {
    
    // [추가] 각 슬라이드에 클릭 가능한 오버레이를 동적으로 추가합니다.
    document.querySelectorAll('.mySwiper .swiper-slide').forEach(function(slide, index) {
        var overlay = document.createElement('div');
        overlay.className = 'slide-click-overlay';
        // 오버레이에 슬라이드 인덱스를 저장해둡니다.
        overlay.dataset.slideTo = index;
        slide.appendChild(overlay);
    });

    // 4. Swiper를 초기화합니다.
    var swiper = new Swiper(".mySwiper", {
        slidesPerView: 1.3,
        centeredSlides: true,
        spaceBetween: -15,
        loop: false, // loop: false 모드이므로 slideToLoop 대신 slideTo를 사용합니다.
        pagination: {
            el: ".reels-swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".reels-swiper-button-next",
            prevEl: ".reels-swiper-button-prev",
        },
        breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 40 },
            1024: { slidesPerView: 3, spaceBetween: 50 },
        },
        on: {
            // 슬라이드가 변경된 직후 실행
            slideChangeTransitionEnd: function () {
                // 모든 비디오를 순회하며 정지
                Object.values(players).forEach(player => {
                    // 플레이어가 로드되었고, 재생 중일 때만 정지 명령을 보냅니다.
                    if (player && typeof player.pauseVideo === 'function' && player.getPlayerState() === 1) {
                        player.pauseVideo();
                    }
                });
            },
        },
    });

    // 5. 각 슬라이드의 iframe에 대해 YouTube 플레이어 객체를 생성합니다.
    var iframes = document.querySelectorAll('.mySwiper iframe');
    iframes.forEach(function(iframe) {
        if (iframe.id) { // id가 있는 iframe만 플레이어로 만듭니다.
            players[iframe.id] = new YT.Player(iframe.id);
        }
    });

    // 6. [핵심] 오버레이 클릭 이벤트 처리
    document.querySelector('.mySwiper .swiper-wrapper').addEventListener('click', function (e) {
        // 클릭된 요소가 오버레이인지 확인
        if (e.target.classList.contains('slide-click-overlay')) {
            // 오버레이에 저장해둔 슬라이드 인덱스를 가져옵니다.
            var slideToIndex = e.target.dataset.slideTo;
            if (slideToIndex !== undefined) {
                // Swiper를 해당 슬라이드로 이동 (loop: false이므로 slideTo 사용)
                swiper.slideTo(slideToIndex);
            }
        }
    });
}