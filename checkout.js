document.addEventListener("DOMContentLoaded", () => {

  //Get HTML Elements Needed 
  const summaryBody = document.getElementById("checkout-summary");      // Table body for the order summary
  const totalCell = document.getElementById("checkout-total");          // Table cell for the grand total price
  const seatOptions = document.getElementById("seat-options");          // The <select> element showing available seats
  const selectedSeatsInput = document.getElementById("selected-seats"); // Hidden input where selected seat numbers are stored
  const paymentForm = document.getElementById("payment-form");          // The payment details form
  const mainContent = document.querySelector('main');                 // The main content area of the page
  const dropdownContainer = document.getElementById("dropdown-container"); // The div holding the seat dropdown
  const dropdownToggleButton = document.getElementById("toggle-btn");   // The button that shows/hides the seat dropdown

  // Load Cart & Initial Check 
  // Get cart items saved from the booking page, or create an empty array if none found
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // If the cart is empty, show a message and hide the form
  if (cart.length === 0) {
      summaryBody.innerHTML = `<tr><td colspan="4">Your cart is empty. Please add tickets first.</td></tr>`;
      if (paymentForm) paymentForm.style.display = 'none'; // Hide form if cart is empty
      return; // Don't run the rest of the code
  }

  // --- Build Order Summary & Calculate Totals ---
  let grandTotal = 0;         // To store the total cost
  let totalSeatsToSelect = 0; // To store the total number of tickets
  summaryBody.innerHTML = ""; // Clear any placeholder rows

  // Loop through each item in the cart
  cart.forEach(item => {
      const itemTotal = item.price * item.seats; // Calculate cost for this movie's tickets
      grandTotal += itemTotal;                   // Add to the overall total
      totalSeatsToSelect += item.seats;          // Add to the total seats count

      // Create the HTML for a table row for this cart item
      const row = `
          <tr>
              <td>${item.movie}</td>
              <td>${item.seats}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${item.total.toFixed(2)}</td> 
          </tr>
      `;
      summaryBody.innerHTML += row; // Add the row to the summary table
  });

  // Display the final grand total, formatted as currency
  totalCell.textContent = `$${grandTotal.toFixed(2)}`;

  // --- Setup Seat Selection Dropdown ---
  if (seatOptions && selectedSeatsInput) { // Check if seat elements exist
      seatOptions.innerHTML = ""; // Clear any default options
      // Create seat options (A1 to F10)
      for (let row of ['A', 'B', 'C', 'D', 'E', 'F']) {
          for (let i = 1; i <= 10; i++) {
              const option = document.createElement("option");
              option.value = `${row}${i}`;      //  value="B5"
              option.textContent = `${row}${i}`; // text shown is "B5"
              seatOptions.appendChild(option);
          }
      }
      // Adjust the visible size of the dropdown 
      seatOptions.size = Math.min(totalSeatsToSelect, 10);
      // Set placeholder text for the display input field
      selectedSeatsInput.placeholder = `Select ${totalSeatsToSelect} seats`;
  }


  // --- Handle Payment Form Submission ---
  if (paymentForm) {
      paymentForm.addEventListener("submit", function(event) {
          event.preventDefault(); // Stop the form from submitting the traditional way

          // Check if payment details are valid
          if (validateForm()) {
              //simulate Successful Payment & Show Confirmation
              const bookingReference = Math.random().toString(36).substring(2, 10).toUpperCase(); // Generate a random ID
              const selectedSeatsValue = selectedSeatsInput ? selectedSeatsInput.value : 'Not Selected'; // Get selected seats

              // Create a summary of movies purchased
              let movieDetails = cart.map(item => `${item.movie} (${item.seats} tickets)`).join(', ');

              // Create the "Thank You" message 
              const thankYouMessage = `
                  <h2>Thank You for Your Purchase!</h2>
                  <p>Your booking details:</p>
                  <ul>
                      <li><strong>Movies:</strong> ${movieDetails}</li>
                      <li><strong>Movie Time:</strong> [Time Not Specified - Check confirmation email]</li>
                      <li><strong>Seats:</strong> ${selectedSeatsValue}</li>
                      <li><strong>Booking Reference:</strong> ${bookingReference}</li>
                  </ul>
                  <p>An electronic ticket has been sent to your email.</p>
                  <p><a href="booking.html">Back to Home</a></p> 
              `;

              // Replace the main page content with the thank you message
              if (mainContent) mainContent.innerHTML = thankYouMessage;
              localStorage.removeItem("cart"); // Clear the cart from storage after successful checkout
          }
      });
  }

  // --- Validation Function for Payment Form ---
  function validateForm() {
      // Get the input fields to validate
      const cardNumberInput = document.querySelector('input[name="cardnumber"]');
      const expiryInput = document.querySelector('input[name="expiry"]');
      const cvvInput = document.querySelector('input[name="cvv"]');
      let isValid = true; // Start by assuming the form is valid

      // Validate Card Number (must be 16 digits)
      if (cardNumberInput && !/^\d{16}$/.test(cardNumberInput.value.trim())) {
          alert("Please enter a valid 16-digit card number.");
          isValid = false;
          cardNumberInput.focus(); // Put cursor in the invalid field
          return isValid; // Stop validation here
      }

      // Validate Expiry Date (must be entered and not in the past)
      if (expiryInput) {
           const expiryValue = expiryInput.value; // Format is 'YYYY-MM'
           if (expiryValue) { // Check if date is selected
               const [year, month] = expiryValue.split('-');
               const expiryDate = new Date(parseInt(year), parseInt(month) - 1); // Month is 0-indexed
               const currentDate = new Date();
               currentDate.setDate(1); // Set to start of current month
               currentDate.setHours(0, 0, 0, 0); // Ignore time

               if (expiryDate < currentDate) {
                   alert("Expiry date cannot be in the past.");
                   isValid = false;
                   expiryInput.focus();
                   return isValid; // Stop validation
               }
           } else { // Expiry date is required
                alert("Please enter the expiry date.");
                isValid = false;
                expiryInput.focus();
                return isValid; // Stop validation
           }
      }


      // Validate CVV (must be 3 digits)
      if (cvvInput && !/^\d{3}$/.test(cvvInput.value.trim())) {
          alert("Please enter a valid 3-digit CVV.");
          isValid = false;
          cvvInput.focus();
          return isValid; // Stop validation
      }

      // If all checks passed, the form is valid
      return isValid;
  }

}); 


// Function to show/hide the custom seat dropdown
function toggleDropdown() {
  const container = document.getElementById("dropdown-container");
  if (container) { // Only run if the container exists
      // If visible, hide it; otherwise, show it
      container.style.display = container.style.display === "block" ? "none" : "block";
  }
}

// Function to update the hidden input when seats are selected
function handleSeatSelection() {
  const seatOptionsElement = document.getElementById("seat-options");
  const selectedSeatsInputElement = document.getElementById("selected-seats");
  const dropdownContainerElement = document.getElementById("dropdown-container");

  // Check if elements exist before using them
  if (seatOptionsElement && selectedSeatsInputElement) {
      // Get all the currently selected <option> elements
      const selectedOptions = Array.from(seatOptionsElement.selectedOptions);
      // Get their 'value' (e.g., "A1", "C5") and join them with a comma and space
      const seats = selectedOptions.map(option => option.value).join(", ");
      // Set the hidden input's value to this string
      selectedSeatsInputElement.value = seats;
  }

  // Hide the dropdown after making a selection
  if (dropdownContainerElement) {
      dropdownContainerElement.style.display = "none";
  }
}

// Add a listener to the whole document to close the dropdown if clicked outside
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("dropdown-container");
  const button = document.getElementById("toggle-btn");

  // Check if the click target is NOT the dropdown itself or the toggle button
  if (dropdown && button && !dropdown.contains(event.target) && event.target !== button) {
      dropdown.style.display = "none"; // Hide the dropdown
  }
});