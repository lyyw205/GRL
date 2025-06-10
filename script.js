const targets = document.querySelectorAll('.text-block, .image-block');

const observer = new IntersectionObserver((entries, observer) => {
  // 화면에 들어온 것들을 top 위치 기준으로 정렬
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => a.target.offsetTop - b.target.offsetTop);

  // 순서대로 .active 붙이기
  visible.forEach((entry, i) => {
    setTimeout(() => {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }, i * 150); // 150ms 간격으로 순차 등장
  });
}, {
  threshold: 0.4,
});

targets.forEach(el => observer.observe(el));