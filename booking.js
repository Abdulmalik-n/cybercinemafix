document.addEventListener("DOMContentLoaded", () => {
  //  Get HTML Elements
  const addToCartButtons = document.querySelectorAll(".add-to-cart"); // all the Add to Cart buttons
  const ticketTableBody = document.getElementById("ticket-table-body"); // Area to show selected tickets
  const grandTotal = document.getElementById("grand-total");          // Where the total price goes
  const saveFavButton = document.getElementById("save-fav");          // Save Favorite button
  const applyFavButton = document.getElementById("apply-fav");        // Apply Favorite button
  const clearCartButton = document.getElementById("clear-cart");      // Clear Cart' button

  //  Cart Data
  // clear the cart every time the page loads. 
  localStorage.removeItem("cart");
  let cart = []; // An array to hold the ticket items-

  // Functions 

  // Function to display the current cart contents in the  table
  function updateTicketSummary() {
      ticketTableBody.innerHTML = ""; // Clear the table first
      let currentGrandTotal = 0;      // Reset total for recalculation

      // Loop through each item in the cart array
      cart.forEach(item => {
          const row = ticketTableBody.insertRow(); // Create a new row in the table
          // Add cells (td) with item details to the row
          row.innerHTML = `
              <td>${item.movie}</td>
              <td>${item.seats}</td>
              <td>$${item.price.toFixed(2)}</td> 
              <td>$${item.total.toFixed(2)}</td> 
          `;
          currentGrandTotal += item.total; // Add item's total to grand total
      });

      // Update the grand total display on the page
      grandTotal.textContent = `$${currentGrandTotal.toFixed(2)}`;
  }

  // function to save the cart to storage and update the table
  function saveAndRefreshUI() {
      localStorage.setItem("cart", JSON.stringify(cart)); // Save the current cart state
      updateTicketSummary();                              // Refresh the displayed table
  }

  // Function that runs when an "Add to Cart" button is clicked
  function handleAddToCart(event) {
      // Find the '.movie' container related to the clicked button
      const movieElement = event.target.closest(".movie");
      if (!movieElement) return; // Exit if structure is wrong

      // Get details from the movie container
      const movieTitle = movieElement.querySelector("h3").textContent;
      const seatsInput = movieElement.querySelector("input[type='number']");
      const price = parseFloat(seatsInput.dataset.price); // Get price from 'data-price'
      const seats = parseInt(seatsInput.value, 10);      // Get number of seats (as integer)

      // Proceed only if seats > 0 and price is valid
      if (seats > 0 && !isNaN(price)) {
          const totalForItem = price * seats; // Calculate total for this specific addition
          // Check if movie is already in the cart
          const existingItem = cart.find(item => item.movie === movieTitle);

          if (existingItem) {
              // If yes, update the existing item's seats and total
              existingItem.seats += seats;
              existingItem.total += totalForItem;
          } else {
              // If no, add a new item object to the cart array
              cart.push({ movie: movieTitle, seats, price, total: totalForItem });
          }

          saveAndRefreshUI();   // Save changes and update the display
          seatsInput.value = 0; // Optional: Reset the number input field

      } else if (seats <= 0) {
          alert("Please enter 1 or more seats."); // Give feedback if seats is zero or negative
      }
  }

  // --- Connect Buttons to Functions (Event Listeners) ---

  // Add the 'handleAddToCart' function to *all* 'Add to Cart' buttons
  addToCartButtons.forEach(button => {
      button.addEventListener("click", handleAddToCart);
  });

  // 'Save Favorite' button click
  saveFavButton.addEventListener("click", () => {
      if (cart.length > 0) { // Only save if cart isn't empty
          localStorage.setItem("favoriteCart", JSON.stringify(cart));
          alert("Cart saved as favorite!");
      } else {
          alert("Cart is empty.");
      }
  });

  // 'Apply Favorite' button click
  applyFavButton.addEventListener("click", () => {
      const savedFav = localStorage.getItem("favoriteCart"); // Try to get saved cart
      if (savedFav) {
          cart = JSON.parse(savedFav); // Load the saved cart into the current cart
          saveAndRefreshUI();          // Save this loaded cart and update display
          alert("Favorite cart applied!");
      } else {
          alert("No favorite cart found!"); // No favorite was saved before
      }
  });

  // 'Clear Cart' button click
  clearCartButton.addEventListener("click", () => {
      cart = [];           // Empty the cart array
      saveAndRefreshUI();  // Save the empty cart and update display
      alert("Cart cleared!");
  });

  // --- Initial Display ---
  updateTicketSummary(); // Show the starting cart state (empty) when the page first loads
});