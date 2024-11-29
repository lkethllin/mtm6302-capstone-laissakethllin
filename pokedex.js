const gallery = document.getElementById('gallery');
let caughtStates = loadCaughtStates(); // Load caught Pokémon from localStorage

// Define border colors for Pokémon cards
const borderColors = ['#FEC9C3', '#D1F4DE', '#BCD5EF', '#C9C7EE', '#FCE2BC'];

// Function to fetch Pokémon data
async function fetchPokemonData(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();

        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();

        // Fetch evolution chain
        const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionChainData = await evolutionChainResponse.json();

        return {
            id: data.id,
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1), // Capitalize name
            image: data.sprites.front_default, // Small sprite image
            largeImage: data.sprites.other['official-artwork'].front_default, // Large image for modal
            types: data.types.map(t => t.type.name),
            weaknesses: await fetchWeaknesses(data.types.map(t => t.type.url)),
            height: data.height,
            weight: data.weight,
            abilities: data.abilities.map(a => a.ability.name),
            category: speciesData.genera.find(g => g.language.name === 'en').genus,
            evolution: evolutionChainData.chain
        };
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        return null;
    }
}

// Function to fetch weaknesses based on Pokémon types
async function fetchWeaknesses(typeUrls) {
    const weaknesses = new Set();
    for (const url of typeUrls) {
        const response = await fetch(url);
        const data = await response.json();
        data.damage_relations.double_damage_from.forEach(type => weaknesses.add(type.name));
    }
    return [...weaknesses];
}

// Display caught Pokémon in the gallery
async function displayCaughtPokemon() {
    gallery.innerHTML = ''; // Clear the gallery
    for (const pokemonId of caughtStates) {
        const pokemon = await fetchPokemonData(pokemonId);
        if (!pokemon) continue;

        // Create a card for each Pokémon
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.pokemonId = pokemon.id; // Store Pokémon ID in the card

        // Assign a border color based on the Pokémon ID
        const borderColor = borderColors[(pokemon.id - 1) % borderColors.length];
        card.style.border = `6px solid ${borderColor}`;

        card.innerHTML = `
            <img src="${pokemon.image}" class="pokemon-image" alt="${pokemon.name}">
            <div class="pokeinfo">
                <div class="poketext">
                    <h4>#${pokemon.id.toString().padStart(4, '0')}</h4>
                    <p>${pokemon.name}</p>
                </div>
                <div>
                    <input type="checkbox" id="caught-checkbox-${pokemon.id}" class="caught-checkbox" checked>
                </div>
            </div>
        `;

        gallery.appendChild(card);
    }

    addCheckboxListeners(); // Add event listeners to handle unchecking Pokémon
}

// Load caught Pokémon states from localStorage
function loadCaughtStates() {
    const storedPokemonIds = localStorage.getItem('caughtPokemon');
    return storedPokemonIds ? JSON.parse(storedPokemonIds) : [];
}

// Save caught Pokémon states to localStorage
function saveCaughtStates() {
    localStorage.setItem('caughtPokemon', JSON.stringify(caughtStates));
}

// Add listeners to checkboxes for unchecking Pokémon
function addCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.caught-checkbox');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            const pokemonId = checkbox.id.split('-').pop();
            if (!checkbox.checked) {
                // Remove Pokémon from caughtStates
                caughtStates = caughtStates.filter(id => id !== pokemonId);
                saveCaughtStates();
            } else {
                // Add Pokémon to caughtStates
                caughtStates.push(pokemonId);
                saveCaughtStates();
            }
            displayCaughtPokemon(); // Refresh gallery
        });
    });
}

// Function to display evolution chain in modal
function displayEvolution(evolutionChain) {
    const evolutionContainer = document.getElementById('evolutionSection');
    evolutionContainer.innerHTML = ''; // Clear previous evolutions

    let currentEvo = evolutionChain;
    let count = 0;

    // Display up to 3 Pokémon in the evolution chain
    while (currentEvo && count < 3) {
        const evoPokemon = currentEvo.species;
        const pokemonId = evoPokemon.url.split('/')[6]; // Extract Pokémon ID
        const borderColor = borderColors[(pokemonId - 1) % borderColors.length]; // Match border color logic

        const evoCard = document.createElement('div');
        evoCard.className = 'card';
        evoCard.setAttribute('data-pokemon-id', pokemonId);
        evoCard.style.border = `6px solid ${borderColor}`; // Apply border color

        evoCard.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" class="pokemon-image" alt="${evoPokemon.name}">
            <div class="poketext">
                <h4>#${pokemonId}</h4>
                <p>${evoPokemon.name}</p>
            </div>
        `;
        evolutionContainer.appendChild(evoCard);

        currentEvo = currentEvo.evolves_to[0]; // Move to next evolution
        count++;
    }
}

// Function to display Pokémon information in the modal
async function openModal(pokemonId) {
    const pokemon = await fetchPokemonData(pokemonId);

    // Update modal content
    document.getElementById('pokemonName').textContent = pokemon.name;
    document.getElementById('pokemonNumber').textContent = `#${pokemon.id.toString().padStart(4, '0')}`;

    const modalImage = document.querySelector('#cardPage .pokemon-image');
    modalImage.src = pokemon.largeImage; // Use the larger image for the modal
    modalImage.alt = pokemon.name;

    document.getElementById('height').textContent = `${pokemon.height / 10} m`;
    document.getElementById('weight').textContent = `${pokemon.weight / 10} kg`;
    document.getElementById('category').textContent = pokemon.category;

    // Update abilities
    const abilityList = document.querySelector('.ability');
    abilityList.innerHTML = ''; // Clear any previous abilities
    pokemon.abilities.forEach(ability => {
        const li = document.createElement('li');
        li.textContent = ability;
        abilityList.appendChild(li);
    });

    // Update types
    const typesContainer = document.getElementById('types');
    typesContainer.innerHTML = ''; // Clear previous types
    pokemon.types.forEach(type => {
        const typeElement = document.createElement('div');
        typeElement.className = `type ${type}`;
        typeElement.textContent = type;
        typesContainer.appendChild(typeElement);
    });

    // Update weaknesses
    const weaknessesContainer = document.getElementById('weaknesses');
    weaknessesContainer.innerHTML = ''; // Clear previous weaknesses
    pokemon.weaknesses.forEach(weakness => {
        const weaknessElement = document.createElement('div');
        weaknessElement.className = `weakness ${weakness}`;
        weaknessElement.textContent = weakness;
        weaknessesContainer.appendChild(weaknessElement);
    });

    // Apply border color to modal card
    const modalCard = document.querySelector('#cardPage .card');
    const borderColor = borderColors[(pokemon.id - 1) % borderColors.length];
    modalCard.style.border = `6px solid ${borderColor}`;

    // Display Evolution Chain
    displayEvolution(pokemon.evolution);

    // Show modal and overlay
    modal.style.display = 'flex';
    overlay.classList.add('show-overlay');
}

// Modal functionality
const modal = document.getElementById("cardPage");
const overlay = document.getElementById("overlay");
const closeButton = document.querySelector('.close');

closeButton.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

function closeModal() {
    modal.style.display = 'none';
    overlay.classList.remove('show-overlay');
}

// Event listener for opening the modal when a Pokémon card is clicked
gallery.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (card && !event.target.closest('input')) {  // Ensure it's not the checkbox that was clicked
        const pokemonId = card.dataset.pokemonId;
        openModal(pokemonId); // Open modal with the correct Pokémon
    }
});

// Initialize Pokédex on page load
document.addEventListener('DOMContentLoaded', () => {
    displayCaughtPokemon(); // Display all caught Pokémon
});
