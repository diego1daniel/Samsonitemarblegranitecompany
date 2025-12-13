
  const counters = document.querySelectorAll('.counter');
  const speed = 200; // lower = faster

  const animateCount = (counter) => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;

    const inc = target / speed;

    if (count < target) {
      counter.innerText = Math.ceil(count + inc);
      setTimeout(() => animateCount(counter), 20);
    } else {
      counter.innerText = target + '+';
    }
  };

  // Trigger animation only when section is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => animateCount(counter));
        observer.disconnect(); // run only once
      }
    });
  }, { threshold: 0.5 });

  observer.observe(document.querySelector('.counter').parentNode.parentNode);