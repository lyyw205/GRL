// (function() { ... })(); 로 전체를 감싸서 완벽한 스코프 격리를 만듭니다.
(function() {
    // 1. 이 스크립트에서만 사용할 변수들
    const heroSection = document.getElementById('hero');
    if (!heroSection) return; // hero 섹션이 없으면 아무것도 실행하지 않음

    const watchVideoBtn = heroSection.querySelector('#watchVideoBtn');
    const heroOverlay = heroSection.querySelector('#heroOverlay');
    const playerContainerId = 'youtube-hero-player';
    let player; // 이 모듈 안에서만 사용될 플레이어 변수

    // YouTube 영상 ID
    const videoId = 't9oX38iS5WU'; 

    // 2. 플레이어를 생성하고 초기화하는 핵심 함수
    function initializePlayer() {
        // 이미 플레이어가 생성되었다면 다시 생성하지 않음
        if (player) {
            return;
        }
        
        player = new YT.Player(playerContainerId, {
            videoId: videoId,
            origin: window.location.origin, // CORS 오류 방지
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'rel': 0,
                'showinfo': 0,
                'modestbranding': 1,
                'loop': 1,
                'playlist': videoId,
                'playsinline': 1,
                'mute': 1,
                'fs': 0,
                'iv_load_policy': 3
            },
            events: {
                'onReady': (event) => {
                    // 오버레이 숨기고 비디오 재생
                    heroOverlay.style.opacity = '0';
                    heroOverlay.style.pointerEvents = 'none';
                    event.target.playVideo();
                },
                'onStateChange': (event) => {
                    if (event.data === YT.PlayerState.ENDED) {
                        event.target.playVideo();
                    }
                }
            }
        });
    }

    // 3. "궁금하면 클릭" 버튼 이벤트 핸들러
    watchVideoBtn.addEventListener('click', (event) => {
        event.preventDefault();

        // YouTube API가 로드되었는지 확인
        if (window.YT && window.YT.Player) {
            // 이미 로드되었다면 즉시 플레이어 생성/재생
            initializePlayer();
            if(player) {
                // 오버레이 숨기고 비디오 재생 (onReady 이벤트가 발생하지 않을 수 있으므로 명시적 호출)
                heroOverlay.style.opacity = '0';
                heroOverlay.style.pointerEvents = 'none';
                player.playVideo();
            }
        } else {
            // 아직 로드되지 않았다면, API 로드를 트리거하고 콜백을 설정
            loadYouTubeAPI();
        }
    });

    // 4. API 로드 및 콜백 관리 로직
    function loadYouTubeAPI() {
        // 콜백 함수가 등록될 전역 배열을 안전하게 생성
        // 다른 스크립트가 이미 만들었다면 그것을 사용
        window.ytApiCallbacks = window.ytApiCallbacks || [];
        
        // 이 모듈의 플레이어 초기화 함수를 콜백 배열에 추가
        window.ytApiCallbacks.push(initializePlayer);

        // API 스크립트가 아직 페이지에 없는 경우에만 추가
        if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
            // onYouTubeIframeAPIReady가 아직 정의되지 않았다면,
            // 콜백 배열을 실행하는 함수로 정의해준다.
            if (typeof window.onYouTubeIframeAPIReady !== 'function') {
                window.onYouTubeIframeAPIReady = function() {
                    window.ytApiCallbacks.forEach(callback => callback());
                };
            }
            
            // API 스크립트 삽입 (한 번만 실행되도록 id로 체크)
            if (!document.getElementById('youtube-iframe-api')) {
                const tag = document.createElement('script');
                tag.id = 'youtube-iframe-api';
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }
        }
    }
})();