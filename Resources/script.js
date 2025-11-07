document.addEventListener('DOMContentLoaded', function () {
    const collapseBtn = document.getElementById('collapse-btn');
    const sidebar = document.querySelector('.sidebar');

    collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    const menuLinks = document.querySelectorAll('.menu a');

    // Menu navigation
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            console.log(`Navigating to ${link.textContent.trim()}`);
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
