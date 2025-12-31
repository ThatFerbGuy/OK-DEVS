// Static data for projects, solutions, and milestones

const projectsData = []; // Will load dynamically or via API if needed

const solutionsData = []; // Will load dynamically or via API if needed

// Fetch and parse milestone data from milestones.html
async function fetchMilestonesData() {
  try {
    const response = await fetch('milestones.html');
    if (!response.ok) throw new Error('Failed to fetch milestones.html');
    const html = await response.text();

    // Create a DOM parser if not in Node (assume browser)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find all milestone sections with <h2>{year}</h2>
    const milestoneSections = Array.from(doc.querySelectorAll('section.card h2'))
      .filter(h2 => h2.textContent.match(/^\d{4}$/))
      .map(h2 => h2.parentElement);

    // Parse data
    let id = 1;
    const out = [];
    for (const section of milestoneSections) {
      const year = section.querySelector('h2').textContent.trim();
      const grid = section.querySelector('.grid-2');
      if (!grid) continue;
      const items = grid.querySelectorAll('div');
      for (const el of items) {
        const dateEl = el.querySelector('h3');
        const descEl = el.querySelector('p');
        if (!dateEl || !descEl) continue;
        out.push({
          id: id++,
          date: dateEl.textContent.trim() + ' ' + year,
          title: '', // Optional: use date as title or add logic for title if needed
          description: descEl.textContent.trim(),
          media: '' // Could extract media here if present
        });
      }
    }
    return out;
  } catch (e) {
    console.error('Error fetching milestones:', e);
    return [];
  }
}

// milestonesData will be populated asynchronously if used in SPA context
let milestonesData = [];

// Optionally trigger loading on import if needed
fetchMilestonesData().then(data => {
  milestonesData = data;
  // Uncomment the next line if you want to expose milestonesData globally upon fetch
  // window.milestonesData = data;
});

// Export for use in other modules if running in node/js modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projectsData, solutionsData, milestonesData, fetchMilestonesData };
}

