document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.prepend(progressBar);

    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Scroll to top');
    backToTopBtn.innerHTML = '▲';
    document.body.appendChild(backToTopBtn);

    const mainContainer = document.querySelector('.divABCDEF');
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-bar-container';
    searchContainer.innerHTML = `
        <input type="text" class="search-input" placeholder="Search Things that you might need...">
        <div class="search-status-bar"></div>
    `;
    mainContainer.insertBefore(searchContainer, mainContainer.firstChild);

    const searchInput = searchContainer.querySelector('.search-input');
    const statusBar = searchContainer.querySelector('.search-status-bar');
    const allCards = document.querySelectorAll('[class*="divchild"]:not(.divchildA3)');

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const currentProgress = (window.scrollY / totalHeight) * 100;
                progressBar.style.width = `${currentProgress}%`;

                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }

                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let matchCount = 0;

        allCards.forEach((card) => {
            const textContent = card.textContent.toLowerCase();
            if (query === '' || textContent.includes(query)) {
                card.classList.remove('hidden-card');
                matchCount++;
            } else {
                card.classList.add('hidden-card');
            }
        });

        if (query === '') {
            statusBar.innerHTML = '';
        } else if (matchCount === 0) {
            statusBar.innerHTML = 'No matching sections found.';
        } else {
            statusBar.innerHTML = `Showing <mark>${matchCount}</mark> section${matchCount > 1 ? 's' : ''}`;
        }
    });

    const headings = document.querySelectorAll('[class*="divchild"] h2, [class*="divchild"] h3');

    headings.forEach((heading, index) => {
        const card = heading.closest('[class*="divchild"]');
        if (!card) return;

        const paragraphs = card.querySelectorAll('p');
        if (paragraphs.length === 0) return;

        heading.classList.add('accordion-header');

        const contentId = `accordion-content-${index}`;
        heading.setAttribute('role', 'button');
        heading.setAttribute('aria-expanded', 'false');
        heading.setAttribute('aria-controls', contentId);

        const icon = document.createElement('span');
        icon.className = 'toggle-icon';
        icon.textContent = '+';
        icon.setAttribute('aria-hidden', 'true');
        heading.appendChild(icon);

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'accordion-content';
        contentWrapper.id = contentId;
        contentWrapper.setAttribute('role', 'region');

        const contentInner = document.createElement('div');
        contentInner.className = 'accordion-inner';

        const fragment = document.createDocumentFragment();
        paragraphs.forEach(p => fragment.appendChild(p));
        contentInner.appendChild(fragment);

        contentWrapper.appendChild(contentInner);
        card.appendChild(contentWrapper);

        heading.addEventListener('click', () => {
            const isOpen = heading.classList.toggle('is-open');
            contentWrapper.classList.toggle('is-open', isOpen);
            heading.setAttribute('aria-expanded', isOpen);
        });
    });

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '20px 0px -20px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.divcontainerABC, .divcontainerDEF, [class*="divchild"]:not(.divchildA3)');
    animatedElements.forEach(el => observer.observe(el));
});