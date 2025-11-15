document.addEventListener('DOMContentLoaded', function () {
    const collapseBtn = document.getElementById('collapse-btn');
    const sidebar = document.querySelector('.sidebar');
    let isSidebarMinimized = false; // Declare and initialize the state variable

    // Initial setup for sidebar, tabs, and panels
    const mainContent = document.querySelector('.main-content');

    function updateSidebarState() {
        const collapseBtnImg = collapseBtn.querySelector('img');
        if (isSidebarMinimized) {
            sidebar.classList.add('minimized');
            mainContent.style.left = '20px'; // Adjust main content position
            mainContent.style.width = 'calc(100% - 20px)'; // Adjust main content width
            if (collapseBtnImg) {
                collapseBtnImg.src = 'Resources/expand.png';
                collapseBtnImg.alt = 'Expand';
            }
        } else {
            sidebar.classList.remove('minimized');
            mainContent.style.left = '250px'; // Adjust main content position
            mainContent.style.width = 'calc(100% - 250px)'; // Adjust main content width
            if (collapseBtnImg) {
                collapseBtnImg.src = 'Resources/collapse_filler.svg';
                collapseBtnImg.alt = 'Collapse';
            }
        }
    }

    // Set initial state
    updateSidebarState();

    collapseBtn.addEventListener('click', () => {
        isSidebarMinimized = !isSidebarMinimized; // Toggle the state
        updateSidebarState();
    });

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

    // Mode submenu navigation (dropdown)
    for (const item of modeMenuItems) {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            const viewId = item.dataset.view;
            const views = document.querySelectorAll('.view');
            for (const view of views) {
                view.classList.remove('active-view');
            }

            const activeView = document.getElementById(viewId);
            if (activeView) {
                activeView.classList.add('active-view');
            }
            dropdownMenu.style.display = 'none'; // Hide dropdown after selection
        });
    }

    // Sidebar tab navigation
    const sidebarTabs = document.querySelectorAll('.sidebar-tabs a');
    const sidebarPanels = document.querySelectorAll('.sidebar-panel');

    for (const tab of sidebarTabs) {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            for (const t of sidebarTabs) {
                t.classList.remove('active');
            }
            tab.classList.add('active');

            const panelId = tab.dataset.panel; // This will now correctly be 'sidebar-panel-audio' for the audio tab
            for (const panel of sidebarPanels) {
                panel.classList.remove('active-panel');
            }
            document.getElementById(panelId).classList.add('active-panel');
        });
    }

    const transcriptActions = document.querySelectorAll('.transcript-actions button');
    const transcriptContainer = document.querySelector('.transcript');

    // Transcript actions
    for (const button of transcriptActions) {
        button.addEventListener('click', () => {
            const action = button.querySelector('img').alt;
            console.log(`${action} clicked`);
            alert(`${action} functionality not implemented yet`);
        });
    }

    // Text highlighting functionality
    if (transcriptContainer) {
        transcriptContainer.addEventListener('mouseup', (event) => {
            const selection = globalThis.getSelection();
            if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
                const range = selection.getRangeAt(0);
                const parentElement = range.commonAncestorContainer.parentElement;

                if (parentElement.closest('.transcript-item')) {
                    const transcriptItems = document.querySelectorAll('.transcript-item');
                    for (const item of transcriptItems) {
                        item.classList.remove('highlight');
                    }
                    
                    const surroundingItem = parentElement.closest('.transcript-item');
                    if(surroundingItem) {
                        surroundingItem.classList.add('highlight');
                    }
                }
                selection.removeAllRanges();
            }
        });
    }

    // Function to switch view based on URL parameter
    function setViewFromUrl() {
        // Define a whitelist of valid view IDs for security.
        const validViews = [
            'transcript-view',
            'timeline-view',
            'generative-options-pt1-view',
            'generative-options-pt2-view'
        ];
        
        const params = new URLSearchParams(globalThis.location.search);
        const viewId = params.get('view');
        
        if (viewId && validViews.includes(viewId)) {
            const views = document.querySelectorAll('.view');
            for (const view of views) {
                view.classList.remove('active-view');
            }

            const activeView = document.getElementById(viewId);
            if (activeView) {
                activeView.classList.add('active-view');
                console.log(`Successfully switched view to '${viewId}'.`);
            }
        } else if (viewId) {
            // If a viewId is provided but it's not valid, log it.
            console.warn(`Attempted to switch to an invalid view: '${viewId}'. Action blocked.`);
        }
    }

    // Function to enable a debug mode that highlights and logs all clicks
    function initializeClickDebugger() {
        const params = new URLSearchParams(globalThis.location.search);
        if (params.get('debug-clicks') === 'true') {
            console.log('Click Debugger Initialized. Click any element to see its details.');
            document.body.addEventListener('click', (event) => {
                const target = event.target;
                console.log('Clicked Element:', {
                    tagName: target.tagName,
                    id: target.id,
                    className: target.className,
                    element: target
                });

                // Add a temporary highlight class
                target.classList.add('debug-click-highlight');
                setTimeout(() => target.classList.remove('debug-click-highlight'), 500);
            }, true); // Use capture phase to catch all clicks
        }
    }

    // Set initial view based on URL at load time
    setViewFromUrl();
    // Initialize the click debugger if the URL parameter is present
    initializeClickDebugger();
});
