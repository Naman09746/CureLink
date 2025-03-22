document.addEventListener('DOMContentLoaded', function() {
    // Nav item click
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Close chat popup
    const chatClose = document.querySelector('.chat-actions');
    const chatPopup = document.querySelector('.chat-popup');
    chatClose.addEventListener('click', function() {
        chatPopup.style.display = 'none';
    });
    
    // Pagination click
    const pageItems = document.querySelectorAll('.page-item');
    pageItems.forEach(item => {
        item.addEventListener('click', function() {
            pageItems.forEach(page => page.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Generate random data for the bar chart
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        const randomHeight = Math.floor(Math.random() * 100) + 30;
        bar.style.height = randomHeight + 'px';
    });
});