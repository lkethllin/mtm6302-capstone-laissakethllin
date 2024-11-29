const gallery = document.querySelector('.gallery');
const loadMoreButton = document.getElementById('loadMore');
const modal = document.getElementById("cardPage");
const overlay = document.getElementById("overlay");
const closeButton = document.querySelector('.close');
const pokemonPerLoad = 20;
let loadedPokemons = 0;
let caughtStates = loadCaughtStates(); // Load caught states from localStorage

// Function to fetch Pokémon data from the API
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
            name: data.name,
            image: data.sprites.front_default, // Sprite image (smaller version)
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

// Function to display evolution chain in modal
function displayEvolution(evolutionChain, borderColors) {
    const evolutionContainer = document.getElementById('evolutionSection');
    evolutionContainer.innerHTML = ''; // Clear previous evolutions

    let currentEvo = evolutionChain;
    let count = 0;

    // Display up to 3 Pokémon in the evolution chain
    while (currentEvo && count < 3) {
        const evoPokemon = currentEvo.species;
        const pokemonId = evoPokemon.url.split('/')[6]; // Extract Pokémon ID
        const borderColor = borderColors[(pokemonId - 1) % borderColors.length]; // Match gallery logic

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


// Generate Pokémon cards and add to gallery
async function generatePokemonCards(startIndex, endIndex) {
    const borderColors = ['#FEC9C3', '#D1F4DE', '#BCD5EF', '#C9C7EE', '#FCE2BC']; // Define border colors

    for (let i = startIndex; i < endIndex; i++) {
        const pokemon = await fetchPokemonData(i + 1);
        if (!pokemon) continue;

        const isChecked = caughtStates.includes(pokemon.id.toString());

        // Assign a border color based on the Pokémon's index
        const borderColor = borderColors[i % borderColors.length];

        gallery.innerHTML += `
            <div class="card" data-pokemon-id="${pokemon.id}" style="border: 6px solid ${borderColor};">
                <img src="${pokemon.image}" class="pokemon-image" alt="${pokemon.name}">
                <div class="pokeinfo">
                    <div class="poketext">
                        <h4>#${pokemon.id.toString().padStart(4, '0')}</h4>
                        <p>${pokemon.name}</p>
                    </div>
                    <div>
                        <input type="checkbox" id="caught-checkbox-${pokemon.id}" class="caught-checkbox" ${isChecked ? 'checked' : ''}>
                        <img src="assets/pokeball.png" alt="Pokéball" class="pokeball-icon" id="pokeball-icon-${pokemon.id}" style="display:${isChecked ? 'block' : 'none'};">
                    </div>
                </div>
            </div>
        `;
    }

    addEventListenersToCheckboxes();
}


// Add event listeners to checkboxes for caught Pokémon
function addEventListenersToCheckboxes() {
    document.querySelectorAll('.caught-checkbox').forEach((checkbox) => {
        const pokeballIcon = document.getElementById(`pokeball-icon-${checkbox.id.split('-').pop()}`);

        checkbox.addEventListener('change', function () {
            const pokemonId = this.id.split('-').pop();
            if (this.checked) {
                caughtStates.push(pokemonId);
            } else {
                caughtStates = caughtStates.filter(id => id !== pokemonId);
            }

            pokeballIcon.style.display = this.checked ? 'block' : 'none';
            saveCaughtStates(); // Save caught states to localStorage
        });
    });
}

// Function to display Pokémon information in the modal
async function openModal(pokemonId) {
    const pokemon = await fetchPokemonData(pokemonId);

    // Update modal content
    document.getElementById('pokemonName').textContent = pokemon.name;
    document.getElementById('pokemonNumber').textContent = `#${pokemon.id.toString().padStart(4, '0')}`;

    const modalImage = document.querySelector('#cardMain .card .pokemon-image');
    modalImage.src = pokemon.largeImage; // Use the larger image for the modal
    modalImage.alt = pokemon.name;

    document.getElementById('height').textContent = `${pokemon.height / 10} m`;
    document.getElementById('weight').textContent = `${pokemon.weight / 10} kg`;
    document.getElementById('category').textContent = pokemon.category;

    // Update abilities
    const abilityList = document.querySelector('.ability');
    abilityList.innerHTML = ''; // Clear previous abilities
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
    const borderColors = ['#FEC9C3', '#D1F4DE', '#BCD5EF', '#C9C7EE', '#FCE2BC']; // Color palette
    const borderColor = borderColors[(pokemon.id - 1) % borderColors.length]; // Match gallery logic
    const modalCard = document.querySelector('#cardMain .card'); // Target the card in the modal
    if (modalCard) {
        modalCard.style.border = `6px solid ${borderColor}`;
    }

    // Display Evolution Chain and apply borders
    displayEvolution(pokemon.evolution, borderColors);

    // Show modal and overlay
    modal.style.display = 'flex';
    overlay.classList.add('show-overlay');
}


// Load more Pokémon
function loadMorePokemons() {
    const startIndex = loadedPokemons;
    const endIndex = loadedPokemons + pokemonPerLoad;

    generatePokemonCards(startIndex, endIndex);
    loadedPokemons += pokemonPerLoad;
}

// Save caught states to localStorage
function saveCaughtStates() {
    localStorage.setItem('caughtPokemon', JSON.stringify(caughtStates));
}

// Load caught states from localStorage
function loadCaughtStates() {
    const storedPokemonIds = localStorage.getItem('caughtPokemon');
    return storedPokemonIds ? JSON.parse(storedPokemonIds) : [];
}


// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadMorePokemons(); // Load initial cards
});

loadMoreButton.addEventListener('click', loadMorePokemons);

// Fix for correctly opening the modal with the clicked Pokémon data
gallery.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (card && !event.target.closest('input')) {  // Ensure it's not the checkbox that was clicked
        const pokemonId = card.dataset.pokemonId;
        openModal(pokemonId); // Open modal with the correct Pokémon
    }
});

closeButton.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

function closeModal() {
    modal.style.display = 'none';
    overlay.classList.remove('show-overlay');
}
