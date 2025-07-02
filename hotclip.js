// [주의] 이 파일은 'hotclip' 슬라이더 전용입니다.

// 전역 플레이어 객체와 API 준비 함수가 겹치지 않도록 구조를 변경합니다.
(function() {
    // 1. 핫클립 슬라이더의 플레이어들을 관리할 독립적인 객체
    var hotclipPlayers = {};

    // 2. 핫클립 슬라이더 초기화 함수
    function initializeHotclipSwiper() {
        // 오버레이 추가
        document.querySelectorAll('.hotclipSwiper .swiper-slide').forEach(function(slide, index) {
            // 이미 오버레이가 있다면 추가하지 않음
            if (slide.querySelector('.slide-click-overlay')) return;
            
            var overlay = document.createElement('div');
            overlay.className = 'slide-click-overlay';
            overlay.dataset.slideTo = index;
            slide.appendChild(overlay);
        });

        // Swiper 초기화
        var hotclipSwiper = new Swiper(".hotclipSwiper", {
            slidesPerView: 1.3,
            centeredSlides: true,
            spaceBetween: -15,
            loop: false,
            pagination: {
                el: ".hotclip-swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".hotclip-swiper-button-next",
                prevEl: ".hotclip-swiper-button-prev",
            },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 40 },
                1024: { slidesPerView: 3, spaceBetween: 50 },
            },
            on: {
                slideChangeTransitionEnd: function () {
                    Object.values(hotclipPlayers).forEach(player => {
                        if (player && typeof player.pauseVideo === 'function' && player.getPlayerState() === 1) {
                            player.pauseVideo();
                        }
                    });
                },
            },
        });
        
        // 오버레이 클릭 이벤트 처리
        document.querySelector('.hotclipSwiper .swiper-wrapper').addEventListener('click', function (e) {
            if (e.target.classList.contains('slide-click-overlay')) {
                var slideToIndex = e.target.dataset.slideTo;
                if (slideToIndex !== undefined) {
                    hotclipSwiper.slideTo(slideToIndex);
                }
            }
        });
    }

    // 3. 핫클립 플레이어 객체 생성 함수
    function createHotclipPlayers() {
        var iframes = document.querySelectorAll('.hotclipSwiper iframe');
        iframes.forEach(function(iframe) {
            if (iframe.id && !hotclipPlayers[iframe.id]) { // 아직 생성되지 않은 플레이어만 생성
                hotclipPlayers[iframe.id] = new YT.Player(iframe.id);
            }
        });
    }

    // 4. YouTube API가 준비되면 실행될 로직
    // 전역 onYouTubeIframeAPIReady 함수가 이미 있다면, 거기에 로직을 추가하는 방식으로 확장합니다.
    var originalReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function() {
        // 기존 함수가 있었다면 먼저 실행
        if (originalReady) {
            originalReady();
        }
        
        // 핫클립 슬라이더 관련 초기화 실행
        initializeHotclipSwiper();
        createHotclipPlayers();
    };

    // 만약 페이지에 onYouTubeIframeAPIReady가 아직 없을 경우를 대비
    if (typeof YT === 'object' && typeof YT.Player === 'function') {
        initializeHotclipSwiper();
        createHotclipPlayers();
    }
})();