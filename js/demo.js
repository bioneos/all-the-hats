var DemoController = function (sequenceStr) {
    var gameReset = false; // Track if the game has been reset
    var buttons = document.querySelectorAll('.btn'); // Get all buttons
    var startTime; // Will be set when the game starts
    var seqIndex = 0; // Track the current sequence index
    var sequence = sequenceStr.toLowerCase().split(' '); // Convert sequence to lowercase and split into an array
    var remainingClicks = sequence.length; // Track remaining clicks
    var won = false; // Track if the game is won
    var timerInterval; // Variable to hold the reference to setInterval

    // Disable all buttons initially
    buttons.forEach(button => button.disabled = true);

    // Function to run the timer
    function runInterval(loopAfter) {
        if (!startTime) return; // Ensure we have a start time set

        // Clear any existing timer to prevent multiple intervals
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        // Update the timer display every millisecond
        timerInterval = setInterval(function() {
            var elapsedTime = Date.now() - startTime; // Calculate elapsed time
            var time = (elapsedTime / 1000).toFixed(3); // Convert to seconds and format
            document.getElementById('timer').innerHTML = time + ' seconds'; // Update the timer display
        }, 1);

        // Reset the interval after a specified time
        setTimeout(() => {
            if (!won && !gameReset) { // Only clear and reset interval if the game hasn't been won or reset
                clearInterval(timerInterval);
                runInterval(loopAfter);
            }
        }, loopAfter);
    }

    // Function to start the game
    function startGame() {
        var playerName = document.getElementById('playerName').value; // Get player's name from the input field

        if (!playerName) {
            var nameErrorMessageDiv = document.getElementById('name-error-message');
            nameErrorMessageDiv.innerHTML = "Please enter your name to start the game."; // Set the error message
            nameErrorMessageDiv.classList.remove('hidden'); // Show the error message
            return;
        }

        console.log("Game started by:", playerName); // Log the player's name to the console

        // Hide the name error message if the game starts successfully
        document.getElementById('name-error-message').classList.add('hidden');

        // Reset game state
        if (timerInterval) {
            clearInterval(timerInterval); // Clear existing timer interval
        }
        startTime = Date.now(); // Reset start time when game starts
        seqIndex = 0;
        remainingClicks = sequence.length;
        won = false;
        buttons.forEach(button => button.disabled = false); // Enable all buttons

        // Reset and start the timer
        runInterval(5000); // Resets every 5 seconds

        // Reset display elements
        document.getElementById('remaining-count').innerHTML = remainingClicks;
        document.getElementById('timer').innerHTML = '0.000 seconds';
        document.getElementById('success-text-container').classList.add('hidden');
        document.body.style['background-color'] = 'white';
        document.body.style['color'] = 'black';

        updatePage(); // Update page elements as needed

        var startButton = document.getElementById('start'); // Get the start button
        var resetButton = document.getElementById('reset-button'); // Get the reset button
        startButton.style.display = 'none'; // Hide the start button
        resetButton.style.display = 'inline-block'; // Show the reset button
    }

    // Function to handle game success
    function successFunction() {
        won = true; // Mark the game as won
        clearInterval(timerInterval); // Stop the timer
        var endTime = Date.now();
        var timeTaken = ((endTime - startTime) / 1000).toFixed(3);
        var adjustedTime = (parseFloat(timeTaken) - 0.004).toFixed(3); // Subtract 0.003 seconds
        updateLeaderboard(adjustedTime);
        showMessage('Congratulations!');
        changeBackground('#6435c9');
        changeTextColor('white', '#fbbd08');

        // Hide the error message
        document.getElementById('error-message').classList.add('hidden');
    }

    // Function to update the leaderboard
    function updateLeaderboard(timeTaken) {
        var playerName = document.getElementById('playerName').value; // Capture the player's name
        var leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({ name: playerName, time: timeTaken });
        leaderboard.sort(function (a, b) { return a.time - b.time; }); // Sort by time
        leaderboard = leaderboard.slice(0, 10); // Keep only the top 10 entries
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        displayLeaderboard();
    }

    // Function to display the leaderboard
    function displayLeaderboard() {
        var leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        var leaderboardHTML = leaderboard.map(function (entry, index) {
            var formattedTime = parseFloat(entry.time).toFixed(3); // Ensure time is formatted to 3 decimal places
            return (index + 1) + '. ' + entry.name + ' - ' + formattedTime + 's'; // Display both name and time
        }).join('<br>');
        document.getElementById('leaderboard-content').innerHTML = leaderboardHTML;
    }

    // Function to show a success message
    function showMessage(successMessage) {
        document.getElementById('success-text').innerHTML = successMessage;
        document.getElementById('success-text-container').classList.remove('hidden');
    }

    // Function to change the background color
    function changeBackground(color) {
        document.body.style['background-color'] = color;
    }

    // Function to change the text color
    function changeTextColor(color, shadow) {
        document.body.style['color'] = color;
        if (shadow) {
            document.body.style['text-shadow'] = '0 1px 1px ' + shadow;
        }
    }

    // Function to update the page elements
    function updatePage() {
        if (remainingClicks === 0) {
            remainingClicks = sequence.length;
            seqIndex = 0;
            successFunction();
        }
        document.getElementById('remaining-count').innerHTML = remainingClicks;
    }

    // Function to handle button clicks
    function buttonEventHandler() {
        if (!startTime) { // Check if the timer needs to start
            startTime = Date.now(); // Ensure start time is set on first click
            timer = runInterval(5000); // Assign the interval to the timer variable
        }
        document.getElementById('success-text-container').classList.add('hidden');
        document.body.style['background-color'] = 'white';
        document.body.style['color'] = 'black';
        if (this.classList.contains(sequence[seqIndex])) {
            seqIndex++;
            remainingClicks--;
        } else {
            seqIndex = 0;

            // Stop the timer
            clearInterval(timer);

            // Reset the game state
            remainingClicks = sequence.length;
            gameReset = true; // Set gameReset to true

            // Select the div element
            var errorMessageDiv = document.getElementById('error-message');

            // Construct the message
            var message = 'Wrong, Try again! (Hint: start with ' + sequence[0] + ', end with ' + sequence.slice(-1) + ')';

            // Update the innerHTML of the div
            errorMessageDiv.innerHTML = message;

            // Remove the 'hidden' class to make the div visible
            errorMessageDiv.classList.remove('hidden');
        }
        updatePage();
    }

    // Function to reset the game
    function resetGame() {
        location.reload(); // Reload the page

        var startButton = document.getElementById('start'); // Get the start button
        var resetButton = document.getElementById('reset-button'); // Get the reset button
        startButton.style.display = 'inline-block'; // Show the start button
        resetButton.style.display = 'none'; // Hide the reset button
    }

    return {
        init: function() {
            buttons.forEach(function(button) {
                button.addEventListener('click', buttonEventHandler);
            });
            var startButton = document.getElementById('start'); // Get the start button
            var resetButton = document.getElementById('reset-button'); // Get the reset button
            startButton.addEventListener('click', startGame); // Set the event listener for the start button
            resetButton.addEventListener('click', resetGame); // Set the event listener for the reset button
            startButton.style.display = 'inline-block'; // Show the start button initially
            resetButton.style.display = 'none'; // Hide the reset button initially
            updatePage();
        },
        startGame: startGame,
    }
}