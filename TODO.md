- [ ] Figure out how to make the checkbox checked when you open the modal, if the user have checked it before. Same thing if the user checks in the modal, I want it to be checked when the modal closes
- [ ] Create a way to style the buttons based on their weakness or type. I want background color to change accordingly
- [ ] Create something to change the background color of the cards depending on their types. it is probably the same way as the previous task
- [x] Create a small profile page, where the user can login, create password. Is that difficult?  If it is too dificult, when can just create a welcome page asking for the user to put their name, and when he presses enter ir redirects to the main pokedex page saying hey "someone", this is your pokedex
- [x] Style the Modal according to the mockup



✔️ The assignment should utilize one HTML (index.html), CSS (style.css), and JavaScript (script.js) file, each located at the root of the repository.
✔️ Feel free to use a modern CSS Framework like Bootstrap or Foundation, or a CSS reset (reset.css). CSS RESET
✔️ You may not use inline events. All DOM events must be handled using Event Listeners.
✔️ You may not declare variables with var. Use either const or let.
✔️ The use of JavaScript libraries is allowed.
✔️ Do not use the XMLHttpRequest object or the jQuery ajax() method. Use the Fetch API for asynchronous operations. */ fetch() to retrieve Pokémon data and their related info WRITE MORE COMMENTS
✔️ The web application should be responsive.
✔️ The web application should not experience any page refreshes. */dynamically loading Pokémon data, handling checkboxes for the "caught" state, and displaying a modal without reloading the page.
✔️ The web application should display the first 20 pokemon (thumbnail and name) when the page loads using an asynchronous request. /*  The generatePokemonCards() function ensures Pokémon cards are loaded as expected.
✔️ The web application should display an additional 20 pokemon when the "more" button is clicked using an asynchronous request. the “Load More” button functionality. When clicked, it loads the next 20 Pokémon.
✔️The web application should display a larger image and additional details of the pokemon when it is clicked. The additional details should be retrieved using an asynchronous request. /*When a Pokémon card is clicked, it opens the modal with detailed information like height, weight, abilities, types, weaknesses, and an evolution chain.
✔️ The web application should allow the user to mark a pokemon as "caught" and save a list of caught pokemon to local storage.
✔️ The web application should allow the user to release or remove pokemon from the caught list.1. The assignment should utilize one HTML (index.html), CSS (style.css), and JavaScript (script.js) file, each located at the root of the repository.