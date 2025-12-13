// CONFIG
const companyName = "SAMSONITE MARBLE AND GRANITE COMPANY";
const phonePrimary = "2348037202816"; // WhatsApp international format (no +)
const phoneVisible = "08037202816";

// Loader: show briefly then reveal app
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const app = document.getElementById("app");
  setTimeout(() => {
    loader.classList.add("loader-hidden");
    setTimeout(() => (loader.style.display = "none"), 380);
    app.style.display = "block";
    document.getElementById("year").textContent = new Date().getFullYear();
  }, 220);
});

// Mobile menu toggle
document.getElementById("mobileMenuBtn").addEventListener("click", () => {
  const m = document.getElementById("mobileMenu");
  m.style.display = m.style.display === "block" ? "none" : "block";
});

// Init AOS with once:false and mirror:true so animations run on scroll up/down
AOS.init({
  duration: 800,
  easing: "ease-out-cubic",
  once: false,
  mirror: true,
});

// IntersectionObserver to toggle reveal class (supports re-trigger)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("revealed");
      else entry.target.classList.remove("revealed");
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));


(function () {
  const track = document.getElementById("carouselTrack");
  const slides = Array.from(track.children);
  const total = slides.length;
  const dotsContainer = document.getElementById("carouselDots");
  const progressBar = document.querySelector(".carousel-progress-bar");
  let idx = 0;
  let timer = null;
  const interval = 5000; // 5 seconds per slide
  let isTransitioning = false;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.dataset.index = i;
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    dotsContainer.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === idx);
    });
  }

  function updateProgress() {
    if (progressBar) {
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
      setTimeout(() => {
        progressBar.style.transition = `width ${interval}ms linear`;
        progressBar.style.width = "100%";
      }, 50);
    }
  }

  function goTo(i) {
    if (isTransitioning) return;
    isTransitioning = true;

    idx = (i + total) % total;
    const offset = -idx * 100; // move track

    track.style.transition = "transform 0.8s ease-in-out";
    track.style.transform = `translateX(${offset}%)`;

    updateDots();
    updateProgress();
    restartAuto();

    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  }

  function next() {
    goTo(idx + 1);
  }
  function prev() {
    goTo(idx - 1);
  }

  // Arrow buttons
  document.getElementById("nextBtn").addEventListener("click", next);
  document.getElementById("prevBtn").addEventListener("click", prev);

  // Auto-slide
  function startAuto() {
    timer = setInterval(next, interval);
    updateProgress();
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
  }
  function restartAuto() {
    stopAuto();
    startAuto();
  }

  // Pause on hover
  const carouselSection = document.querySelector(".carousel");
  carouselSection.addEventListener("mouseenter", stopAuto);
  carouselSection.addEventListener("mouseleave", startAuto);

  // Swipe on touch
  let startX = 0;
  carouselSection.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    stopAuto();
  });
  carouselSection.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (diff > 60) prev();
    else if (diff < -60) next();
    restartAuto();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
  });

  // Initialize
  track.style.transform = "translateX(0%)";
  updateDots();
  startAuto();
})();





// Enhanced Testimonials autoslide & touch
(function() {
  const carousel = document.getElementById("testimonial-carousel");
  const slides = carousel.children.length;
  let index = 0;

  function nextTestimonial() {
    index = (index + 1) % slides;
    carousel.style.transform = `translateX(-${index * 100}%)`;
  }

  // Auto advance every 5 seconds
  setInterval(nextTestimonial, 5000);

  // Touch support for testimonials
  let startX = 0;
  carousel.parentElement.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  carousel.parentElement.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (dx > 50) {
      index = (index - 1 + slides) % slides;
    } else if (dx < -50) {
      index = (index + 1) % slides;
    }
    carousel.style.transform = `translateX(-${index * 100}%)`;
    startX = 0;
  });
})();

// Open WhatsApp with product
function openWhatsApp(productName) {
  const text = encodeURIComponent(
    `Hello ${companyName}, I'm interested in your ${productName}. Please share the price and details.`
  );
  const url = `https://wa.me/${phonePrimary}?text=${text}`;
  window.open(url, "_blank");
}

// Quick message form
document.addEventListener("submit", function (e) {
  if (e.target && e.target.id === "quickMsgForm") {
    e.preventDefault();
    const name = document.getElementById("qname").value || "";
    const phone = document.getElementById("qphone").value || "";
    const msg = document.getElementById("qmsg").value || "";
    const full = `Hello, my name is ${name}. ${msg} ${
      phone ? "Contact: " + phone : ""
    }`;
    const text = encodeURIComponent(full);
    window.open(`https://wa.me/${phonePrimary}?text=${text}`, "_blank");
  }
});

document.getElementById("clearForm").addEventListener("click", () => {
  document.getElementById("qname").value = "";
  document.getElementById("qphone").value = "";
  document.getElementById("qmsg").value = "";
});

// Floating WhatsApp & header CTA
document.querySelectorAll("#waFloat, #whatsapp-cta").forEach((el) => {
  if (!el) return;
  el.addEventListener("click", function (e) {
    e && e.preventDefault();
    const text = encodeURIComponent(
      "Hello, I would like to speak with a manager about Samsonite Marble & Granite."
    );
    window.open(`https://wa.me/${phonePrimary}?text=${text}`, "_blank");
  });
});

// SERVICES
  (function(){
    const track = document.getElementById('servicesTrack');
    const slides = Array.from(track.children);
    const total = slides.length;
    const dotsContainer = document.getElementById('svcDots');
    const prevBtn = document.getElementById('svcPrev');
    const nextBtn = document.getElementById('svcNext');

    // create dots (one per slide)
    slides.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'svc-dot' + (i === 0 ? ' active' : '');
      d.dataset.index = i;
      d.addEventListener('click', ()=> goTo(i));
      dotsContainer.appendChild(d);
    });

    let index = 0;
    let timer = null;
    const interval = 5000;

    function update() {
      // move track by percentage of viewport width (one slide = 100%)
      track.style.transform = `translateX(-${index * 100}%)`;
      // update dots
      dotsContainer.querySelectorAll('.svc-dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + total) % total;
      update();
      restartAuto();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    function startAuto() { timer = setInterval(next, interval); }
    function stopAuto() { if(timer){ clearInterval(timer); timer = null; } }
    function restartAuto(){ stopAuto(); startAuto(); }

    // pause on hover for desktop
    const container = document.getElementById('servicesViewport');
    container.addEventListener('mouseenter', stopAuto);
    container.addEventListener('mouseleave', startAuto);

    // swipe support for mobile
    let startX = 0;
    container.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stopAuto(); });
    container.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 40) prev();
      else if (dx < -40) next();
      restartAuto();
      startX = 0;
    });

    // initialize
    update();
    startAuto();

    // optional: make sure slides have full height on resize, force update
    window.addEventListener('resize', () => { update(); });

  })();