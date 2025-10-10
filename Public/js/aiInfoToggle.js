document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleInputButton');
    const inputArea = document.getElementById('customInputArea');

    toggleButton.addEventListener('click', function() {
        // Toggle the display style between 'none' (hidden) and 'block' (visible)
        if (inputArea.style.display === 'none') {
            inputArea.style.display = 'block';
            toggleButton.textContent = 'Hide Input Field'; // Change button text when visible
        } else {
            inputArea.style.display = 'none';
            toggleButton.textContent = 'Challenge the System!'; // Change button text when hidden
        }
    });
});
