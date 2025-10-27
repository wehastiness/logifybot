document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navContainer = document.querySelector('.nav-container');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileMenuToggle.addEventListener('click', () => {
    navContainer.classList.toggle('active');
    document.body.classList.toggle('menu-open');

    const icon = mobileMenuToggle.querySelector('i');
    if (navContainer.classList.contains('active')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navContainer.classList.contains('active')) {
        navContainer.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (
      navContainer.classList.contains('active') &&
      !navContainer.contains(e.target) &&
      !mobileMenuToggle.contains(e.target)
    ) {
      navContainer.classList.remove('active');
      document.body.classList.remove('menu-open');
      mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  const categories = document.querySelectorAll('.category');
  let autoSwitchInterval;
  let userInteracted = false;
  let currentCategoryIndex = 0;

  function switchToCategory(categoryIndex) {
    const category = categories[categoryIndex];

    if (category.classList.contains('active')) {
      return;
    }

    categories.forEach(c => c.classList.remove('active'));
    category.classList.add('active');

    const activeGroup = document.querySelector('.command-group.active');
    const groupToShow = document.querySelector(`[data-group="${category.dataset.category}"]`);

    if (activeGroup) {
      const items = activeGroup.querySelectorAll('.command-item');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(-20px)';
        }, 30 * index);
      });

      setTimeout(() => {
        document.querySelectorAll('.command-group').forEach(g => {
          g.classList.remove('active');
        });

        if (groupToShow) {
          groupToShow.classList.add('active');

          const commandItems = groupToShow.querySelectorAll('.command-item');
          commandItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            setTimeout(() => {
              item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50 * index); 
          });
        }
      }, 300);
    } else {
      document.querySelectorAll('.command-group').forEach(g => {
        g.classList.remove('active');
      });

      if (groupToShow) {
        groupToShow.classList.add('active');

        const commandItems = groupToShow.querySelectorAll('.command-item');
        commandItems.forEach((item, index) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';

          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50 * index); 
        });
      }
    }
  }

  const progressBar = document.querySelector('.category-progress');
  const switchInterval = 5000;
  let startTime;

  function animateProgress(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / switchInterval * 100, 100);

    progressBar.style.width = `${progress}%`;

    if (progress < 100 && !userInteracted) {
      requestAnimationFrame(animateProgress);
    } else if (progress >= 100 && !userInteracted) {
      startTime = null;
      progressBar.style.width = '0%';

      currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
      switchToCategory(currentCategoryIndex);

      requestAnimationFrame(animateProgress);
    } else if (userInteracted) {
      progressBar.style.width = '0%';
    }
  }

  function startAutoSwitch() {
    if (autoSwitchInterval) {
      clearInterval(autoSwitchInterval);
    }

    startTime = null;
    requestAnimationFrame(animateProgress);

    autoSwitchInterval = setInterval(() => {
      if (!userInteracted) {
        currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
        switchToCategory(currentCategoryIndex);

        progressBar.style.width = '0%';
        startTime = null;
      }
    }, switchInterval);
  }

  categories.forEach((category, index) => {
    category.addEventListener('click', () => {
      userInteracted = true;
      currentCategoryIndex = index;

      progressBar.style.width = '0%';

      switchToCategory(index);

      setTimeout(() => {
        userInteracted = false;
        requestAnimationFrame(function(timestamp) {
          startTime = timestamp;
          animateProgress(timestamp);
        });
      }, 10000);
    });
  });

  const commandsSection = document.querySelector('.commands');
  commandsSection.addEventListener('mousemove', () => {
    userInteracted = true;

    progressBar.style.width = '0%';

    clearTimeout(commandsSection.mouseMoveTimeout);
    commandsSection.mouseMoveTimeout = setTimeout(() => {
      userInteracted = false;
      requestAnimationFrame(function(timestamp) {
        startTime = timestamp;
        animateProgress(timestamp);
      });
    }, 10000);
  });

  generateCommandGroups();

  generateIconGrid();

  initAnimations();

  setTimeout(() => {
    const activeGroup = document.querySelector('.command-group.active');
    if (activeGroup) {
      const commandItems = activeGroup.querySelectorAll('.command-item');
      commandItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';

        setTimeout(() => {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50 * index);
      });
    }

    startAutoSwitch();
  }, 500);
});

function generateCommandGroups() {
  const commandList = document.querySelector('.command-list');

    const musicCommands = `
  <div class="command-group active" data-group="custom">
    <h3 class="command-category-title"><i class="fas fa-terminal"></i> Команды</h3>
    <div class="command-category-list">
      <div class="command-item">
        <div class="command-name"><i class="fas fa-info-circle"></i> about</div>
        <div class="command-description">Покажет общую информацию о боте и статистику по всем серверам.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-list"></i> logify</div>
        <div class="command-description">Настрой отслеживание событий и куда отправлять логи на сервере.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-user-plus"></i> autorole</div>
        <div class="command-description">Бот автоматически выдаёт выбранную роль новым участникам сервера.</div>
      </div>
    </div>
  </div>
`;


  commandList.innerHTML = musicCommands;
}

function generateIconGrid() {
  const iconsContainer = document.querySelector('.icons-container');

  const icons = [
    { name: 'play', icon: 'fas fa-play' },
    { name: 'pause', icon: 'fas fa-pause' },
    { name: 'skip', icon: 'fas fa-forward' },
    { name: 'previous', icon: 'fas fa-backward' },
    { name: 'stop', icon: 'fas fa-stop' },
    { name: 'loop', icon: 'fas fa-redo' },
    { name: 'shuffle', icon: 'fas fa-random' },
    { name: 'volume', icon: 'fas fa-volume-up' },
    { name: 'mute', icon: 'fas fa-volume-mute' },
    { name: 'playlist', icon: 'fas fa-list' },
    { name: 'lyrics', icon: 'fas fa-file-alt' },
    { name: 'filter', icon: 'fas fa-sliders-h' },
    { name: 'spotify', icon: 'fab fa-spotify' },
    { name: 'youtube', icon: 'fab fa-youtube' },
    { name: 'soundcloud', icon: 'fab fa-soundcloud' },
    { name: 'deezer', icon: 'fas fa-music' },
    { name: 'apple', icon: 'fab fa-apple' },
    { name: 'radio', icon: 'fas fa-broadcast-tower' },
    { name: '24/7', icon: 'fas fa-clock' },
    { name: 'queue', icon: 'fas fa-stream' },
    { name: 'search', icon: 'fas fa-search' },
    { name: 'grab', icon: 'fas fa-download' },
    { name: 'vote', icon: 'fas fa-vote-yea' },
    { name: 'premium', icon: 'fas fa-crown' },
    { name: 'support', icon: 'fas fa-headset' },
    { name: 'invite', icon: 'fas fa-user-plus' },
    { name: 'help', icon: 'fas fa-question-circle' },
    { name: 'settings', icon: 'fas fa-cog' },
    { name: 'bassboost', icon: 'fas fa-volume-down' },
    { name: 'nightcore', icon: 'fas fa-moon' },
    { name: 'karaoke', icon: 'fas fa-microphone' },
    { name: 'vaporwave', icon: 'fas fa-water' },
    { name: 'equalizer', icon: 'fas fa-sliders-h' },
    { name: 'volume_up', icon: 'fas fa-volume-up' },
    { name: 'volume_down', icon: 'fas fa-volume-down' },
    { name: 'discord', icon: 'fab fa-discord' },
    { name: 'heart', icon: 'fas fa-heart' },
    { name: 'star', icon: 'fas fa-star' },
    { name: 'fire', icon: 'fas fa-fire' },
    { name: 'bolt', icon: 'fas fa-bolt' },
  ];

  let iconsHTML = '';
  icons.forEach(icon => {
    iconsHTML += `
      <div class="icon-item" data-name="${icon.name}" title="${icon.name}">
        <span><i class="${icon.icon}"></i></span>
      </div>
    `;
  });

  iconsContainer.innerHTML = iconsHTML;

  const iconItems = document.querySelectorAll('.icon-item');
  iconItems.forEach(item => {
    const randomDelay = Math.random() * 2;
    item.style.animationDelay = `${randomDelay}s`;

    item.addEventListener('mouseenter', () => {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      item.appendChild(ripple);

      item.classList.add('glow');

      setTimeout(() => {
        ripple.remove();
        item.classList.remove('glow');
      }, 1000);
    });
  });
}

function initAnimations() {
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .pricing-card, .support-card');

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;

      if (elementTop < window.innerHeight && elementBottom > 0) {
        element.classList.add('animate');
      }
    });
  };

  animateOnScroll();

  window.addEventListener('scroll', animateOnScroll);
}