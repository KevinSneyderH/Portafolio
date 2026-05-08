// ========================================
// DOM READY
// ========================================
document.addEventListener('DOMContentLoaded', function () {

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const projectFilterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // ========================================
    // TOGGLE THEME
    // ========================================
    function toggleTheme() {

        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
    }

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // ========================================
    // MENU MOBILE
    // ========================================
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ========================================
    // FILTRO PROYECTOS
    // ========================================
    if (projectFilterBtns.length && projectCards.length) {

        projectFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {

                projectFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ========================================
    // ANIMACIÓN SCROLL
    // ========================================
    const animateOnScroll = () => {

        document.querySelectorAll('.skill-card, .project-card, .timeline-item')
            .forEach(el => {

                const pos = el.getBoundingClientRect().top;

                if (pos < window.innerHeight - 100) {
                    el.classList.add('visible');
                }
            });
    };

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

});


// ========================================
// FUNCION FALLBACK IMAGENES
// ========================================
function handleImageError(img) {

    if (document.body.classList.contains('dark-mode')) {
        img.src = 'img/default-project-dark.jpg';
    } else {
        img.src = 'img/default-project-light.jpg';
    }
}


// ========================================
// GITHUB PROJECTS
// ========================================
const projectsContainer = document.getElementById("projects-container");

async function cargarProyectos() {

    try {

        const response = await fetch(
            "https://api.github.com/users/KevinSneyderH/repos"
        );

        let repos = await response.json();

        repos = repos
            .filter(repo => !repo.fork && repo.description)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        projectsContainer.innerHTML = "";

        repos.forEach(repo => {

            let topicsHTML = "";

            if (repo.topics && repo.topics.length > 0) {
                repo.topics.forEach(topic => {
                    topicsHTML += `<span class="tag">${topic}</span>`;
                });
            } else {
                topicsHTML = `<span class="tag">${repo.language || "Proyecto"}</span>`;
            }

            const projectCard = document.createElement("div");

            projectCard.classList.add("project-card");

            projectCard.innerHTML = `
                <div class="project-image">

                    <img 
                        class="project-img"
                        src="img/${repo.name}.jpg"
                        alt="${repo.name}"
                        onerror="handleImageError(this)"
                    >

                    <div class="project-overlay">

                        ${repo.homepage ? `
                            <a href="${repo.homepage}" target="_blank" class="project-link">
                                <i class="fas fa-eye"></i>
                            </a>
                        ` : ""}

                        <a href="${repo.html_url}" target="_blank" class="project-link">
                            <i class="fas fa-code"></i>
                        </a>

                    </div>

                </div>

                <div class="project-info">

                    <h3>${repo.name}</h3>
                    <p class="project-category">${repo.language || "Sin lenguaje"}</p>
                    <p class="project-description">${repo.description}</p>

                    <div class="project-tags">
                        ${topicsHTML}
                    </div>

                    <div class="project-stats">
                        <span>⭐ ${repo.stargazers_count}</span>
                        <span>🍴 ${repo.forks_count}</span>
                    </div>

                </div>
            `;

            projectsContainer.appendChild(projectCard);
        });

    } catch (error) {
        console.error("Error cargando proyectos:", error);

        projectsContainer.innerHTML =
            "<p>Error cargando proyectos de GitHub.</p>";
    }
}

cargarProyectos();


// ========================================
// EMAILJS
// ========================================
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (contactForm) {

    contactForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const submitBtn = contactForm.querySelector("button");

        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";

        formMessage.className = "";
        formMessage.style.display = "none";

        const templateParams = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value
        };

        try {

            await emailjs.send(
                "service_cf4u9as",
                "template_n2p265g",
                templateParams
            );

            formMessage.textContent = "Mensaje enviado correctamente 🚀";
            formMessage.classList.add("success");

            contactForm.reset();

        } catch (error) {

            console.error(error);

            formMessage.textContent = "Error enviando mensaje ❌";
            formMessage.classList.add("error");
        }

        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar Mensaje";
    });
}