// Public/js/loadAiData.js
document.addEventListener('DOMContentLoaded', () => {
    // A reference to the AI button
    const aiButton = document.getElementById('aiButton');
    const messageContainer = document.getElementById('messageContainer');
    const contentContainer = document.getElementById('contentContainer');

    // The API endpoint URL
    const apiUrl = 'http://localhost:3001/api/hero_ai_finds/by-hero-name/jimmy%20glass';

    aiButton.addEventListener('click', function(event) {
        event.preventDefault();   // Prevent default link behavior

        contentContainer.innerHTML = '';
        messageContainer.innerHTML = '';

        const originalText = aiButton.textContent;

        // Disable the button
        aiButton.disabled = true;
        aiButton.style.pointerEvents = 'none';

        // Show spinner instead of countdown
        aiButton.innerHTML = '<span class="spinner"></span>';

        // Pause for 3 seconds before fetching
        setTimeout(async () => {
            // Show a loading message
            messageContainer.innerHTML = '<p class="text-gray-500">Loading AI finds...</p>';

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    messageContainer.innerHTML = ''; // Clear loading message
                    data.slice(0, 5).forEach(item => {
                        const contentCard = document.createElement('div');
                        contentCard.className = 'content-card';
                        contentCard.textContent = item.content;
                        contentContainer.appendChild(contentCard);
                    });
                } else {
                    messageContainer.innerHTML = '<p class="text-gray-500">No content found for this hero.</p>';
                }
            } catch (error) {
                console.error('Fetch error:', error);
                messageContainer.innerHTML = `<p class="text-red-500">Failed to load content. Error: ${error.message}</p>`;
            }

            // Reset button back to original state
            aiButton.innerHTML = originalText;
            aiButton.disabled = false;
            aiButton.style.pointerEvents = 'auto';
        }, 3000); // <-- 3 second pause
    });


});


