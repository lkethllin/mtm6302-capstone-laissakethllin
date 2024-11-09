Capstone Project Part -1

Name: Laissa Kethllin Leitao Dias
Student Number: 90541119265
Project: Pokedex


Capstone Project Part -2

After researching different pokémon websites and UI Resources I've decided to go with a modern, feminine and clean interface. There are many women out there who love pokemon, but there isn't a interface with a more feminine and minimal aesthetic.

I've chosen pastel colors, and as for imagery I will try to develop them using Artificial Intelligence if possible. I want the pokemon to look like animated characters.

Although I have only designed a few pages for the app, the main idea is to have the home page, with the recent updates, a page for every character showing tabs such as About, Stats, Moves and Evolutions; as well as the pokedex showing which pokemons have been caught.

/// After reading the project file cautiously I learned that the images and all the data will be provided through an API. With that in mind, I won't have to develop the images and the website will be much simpler than before.

I intend for it to have:
- a log in / sign up page
- main page with all the pokemons, with infinite loading (20 at a time)
- pop up page for each pokemon containing its characteristics, that will be activated when the user clicks on a character.


Capstone Project Part -3

Steps Taken to Create the Prototype:

Wireframe Adaptation: The first thing I did was adapt my wireframe design into a more achievable version through code, making it easier to implement.

HTML Development: I then began developing the HTML for my Pokédex project, starting with the header and footer, and creating a stylesheet for styling the page.

Thumbnail Template: Next, I developed the Pokémon thumbnail template. Initially, I planned for each thumbnail to have different background colors, but for now, I have used only one color. I hope to implement dynamic background colors using JavaScript later. Additionally, I added a "Load More" button to the gallery body.

Modal Card Template: After creating the HTML for the gallery, I designed a modal card template that would display every time a user clicks on a Pokémon image. Although I had originally planned to include descriptions for each ability and a chart showing Pokémon stats, I modified the interface slightly. I removed the ability descriptions and replaced them with an evolution section instead of the stats. I also changed the modal card’s border to rounded corners, instead of the "leaf-border" design I had initially envisioned.

JavaScript Integration: To see how the project would look dynamically, I added JavaScript prompts to the HTML file.

I created a function to load 20 Pokémon initially, and 20 more each time the user clicks the "Load More" button.
Another function was created for the modal to appear when the user clicks on a Pokémon image.
A third main function was added to display a Pokéball every time the user checks the "caught" box. This feature still needs refinement to ensure the checkbox appears inside the modal card and is synced with the main gallery.
Personal Touch – Login Page: To give the project a more app-like experience, I created a login page where the user can enter their name. This name will then be displayed on the main index.html page when the user presses the Enter button. I used an event listener to perform this action, and I added a separate JavaScript file to keep the "extra functions" organized.

Next Steps: For the next phase, I will refine all functions and clean up the code to ensure it is easily readable. I anticipate needing to adjust some of the code to fetch API data, but for now, the project will remain as is.


