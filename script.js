/* ==========================================================================
   PORTFOLIO INTERACTION & LOGIC SCRIPT
   Client: Thrisha R
   Features: Typewriter, Scroll Reveal, Skills Progress, Project Filters, Mock Form
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Typewriter Effect --- */
  const typewriterText = document.getElementById('typewriter-text');
  const words = [
    "Computer Science Engineering Student",
    "Web Developer",
    "AI & Cybersecurity Enthusiast"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // faster deletion
    } else {
      typewriterText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // pause before next word
    }

    setTimeout(type, typingSpeed);
  }
  
  if (typewriterText) {
    type();
  }

  /* --- Sticky Header & Active Link Highlighting --- */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Header class scroll toggle
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll back to top button visibility
    const backToTop = document.getElementById('back-to-top');
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Nav active tab highlight on scroll
    let currentActive = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentActive = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === currentActive) {
        link.classList.add('active');
      }
    });
  });

  /* --- Mobile Hamburger Menu --- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-links');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  /* --- Scroll Reveal & Skill Bar Animation --- */
  const revealElements = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger skill bars animation if the skills panel enters viewport
        if (entry.target.classList.contains('skills') || entry.target.querySelector('.skill-bar-fill')) {
          animateSkillBars();
        }
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Fallback if IntersectionObserver isn't fully supported, run it once
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('active'));
    animateSkillBars();
  }, 1000);

  function animateSkillBars() {
    skillBars.forEach(bar => {
      const widthStr = bar.getAttribute('data-width');
      bar.style.width = widthStr;
    });
  }

  /* --- Skills Tabs Navigation --- */
  const tabButtons = document.querySelectorAll('.skill-tab-btn');
  const panels = document.querySelectorAll('.skills-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        
        // Reset and animate progress bars in the newly activated tab
        const barsInPanel = targetPanel.querySelectorAll('.skill-bar-fill');
        barsInPanel.forEach(bar => {
          bar.style.width = '0';
          setTimeout(() => {
            bar.style.width = bar.getAttribute('data-width');
          }, 50);
        });
      }
    });
  });

  /* --- Project Grid Filter --- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.transform = 'scale(0.85)';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* --- Contact Form Handler (Mock API Submit) --- */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Disable inputs and show sending status
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      formStatus.className = 'form-status';
      formStatus.style.display = 'none';

      // Simulate a network request
      setTimeout(() => {
        // Success response
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        formStatus.textContent = 'Thank you! Your message has been sent successfully. I will get back to you shortly.';
        formStatus.className = 'form-status success';
        formStatus.style.display = 'block';

        // Clear form
        contactForm.reset();

        // Clear status after 5 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }

  /* --- Back to Top Click Action --- */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
