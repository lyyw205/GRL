const targets = document.querySelectorAll('.intro-text-block, .intro-img-block');

const observer = new IntersectionObserver((entries, observer) => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => a.target.offsetTop - b.target.offsetTop);

  visible.forEach((entry, i) => {
    setTimeout(() => {
      const el = entry.target;
      el.style.opacity = '1';

      if (el.classList.contains('from-left') || el.classList.contains('from-right')) {
        el.style.transform = 'translateX(0)';
      } else if (el.classList.contains('from-bottom')) {
        el.style.transform = 'translateY(0)';
      }

      observer.unobserve(el);
    }, i * 150);
  });
}, {
  threshold: 0.4,
});

targets.forEach(el => observer.observe(el));
