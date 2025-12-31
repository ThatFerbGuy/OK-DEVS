// Loader Management
(function() {
  const loader = document.getElementById('loader');
  
  function hideLoader() {
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => {
        if (loader.parentNode) {
          loader.style.display = 'none';
        }
      }, 500);
    }
  }
  
  // Hide loader when page is fully loaded
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
})();

