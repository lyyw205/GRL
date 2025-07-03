// YouTubePlayerManager.js (v3 - Hero iframe 직접 삽입 방식)

(function(window, document) {
    'use strict';

    const YouTubePlayerManager = {
        isApiReady: false,
        isApiLoading: false,
        components: {},

        loadApi: function() {
            if (this.isApiLoading || document.querySelector('script[src="https.www.youtube.com/iframe_api"]')) return;
            this.isApiLoading = true;
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        },

        initComponent: function(config) {
            // API가 준비된 후에만 컴포넌트 초기화를 진행합니다.
            if (!this.isApiReady) {
                console.warn('API가 아직 준비되지 않았습니다. 초기화를 대기합니다.');
                return;
            }

            const container = document.querySelector(config.selector);
            if (!container) return;

            this.components[config.selector] = {
                players: {},
                config: config
            };
            const componentData = this.components[config.selector];

            if (config.type === 'hero') {
                this.initHeroPlayer(container, componentData);
            } else if (config.type === 'swiper') {
                this.initYouTubeSwiper(container, componentData);
            }
        },

        /**
         * [개선됨] 'hero' 타입. 이미 존재하는 iframe을 제어합니다.
         */
        initHeroPlayer: function(container, componentData) {
            const config = componentData.config;
            const watchBtn = document.querySelector(config.trigger);
            const overlay = document.querySelector(config.overlay);
            const videoWrapper = container; 
            const iframe = videoWrapper.querySelector('iframe');

            if (!watchBtn || !overlay || !iframe || !iframe.id) {
                console.error('Hero Player 초기화에 필요한 요소가 없습니다.');
                return;
            }
            
            const playerId = iframe.id;
            const player = new YT.Player(playerId, {
                events: {
                    'onReady': function(event) {
                        componentData.players[playerId] = event.target;
                    }
                }
            });

            watchBtn.addEventListener('click', (e) => {
                e.preventDefault();

                const heroPlayer = componentData.players[playerId];
                
                if (heroPlayer && typeof heroPlayer.playVideo === 'function') {
                    // 1. [수정] 오버레이에 is-hidden 클래스를 추가하여 완전히 제거
                    overlay.classList.add('is-hidden');

                    // 2. 영상(iframe)을 감싸는 wrapper를 보이게 함
                    videoWrapper.classList.add('is-playing');

                    // 3. 영상 재생
                    heroPlayer.playVideo();
                } else {
                    console.warn('Hero 플레이어가 아직 준비되지 않았습니다. 잠시 후 다시 클릭해주세요.');
                }
            });
        },
        
        initYouTubeSwiper: function(container, componentData) {
            // Swiper 로직은 변경 없음
            const config = componentData.config;
            container.querySelectorAll('.swiper-slide').forEach((slide, index) => {
                if (slide.querySelector('.slide-click-overlay')) return;
                const overlay = document.createElement('div');
                overlay.className = 'slide-click-overlay';
                overlay.dataset.slideTo = index;
                slide.appendChild(overlay);
            });
            container.querySelectorAll('iframe').forEach(iframe => {
                if (iframe.id) {
                    try {
                        console.log(`Trying to create player for #${iframe.id}`); // <--- 추가
                    // new YT.Player()를 호출하되, 바로 할당하지 않습니다.
                        new YT.Player(iframe.id, {
                            events: {
                                // 'onReady' 이벤트가 발생하면, 즉 플레이어가 진짜로 준비되면
                                // 그 때 componentData.players 객체에 추가합니다.
                                'onReady': function(event) {
                                    console.log(iframe.id + ' is ready!');
                                    componentData.players[iframe.id] = event.target;
                                }
                            }
                        });
                    } catch (e) {
                        console.error(`Failed to create player for #${iframe.id}:`, e); // <--- 추가
                    }
                }
            });
            const swiperOptions = {
                ...config.options,
                pagination: { el: config.pagination, clickable: true },
                navigation: { nextEl: config.navigation.nextEl, prevEl: config.navigation.prevEl },
                on: {
                    slideChangeTransitionEnd: (swiper) => {
                        console.log('Slide changed! Event handler is working.');
                        console.log('Players object to check:', componentData.players); 
                        Object.values(componentData.players).forEach(player => {
                            if (player && typeof player.pauseVideo === 'function' && player.getPlayerState() === YT.PlayerState.PLAYING) {
                                player.pauseVideo();
                            }
                        });
                    }
                }
            };
            const swiper = new Swiper(config.selector, swiperOptions);
            const wrapper = container.querySelector('.swiper-wrapper');
            if (wrapper) {
                wrapper.addEventListener('click', (e) => {
                    if (e.target.classList.contains('slide-click-overlay')) {
                        const slideToIndex = e.target.dataset.slideTo;
                        if (slideToIndex !== undefined) {
                            swiper.slideTo(parseInt(slideToIndex, 10));
                        }
                    }
                });
            }
        },

        initAllQueued: function() {
            if (window.ytManagerInitQueue && Array.isArray(window.ytManagerInitQueue)) {
                window.ytManagerInitQueue.forEach(config => this.initComponent(config));
                window.ytManagerInitQueue = []; // 큐 비우기
            }
        }
    };

    window.onYouTubeIframeAPIReady = function() {
        YouTubePlayerManager.isApiReady = true;
        YouTubePlayerManager.initAllQueued();
    };

    // 외부에서 호출할 API
    window.YouTubePlayerManager = {
        init: function(config) {
            if (!config || !config.selector) {
                console.error('YouTubePlayerManager: 초기화 설정 객체 또는 selector가 필요합니다.');
                return;
            }
            // API가 준비되기 전이라도 요청을 큐에 저장
            window.ytManagerInitQueue = window.ytManagerInitQueue || [];
            window.ytManagerInitQueue.push(config);

            // API 로드는 항상 시도
            YouTubePlayerManager.loadApi();

            // API가 이미 준비되었다면 바로 실행
            if (YouTubePlayerManager.isApiReady) {
                YouTubePlayerManager.initAllQueued();
            }
        }
    };

})(window, document);