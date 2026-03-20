const PortfolioApp = (() => {
    let allProjects = [];

    // ---- Data Fetching & Rendering ----
    async function fetchProjects() {
        try {
            const response = await fetch(CONFIG.SHEETS.PROJECTS);
            const data = await response.text();

            const allRows = Common.parseCSV(data);
            if (allRows.length < 2) return;

            const headers = allRows[0].map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
            const rows = allRows.slice(1);
            const track = document.getElementById('catalog-track');

            if (!track) return;
            track.innerHTML = '';

            allProjects = rows.map(cols => {
                if (!cols || cols.length === 0) return null;

                function getCol(name) {
                    const idx = headers.findIndex(h => h.includes(name.toLowerCase()));
                    return idx > -1 && cols[idx] ? cols[idx].trim().replace(/^"|"$/g, '') : '';
                }

                const titulo = getCol('titulo') || cols[0]?.trim();
                const descricao = getCol('descri') || cols[1]?.trim();
                const valor = getCol('valor') || cols[2]?.trim();
                const sobre = getCol('sobre') || cols[3]?.trim();
                const categoria = getCol('categoria') || cols[4]?.trim();
                const colecao = getCol('cole') || cols[5]?.trim();
                const dimensoes = getCol('dimens') || cols[6]?.trim();
                const artista = getCol('artista') || cols[7]?.trim();
                const mainImgUrl = getCol('url da imagem') || cols[8]?.trim();
                
                const urlImg1 = getCol('url img1') || cols[9]?.trim();
                const descImg1 = getCol('descrição url img1') || cols[10]?.trim();
                const urlImg2 = getCol('url img2') || cols[11]?.trim();
                const descImg2 = getCol('descrição url img2') || cols[12]?.trim();

                const gallery = [];
                if (mainImgUrl) gallery.push({ url: Common.getDirectImageUrl(mainImgUrl), desc: titulo });
                if (urlImg1) gallery.push({ url: Common.getDirectImageUrl(urlImg1), desc: descImg1 || titulo });
                if (urlImg2) gallery.push({ url: Common.getDirectImageUrl(urlImg2), desc: descImg2 || titulo });

                return {
                    titulo, descricao, valor, sobre, categoria, colecao, dimensoes, artista,
                    mainImg: Common.getDirectImageUrl(mainImgUrl),
                    gallery
                };
            }).filter(p => p !== null && p.titulo);

            renderCatalog(allProjects);
        } catch (error) {
            console.error('Erro ao buscar catálogo:', error);
            const track = document.getElementById('catalog-track');
            if (track) track.innerHTML = '<div class="loader">Erro ao carregar catálogo.</div>';
        }
    }

    async function fetchAbout() {
        try {
            const response = await fetch(CONFIG.SHEETS.ABOUT);
            const data = await response.text();

            const allRows = Common.parseCSV(data);
            if (allRows.length < 2) return;

            const headers = allRows[0].map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
            const cols = allRows[1];

            function getCol(name) {
                const idx = headers.indexOf(name.toLowerCase());
                return idx > -1 && cols[idx] ? cols[idx].trim().replace(/^"|"$/g, '') : '';
            }

            const nome = getCol('nome') || (cols[0] ? cols[0].trim().replace(/^"|"$/g, '') : '');
            const slogan = getCol('slogan') || (cols[1] ? cols[1].trim().replace(/^"|"$/g, '') : '');
            const descricaoRaw = getCol('descricao') || (cols[2] ? cols[2].trim().replace(/^"|"$/g, '') : '');
            const imgUrl = getCol('imgurl') || getCol('foto') || (cols[3] ? cols[3].trim().replace(/^"|"$/g, '') : '');

            const urlLogo = getCol('url_logo');
            const textoLogo = getCol('texto_logo');
            const homeTexto = getCol('home_texto');
            const homeSubTexto = getCol('home_sub_texto');
            const urlImgPrincipal = getCol('urlimg_pincipal') || getCol('pincipal') || getCol('principal') || getCol('urlimg') || cols[4] || cols[5];
            console.log('Imagem Home detectada:', urlImgPrincipal);

            const aboutTitle = document.getElementById('about-title');
            const aboutText = document.getElementById('about-text');
            const aboutImg = document.getElementById('about-img');

            if (aboutTitle && nome) {
                aboutTitle.innerText = nome;
            }

            if (aboutText && descricaoRaw) {
                const formattedDesc = descricaoRaw.replace(/\n/g, '<br>');
                aboutText.innerHTML = `<strong>${slogan}</strong><br><br>${formattedDesc}`;
            }

            if (aboutImg && imgUrl) {
                aboutImg.src = Common.getDirectImageUrl(imgUrl);
                aboutImg.alt = nome;
            }

            const heroTitle = document.querySelector('.hero-title');
            const heroDesc = document.querySelector('.hero-description');
            if (heroTitle && homeTexto) heroTitle.innerHTML = homeTexto;
            if (heroDesc && homeSubTexto) heroDesc.innerHTML = homeSubTexto;

            const allLogoImgs = document.querySelectorAll('.logo-img');
            const allLogoTextGroups = document.querySelectorAll('.logo-text-group');
            
            if (urlLogo) {
                const directUrl = Common.getDirectImageUrl(urlLogo);
                allLogoImgs.forEach(img => {
                    img.src = directUrl;
                    img.style.display = 'block';
                });
                if (!textoLogo) {
                    allLogoTextGroups.forEach(group => group.style.display = 'none');
                }
            }
            
            if (textoLogo) {
                allLogoTextGroups.forEach(group => {
                    group.style.display = 'flex';
                    group.innerHTML = `<span class="logo-name" style="font-size: 1.4rem; font-weight: 700;">${textoLogo}</span>`;
                });
                if (!urlLogo) {
                    allLogoImgs.forEach(img => img.style.display = 'none');
                }
            }

            const heroSection = document.getElementById('home');
            if (heroSection && urlImgPrincipal) {
                heroSection.style.backgroundImage = `url('${Common.getDirectImageUrl(urlImgPrincipal)}')`;
                heroSection.style.backgroundSize = 'cover';
                heroSection.style.backgroundPosition = 'center';
            }

        } catch (error) {
            console.error('Erro ao buscar dados do Sobre:', error);
        }
    }

    async function fetchServices() {
        try {
            const response = await fetch(CONFIG.SHEETS.SERVICES_MAIN);
            const data = await response.text();

            const rows = Common.parseCSV(data).slice(1);

            const servicesGrid = document.getElementById('services-grid');
            if (!servicesGrid) return;

            servicesGrid.innerHTML = '';

            rows.forEach((cols, index) => {
                const titulo = cols[0] ? cols[0].trim().replace(/^"|"$/g, '') : '';
                const descricaoRaw = cols[1] ? cols[1].trim().replace(/^"|"$/g, '') : '';
                const saibaMais = cols[2] ? cols[2].trim().replace(/^"|"$/g, '') : '';
                if (!titulo) return;

                const formattedDesc = descricaoRaw.replace(/\n/g, '<br>');
                const number = String(index + 1).padStart(2, '0');

                const serviceCard = document.createElement('div');
                serviceCard.className = 'service-list-item reveal active';
                serviceCard.innerHTML = `
                    <div class="service-number">${number}</div>
                    <div class="service-content-wrapper">
                        <div class="service-text">
                            <h3>${titulo}</h3>
                            <p>${formattedDesc}</p>
                        </div>
                        ${saibaMais ? `<div class="service-link-wrapper"><a href="${saibaMais}" target="_blank" class="btn btn-primary" style="padding: 10px 20px;">Saiba mais &rsaquo;</a></div>` : ''}
                    </div>
                `;
                servicesGrid.appendChild(serviceCard);
            });
        } catch (error) {
            console.error('Erro ao buscar dados de Obras e Estilos:', error);
            const servicesGrid = document.getElementById('services-grid');
            if (servicesGrid) servicesGrid.innerHTML = '<div class="loader">Erro ao carregar Obras e Estilos.</div>';
        }
    }

    async function fetchContact() {
        try {
            const response = await fetch(CONFIG.SHEETS.CONTACT);
            const data = await response.text();

            const allRows = Common.parseCSV(data);
            if (allRows.length < 2) return;

            const headers = allRows[0].map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
            const cols = allRows[1];
            if (!cols) return;

            function getCol(name) {
                const idx = headers.findIndex(h => h.includes(name.toLowerCase()));
                return idx > -1 && cols[idx] ? cols[idx].trim().replace(/^"|"$/g, '') : '';
            }

            const sloganMain = getCol('sloganprincipal') || (cols[0] ? cols[0].trim().replace(/^"|"$/g, '') : '');
            const sloganSub = getCol('slogansecuntario') || getCol('slogansec') || (cols[1] ? cols[1].trim().replace(/^"|"$/g, '') : '');
            const phone = getCol('telefone') || (cols[2] ? cols[2].trim().replace(/^"|"$/g, '') : '');
            const email = getCol('email') || (cols[3] ? cols[3].trim().replace(/^"|"$/g, '') : '');
            const instaUrl = getCol('url_instagran') || getCol('url_instagram') || (cols[4] ? cols[4].trim().replace(/^"|"$/g, '') : '');
            const linktreeUrl = getCol('url_linktree') || (cols[5] ? cols[5].trim().replace(/^"|"$/g, '') : '');
            const facebookUrl = getCol('url_facebook') || (cols[6] ? cols[6].trim().replace(/^"|"$/g, '') : '');
            const footerRights = getCol('rodapédireiros') || getCol('rodape') || (cols[7] ? cols[7].trim().replace(/^"|"$/g, '') : '');
            const address = getCol('endereço') || getCol('endereco') || (cols[8] ? cols[8].trim().replace(/^"|"$/g, '') : '');

            const elSloganMain = document.getElementById('contact-slogan-main');
            const elSloganSub = document.getElementById('contact-slogan-sub');
            const elEmail = document.getElementById('contact-email');
            const elEmailText = document.getElementById('contact-email-text');
            const elPhone = document.getElementById('contact-phone');
            const elPhoneText = document.getElementById('contact-phone-text');
            const elInsta = document.getElementById('contact-instagram');
            const elLinktree = document.getElementById('contact-linktree');
            const elFacebook = document.getElementById('contact-facebook');
            const elFooter = document.getElementById('footer-rights');
            const elAddressContainer = document.getElementById('address-container');
            const elAddress = document.getElementById('contact-address');
            const elAddressText = document.getElementById('contact-address-text');

            if (elSloganMain && sloganMain) elSloganMain.innerText = sloganMain;
            if (elSloganSub && sloganSub) elSloganSub.innerText = sloganSub;

            if (elEmail && email) {
                elEmail.href = `mailto:${email}`;
                if (elEmailText) elEmailText.innerText = email;
            }
            if (elPhone && phone) {
                const sanitizedPhone = phone.replace(/\D/g, '');
                elPhone.href = `https://wa.me/${sanitizedPhone}`;
                if (elPhoneText) elPhoneText.innerText = phone;
            }

            if (elInsta && instaUrl) elInsta.href = instaUrl;
            if (elLinktree && linktreeUrl) elLinktree.href = linktreeUrl;
            if (elFacebook && facebookUrl) elFacebook.href = facebookUrl;

            if (elAddressContainer && elAddress && address) {
                elAddressContainer.style.display = 'block';
                elAddress.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                if (elAddressText) elAddressText.innerText = address;
            }

            if (elFooter && footerRights) {
                const formattedRights = footerRights.includes('©') || footerRights.includes('&copy;')
                    ? footerRights
                    : `&copy; ${footerRights}`;
                elFooter.innerHTML = formattedRights;
            }

        } catch (error) {
            console.error('Erro ao buscar dados de Contato:', error);
        }
    }

    function renderCatalog(projects) {
        const track = document.getElementById('catalog-track');
        if (!track) return;

        const getItemsPerSlide = () => {
            if (window.innerWidth <= 576) return 2; // 1 col, 2 rows
            if (window.innerWidth <= 968) return 4; // 2 cols, 2 rows
            if (window.innerWidth <= 1200) return 6; // 3 cols, 2 rows
            return 8; // 4 cols, 2 rows
        };

        const renderSlides = () => {
            track.innerHTML = '';
            const itemsPerSlide = getItemsPerSlide();
            
            for (let i = 0; i < projects.length; i += itemsPerSlide) {
                const chunk = projects.slice(i, i + itemsPerSlide);
                const slide = document.createElement('div');
                slide.className = 'catalog-slide catalog-grid';
                
                chunk.forEach((project, index) => {
                    const card = document.createElement('div');
                    card.className = 'project-card';
                    card.innerHTML = `
                        <div class="project-img-wrapper" data-index="${i + index}">
                            <img src="${project.mainImg}" alt="${project.titulo}" class="project-img" onerror="this.src='assets/portfolio/living_room.png'">
                        </div>
                        <div class="project-info">
                            <span class="project-label">${project.categoria || 'Catálogo'}</span>
                            <h3 class="project-ambiente" style="font-size: 1.3rem; margin-bottom: 5px;">${project.titulo}</h3>
                            <p class="project-estilo" style="font-size: 0.9rem; margin-bottom: 8px; color: var(--text-muted);">${project.descricao || ''}</p>
                            ${project.valor ? `<h4 class="project-valor" style="font-size: 1.1rem; color: var(--primary-color); margin: 5px 0 10px 0;">R$ ${project.valor}</h4>` : ''}
                            ${project.artista ? `<span class="project-value" style="font-size: 0.85rem;"><strong>Artista:</strong> ${project.artista}</span><br>` : ''}
                            ${project.colecao ? `<span class="project-estilo" style="font-size: 0.85rem;"><strong>Coleção:</strong> ${project.colecao}</span><br>` : ''}
                            ${project.dimensoes ? `<span class="project-estilo" style="font-size: 0.85rem;"><strong>Dimensões:</strong> ${project.dimensoes}</span>` : ''}
                            <button class="btn-share-wpp" style="margin-top: 15px; display: flex; align-items: center; gap: 8px; background: none; border: none; color: var(--primary-color); cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: 0.3s; padding: 0;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                Compartilhar
                            </button>
                        </div>
                    `;
                    slide.appendChild(card);
                    
                    const imgWrapper = card.querySelector('.project-img-wrapper');
                    imgWrapper.addEventListener('click', () => {
                        Common.openGallery(0, project.gallery, project.titulo);
                    });

                    const shareBtn = card.querySelector('.btn-share-wpp');
                    if (shareBtn) {
                        shareBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            let text = `*Catálogo Bem Brasil Regional*\n\n`;
                            text += `*Título:* ${project.titulo}\n`;
                            if (project.valor) text += `*Valor:* R$ ${project.valor}\n`;
                            if (project.categoria) text += `*Categoria:* ${project.categoria}\n`;
                            if (project.artista) text += `*Artista:* ${project.artista}\n`;
                            if (project.colecao) text += `*Coleção:* ${project.colecao}\n`;
                            if (project.dimensoes) text += `*Dimensões:* ${project.dimensoes}\n`;
                            if (project.descricao) text += `\n${project.descricao}\n`;
                            text += `\n\n📷 *Acesse a imagem da obra:*\n${project.mainImg}#.jpg`;
                            
                            const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
                            window.open(waUrl, '_blank');
                        });
                    }
                });
                track.appendChild(slide);
            }
            initCatalogSlider();
        };

        renderSlides();

        window.addEventListener('resize', () => {
            clearTimeout(window.resizeCatalogTimer);
            window.resizeCatalogTimer = setTimeout(renderSlides, 300);
        });

        Common.hookCursorEvents();
    }

    function initCatalogSlider() {
        const track = document.getElementById('catalog-track');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');

        if (!track || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        const slides = track.querySelectorAll('.catalog-slide');
        const totalSlides = slides.length;

        if (totalSlides <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }

        const newNextBtn = nextBtn.cloneNode(true);
        const newPrevBtn = prevBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);

        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        newNextBtn.addEventListener('click', () => {
            if (currentIndex < totalSlides - 1) currentIndex++;
            else currentIndex = 0;
            updateSlider();
        });

        newPrevBtn.addEventListener('click', () => {
            if (currentIndex > 0) currentIndex--;
            else currentIndex = totalSlides - 1;
            updateSlider();
        });
    }

    // ---- Window / Global Events ----
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - 150) {
                reveal.classList.add('active');
            }
        });
    }

    function initScrollEvents() {
        window.addEventListener('scroll', revealOnScroll);

        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (header) {
                if (window.scrollY > 50) header.classList.add('scrolled');
                else header.classList.remove('scrolled');
            }
        });
    }

    // ---- Public API ----
    return {
        init: async function () {
            Common.initCursor();
            Common.initMobileMenu();
            Common.initModalLogic();
            
            try {
                await Promise.all([
                    fetchProjects(),
                    fetchAbout(),
                    fetchServices(),
                    fetchContact()
                ]);

                const globalLoader = document.getElementById('global-loader');
                if (globalLoader) {
                    globalLoader.style.opacity = '0';
                    setTimeout(() => globalLoader.remove(), 600);
                }

                initScrollEvents();
                
                // Trigger initially
                revealOnScroll();
            } catch (error) {
                console.error("Error during app initialization:", error);
                // Ensure loader is removed even if there's an error
                const globalLoader = document.getElementById('global-loader');
                if (globalLoader) {
                    globalLoader.style.opacity = '0';
                    setTimeout(() => globalLoader.remove(), 600);
                }
            }
        }
    };
})();

// Initialize the app on DOM loading
window.addEventListener('DOMContentLoaded', PortfolioApp.init);
