const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const targetId = item.getAttribute('data-target');
    const targetPanel = document.getElementById(targetId);

    // Toggle current panel
    const isVisible = targetPanel.style.display === 'block';
    document.querySelectorAll('.nav-panel').forEach(panel => panel.style.display = 'none');
    if (!isVisible) targetPanel.style.display = 'block';

    // Toggle active state of buttons
    navItems.forEach(i => i.classList.remove('active'));
    if (!isVisible) item.classList.add('active');
  });
});