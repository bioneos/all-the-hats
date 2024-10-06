var DemoController = function (sequenceStr) {
    var gameReset = false; // Track if the game has been reset
    var buttons = document.querySelectorAll('.btn'); // Get all buttons
    var startTime; // Will be set when the game starts
    var seqIndex = 0; // Track the current sequence index
    var sequence = sequenceStr.toLowerCase().split(' '); // Convert sequence to lowercase and split into an array
    var remainingClicks = sequence.length; // Track remaining clicks
    var won = false; // Track if the game is won
    var timerInterval; // Variable to hold the reference to setInterval
    var timeTaken; // Variable to store the time taken

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
        timeTaken = ((endTime - startTime) / 1000).toFixed(3); // Calculate the time taken
        document.getElementById('timer').innerHTML = timeTaken + ' seconds'; // Update the timer display with the exact time
        updateLeaderboard(timeTaken); // Use the exact time for the leaderboard
        showMessage('Congratulations!');
        changeBackground('#6435c9');
        changeTextColor('white', '#fbbd08');
    
        // Hide the error message
        document.getElementById('error-message').classList.add('hidden');
    }

    // Function to update the leaderboard
    function updateLeaderboard(timeTaken) {
        var leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({ name: "", time: timeTaken }); // Temporarily add an empty name
        leaderboard.sort(function (a, b) { return a.time - b.time; }); // Sort by time
        leaderboard = leaderboard.slice(0, 10); // Keep only the top 10 entries
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        displayLeaderboard();
    
        // Check if the player's time is in the top 10
        var isTop10 = leaderboard.some(entry => entry.time === timeTaken);
        if (isTop10) {
            document.getElementById('top10-dialog').showModal(); // Show the dialog
        }
    }
    
    function savePlayerName(playerName) {
        var leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        for (var i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].name === "" && leaderboard[i].time === timeTaken) {
                leaderboard[i].name = playerName; // Update the name
                break;
            }
        }
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        displayLeaderboard();
    }

    // Function to display the leaderboard
    function displayLeaderboard() {
        var leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        var leaderboardHTML = leaderboard.map(function (entry, index) {
            var formattedTime = parseFloat(entry.time).toFixed(3); // Ensure time is formatted to 3 decimal places
            return (index + 1) + '. ' + entry.name + ' - ' + formattedTime + 's'; // Display both name and time
        });
    
        // Fill remaining spots with "N/A"
        for (var i = leaderboard.length; i < 10; i++) {
            leaderboardHTML.push((i + 1) + '. N/A - N/A');
        }
    
        document.getElementById('leaderboard-content').innerHTML = leaderboardHTML.join('<br>');
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
    
            // Hide the error message when the correct button is pressed
            document.getElementById('error-message').classList.add('hidden');
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
            displayLeaderboard(); // Display the leaderboard when the page loads
            updatePage();
        },
        startGame: startGame,
        savePlayerName: savePlayerName // Expose savePlayerName function
    }
}