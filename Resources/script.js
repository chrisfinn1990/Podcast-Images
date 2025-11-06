document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const modeLinks = document.querySelectorAll('.dropdown-content a[data-mode]');
    const modeContents = document.querySelectorAll('.mode-content');
    const modeButton = document.getElementById('mode-button');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;

            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            tabContents.forEach(content => {
                if (content.id === `${tab}-tab`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // Mode switching
    modeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const mode = link.dataset.mode;

            modeContents.forEach(content => {
                if (content.id === `${mode}-mode`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });

            // Update mode button text
            modeButton.textContent = link.textContent;
        });
    });

    // Close dropdowns when clicking outside
    window.addEventListener('click', function(event) {
        dropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('.dropbtn');
            const content = dropdown.querySelector('.dropdown-content');
            if (!dropdown.contains(event.target)) {
                content.style.display = 'none';
                button.setAttribute('aria-expanded', 'false');
            }
        });
    });

    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropbtn');
        const content = dropdown.querySelector('.dropdown-content');

        dropdown.addEventListener('mouseover', () => {
            content.style.display = 'block';
            button.setAttribute('aria-expanded', 'true');
        });
    });
});