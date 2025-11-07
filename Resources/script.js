document.addEventListener('DOMContentLoaded', function () {
    const collapseBtn = document.getElementById('collapse-btn');
    const sidebar = document.querySelector('.sidebar');
    let isSidebarMinimized = false; // Declare and initialize the state variable

    // Initial setup for sidebar, tabs, and panels
    const sidebarTabContainer = document.querySelector('.sidebar-tabs');
    const sidebarPanelContainer = document.querySelector('.sidebar-panel-container');
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
        'transcript-view': 'autopod_AutoPod Transcript.xml',
        'timeline-view': 'autopod_AutoPod Timeline.xml',
        'generative-options-pt1-view': 'autopod_AutoPod Generative Options pt1.xml',
        'generative-options-pt2-view': 'autopod_AutoPod Generative Options pt2.xml',
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
                if (viewId === 'transcript-view') {
                    setupTranscriptInteractions();
                } else if (viewId === 'timeline-view') {
                    setupTimelineInteractions();
                } else if (viewId === 'generative-options-pt1-view') {
                    setupGenerativeOptionsPt1Interactions();
                } else if (viewId === 'generative-options-pt2-view') {
                    setupGenerativeOptionsPt2Interactions();
                }
            }
        });
    });

    function setupTimelineInteractions() {
        const timelineView = document.getElementById('timeline-view');
        if (!timelineView) return;

        const verticalScrollBeginBtn = timelineView.querySelector('#\\311a1d588699941c1a4245d53c839bc0d');
        const verticalScrollEndBtn = timelineView.querySelector('#dd68a86fa1cd45928ea819533f83d610');
        const verticalScrollGrip = timelineView.querySelector('#\\30bcf1cf21dce4be4866fdfc900a583aa');

        const horizontalScrollBeginBtn = timelineView.querySelector('#e201deba1ce7496ba5026770cff9c3b5');
        const horizontalScrollEndBtn = timelineView.querySelector('#d0e320ee01674173b1622f6994af87ca');
        const horizontalScrollGrip = timelineView.querySelector('#\\39e955a77617f435b9cab4362c1b9b7ca');

        if (verticalScrollBeginBtn) verticalScrollBeginBtn.addEventListener('click', () => console.log('Vertical scroll begin button clicked'));
        if (verticalScrollEndBtn) verticalScrollEndBtn.addEventListener('click', () => console.log('Vertical scroll end button clicked'));
        if (verticalScrollGrip) verticalScrollGrip.addEventListener('mousedown', () => console.log('Vertical scroll grip grabbed'));

        if (horizontalScrollBeginBtn) horizontalScrollBeginBtn.addEventListener('click', () => console.log('Horizontal scroll begin button clicked'));
        if (horizontalScrollEndBtn) horizontalScrollEndBtn.addEventListener('click', () => console.log('Horizontal scroll end button clicked'));
        if (horizontalScrollGrip) horizontalScrollGrip.addEventListener('mousedown', () => console.log('Horizontal scroll grip grabbed'));

        // Tab header interactions
        const tabHeaders = [
            timelineView.querySelector('#g37'),
            timelineView.querySelector('#g43'),
            timelineView.querySelector('#g49'),
        ];

        tabHeaders.forEach(tab => {
            if (tab) {
                tab.addEventListener('click', () => {
                    tabHeaders.forEach(t => t.classList.remove('active-tab-header'));
                    tab.classList.add('active-tab-header');
                    console.log(`Tab header ${tab.id} clicked`);
                });
            }
        });
    }

    function setupTranscriptInteractions() {
        const transcriptView = document.getElementById('transcript-view');
        if (!transcriptView) return;

        const verticalScrollBeginBtn = transcriptView.querySelector('#\\38591b210856443b5bb67333f06f766a1');
        const verticalScrollEndBtn = transcriptView.querySelector('#\\346b6a224fbae4feaa0acd7fa7ce4515f');
        const verticalScrollGrip = transcriptView.querySelector('#\\326af0fce9fed4239a4130cee62ab353b');

        if (verticalScrollBeginBtn) verticalScrollBeginBtn.addEventListener('click', () => console.log('Transcript vertical scroll begin button clicked'));
        if (verticalScrollEndBtn) verticalScrollEndBtn.addEventListener('click', () => console.log('Transcript vertical scroll end button clicked'));
        if (verticalScrollGrip) verticalScrollGrip.addEventListener('mousedown', () => console.log('Transcript vertical scroll grip grabbed'));

        // Tab header interactions
        const tabHeaders = [
            transcriptView.querySelector('#b4b80cf0635647649a016ff7061dd8a9'),
            transcriptView.querySelector('#c8b1d79468504591b480bc373d1a2ec3'),
            transcriptView.querySelector('#c1ab7ad60d1c43be94d35bc425e22367'),
        ];

        tabHeaders.forEach(tab => {
            if (tab) {
                tab.addEventListener('click', () => {
                    tabHeaders.forEach(t => t.classList.remove('active-tab-header'));
                    tab.classList.add('active-tab-header');
                    console.log(`Transcript tab header ${tab.id} clicked`);
                });
            }
        });

        // Toolbar button interaction
        const toolbarButton = transcriptView.querySelector('#ff5d24d421914f658818c409dff43f61');
        if (toolbarButton) {
            toolbarButton.addEventListener('click', () => {
                console.log('Transcript toolbar button clicked');
                alert('Transcript toolbar button functionality not implemented yet');
            });
        }
    }

    function setupGenerativeOptionsPt1Interactions() {
        // TODO: Implement interactions for Generative Options Pt1 view
    }

    function setupGenerativeOptionsPt2Interactions() {
        const generativeOptionsPt2View = document.getElementById('generative-options-pt2-view');
        if (!generativeOptionsPt2View) return;

        // Scrollbar interactions
        const verticalScrollBeginBtn = generativeOptionsPt2View.querySelector('#b92e63da85664210bb574f40d275b4d5');
        const verticalScrollEndBtn = generativeOptionsPt2View.querySelector('#\\389634aa48c7d45ff908546b5190be634');
        const verticalScrollGrip = generativeOptionsPt2View.querySelector('#\\31249d2bc4c954187aa5b5fe06c941850');

        if (verticalScrollBeginBtn) verticalScrollBeginBtn.addEventListener('click', () => console.log('Generative Options Pt2 vertical scroll begin button clicked'));
        if (verticalScrollEndBtn) verticalScrollEndBtn.addEventListener('click', () => console.log('Generative Options Pt2 vertical scroll end button clicked'));
        if (verticalScrollGrip) verticalScrollGrip.addEventListener('mousedown', () => console.log('Generative Options Pt2 vertical scroll grip grabbed'));

        // Tab header interactions
        const tabHeaders = [
            generativeOptionsPt2View.querySelector('#g110'),
            generativeOptionsPt2View.querySelector('#g116'),
            generativeOptionsPt2View.querySelector('#g122'),
        ];

        tabHeaders.forEach(tab => {
            if (tab) {
                tab.addEventListener('click', () => {
                    tabHeaders.forEach(t => t.classList.remove('active-tab-header'));
                    tab.classList.add('active-tab-header');
                    console.log(`Generative Options Pt2 tab header ${tab.id} clicked`);
                });
            }
        });

        // Scaleround (slider) interactions
        const stabilityHandle = generativeOptionsPt2View.querySelector('#c16788af9b984616b5c2df154d2c4c6e');
        const clarityHandle = generativeOptionsPt2View.querySelector('#bf5f86116ed446248becb2c2636c143e');
        const articulationHandle = generativeOptionsPt2View.querySelector('#d52d36924ec34945b2c9469a057d560b');
        const tempoHandle = generativeOptionsPt2View.querySelector('#\\34817649a8bcb411fa4290f812317f4bc');

        if (stabilityHandle) stabilityHandle.addEventListener('mousedown', () => console.log('Stability handle grabbed'));
        if (clarityHandle) clarityHandle.addEventListener('mousedown', () => console.log('Clarity handle grabbed'));
        if (articulationHandle) articulationHandle.addEventListener('mousedown', () => console.log('Articulation handle grabbed'));
        if (tempoHandle) tempoHandle.addEventListener('mousedown', () => console.log('Tempo handle grabbed'));

        // Combo Entry (dropdown) interactions
        const voiceDropdown = generativeOptionsPt2View.querySelector('#cad00df1fb7842e490b26adc355f696c');
        const voiceStyleDropdown = generativeOptionsPt2View.querySelector('#\\358b4c0ffab9b41349f375a4314f22df7');
        const modelDropdown = generativeOptionsPt2View.querySelector('#cb7dacdeeef34b35971ef38cb9f467ea');
        const ambientStyleDropdown = generativeOptionsPt2View.querySelector('#b2e583ea7c1c412f96b9986d15aace92');

        if (voiceDropdown) voiceDropdown.addEventListener('click', () => console.log('Voice dropdown clicked'));
        if (voiceStyleDropdown) voiceStyleDropdown.addEventListener('click', () => console.log('Voice Style dropdown clicked'));
        if (modelDropdown) modelDropdown.addEventListener('click', () => console.log('Model dropdown clicked'));
        if (ambientStyleDropdown) ambientStyleDropdown.addEventListener('click', () => console.log('Ambient Style dropdown clicked'));
    }
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

    // Sidebar tab navigation
    const sidebarTabs = document.querySelectorAll('.sidebar-tabs a');
    const sidebarPanels = document.querySelectorAll('.sidebar-panel');

    sidebarTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const panelId = tab.dataset.panel; // This will now correctly be 'sidebar-panel-audio' for the audio tab
            sidebarPanels.forEach(panel => panel.classList.remove('active-panel'));
            document.getElementById(panelId).classList.add('active-panel');
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
