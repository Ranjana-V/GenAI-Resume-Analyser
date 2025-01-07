console.log('home.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    const animatedElements = document.querySelectorAll('.section-title, .mission-statement, .services h3, .service-item, .commitment-h3, .commitment-p, .join-us-h3, .join-us-p, .cta-button');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            console.log('Entry:', entry.target, 'Is intersecting:', entry.isIntersecting);
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('section-title') || 
                    entry.target.classList.contains('mission-statement') ||
                    entry.target.classList.contains('commitment-p') ||
                    entry.target.classList.contains('join-us-p') ||
                    entry.target.classList.contains('cta-button')) {
                    entry.target.classList.add('animate-fade-up');
                } else if (entry.target.classList.contains('services h3') ||
                           entry.target.classList.contains('commitment-h3') ||
                           entry.target.classList.contains('join-us-h3')) {
                    entry.target.classList.add('animate-fade-left');
                } else if (entry.target.classList.contains('service-item')) {
                    entry.target.classList.add('animate-fade-right');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px -100px 0px' });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
});