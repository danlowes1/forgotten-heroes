// const aiButton = document.getElementById("aiButton");
// const messageContainer = document.getElementById('messageContainer');
// const contentContainer = document.getElementById('contentContainer');


// const apiUrl = 'http://localhost:3001/api/hero_ai_finds/by-hero-name/jimmy%20glass';



document.addEventListener('DOMContentLoaded', () => {
    // Get references to the HTML elements
    const aiButton = document.getElementById('aiButton');
    const messageContainer = document.getElementById('messageContainer');
    const contentContainer = document.getElementById('contentContainer');

    // The API endpoint URL
    const apiUrl = 'http://localhost:3001/api/hero_ai_finds/by-hero-name/jimmy%20glass';

    // Add a click event listener to the button
    aiButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent the default link behavior

 
        // Clear previous content and messages
        contentContainer.innerHTML = '';
        messageContainer.innerHTML = '';

        // Show a loading message
        messageContainer.innerHTML = '<p class="text-gray-500">Loading AI finds...</p>';
        
        try {
            // Fetch data from the API
            const response = await fetch(apiUrl);
            
            // Check if the response was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            // Check if data is an array and not empty
            if (Array.isArray(data) && data.length > 0) {
                messageContainer.innerHTML = ''; // Clear loading message

                // Iterate through the data and display the 'content' field
                data.slice(0, 5).forEach(item => { // Limit to 5 rows as per prompt
                    const contentCard = document.createElement('div');
                    contentCard.className = 'content-card';
                    contentCard.textContent = item.content;
                    contentContainer.appendChild(contentCard);
                });
            } else {
                messageContainer.innerHTML = '<p class="text-gray-500">No content found for this hero.</p>';
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            messageContainer.innerHTML = `<p class="text-red-500">Failed to load content. Please check the server connection. Error: ${error.message}</p>`;
        }
    });

  
});


function myEventHandlerFunction() {
    console.log('Event handler function has been fired!');
    // Add your original logic here, like making an API call
}