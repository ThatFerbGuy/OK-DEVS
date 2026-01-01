// Static data for projects, solutions, milestones, and blogs

const projectsData = [
  {
    id: 1,
    title: 'ElderEase',
    description: 'A comprehensive healthcare management App for elderly care facilities.',
    tech: ['Python', 'KivyMD', 'SQLite'],
    demoLink: 'https://thatferbguy.github.io/ElderEase/',
    githubLink: 'https://github.com/ThatFerbGuy/ElderEase/'
  },
  {
    id: 2,
    title: 'TailTrovez',
    description: 'An e-commerce platform for pet supplies and accessories.',
    tech: ['HTML', 'CSS', 'JS', 'Node.js', 'Firebase'],
    demoLink: 'https://thatferbguy.github.io/TailTrovez/',
    githubLink: 'https://github.com/ThatFerbGuy/TailTrovez/'
  },
  {
    id: 3,
    title: 'FoodieConnect',
    description: 'A social platform for food enthusiasts to share recipes and connect.',
    tech: ['PHP', 'HTML', 'CSS', 'JS', 'MySQL'],
    demoLink: 'https://thatferbguy.github.io/FoodieConnect',
    githubLink: 'https://github.com/ThatFerbGuy/FoodieConnect/'
  },
  {
    id: 4,
    title: 'Personal Profile',
    description: 'A personal profile/Resume showcasing skills and projects of founder',
    tech: ['HTML', 'CSS', 'JS'],
    demoLink: 'https://thatferbguy.github.io/ThatFerbGuy/',
    githubLink: 'https://github.com/ThatFerbGuy/ThatFerbGuy/'
  }
];

const solutionsData = [
  {
    id: 1,
    title: 'Web Development Solutions',
    description: 'Comprehensive web development services from frontend to backend, ensuring scalable and maintainable code.',
    tech: ['Full Stack', 'Cloud', 'DevOps'],
    link: '#'
  },
  {
    id: 2,
    title: 'API Architecture',
    description: 'Design and implementation of robust API solutions that scale with your business needs.',
    tech: ['REST', 'GraphQL', 'Microservices'],
    link: '#'
  },
  {
    id: 3,
    title: 'Performance Optimization',
    description: 'Expert analysis and optimization to improve application speed, efficiency, and user experience.',
    tech: ['Performance', 'Caching', 'CDN'],
    link: '#'
  },
  {
    id: 4,
    title: 'Security Solutions',
    description: 'Comprehensive security audits and implementations to protect your applications and data.',
    tech: ['Security', 'Encryption', 'Auth'],
    link: '#'
  }
];

// Fetch and parse milestones from milestones.html
async function fetchMilestonesData(basePath = '') {
  try {
    const milestonesPath = basePath ? `${basePath}milestones.html` : 'milestones.html';
    const response = await fetch(milestonesPath);
    if (!response.ok) {
      throw new Error('Failed to fetch milestones.html');
    }
    const html = await response.text();
    
    // Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find all milestone sections (sections with class "card" that contain a year as h2)
    const sections = Array.from(doc.querySelectorAll('section.card'));
    const milestones = [];
    let id = 1;
    let imageIndex = 1; // For assigning ms.png, ms2.png, etc.
    
    // Process sections in order (newest year first: 2026, 2025, 2024)
    sections.forEach(section => {
      const yearEl = section.querySelector('h2');
      if (!yearEl) return;
      
      const year = yearEl.textContent.trim();
      // Skip "Looking Ahead" section
      if (year === 'Looking Ahead') return;
      
      // Find all milestone items in the grid
      const grid = section.querySelector('.grid');
      if (!grid) return;
      
      // Process items - reverse them so newest within each year appears first
      const items = Array.from(grid.querySelectorAll('div')).reverse();
      items.forEach(item => {
        const dateEl = item.querySelector('h3');
        const descEl = item.querySelector('p');
        
        if (dateEl && descEl) {
          const date = dateEl.textContent.trim();
          const description = descEl.textContent.trim();
          
          // Create title from description (first part or use date)
          let title = description.split('.')[0];
          if (title.length > 50) {
            title = title.substring(0, 50) + '...';
          }
          
          // Determine full date
          let fullDate = date;
          if (!date.includes(year)) {
            fullDate = `${date} ${year}`;
          }
          
          milestones.push({
            id: id++,
            date: fullDate,
            title: title,
            description: description,
            image: `ms${imageIndex}.png`
          });
          
          imageIndex++;
        }
      });
    });
    
    // Return milestones in order (newest first - 2026 items, then 2025, then 2024)
    // Sections are already in newest-first order, and items within each year are reversed
    return milestones;
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return [];
  }
}

// Initialize milestones data (will be populated asynchronously)
let milestonesData = [];

// Fetch milestones when data.js loads (will be called by router with base path)
if (typeof window !== 'undefined') {
  // Will be initialized by router with proper base path
  window.fetchMilestonesData = fetchMilestonesData;
}

const blogsData = [
  {
    id: 1,
    slug: 'building-spa-without-frameworks',
    title: 'Building SPAs Without Frameworks',
    date: 'January 20, 2025',
    category: 'Development',
    excerpt: 'Why we chose vanilla JavaScript for our latest project and what we learned along the way.',
    content: `
      <p>Modern web development often defaults to frameworks, but sometimes the best solution is the simplest one. We recently built a single-page application using only vanilla JavaScript, and the experience taught us valuable lessons about performance, maintainability, and developer control.</p>
      
      <p>Without framework overhead, our initial bundle size dropped significantly. The app loads faster, especially on mobile devices. More importantly, we gained a deeper understanding of how the browser actually works.</p>
      
      <p>The History API handles routing elegantly. CSS custom properties make theming straightforward. Intersection Observer manages scroll animations efficiently. These native APIs are powerful enough for most use cases.</p>
      
      <p>Of course, there are trade-offs. We wrote more boilerplate code. State management required careful planning. But for our needs—a fast, focused application—vanilla JavaScript was the right choice.</p>
      
      <p>The takeaway? Don't reach for a framework by default. Understand your requirements first. Sometimes the best tool is the one that's already in your browser.</p>
    `
  },
  {
    id: 2,
    slug: 'minimal-design-maximal-impact',
    title: 'Minimal Design, Maximal Impact',
    date: 'January 15, 2025',
    category: 'Design',
    excerpt: 'How removing elements can make your interface more powerful and user-friendly.',
    content: `
      <p>Good design isn't about adding more—it's about removing everything that doesn't serve a purpose. We've been applying this principle to our recent projects, and the results speak for themselves.</p>
      
      <p>Every pixel should earn its place. Every animation should communicate something. Every color choice should guide the user's attention. When you strip away the unnecessary, what remains is clarity.</p>
      
      <p>Our design process starts with constraints. Limited color palette. Consistent spacing scale. Typography hierarchy. These constraints force creative solutions and prevent visual chaos.</p>
      
      <p>Users appreciate interfaces that get out of their way. They want to accomplish tasks, not admire decorative elements. Minimal design respects the user's time and cognitive load.</p>
      
      <p>But minimal doesn't mean boring. Strategic use of whitespace creates breathing room. Subtle animations provide feedback. Thoughtful typography establishes hierarchy. The magic is in the details.</p>
      
      <p>Next time you're designing, ask yourself: "What can I remove?" You might be surprised by how much better the interface becomes.</p>
    `
  },
  {
    id: 3,
    slug: 'command-palette-pattern',
    title: 'The Command Palette Pattern',
    date: 'January 10, 2025',
    category: 'UX',
    excerpt: 'Why keyboard-first navigation is becoming essential for power users and how to implement it.',
    content: `
      <p>Command palettes are everywhere now—VS Code, Linear, Notion, GitHub. They've become the standard for efficient navigation in complex applications. We've integrated this pattern into our latest project, and users love it.</p>
      
      <p>The concept is simple: press a key (usually Cmd+K or Ctrl+K), type what you want, and go there instantly. No mouse required. No hunting through menus. Just pure speed.</p>
      
      <p>For power users, this is transformative. Tasks that took multiple clicks now happen in seconds. The keyboard becomes the primary interface, and productivity skyrockets.</p>
      
      <p>Implementation is straightforward. A modal overlay, a search input, filtered results, keyboard navigation. The pattern is well-established, so users already know how to use it.</p>
      
      <p>But it's not just for power users. New users discover features they didn't know existed. The search functionality becomes a discovery mechanism. It's navigation and education combined.</p>
      
      <p>If your application has more than a few screens, consider adding a command palette. Your users—especially the power users—will thank you.</p>
    `
  },
  {
    id: 4,
    slug: 'css-variables-theming',
    title: 'CSS Variables for Theming',
    date: 'January 5, 2025',
    category: 'Development',
    excerpt: 'How we built a flexible theme system using CSS custom properties and localStorage.',
    content: `
      <p>Dark mode isn't optional anymore—it's expected. We needed a theming system that was flexible, performant, and easy to maintain. CSS custom properties (variables) turned out to be the perfect solution.</p>
      
      <p>The approach is elegant. Define your color palette as CSS variables in :root. Create a [data-theme="dark"] selector that overrides those variables. Toggle the attribute, and everything updates instantly.</p>
      
      <p>No JavaScript for styling. No class toggling on every element. No flash of wrong theme. Just clean, declarative CSS that does exactly what you need.</p>
      
      <p>We store the user's preference in localStorage, so it persists across sessions. The theme applies immediately on page load, before any JavaScript runs. This prevents the dreaded flash of light mode.</p>
      
      <p>But theming isn't just about dark and light. We can create multiple themes easily. Just add more data attributes and variable sets. The system scales beautifully.</p>
      
      <p>CSS variables also enable dynamic theming. Want to let users customize accent colors? Just update a variable. The entire interface adapts automatically.</p>
      
      <p>If you're building a theme system, start with CSS variables. They're powerful, performant, and perfectly suited for this use case.</p>
    `
  }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projectsData, solutionsData, milestonesData, blogsData, fetchMilestonesData };
}
