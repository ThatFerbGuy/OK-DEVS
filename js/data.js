// Static data for projects, solutions, and milestones

const projectsData = [
  {
    id: 1,
    title: 'Project Alpha',
    description: 'A modern web application built with cutting-edge technologies, focusing on user experience and performance.',
    tech: ['React', 'Node.js', 'PostgreSQL'],
    link: '#'
  },
  {
    id: 2,
    title: 'Project Beta',
    description: 'An open-source tool that simplifies complex workflows for developers and designers alike.',
    tech: ['TypeScript', 'Vue', 'MongoDB'],
    link: '#'
  },
  {
    id: 3,
    title: 'Project Gamma',
    description: 'A mobile-first platform designed to connect communities and foster collaboration.',
    tech: ['React Native', 'GraphQL', 'Firebase'],
    link: '#'
  },
  {
    id: 4,
    title: 'Project Delta',
    description: 'An innovative design system that promotes consistency and accelerates development.',
    tech: ['Design Tokens', 'CSS', 'JavaScript'],
    link: '#'
  },
  {
    id: 5,
    title: 'Project Epsilon',
    description: 'A data visualization tool that makes complex information accessible and engaging.',
    tech: ['D3.js', 'Python', 'WebGL'],
    link: '#'
  },
  {
    id: 6,
    title: 'Project Zeta',
    description: 'A developer toolkit that streamlines common tasks and improves productivity.',
    tech: ['CLI', 'Node.js', 'TypeScript'],
    link: '#'
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

const milestonesData = [
  {
    id: 1,
    date: 'January 2025',
    title: 'Website Launch',
    description: 'Launched our new website and rebranded as OK Devs. Reached 1000+ community members.',
    media: 'Placeholder'
  },
  {
    id: 2,
    date: 'February 2025',
    title: 'Project Alpha Release',
    description: 'Released Project Alpha to public beta. Started our first open-source initiative.',
    media: 'Placeholder'
  },
  {
    id: 3,
    date: 'Q4 2024',
    title: 'Major Projects Completed',
    description: 'Completed three major projects. Expanded our team with talented new members.',
    media: 'Placeholder'
  },
  {
    id: 4,
    date: 'Q3 2024',
    title: 'Community Event',
    description: 'Hosted our first community event. Published 10+ technical blog posts.',
    media: 'Placeholder'
  },
  {
    id: 5,
    date: 'Q2 2024',
    title: 'Design System Launch',
    description: 'Reached 500 active contributors. Launched our design system.',
    media: 'Placeholder'
  },
  {
    id: 6,
    date: 'Q1 2024',
    title: 'OK Devs Founded',
    description: 'Formed OK Devs collective. Completed our first collaborative project.',
    media: 'Placeholder'
  }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projectsData, solutionsData, milestonesData };
}

