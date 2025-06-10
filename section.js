  const animatedElements = document.querySelectorAll(
    '.text-h1-block, .text-h2-block, .text-h3-block'
  );

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => a.target.offsetTop - b.target.offsetTop);

    visible.forEach((entry, i) => {
      setTimeout(() => {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }, i * 150);
    });
  }, { threshold: 0.4 });

  animatedElements.forEach(el => sectionObserver.observe(el));