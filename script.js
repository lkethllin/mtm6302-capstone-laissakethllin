// Get the gallery element where the cards will be added
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.getElementById('loadMore');

// Define the number of Pokémon to load each time
const pokemonPerLoad = 20;

// Initial starting point (number of Pokémon already loaded)
let loadedPokemons = 0;

// Array to keep track of caught Pokémon states
const caughtStates = {};

// Function to generate the Pokémon cards
function generatePokemonCards(startIndex, endIndex) {
    // Array to hold the card HTML strings
    let cards = [];

    // Loop to generate cards
    for (let i = startIndex; i < endIndex; i++) {
        const uniqueId = i + 1; // Using i + 1 for IDs

        // Check if the caught state for this Pokémon is already set
        const isChecked = caughtStates[uniqueId] || false;

        cards.push(`
            <div class="card" data-pokemon-id="${uniqueId}">
                <img src="assets/pokemons/bulbasaur.png" class="pokemon-image" alt="">
                <div class="pokeinfo">
                    <div class="poketext">
                        <h4>#00${uniqueId}</h4>
                        <p>Bulbasaur</p>
                    </div>
                    <div>
                        <input type="checkbox" id="caught-checkbox-${uniqueId}" class="caught-checkbox" ${isChecked ? 'checked' : ''}>
                        <img src="assets/pokeball.png" alt="Pokéball" class="pokeball-icon" style="display:${isChecked ? 'block' : 'none'};" id="pokeball-icon-${uniqueId}">
                    </div>
                </div>
            </div>
        `);
    }

    // Insert the cards into the gallery
    gallery.innerHTML += cards.join('');

    // Add event listeners to the newly added checkboxes
    const newCheckboxes = document.querySelectorAll('.caught-checkbox');

    newCheckboxes.forEach((checkbox) => {
        const pokeballIcon = document.getElementById(`pokeball-icon-${checkbox.id.split('-').pop()}`);

        // Set the initial state of the checkbox
        checkbox.addEventListener('change', function() {
            // Update the caught states object
            caughtStates[this.id.split('-').pop()] = this.checked; // Store the state

            if (this.checked) {
                pokeballIcon.style.display = 'block'; // Show the image
            } else {
                pokeballIcon.style.display = 'none'; // Hide the image
            }
        });

        // Initialize the checkbox state and Pokéball visibility
        checkbox.checked = caughtStates[checkbox.id.split('-').pop()] || false;
        pokeballIcon.style.display = checkbox.checked ? 'block' : 'none';
    });
}

// Function to load more Pokémon
function loadMorePokemons() {
    // Calculate the new range of Pokémon to load
    const startIndex = loadedPokemons;
    const endIndex = loadedPokemons + pokemonPerLoad;

    // Generate and add the new Pokémon cards
    generatePokemonCards(startIndex, endIndex);

    // Update the number of Pokémon loaded
    loadedPokemons += pokemonPerLoad;
}

// Initial load of Pokémon
loadMorePokemons();

// Add event listener to the load more button
loadMoreButton.addEventListener('click', loadMorePokemons);


// Get modal, overlay, and close button elements
const modal = document.getElementById("cardPage");
const overlay = document.getElementById("overlay");
const closeButton = document.querySelector('.close'); // Adjust if your class differs

// Show modal and overlay
function openModal() {
    // Scroll to the top of the page
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // for a smooth scrolling effect
    });

    modal.style.display = "flex";
    overlay.classList.add("show-overlay");
}

// Hide modal and overlay
function closeModal() {
    modal.style.display = "none";
    overlay.classList.remove("show-overlay");
}

// Event listener for overlay click to close modal
overlay.addEventListener("click", closeModal);

// Event listener for close button click to close modal
if (closeButton) {
    closeButton.addEventListener("click", closeModal);
}

// Show modal when a Pokémon card is clicked
// Event delegation to handle clicks on any pokemon image within the gallery
gallery.addEventListener('click', (event) => {
    if (event.target.classList.contains('pokemon-image')) {
        openModal();
    }
});



//* Colors for every different pokemon ability

// Pokémon data
const types = [
    { name: 'Flamethrower', type: 'fire' },
    { name: 'Hydro Pump', type: 'water' }
];

const weaknesses = [
    { name: 'Rock', type: 'rock' },
    { name: 'Electric', type: 'electric' }
];

// Function to display abilities and weaknesses
function displayPokemonInfo() {
    const typesContainer = document.getElementById('types');
    const weaknessesContainer = document.getElementById('weaknesses');

    types.forEach(type => {
        const typeElement = document.createElement('div');
        typeElement.className = `type ${type.type}`;
        typeElement.textContent = type.name;
        typesContainer.appendChild(typeElement);
    });

    weaknesses.forEach(weakness => {
        const weaknessElement = document.createElement('div');
        weaknessElement.className = `weakness ${weakness.type}`;
        weaknessElement.textContent = weakness.name;
        weaknessesContainer.appendChild(weaknessElement);
    });
}

// Call function to display info
displayPokemonInfo();
