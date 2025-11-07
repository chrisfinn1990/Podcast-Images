document.addEventListener('DOMContentLoaded', function () {
    const collapseBtn = document.getElementById('collapse-btn');
    const sidebar = document.querySelector('.sidebar');

    collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    const menuLinks = document.querySelectorAll('.menu a');
    const hamburgerMenuBtn = document.querySelector('.hamburger-menu');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const modeMenuItems = document.querySelectorAll('.dropdown-menu li[data-view]');

    // Hamburger menu toggle
    hamburgerMenuBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    function setupDropdownClickListener() {
        document.addEventListener('click', (event) => {
            if (!dropdownMenu.contains(event.target) && !hamburgerMenuBtn.contains(event.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
    }
    setupDropdownClickListener();

    const svgMap = {
        'transcript-view': 'autopod_AutoPod Transcript.svg',
        'timeline-view': 'autopod_AutoPod Timeline.svg',
        'generative-options-pt1-view': 'autopod_AutoPod Generative Options pt1.svg',
        'generative-options-pt2-view': 'autopod_AutoPod Generative Options pt2.svg',
    };

    async function loadAndInjectSvg(viewId, svgFilePath) {
        const viewContainer = document.getElementById(viewId);
        if (!viewContainer) {
            console.error(`View container with ID ${viewId} not found.`);
            return;
        }

        try {
            const response = await fetch(svgFilePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const svgContent = await response.text();
            viewContainer.innerHTML = svgContent;
        } catch (error) {
            console.error(`Could not load SVG: ${error}`);
            viewContainer.innerHTML = `<p>Error loading ${svgFilePath}</p>`;
        }
    }

    // Initial load of the active view
    const initialActiveViewId = document.querySelector('.view.active-view').id;
    const initialSvgPath = svgMap[initialActiveViewId];
    if (initialActiveViewId && initialSvgPath) {
        loadAndInjectSvg(initialActiveViewId, initialSvgPath);
    }

    // Menu navigation (sidebar)
    menuLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const viewId = link.dataset.view;
            const views = document.querySelectorAll('.view');
            views.forEach(view => view.classList.remove('active-view'));

            const activeView = document.getElementById(viewId);
            if (activeView) {
                activeView.classList.add('active-view');
                await loadAndInjectSvg(viewId, svgMap[viewId]);
            }
        });
    });

    // Mode submenu navigation (dropdown)
    modeMenuItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            // Deactivate all sidebar menu links
            menuLinks.forEach(l => l.classList.remove('active'));

            const viewId = item.dataset.view;
            const views = document.querySelectorAll('.view');
            views.forEach(view => view.classList.remove('active-view'));

            const activeView = document.getElementById(viewId);
            if (activeView) {
                activeView.classList.add('active-view');
                await loadAndInjectSvg(viewId, svgMap[viewId]);
            }
            dropdownMenu.style.display = 'none'; // Hide dropdown after selection

            // Also activate the corresponding sidebar link
            const correspondingSidebarLink = document.querySelector(`.menu a[data-view="${viewId}"]`);
            if (correspondingSidebarLink) {
                menuLinks.forEach(l => l.classList.remove('active'));
                correspondingSidebarLink.classList.add('active');
            }
        });
    });

    const transcriptActions = document.querySelectorAll('.transcript-actions button');
    const transcriptContainer = document.querySelector('.transcript');

    // Transcript actions
    transcriptActions.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.querySelector('img').alt;
            console.log(`${action} clicked`);
            alert(`${action} functionality not implemented yet`);
        });
    });

    // Text highlighting functionality
    if (transcriptContainer) {
        transcriptContainer.addEventListener('mouseup', (event) => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
                const range = selection.getRangeAt(0);
                const selectedText = range.toString();
                const parentElement = range.commonAncestorContainer.parentElement;

                if (parentElement.closest('.transcript-item')) {
                    const transcriptItems = document.querySelectorAll('.transcript-item');
                    transcriptItems.forEach(item => item.classList.remove('highlight'));
                    
                    const surroundingItem = parentElement.closest('.transcript-item');
                    if(surroundingItem) {
                        surroundingItem.classList.add('highlight');
                    }
                }
                selection.removeAllRanges();
            }
        });
    }
});
