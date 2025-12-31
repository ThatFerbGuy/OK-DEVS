// UI Interactions: Sidebar, Theme, Command Palette, Chat

// Theme Management
(function() {
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);
  
  // Theme toggle handler
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
  
  function updateThemeIcon(theme) {
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
})();

// Sidebar Management
(function() {
  const sidebar = document.getElementById('sidebar');
  let sidebarTimeout;
  
  if (sidebar) {
    // Expand on hover
    sidebar.addEventListener('mouseenter', () => {
      clearTimeout(sidebarTimeout);
      sidebar.classList.add('expanded');
    });
    
    sidebar.addEventListener('mouseleave', () => {
      sidebarTimeout = setTimeout(() => {
        sidebar.classList.remove('expanded');
      }, 300);
    });
    
    // Toggle on click (mobile)
    const navItems = sidebar.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('expanded');
        }
      });
    });
  }
})();

// Command Palette
(function() {
  const cmdPalette = document.getElementById('cmdPalette');
  const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');
  const cmdInput = document.getElementById('cmdInput');
  const cmdResults = document.getElementById('cmdResults');
  const cmdPalette404 = document.getElementById('cmdPalette404');
  
  const commands = [
    { id: 'home', title: 'Home', desc: 'Go to home page', view: 'home' },
    { id: 'projects', title: 'Projects', desc: 'View our projects', view: 'projects' },
    { id: 'solutions', title: 'Solutions', desc: 'View our solutions', view: 'solutions' },
    { id: 'milestones', title: 'Milestones', desc: 'View milestones', view: 'milestones' },
    { id: 'blog', title: 'Blog', desc: 'Read our blog', view: 'blog' },
    { id: 'contact', title: 'Contact', desc: 'Get in touch', view: 'contact' },
    { id: 'feedback', title: 'Feedback', desc: 'Send feedback', view: 'feedback' },
    { id: 'about', title: 'About', desc: 'Learn about us', view: 'about' },
    { id: 'legal', title: 'Legal', desc: 'Privacy & Terms', view: 'legal' }
  ];
  
  let selectedIndex = 0;
  
  function openPalette() {
    if (cmdPalette) {
      cmdPalette.classList.add('active');
      if (cmdInput) {
        setTimeout(() => cmdInput.focus(), 100);
      }
      updateResults('');
    }
  }
  
  function closePalette() {
    if (cmdPalette) {
      cmdPalette.classList.remove('active');
      if (cmdInput) {
        cmdInput.value = '';
      }
      selectedIndex = 0;
    }
  }
  
  function updateResults(query) {
    if (!cmdResults) return;
    
    const filtered = commands.filter(cmd => 
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.desc.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length === 0) {
      cmdResults.innerHTML = '<div class="cmd-result-item"><div class="cmd-result-title">No results found</div></div>';
      return;
    }
    
    cmdResults.innerHTML = filtered.map((cmd, index) => `
      <div class="cmd-result-item ${index === selectedIndex ? 'selected' : ''}" data-view="${cmd.view}">
        <div class="cmd-result-title">${cmd.title}</div>
        <div class="cmd-result-desc">${cmd.desc}</div>
      </div>
    `).join('');
    
    // Add click handlers
    const items = cmdResults.querySelectorAll('.cmd-result-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        if (view && router) {
          router.navigate(view);
          closePalette();
        }
      });
    });
  }
  
  function navigateResults(direction) {
    const items = cmdResults.querySelectorAll('.cmd-result-item');
    if (items.length === 0) return;
    
    items[selectedIndex]?.classList.remove('selected');
    selectedIndex += direction;
    
    if (selectedIndex < 0) selectedIndex = items.length - 1;
    if (selectedIndex >= items.length) selectedIndex = 0;
    
    items[selectedIndex]?.classList.add('selected');
    items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
  }
  
  // Open palette
  if (cmdPaletteBtn) {
    cmdPaletteBtn.addEventListener('click', openPalette);
  }
  
  if (cmdPalette404) {
    cmdPalette404.addEventListener('click', openPalette);
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (cmdPalette?.classList.contains('active')) {
        closePalette();
      } else {
        openPalette();
      }
    }
    
    // Escape to close
    if (e.key === 'Escape' && cmdPalette?.classList.contains('active')) {
      closePalette();
    }
    
    // Arrow keys in palette
    if (cmdPalette?.classList.contains('active')) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateResults(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateResults(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = cmdResults?.querySelector('.cmd-result-item.selected');
        if (selected) {
          selected.click();
        }
      }
    }
  });
  
  // Search input
  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      updateResults(e.target.value);
      selectedIndex = 0;
    });
    
    // Close on overlay click
    const overlay = cmdPalette?.querySelector('.cmd-palette-overlay');
    if (overlay) {
      overlay.addEventListener('click', closePalette);
    }
  }
})();

// Chat Popup
(function() {
  const chatBtn = document.getElementById('chatBtn');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.querySelector('.chat-close');
  const chatSend = document.querySelector('.chat-send');
  const chatMessage = document.getElementById('chatMessage');
  
  function toggleChat() {
    if (chatWindow) {
      chatWindow.classList.toggle('open');
    }
  }
  
  function closeChat() {
    if (chatWindow) {
      chatWindow.classList.remove('open');
    }
  }
  
  if (chatBtn) {
    chatBtn.addEventListener('click', toggleChat);
  }
  
  if (chatClose) {
    chatClose.addEventListener('click', closeChat);
  }
  
  if (chatSend) {
    chatSend.addEventListener('click', (e) => {
      e.preventDefault();
      if (chatMessage && chatMessage.value.trim()) {
        // Stub - no backend
        console.log('Message sent:', chatMessage.value);
        chatMessage.value = '';
        alert('Message sent! (This is a demo - no backend connected)');
      }
    });
  }
  
  // Close chat on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWindow?.classList.contains('open')) {
      closeChat();
    }
  });
})();

// Let's Talk Button
(function() {
  const letsTalkBtn = document.getElementById('letsTalkBtn');
  if (letsTalkBtn) {
    letsTalkBtn.addEventListener('click', () => {
      if (router) {
        router.navigate('contact');
      }
    });
  }
})();

// Form Handling (Stub)
(function() {
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form.id === 'contactForm' || form.id === 'feedbackForm') {
      e.preventDefault();
      // Stub - no backend
      alert('Form submitted! (This is a demo - no backend connected)');
      form.reset();
    }
  });
})();

