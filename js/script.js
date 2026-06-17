document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll effect for header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'var(--bg-header-scrolled)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
        } else {
            header.style.background = 'var(--bg-header)';
            header.style.boxShadow = 'none';
        }
    });

    // Subtly parallax the floating image on mousemove
    const showcase = document.querySelector('.pixel-art-showcase');
    const floatingImg = document.querySelector('.floating-img');
    
    if (showcase && floatingImg) {
        showcase.addEventListener('mousemove', (e) => {
            const rect = showcase.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / 15;
            const deltaY = (y - centerY) / 15;
            
            floatingImg.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        showcase.addEventListener('mouseleave', () => {
            floatingImg.style.transform = 'translate(0px, 0px)';
        });
    }

    // --- THEME TOGGLE LOGIC ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('.theme-icon');
    const themeLogos = document.querySelectorAll('.theme-logo');
    
    const LOGO_DARK = 'Images/Logo OpenPixel Lab.png';
    const LOGO_LIGHT = 'Images/Logo OpenPixel Lab clear.png';

    // Sync button state with stored theme on load
    const savedTheme = localStorage.getItem('opl-theme');
    if (savedTheme === 'dark') {
        themeIcon.textContent = '☀️';
        themeToggleBtn.classList.add('theme-sun');
        themeToggleBtn.classList.remove('theme-moon');
        themeLogos.forEach(img => { img.src = LOGO_DARK; });
    }

    function switchTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const newTheme = isDark ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('opl-theme', newTheme);

        if (newTheme === 'light') {
            themeIcon.textContent = '🌙';
            themeToggleBtn.classList.add('theme-moon');
            themeToggleBtn.classList.remove('theme-sun');
        } else {
            themeIcon.textContent = '☀️';
            themeToggleBtn.classList.add('theme-sun');
            themeToggleBtn.classList.remove('theme-moon');
        }

        themeLogos.forEach(img => {
            img.src = newTheme === 'light' ? LOGO_LIGHT : LOGO_DARK;
        });
    }

    themeToggleBtn.addEventListener('click', (event) => {
        // Fallback for browsers that don't support View Transitions API
        if (!document.startViewTransition) {
            switchTheme();
            return;
        }
        
        // Start the transition
        const transition = document.startViewTransition(() => {
            switchTheme();
        });

        // Add the custom sweep/wipe animation directionally
        transition.ready.then(() => {
            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
            
            // If switching to dark, sweep left to right. If to light, sweep right to left.
            const clipPathStart = isDark 
                ? 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' 
                : 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)';

            document.documentElement.animate(
                {
                    clipPath: [
                        clipPathStart,
                        'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                    ]
                },
                {
                    duration: 600,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    pseudoElement: '::view-transition-new(root)'
                }
            );
        });
    });

    // --- i18n LOGIC (Multilingual) ---
    const translations = {
        fr: {
            nav_home: "Accueil",
            nav_wiki: "Wiki",
            nav_tools: "Tools",
            nav_mods: "Mods",
            nav_partners: "Partenaires",
            nav_join: "Rejoindre la commu",
            hero_btn_wiki: "Explorer le Wiki",
            hero_btn_contribution: "Contribuer",
            badge_beta: "BÊTA PUBLIQUE",
            hero_title: "L'Encyclopédie <br><span class=\"highlight\">Open-Source</span> du Modding rétro",
            hero_subtitle: "OpenPixel Lab vous donne accès à une bibliothèque intégrale du Modding Rétro-Gaming. Parcourez notre wiki participatif pour découvrir une autre façon de vivre le retrogaming, où prendre soin de ses consoles devient aussi passionnant que d'y jouer.",
            btn_explore: "Explorer le Wiki ➔",
            btn_contribute: "Contribuer",
            section_tools_title: "Un outil complet",
            card_3d_title: "Configurateur 3D",
            card_3d_desc: "Utilisez notre Configurateur 3D, une interface visuelle innovante qui donne instantanément vie à vos idées de personnalisation.",
            card_3d_btn: "Lancer l'outil ➔",
            card_partners_title: "Partenaires",
            card_partners_desc: "Une sélection de Partenaires Professionnels et Fiables pour confier vos projets de Modding, de Réparation, ou l'achat de jeux rétro certifiés.",
            card_partners_btn: "Voir la liste ➔",
            card_mods_title: "Mods",
            card_mods_desc: "Parcourez un répertoire clair et détaillé regroupant tous les mods existants, minutieusement classés pour chaque console rétro.",
            card_mods_btn: "Parcourir les mods ➔",
            banner_title: "Construit par la communauté. Pour la communauté.",
            banner_desc: "OpenPixel Lab appartient à sa communauté. L'intégralité des tutoriels, mods et outils sont en open-source : pensés et partagés par des passionnés, pour des passionnés.",
            banner_btn: "Rejoindre le Discord",
            footer_brand_desc: "Le wiki de référence pour le modding retrogaming.",
            footer_brand_credit: "Créé avec passion par Doctor L.",
            footer_res_title: "Ressources",
            footer_proj_title: "Projet",
            footer_about: "À propos",
            footer_donate: "Faire un don",
            footer_copyright: "© 2026 OpenPixel Lab. Wiki open-source.",
            wiki_title: "Wiki <span class=\"highlight\">Communautaire</span>",
            wiki_subtitle: "Parcourez notre encyclopédie collaborative pour découvrir l'ensemble des mods et améliorations disponibles pour vos consoles préférées.",
            wiki_search_placeholder: "Rechercher une console, un mod...",
            wiki_search_btn: "Rechercher",
            cat_portable: "Consoles Portables",
            cat_home: "Consoles de salon",
            partners_title: "Nos <span class=\"highlight\">Partenaires</span>",
            partners_subtitle: "Une sélection rigoureuse d'experts et de services de confiance pour accompagner vos projets retrogaming.",
            partners_cat_modders: "Moddeurs Professionnels",
            partners_cat_games: "Boutiques",
            partners_cat_apps: "Applications",
            partners_cat_modsmakers: "Mods Makers",
            tools_title: "Nos <span class=\"highlight\">Outils</span>",
            tools_subtitle: "Une suite d'outils innovants conçus pour matérialiser vos concepts et repousser les limites de la personnalisation rétro.",
            tool_config_title: "Configurateur 3D",
            tool_config_desc: "Plongez dans l'atelier virtuel d'OpenPixel Lab. Un configurateur 3D temps réel pour expérimenter, personnaliser et perfectionner le look de vos projets de modding.",
            tool_config_btn: "Lancer le configurateur",
            tool_comparator_title: "Comparateur de Customs",
            tool_comparator_desc: "Choisissez vos mods, comparez jusqu'à 4 configurations côte à côte et découvrez les points forts, les compromis et le meilleur setup pour vous.",
            tool_comparator_btn: "Lancer le comparateur",
            contribution_title: "Contribuer à <span class=\"highlight\">l'aventure</span>",
            contribution_subtitle: "OpenPixel Lab est un projet communautaire. Votre aide est précieuse pour faire grandir cette base de connaissances.",
            contrib_wiki_title: "Aider au Wiki",
            contrib_wiki_desc: "Vous avez des connaissances en modding ? Partagez vos astuces, tutoriels et photos pour aider la communauté.",
            contrib_wiki_btn: "Rejoindre le Discord",
            contrib_donation_title: "Faire un don",
            contrib_donation_desc: "Soutenez les coûts d'hébergement et le développement du site. Chaque geste compte pour maintenir le projet en vie.",
            contrib_donation_btn: "Soutenir sur Ko-fi",
            about_title: "L'Héritage d'une <span class=\"highlight\">Passion</span>",
            about_subtitle: "Découvrez l'histoire derrière OpenPixel Lab et la vision de son créateur.",
            about_story_title: "Du Professionnalisme au Partage Libre",
            about_story_p1: "OpenPixel Lab est né d'un parcours passionné dédié à l'art du modding. Je suis <strong>Doctor L</strong>, ancien moddeur professionnel. Pendant 18 mois, mon quotidien a été de transformer des consoles oubliées en véritables pièces d’exception, alliant précision et créativité au service de mes clients.",
            about_story_p2: "Au fil du temps, j'ai compris que le plus grand défi d'un projet de personnalisation n'était pas seulement la technique, mais la vision. C'est pour répondre à ce besoin que j'ai développé des outils exclusifs comme le <strong>Configurateur 3D</strong> — une interface pensée à l'origine pour offrir à mes clients une immersion totale et une prévisualisation parfaite avant la moindre commande.",
            about_story_p3: "Aujourd’hui, une page se tourne avec la clôture de mon entreprise, mais ma flamme pour le modding et le rétro-gaming reste intacte. J'ai choisi de ne pas laisser ce savoir dormir dans des archives privées. Ma nouvelle mission ? <strong>Transmettre.</strong>",
            about_story_p4: "OpenPixel Lab est le fruit de cette volonté de partage. J'ai décidé d'ouvrir un atelier virtuel communautaire et de libérer mes outils au service de tous. C'est un espace dédié à l'échange : que vous soyez ici pour votre premier mod ou pour votre centième, j'espère que ces ressources vous seront utiles pour faire grandir vos projets.",
            about_story_footer: "Bienvenue dans mon ancien atelier, devenu aujourd'hui le vôtre."
        },
        en: {
            nav_home: "Home",
            nav_wiki: "Wiki",
            nav_tools: "Tools",
            nav_mods: "Mods",
            nav_partners: "Partners",
            nav_join: "Join the Community",
            hero_btn_wiki: "Explore the Wiki",
            hero_btn_contribution: "Contribute",
            badge_beta: "PUBLIC BETA",
            hero_title: "The <span class=\"highlight\">Open-Source</span> Retro Modding Encyclopedia",
            hero_subtitle: "OpenPixel Lab gives you access to a comprehensive Retro-Gaming Modding library. Browse our community wiki to discover another way to experience retrogaming, where taking care of your consoles becomes as exciting as playing them.",
            btn_explore: "Explore the Wiki ➔",
            btn_contribute: "Contribute",
            section_tools_title: "A complete toolset",
            card_3d_title: "3D Configurator",
            card_3d_desc: "Use our 3D Configurator, an innovative visual interface that instantly brings your customization ideas to life.",
            card_3d_btn: "Launch tool ➔",
            card_partners_title: "Partners",
            card_partners_desc: "A selection of Professional and Reliable Partners to trust with your Modding projects, Repairs, or certified retro game purchases.",
            card_partners_btn: "View list ➔",
            card_mods_title: "Mods",
            card_mods_desc: "Browse a clear and detailed directory gathering all existing mods, meticulously categorized for each retro console.",
            card_mods_btn: "Browse mods ➔",
            banner_title: "Built by the community. For the community.",
            banner_desc: "OpenPixel Lab belongs to its community. All tutorials, mods, and tools are open-source: conceived and shared by enthusiasts, for enthusiasts.",
            banner_btn: "Join the Discord",
            footer_brand_desc: "The reference wiki for retrogaming modding.",
            footer_brand_credit: "Created with passion by Doctor L.",
            footer_res_title: "Resources",
            footer_proj_title: "Project",
            footer_about: "About",
            footer_donate: "Donate",
            footer_copyright: "© 2026 OpenPixel Lab. Open-source wiki.",
            wiki_title: "<span class=\"highlight\">Community</span> Wiki",
            wiki_subtitle: "Browse our collaborative encyclopedia to discover all the mods and upgrades available for your favorite consoles.",
            wiki_search_placeholder: "Search for a console, a mod...",
            wiki_search_btn: "Search",
            cat_portable: "Handheld Consoles",
            cat_home: "Home Consoles",
            partners_title: "Our <span class=\"highlight\">Partners</span>",
            partners_subtitle: "A rigorous selection of trusted experts and services to support your retrogaming projects.",
            partners_cat_modders: "Professional Modders",
            partners_cat_games: "Shops",
            partners_cat_apps: "Applications",
            partners_cat_modsmakers: "Mods Makers",
            tools_title: "Our <span class=\"highlight\">Tools</span>",
            tools_subtitle: "A suite of innovative tools designed to materialize your concepts and push the boundaries of retro customization.",
            tool_config_title: "3D Configurator",
            tool_config_desc: "Dive into the OpenPixel Lab virtual workshop. A real-time 3D configurator to experiment, customize, and perfect the look of your modding projects.",
            tool_config_btn: "Launch Configurator",
            tool_comparator_title: "Customs Comparator",
            tool_comparator_desc: "Choose your mods, compare up to 4 configurations side by side and discover the strengths, trade-offs, and the best setup for you.",
            tool_comparator_btn: "Launch the Comparator",
            contribution_title: "Contribute to the <span class=\"highlight\">adventure</span>",
            contribution_subtitle: "OpenPixel Lab is a community project. Your help is precious to grow this knowledge base.",
            contrib_wiki_title: "Help the Wiki",
            contrib_wiki_desc: "Do you have modding knowledge? Share your tips, tutorials, and photos to help the community.",
            contrib_wiki_btn: "Join the Discord",
            contrib_donation_title: "Make a Donation",
            contrib_donation_desc: "Support hosting costs and site development. Every gesture counts to keep the project alive.",
            contrib_donation_btn: "Support on Ko-fi",
            about_title: "The Legacy of a <span class=\"highlight\">Passion</span>",
            about_subtitle: "Discover the story behind OpenPixel Lab and its creator's vision.",
            about_story_title: "From Professionalism to Open Sharing",
            about_story_p1: "OpenPixel Lab was born from a passionate journey dedicated to the art of modding. I am <strong>Doctor L</strong>, a former professional modder. For 18 months, my daily life involved transforming forgotten consoles into truly exceptional pieces, combining precision and creativity for my clients.",
            about_story_p2: "Over time, I realized that the greatest challenge of a customization project was not just the technique, but the vision. To meet this need, I developed exclusive tools like the <strong>3D Configurator</strong> — an interface originally designed to offer my clients total immersion and perfect preview before any order.",
            about_story_p3: "Today, a chapter closes with the end of my business, but my flame for modding and retro-gaming remains intact. I chose not to let this knowledge sleep in private archives. My new mission? <strong>To pass it on.</strong>",
            about_story_p4: "OpenPixel Lab is the result of this desire to share. I decided to open a community virtual workshop and release my tools to everyone. It's a space dedicated to exchange: whether you're here for your first mod or your hundredth, I hope these resources will be useful for your projects.",
            about_story_footer: "Welcome to my former workshop, now yours."
        }
    };

    let currentLang = localStorage.getItem('lang') || 'fr';
    const langToggleBtn = document.getElementById('lang-toggle');
    const langIcon = langToggleBtn ? langToggleBtn.querySelector('.lang-icon') : null;

    function applyTranslations(lang) {
        document.documentElement.lang = lang;
        const dict = translations[lang];
        if (!dict) return;
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                // If the translation contains HTML (like <br>) or entities (like &copy;), use innerHTML
                if (dict[key].includes('<') || dict[key].includes('&')) {
                    el.innerHTML = dict[key];
                } else {
                    el.textContent = dict[key];
                }
            }
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) {
                el.placeholder = dict[key];
            }
        });
        
        if (langIcon) {
            langIcon.textContent = lang === 'fr' ? 'FR' : 'EN';
        }
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'fr' ? 'en' : 'fr';
            localStorage.setItem('lang', currentLang);
            applyTranslations(currentLang);
        });
        
        // Initial application on page load
        applyTranslations(currentLang);
    }

    // --- MOBILE MENU LOGIC ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navLinksContainer.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinksContainer.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- ACCORDION LOGIC ---
    const accordions = document.querySelectorAll('.accordion-header');
    
    accordions.forEach(acc => {
        acc.addEventListener('click', function(e) {
            e.preventDefault();
            const item = this.parentElement;
            const content = this.nextElementSibling;
            
            if (!content) return;

            // Toggle active class on the accordion item
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                // Open
                content.style.maxHeight = content.scrollHeight + "px";
                
                // Update parents up the tree if nested
                let parent = item.parentElement.closest('.accordion-content');
                while (parent) {
                    parent.style.maxHeight = parent.scrollHeight + content.scrollHeight + "px";
                    parent = parent.parentElement.closest('.accordion-content');
                }
            } else {
                // Close
                const oldHeight = content.scrollHeight;
                content.style.maxHeight = null;
                
                // Update parents up the tree if nested
                let parent = item.parentElement.closest('.accordion-content');
                while (parent) {
                    parent.style.maxHeight = (parent.scrollHeight - oldHeight) + "px";
                    parent = parent.parentElement.closest('.accordion-content');
                }
            }
        });
    });
});
