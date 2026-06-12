# 🤖 TIC-TAC-TOE: Minimax AI

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

This project goes beyond a standard Tic-Tac-Toe game. It was built as a hands-on architectural challenge to implement complex artificial intelligence (Minimax) and scalable state management using strictly Vanilla JavaScript, completely avoiding modern frameworks.

## ✨ Features

* **Unbeatable AI (Minimax Engine):** The CPU relies on the classic Minimax algorithm to evaluate all possible future board states. By incorporating depth scoring (`scoreTable[result] - depth`), the AI doesn't just play not to lose—it actively seeks the fastest path to victory and the slowest path to defeat, making it mathematically unbeatable on the highest difficulty.
* **Custom Observer Pattern (Pub/Sub):** Built a custom event-driven architecture (`boardState.subscribe` / `update`). The game state is fully decoupled from the UI layer. This means board updates, win validations, score increments, and turn changes happen reactively, preventing "spaghetti code" and keeping the modules strictly isolated.
* **Asynchronous Turn Control & UX Protection:** Simulates CPU "thinking" time using Promises (`async/await` and precise delays). During these calculations, the board is strictly locked (`pointerEvents = "none"`) to prevent ghost clicks, race conditions, or accidental user inputs, ensuring a highly polished and bug-free user experience.
* **Silent Future Simulations:** The core rule engine (`gameRules.getWinner`) utilizes a side-effect-free mode via the `isUpdating` flag. This critical feature allows the Minimax algorithm to traverse the decision tree and test thousands of hypothetical scenarios in the background without triggering actual UI victory screens or mutating the live board state.
* **Score & Match Management:** Includes a dedicated `scoreManager` that tracks player wins, CPU wins, and ties in real-time, updating the dashboard dynamically without reloading the session.
* **🌗 Dynamic Theming System:** Fully integrated theme manager (Default, AMOLED, Light) that manipulates the DOM via `data-theme` attributes. Preferences are saved in `localStorage` for immediate cross-session persistence.

## 🛠️ Technologies Used

* **Vanilla JavaScript (ES6+):** Architected strictly with vanilla JS using object namespaces (`boardState`, `miniMaxEngine`, `turnManager`, `ui`) to separate game logic, state, and rendering. Strong focus on recursive algorithms (Minimax), state encapsulation, and asynchronous event handling.
* **CSS3:** Advanced usage of CSS Custom Properties (variables) and `data-theme` selectors for global dynamic styling. Utilizes CSS Flexbox/Grid for a responsive board and state-based utility classes (`.disabled`) to manage interactive grid cells.
* **HTML5:** Semantic and accessible markup serving as a structural shell. The interactive grid layout and its corresponding state-bound cells are injected and managed entirely by the JavaScript logic.

---

## 🚀 Future Improvements

* **UI Controls Restoration:** Fully implement and wire the frontend UI elements (like `configBtn` and `themeBtn`) to allow users to toggle between visual themes seamlessly and dynamically switch the AI logic (e.g., Random vs. Unbeatable) in real-time.
* **ES6 Modules Refactoring:** Currently, the project is structured in a single-entry point for simplicity during development. The next major architectural milestone is to decouple the code into distinct, highly cohesive ES6 modules (`minimax.js`, `state.js`, `ui.js`, `rules.js`) to improve maintainability and align with modern enterprise engineering standards.
* **Score Persistence:** Extend the `localStorage` logic to save user scores and match history, allowing players to keep track of their long-term win/loss ratios against the Minimax engine.
