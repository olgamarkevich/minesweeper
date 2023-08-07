# Minesweeper

This project is an implementation of the classic game Minesweeper using pure JavaScript. The game is built dynamically, generating all elements through JavaScript. ESLint is utilized for development and build processes. The project replicates the original Minesweeper experience, allowing players to choose the field size and number of mines. The first move is guaranteed to never hit a mine. Victories are saved in LocalStorage, and players can switch between light and dark themes.

Deployed project: Link to the deployed

**Implemented Features**

* The game interface is dynamically created using JavaScript, generating the grid and other elements.
* Players can click on cells to reveal them and uncover numbers indicating the proximity to mines.
* If a player uncovers a mine, the game ends, and they lose.
* The first move is guaranteed to not hit a mine, ensuring a fair start.
* Players can flag cells they suspect contain mines.
* The game includes adjustable settings for field size and mine count.
* Victories are saved in the browser's LocalStorage, allowing players to track their wins.
* A theme switcher is implemented, allowing users to toggle between light and dark themes.

**Skills Acquired** 

* Proficiency in JavaScript for generating and manipulating HTML elements dynamically.
* Use of JavaScript to implement game logic and interactions.
* Understanding and implementation of algorithms for generating minefield grids and calculating mine proximity.
* Integration of ESLint for code linting and adhering to coding best practices.
* Working with browser storage, specifically LocalStorage, to persist game victories.
* Implementation of theme switching functionality using CSS classes and JavaScript.
