document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.querySelector('.slider-nav.prev');
  const nextBtn = document.querySelector('.slider-nav.next');
  let currentSlideIndex = 0;
  let slideInterval;

  if (slides.length > 0) {
    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      currentSlideIndex = (index + slides.length) % slides.length;
      slides[currentSlideIndex].classList.add('active');
    };

    const nextSlide = () => {
      showSlide(currentSlideIndex + 1);
    };

    const prevSlide = () => {
      showSlide(currentSlideIndex - 1);
    };

    const startSlideShow = () => {
      slideInterval = setInterval(nextSlide, 5000);
    };

    const resetSlideShow = () => {
      clearInterval(slideInterval);
      startSlideShow();
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSlideShow();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSlideShow();
      });
    }

    startSlideShow();
  }

  const tabButtons = document.querySelectorAll('.course-tab');
  const courseCardDisplay = document.getElementById('course-card-display');
  const courseImage = document.getElementById('course-detail-image');
  const courseTitle = document.getElementById('course-detail-title');
  const courseCount = document.getElementById('course-detail-count');
  const courseDesc = document.getElementById('course-detail-desc');
  const courseDuration = document.getElementById('course-detail-duration');
  const courseTags = document.getElementById('course-detail-tags');

  const courseData = {
    'ai': {
      image: '/static/images/courses/course-1.png',
      title: 'Artificial Intelligence',
      count: '12 Courses',
      desc: 'End-to-end AI engineering — from ML fundamentals to deploying large language models in production environments.',
      duration: '6 months Beginner → Advanced',
      tags: ['Machine Learning & Deep Learning', 'Generative AI & LLMs', 'MLOps & Model Deployment', 'AI Ethics & Governance', 'Capstone Project']
    },
    'semiconductor': {
      image: '/static/images/courses/course-2.png',
      title: 'Semiconductor Engineering',
      count: '8 Courses',
      desc: 'Comprehensive training in semiconductor physics, chip architecture, fabrication processes, and cleanroom protocols.',
      duration: '5 months Beginner → Advanced',
      tags: ['Device Physics', 'Microfabrication', 'ASIC & FPGA Design', 'Cleanroom Protocols', 'Silicon Verification']
    },
    'cloud': {
      image: '/static/images/courses/course-3.png',
      title: 'Cloud Computing',
      count: '10 Courses',
      desc: 'Master modern cloud architecture, containerization, serverless computing, and DevOps automation across major cloud platforms.',
      duration: '4 months Beginner → Advanced',
      tags: ['AWS & Azure Architectures', 'Docker & Kubernetes', 'CI/CD & DevOps', 'Cloud Security', 'Infrastructure as Code']
    },
    'placement': {
      image: '/static/images/courses/course-4.png',
      title: 'Pre-Placement Training',
      count: '6 Courses',
      desc: 'Accelerate your career readiness with dedicated mock interviews, algorithmic problem solving, and soft skills training.',
      duration: '3 months Intermediate → Placement',
      tags: ['Data Structures & Algos', 'System Design', 'Mock Technical Interviews', 'Soft Skills & Resume Review', 'Behavioral Prep']
    },
    'vlsi': {
      image: '/static/images/courses/course-5.png',
      title: 'VLSI & Chip Design',
      count: '9 Courses',
      desc: 'Dive deep into hardware description languages, physical design flow, RTL coding, and electronic design automation tools.',
      duration: '6 months Beginner → Advanced',
      tags: ['Verilog & SystemVerilog', 'RTL Coding & Synthesis', 'Physical Design Flow', 'Static Timing Analysis', 'EDA Tools Mastery']
    }
  };

  if (tabButtons.length > 0 && courseCardDisplay) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        const data = courseData[category];

        if (!data) return;

        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          const span = btn.querySelector('.tab-gradient-text');
          if (span) {
            btn.textContent = span.textContent.trim();
          }
        });

        button.classList.add('active');
        const labelText = button.textContent.trim();
        button.innerHTML = '';
        const gradientSpan = document.createElement('span');
        gradientSpan.className = 'tab-gradient-text';
        gradientSpan.textContent = labelText;
        button.appendChild(gradientSpan);

        courseCardDisplay.style.opacity = '0';

        setTimeout(() => {
          if (courseImage) courseImage.src = data.image;
          if (courseTitle) courseTitle.textContent = data.title;
          if (courseCount) courseCount.textContent = data.count;
          if (courseDesc) courseDesc.textContent = data.desc;
          if (courseDuration) courseDuration.textContent = data.duration;

          if (courseTags) {
            courseTags.innerHTML = '';
            data.tags.forEach(tag => {
              const div = document.createElement('div');
              div.className = 'course-tag';
              div.textContent = tag;
              courseTags.appendChild(div);
            });
          }

          courseCardDisplay.style.opacity = '1';
        }, 400);
      });
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();

      if (!firstName || !lastName || !email) {
        alert('Please fill out all required fields.');
        return;
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstName, lastName, email })
        });

        if (response.ok) {
          alert('Message sent successfully!');
          contactForm.reset();
        } else {
          alert('Failed to send message. Please try again.');
        }
      } catch (err) {
        alert('An error occurred. Please try again.');
      }
    });
  }
});
