const Common = (() => {
    let cursor = null;
    let currentProjectImages = [];
    let currentImageIndex = 0;

    function initCursor() {
        cursor = document.querySelector('.custom-cursor');
        document.addEventListener('mousemove', (e) => {
            if (cursor) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }
        });
    }

    function hookCursorEvents() {
        document.querySelectorAll('.project-card, .nav-link, .dropdown-link, .gallery-item').forEach(el => {
            el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hover'));
        });
    }

    function initMobileMenu() {
        const toggle = document.getElementById('nav-toggle');
        const nav = document.querySelector('.nav-list');
        const links = document.querySelectorAll('.nav-link');

        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                nav.classList.toggle('active');
            });

            links.forEach(link => {
                link.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    nav.classList.remove('active');
                });
            });
        }
    }

    function getDirectImageUrl(url) {
        if (!url) return 'assets/portfolio/living_room.png';
        url = url.trim().replace(/^"|"$/g, '');

        if (url.includes('drive.google.com')) {
            const idMatch = url.match(/\/d\/([^/&?]+)/) || url.match(/id=([^&]+)/);
            if (idMatch && idMatch[1]) {
                return `https://lh3.googleusercontent.com/u/0/d/${idMatch[1]}`;
            }
        }

        if (!url.startsWith('http') && !url.startsWith('assets/')) {
            return `assets/portfolio/${url}`;
        }

        return url;
    }

    function parseCSV(str) {
        const result = [];
        let row = [];
        let inQuotes = false;
        let val = '';
        for (let i = 0; i < str.length; i++) {
            let cc = str[i], nc = str[i + 1];
            if (cc === '"' && inQuotes && nc === '"') {
                val += '"';
                i++; // skip next quote
            } else if (cc === '"') {
                inQuotes = !inQuotes;
            } else if (cc === ',' && !inQuotes) {
                row.push(val); val = '';
            } else if ((cc === '\r' || cc === '\n') && !inQuotes) {
                if (cc === '\r' && nc === '\n') i++;
                row.push(val); val = '';
                result.push(row); row = [];
            } else {
                val += cc;
            }
        }
        if (val || row.length) {
            row.push(val);
            result.push(row);
        }
        return result;
    }

    function openGallery(idx, images, title) {
        if (!images || images.length === 0) return;
        currentProjectImages = images;
        currentImageIndex = idx;

        const modal = document.getElementById('project-modal');
        const modalTitle = document.getElementById('modal-title');

        if (modal) {
            modal.style.display = "block";
            if (modalTitle && title) {
                modalTitle.innerText = title;
            }
            updateModalImage();
        }
    }

    function updateModalImage() {
        const modalImg = document.getElementById('modal-img');
        const modalDesc = document.getElementById('modal-desc');
        const currentIdxEl = document.getElementById('current-img-idx');
        const totalCountEl = document.getElementById('total-img-count');

        const imageData = currentProjectImages[currentImageIndex];
        if (imageData && modalImg) {
            modalImg.src = imageData.url;
            if (modalDesc) modalDesc.innerText = imageData.desc || '';
            if (currentIdxEl) currentIdxEl.innerText = currentImageIndex + 1;
            if (totalCountEl) totalCountEl.innerText = currentProjectImages.length;
        }
    }

    function flipPage(direction) {
        const activeImg = document.getElementById('modal-img');
        if (!activeImg || currentProjectImages.length < 2) return;

        const animationClass = direction === 'next' ? 'flip-right' : 'flip-left';
        activeImg.classList.add(animationClass);

        setTimeout(() => {
            if (direction === 'next') {
                currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
            } else {
                currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
            }
            updateModalImage();
            activeImg.classList.remove(animationClass);
        }, 400);
    }

    function initModalLogic() {
        const nextBtn = document.getElementById('modal-next');
        const prevBtn = document.getElementById('modal-prev');
        if (nextBtn) nextBtn.onclick = () => flipPage('next');
        if (prevBtn) prevBtn.onclick = () => flipPage('prev');

        const closeBtn = document.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.onclick = function () {
                document.getElementById('project-modal').style.display = "none";
            }
        }

        window.addEventListener('click', function (event) {
            const modal = document.getElementById('project-modal');
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }

    return {
        initCursor,
        hookCursorEvents,
        initMobileMenu,
        getDirectImageUrl,
        parseCSV,
        initModalLogic,
        openGallery
    };
})();
