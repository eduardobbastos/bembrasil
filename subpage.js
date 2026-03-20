const SubpageApp = (() => {
    async function loadSubpageData() {
        const urlParams = new URLSearchParams(window.location.search);
        const pageId = urlParams.get('page') || '1';

        try {
            const response = await fetch(CONFIG.SHEETS.SERVICES_SUBPAGE);
            const data = await response.text();
            
            const rows = Common.parseCSV(data).slice(1);
            if (rows.length === 0) return;
            
            const cols = rows[0];
            
            const tituloPag1 = cols[3] ? cols[3].trim().replace(/^"|"$/g, '') : '';
            const tituloPag2 = cols[11] ? cols[11].trim().replace(/^"|"$/g, '') : '';
            const menu1 = document.getElementById('submenu-pag1');
            const menu2 = document.getElementById('submenu-pag2');
            if (menu1 && tituloPag1) menu1.innerText = tituloPag1;
            if (menu2 && tituloPag2) menu2.innerText = tituloPag2;

            let title, description;
            let photos = [];

            if (pageId === '1') {
                document.title = `${tituloPag1} | cknetto interiores`;
                title = tituloPag1;
                description = cols[4] ? cols[4].trim().replace(/^"|"$/g, '') : '';
                photos.push({ url: cols[5], desc: cols[6] });
                photos.push({ url: cols[7], desc: cols[8] });
                photos.push({ url: cols[9], desc: cols[10] });
            } else {
                document.title = `${tituloPag2} | cknetto interiores`;
                title = tituloPag2;
                description = cols[12] ? cols[12].trim().replace(/^"|"$/g, '') : '';
                photos.push({ url: cols[13], desc: cols[14] });
                photos.push({ url: cols[15], desc: cols[16] });
                photos.push({ url: cols[17], desc: cols[18] });
            }

            renderPage(title, description, photos);

        } catch (error) {
            console.error(error);
            document.getElementById('subpage-content').innerHTML = '<p>Erro ao carregar dados.</p>';
        }
    }

    function renderPage(title, description, photos) {
        const container = document.getElementById('subpage-content');
        const formattedDesc = description ? description.replace(/\n/g, '<br>') : '';
        
        const currentProjectImages = photos.map(photo => ({
            url: photo.url ? Common.getDirectImageUrl(photo.url.trim().replace(/^"|"$/g, '')) : '',
            desc: photo.desc ? photo.desc.trim().replace(/^"|"$/g, '') : ''
        })).filter(photo => photo.url !== '' && photo.url !== 'assets/portfolio/living_room.png');
        
        let galleryHtml = '<div class="gallery-grid">';
        currentProjectImages.forEach((photo, index) => {
            galleryHtml += `
                <div class="gallery-item" data-index="${index}" style="cursor: zoom-in;">
                    <img src="${photo.url}" alt="${photo.desc || title}">
                    ${photo.desc ? `<div class="gallery-desc">${photo.desc}</div>` : ''}
                </div>
            `;
        });
        galleryHtml += '</div>';

        container.innerHTML = `
            <h1 class="hero-title" style="margin-bottom: 30px;"><span>${title}</span></h1>
            <p class="subpage-description">${formattedDesc}</p>
            ${galleryHtml}
        `;

        container.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'), 10);
                Common.openGallery(idx, currentProjectImages, title);
            });
        });

        Common.hookCursorEvents();
    }

    return {
        init: function() {
            Common.initCursor();
            Common.initMobileMenu();
            Common.initModalLogic();
            loadSubpageData();
            Common.hookCursorEvents();
        }
    };
})();

window.addEventListener('DOMContentLoaded', SubpageApp.init);
