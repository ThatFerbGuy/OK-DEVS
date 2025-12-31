// SPA Router with History API

class Router {
  constructor() {
    this.routes = {
      'home': 'views/home.html',
      'projects': 'views/projects.html',
      'solutions': 'views/solutions.html',
      'milestones': 'views/milestones.html',
      'blog': 'views/blog.html',
      'contact': 'views/contact.html',
      'feedback': 'views/feedback.html',
      'about': 'views/about.html',
      'legal': 'views/legal.html',
      '404': 'views/404.html'
    };
    
    this.currentView = 'home';
    this.init();
  }

  init() {
    // Handle initial load
    window.addEventListener('popstate', (e) => {
      this.handleRoute();
    });

    // Handle navigation clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-view]');
      if (link) {
        e.preventDefault();
        const view = link.getAttribute('data-view');
        this.navigate(view);
      }
    });

    // Handle initial route
    this.handleRoute();
  }

  navigate(view) {
    if (!this.routes[view]) {
      view = '404';
    }

    this.currentView = view;
    this.loadView(view);
    this.updateURL(view);
    this.updateBreadcrumbs(view);
    this.updateActiveNav(view);
  }

  handleRoute() {
    const path = window.location.pathname;
    const hash = window.location.hash.slice(1);
    
    let view = 'home';
    
    if (hash) {
      view = hash;
    } else if (path !== '/' && path !== '/index.html') {
      view = path.split('/').pop().replace('.html', '') || 'home';
    }

    if (!this.routes[view]) {
      view = '404';
    }

    this.currentView = view;
    this.loadView(view);
    this.updateBreadcrumbs(view);
    this.updateActiveNav(view);
  }

  async loadView(view) {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    appContent.classList.add('loading');

    try {
      const response = await fetch(this.routes[view]);
      if (!response.ok) {
        throw new Error('View not found');
      }
      const html = await response.text();
      appContent.innerHTML = html;
      
      // Initialize view-specific functionality
      this.initView(view);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error loading view:', error);
      this.loadView('404');
    } finally {
      appContent.classList.remove('loading');
    }
  }

  initView(view) {
    // Initialize view-specific data and functionality
    switch(view) {
      case 'home':
        this.initHomeView();
        break;
      case 'projects':
        this.initProjectsView();
        break;
      case 'solutions':
        this.initSolutionsView();
        break;
      case 'milestones':
        this.initMilestonesView();
        break;
    }
  }

  initHomeView() {
    // Load recent milestones
    if (typeof milestonesData !== 'undefined') {
      const recentMilestones = milestonesData.slice(0, 2);
      const container = document.getElementById('recentMilestones');
      if (container) {
        container.innerHTML = recentMilestones.map(m => `
          <div class="milestone-card">
            <div class="milestone-date">${m.date}</div>
            <h3>${m.title}</h3>
            <p>${m.description}</p>
          </div>
        `).join('');
      }
    }
  }

  initProjectsView() {
    if (typeof projectsData !== 'undefined') {
      const container = document.getElementById('projectsGrid');
      if (container) {
        container.innerHTML = projectsData.map(project => `
          <div class="project-card">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tech">
              ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
            <a href="#" data-view="contact" class="btn-secondary" style="margin-top: 1rem; display: inline-block;">Learn More</a>
          </div>
        `).join('');
      }
    }
  }

  initSolutionsView() {
    if (typeof solutionsData !== 'undefined') {
      const container = document.getElementById('solutionsGrid');
      if (container) {
        container.innerHTML = solutionsData.map(solution => `
          <div class="solution-card">
            <h3>${solution.title}</h3>
            <p>${solution.description}</p>
            <div class="project-tech">
              ${solution.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
            <a href="#" data-view="contact" class="btn-secondary" style="margin-top: 1rem; display: inline-block;">Get Started</a>
          </div>
        `).join('');
      }
    }
  }

  initMilestonesView() {
    if (typeof milestonesData !== 'undefined') {
      const container = document.getElementById('milestonesTimeline');
      if (container) {
        container.innerHTML = milestonesData.map(milestone => `
          <div class="milestone-item">
            <div class="milestone-content">
              <div class="milestone-date">${milestone.date}</div>
              <h3 class="milestone-title">${milestone.title}</h3>
              <p>${milestone.description}</p>
              <div class="milestone-media">${milestone.media}</div>
            </div>
          </div>
        `).join('');

        // Initialize timeline scroll animation
        this.initTimelineAnimation();
      }
    }
  }

  initTimelineAnimation() {
    const timelineLine = document.getElementById('timelineLine');
    if (!timelineLine) return;

    // Create progress element if it doesn't exist
    let progressBar = timelineLine.querySelector('.timeline-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'timeline-progress';
      timelineLine.appendChild(progressBar);
    }

    const updateTimeline = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      const height = Math.min(Math.max(scrollPercent, 0), 100);
      progressBar.style.height = `${height}%`;
    };

    window.addEventListener('scroll', updateTimeline);
    updateTimeline();
  }

  updateURL(view) {
    const url = view === 'home' ? '/' : `#${view}`;
    window.history.pushState({ view }, '', url);
  }

  updateBreadcrumbs(view) {
    const breadcrumbs = document.getElementById('breadcrumbs');
    if (!breadcrumbs) return;

    const viewNames = {
      'home': 'Home',
      'projects': 'Projects',
      'solutions': 'Solutions',
      'milestones': 'Milestones',
      'blog': 'Blog',
      'contact': 'Contact',
      'feedback': 'Feedback',
      'about': 'About',
      'legal': 'Legal',
      '404': '404'
    };

    breadcrumbs.innerHTML = `<span class="breadcrumb-item">${viewNames[view] || 'Home'}</span>`;
  }

  updateActiveNav(view) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const itemView = item.getAttribute('data-view');
      if (itemView === view) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

// Initialize router when DOM is ready
let router;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    router = new Router();
  });
} else {
  router = new Router();
}

