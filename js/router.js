// SPA Router with History API

class Router {
  constructor() {
    // Detect base path for GitHub Pages
    this.basePath = this.getBasePath();
    
    this.routes = {
      'home': 'views/home.html',
      'projects': 'views/projects.html',
      'solutions': 'views/solutions.html',
      'milestones': 'views/milestones.html',
      'blog': 'views/blog.html',
      'blog-post': 'views/blog-post.html',
      'contact': 'views/contact.html',
      'feedback': 'views/feedback.html',
      'about': 'views/about.html',
      'legal': 'views/legal.html',
      '404': 'views/404.html'
    };
    
    this.currentView = 'home';
    this.init();
  }

  getBasePath() {
    // Get the base path from the current location
    const path = window.location.pathname;
    // If path includes /OK-DEVS/, extract it
    if (path.includes('/OK-DEVS')) {
      const match = path.match(/^(\/OK-DEVS\/?)/);
      if (match) {
        // Ensure trailing slash for consistency
        return match[1].endsWith('/') ? match[1] : match[1] + '/';
      }
    }
    return '/';
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
        const blogSlug = link.getAttribute('data-blog-slug');
        this.navigate(view, blogSlug);
      }
    });

    // Handle initial route
    this.handleRoute();
  }

  navigate(view, blogSlug = null) {
    if (!this.routes[view]) {
      view = '404';
    }

    this.currentView = view;
    this.loadView(view, blogSlug);
    this.updateURL(view, blogSlug);
    this.updateBreadcrumbs(view);
    this.updateActiveNav(view);
  }

  handleRoute() {
    const hash = window.location.hash.slice(1);
    const path = window.location.pathname;
    
    let view = 'home';
    let blogSlug = null;
    
    // Prioritize hash-based routing (works better with GitHub Pages)
    if (hash) {
      // Check if it's a blog post (format: blog-slug)
      if (hash.startsWith('blog-') && hash.length > 5) {
        view = 'blog-post';
        blogSlug = hash.substring(5); // Get slug after 'blog-'
      } else {
        view = hash;
      }
    } else {
      // Fallback to path-based routing
      const cleanPath = path.replace(this.basePath, '').replace(/^\//, '').replace(/\/$/, '');
      if (cleanPath && cleanPath !== 'index.html' && cleanPath !== '') {
        view = cleanPath.replace('.html', '');
      }
    }

    if (!this.routes[view]) {
      view = '404';
    }

    this.currentView = view;
    this.loadView(view, blogSlug);
    this.updateBreadcrumbs(view);
    this.updateActiveNav(view);
  }

  async loadView(view, blogSlug = null) {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    appContent.classList.add('loading');

    try {
      // Use base path for fetching views
      const viewPath = this.basePath !== '/' ? `${this.basePath}${this.routes[view]}` : this.routes[view];
      const response = await fetch(viewPath);
      if (!response.ok) {
        throw new Error('View not found');
      }
      let html = await response.text();
      
      // Fix asset paths for GitHub Pages base path
      if (this.basePath !== '/') {
        // Fix relative asset paths that don't start with http://, https://, or /
        html = html.replace(/src="(?!https?:\/\/|\/)(assets\/)/g, `src="${this.basePath}$1`);
        html = html.replace(/href="(?!https?:\/\/|\/)(assets\/)/g, `href="${this.basePath}$1`);
      }
      
      // Fix image paths in dynamically generated content (milestones, etc.)
      // This will be handled by the initView methods that generate HTML
      
      appContent.innerHTML = html;
      
      // Initialize view-specific functionality
      await this.initView(view, blogSlug);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error loading view:', error);
      this.loadView('404');
    } finally {
      appContent.classList.remove('loading');
    }
  }

  async initView(view, blogSlug = null) {
    // Initialize view-specific data and functionality
    switch(view) {
      case 'home':
        await this.initHomeView();
        break;
      case 'projects':
        this.initProjectsView();
        break;
      case 'solutions':
        this.initSolutionsView();
        break;
      case 'milestones':
        await this.initMilestonesView();
        break;
      case 'blog':
        this.initBlogView();
        break;
      case 'blog-post':
        this.initBlogPostView(blogSlug);
        break;
    }
  }

  async initHomeView() {
    // Load recent milestones
    const container = document.getElementById('recentMilestones');
    if (container) {
      // Fetch milestones from milestones.html
      let milestones = [];
      if (typeof fetchMilestonesData !== 'undefined') {
        milestones = await fetchMilestonesData(this.basePath);
      } else if (typeof milestonesData !== 'undefined' && milestonesData.length > 0) {
        // Fallback to static data if fetch function not available
        milestones = milestonesData;
      }
      
      if (milestones.length > 0) {
        const recentMilestones = milestones.slice(0, 2);
        const basePath = this.basePath !== '/' ? this.basePath : '';
        container.innerHTML = recentMilestones.map(m => `
          <div class="milestone-card">
            <div class="milestone-date">${m.date}</div>
            <h3>${m.title}</h3>
            <p>${m.description}</p>
            ${m.image ? `<div class="milestone-card-image"><img src="${basePath}assets/${m.image}" alt="${m.title}" loading="lazy"></div>` : ''}
          </div>
        `).join('');
      }
    }
    
    // Optimize video for mobile
    this.optimizeHeroVideo();
  }

  optimizeHeroVideo() {
    const video = document.querySelector('.hero-video');
    if (!video) return;
    
    // Mobile optimizations
    if (window.innerWidth <= 768) {
      // Set video attributes for mobile performance
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      
      // Reduce video quality on mobile by adjusting playback
      // Note: Actual resolution reduction would require multiple video sources
      // This ensures the video fits the screen properly
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      
      // Pause video if not in viewport to save resources
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay may be blocked, ignore error
            });
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(video);
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
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <a href="${project.demoLink || '#'}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="display: inline-block;">Live Demo</a>
              <a href="${project.githubLink || '#'}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="display: inline-block;">GitHub</a>
            </div>
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

  async initMilestonesView() {
    const container = document.getElementById('milestonesTimeline');
    if (!container) return;
    
    // Fetch milestones from milestones.html
    let milestones = [];
    if (typeof fetchMilestonesData !== 'undefined') {
      milestones = await fetchMilestonesData(this.basePath);
    } else if (typeof milestonesData !== 'undefined' && milestonesData.length > 0) {
      // Fallback to static data if fetch function not available
      milestones = milestonesData;
    }
    
    if (milestones.length === 0) {
      container.innerHTML = '<p>No milestones found.</p>';
      return;
    }
    
    const basePath = this.basePath !== '/' ? this.basePath : '';
    container.innerHTML = milestones.map(milestone => `
      <div class="milestone-item">
        <div class="milestone-content">
          <div class="milestone-date">${milestone.date}</div>
          <h3 class="milestone-title">${milestone.title}</h3>
          <p>${milestone.description}</p>
          <div class="milestone-media">
            ${milestone.image ? `<img src="${basePath}assets/${milestone.image}" alt="${milestone.title}" loading="lazy">` : ''}
          </div>
        </div>
      </div>
    `).join('');

    // Initialize timeline scroll animation
    this.initTimelineAnimation();
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

  initBlogView() {
    if (typeof blogsData !== 'undefined') {
      const container = document.getElementById('blogGrid');
      if (container) {
        container.innerHTML = blogsData.map(blog => `
          <article class="blog-card">
            <div class="blog-meta">
              <span class="blog-date">${blog.date}</span>
              <span class="blog-category">${blog.category}</span>
            </div>
            <h2>${blog.title}</h2>
            <p>${blog.excerpt}</p>
            <a href="#" data-view="blog-post" data-blog-slug="${blog.slug}" class="blog-link">Read more →</a>
          </article>
        `).join('');
        
        // Add click handlers for blog post links
        container.querySelectorAll('[data-blog-slug]').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const slug = link.getAttribute('data-blog-slug');
            this.navigate('blog-post', slug);
          });
        });
      }
    }
  }

  initBlogPostView(slug) {
    if (typeof blogsData === 'undefined' || !slug) {
      // Redirect to 404 if no slug or data
      this.navigate('404');
      return;
    }

    const blog = blogsData.find(b => b.slug === slug);
    if (!blog) {
      this.navigate('404');
      return;
    }

    // Populate blog post
    const titleEl = document.getElementById('blogPostTitle');
    const metaEl = document.getElementById('blogPostMeta');
    const contentEl = document.getElementById('blogPostContent');

    if (titleEl) {
      titleEl.textContent = blog.title;
    }

    if (metaEl) {
      metaEl.innerHTML = `
        <span class="blog-date">${blog.date}</span>
        <span class="blog-category">${blog.category}</span>
      `;
    }

    if (contentEl) {
      contentEl.innerHTML = blog.content;
    }
  }

  updateURL(view, blogSlug = null) {
    // Use hash-based routing for GitHub Pages compatibility
    if (view === 'home') {
      // For home, use base path or root
      const url = this.basePath !== '/' ? this.basePath : '/';
      window.history.pushState({ view }, '', url);
    } else if (view === 'blog-post' && blogSlug) {
      // For blog posts, include slug in hash
      const url = this.basePath !== '/' ? `${this.basePath}#blog-${blogSlug}` : `#blog-${blogSlug}`;
      window.history.pushState({ view, blogSlug }, '', url);
    } else {
      // For other views, use hash
      const url = this.basePath !== '/' ? `${this.basePath}#${view}` : `#${view}`;
      window.history.pushState({ view }, '', url);
    }
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
      'blog-post': 'Blog',
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

