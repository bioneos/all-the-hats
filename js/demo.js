const DemoController = function (sequenceStr) {
    let gameReset = false; // Track if the game has been reset
    let startTime; // Will be set when the game starts
    let seqIndex = 0; // Track the current sequence index
    let sequence = sequenceStr.toLowerCase().split(' '); // Convert sequence to lowercase and split into an array
    let remainingClicks = sequence.length; // Track remaining clicks
    let won = false; // Track if the game is won
    let timerInterval; // Variable to hold the reference to setInterval
    let timeTaken; // Variable to store the time taken

    const defaultLeaderboard = [
        { name: 'Mike', time: '8.127' },
        { name: 'EpicNinja', time: '10.456' },
        { name: 'BlazeHunter', time: '14.239' },
        { name: 'FrostByte', time: '17.582' },
        { name: 'ShadowStrike', time: '21.304' },
        { name: 'MysticMage', time: '24.671' },
        { name: 'ThunderFist', time: '27.915' },
        { name: 'VortexViper', time: '30.246' },
        { name: 'CrimsonKnight', time: '33.789' },
        { name: 'SteelSerpent', time: '37.512' },
    ];

    // Disable all buttons initially
    let buttons = document.querySelectorAll('.btn'); // Get all buttons
    buttons.forEach(button => button.disabled = true);

    // Function to run the timer
    function runInterval(loopAfter) {
        if (!startTime) return;

        if (timerInterval) {
            clearInterval(timerInterval);
        }

        timerInterval = setInterval(function () {
            let elapsedTime = Date.now() - startTime;
            let time = (elapsedTime / 1000).toFixed(3);
            document.getElementById('timer').innerHTML = time + ' seconds';

            // Check if the elapsed time has reached 60 seconds
            if (elapsedTime >= 60000) { // 60000 milliseconds == 1 minute
                clearInterval(timerInterval); // Stop the timer
                won = true; // Set game as won to stop further interactions
                document.getElementById('timer').innerHTML = 'Time is up!'; // Update the timer display
                buttons.forEach(button => button.disabled = true); // Disable all buttons
                document.getElementById('error-message').innerHTML = 'Time is up!'; // Update error message
                document.getElementById('error-message').classList.remove('hidden'); // Show error message
                document.getElementById('success-text-container').classList.add('hidden'); // Hide any success message
            }
        }, 1);

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

        let startButton = document.getElementById('start'); // Get the start button
        let resetButton = document.getElementById('reset-button'); // Get the reset button
        startButton.style.display = 'none'; // Hide the start button
        resetButton.style.display = 'inline-block'; // Show the reset button
    }

    // Function to handle game success
    function successFunction() {
        won = true; // Mark the game as won
        clearInterval(timerInterval); // Stop the timer
        let endTime = Date.now();
        timeTaken = ((endTime - startTime) / 1000).toFixed(3); // Calculate the time taken
        document.getElementById('timer').innerHTML = timeTaken + ' seconds'; // Update the timer display with the exact time
        updateLeaderboard(timeTaken); // Use the exact time for the leaderboard
        showMessage('Congratulations!');
        changeBackground('#6435c9');
        changeTextColor('white', '#fbbd08');
        buttons.forEach(button => button.disabled = true); // Disable all buttons

        // Hide the error message
        document.getElementById('error-message').classList.add('hidden');
    }

    function getLeaderboard() {
        return JSON.parse(localStorage.getItem('leaderboard')) || defaultLeaderboard;
    }

    function saveLeaderboard(newLeaderboard) {
        localStorage.setItem('leaderboard', JSON.stringify(newLeaderboard));
    }

    // Function to update the leaderboard
    function updateLeaderboard(timeTaken) {
        let leaderboard = getLeaderboard();
        leaderboard.push({ name: "_ _ _", time: timeTaken }); // Temporarily add an empty name
        leaderboard.sort(function (a, b) { return a.time - b.time; }); // Sort by time
        leaderboard = leaderboard.slice(0, 10); // Keep only the top 10 entries
        saveLeaderboard(leaderboard);
        displayLeaderboard();

        // Check if the player's time is in the top 10
        let isTop10 = leaderboard.some(entry => entry.time === timeTaken);
        if (isTop10) {
            document.getElementById('top10-dialog').showModal(); // Show the dialog
        }
    }

    function savePlayerName(playerName) {
        let leaderboard = getLeaderboard();
        for (let i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].name === "_ _ _" && leaderboard[i].time === timeTaken) {
                leaderboard[i].name = playerName; // Update the name
                break;
            }
        }
        saveLeaderboard(leaderboard);
        displayLeaderboard();
    }

    // Function to display the leaderboard
    function displayLeaderboard() {
        let leaderboard = getLeaderboard();
        let leaderboardHTML = leaderboard.map(function (entry, index) {
            let formattedTime = parseFloat(entry.time).toFixed(3); // Ensure time is formatted to 3 decimal places
            return `<tr><td>${index + 1}</td><td>${entry.name || 'N/A'}</td><td>${formattedTime}s</td></tr>`; // Display both name and time
        });

        document.getElementById('leaderboard-content').innerHTML = leaderboardHTML.join('');
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

        // I'm having some troubles with this part of the code,
        // is the sequence what I think it should be?
        console.log(sequence);

        if (this.classList.contains(sequence[seqIndex])) {
            seqIndex++;
            remainingClicks--;

            // Hide the error message when the correct button is pressed
            document.getElementById('error-message').classList.add('hidden');
        } else {
            seqIndex = 0;

            // Reset the game state (so they can keep trying)
            remainingClicks = sequence.length;
            gameReset = true; // Set gameReset to true

            // Select the div element
            let errorMessageDiv = document.getElementById('error-message');

            // Construct the message
            let message = '<div>Wrong color, Keep trying!</div>'
            message += '<div id="hint">(Hint: start with ' + sequence[0] + ', end with ' + sequence.slice(-1) + ')</div>';
            setTimeout(() => {
                document.getElementById('hint').classList.add('hidden');
            }, 2000);

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

        let startButton = document.getElementById('start'); // Get the start button
        let resetButton = document.getElementById('reset-button'); // Get the reset button
        startButton.style.display = 'inline-block'; // Show the start button
        resetButton.style.display = 'none'; // Hide the reset button
    }

    function resetLeaderboardListener(event) {
        if (event.ctrlKey && event.key === 'r') {
            event.preventDefault();
            resetLeaderboard();
        }
    }

    function resetLeaderboard() {
        saveLeaderboard(defaultLeaderboard);
        displayLeaderboard();
    }

    return {
        init: function () {
            buttons.forEach(function (button) {
                button.addEventListener('click', buttonEventHandler);
            });
            let startButton = document.getElementById('start'); // Get the start button
            let resetButton = document.getElementById('reset-button'); // Get the reset button
            startButton.addEventListener('click', startGame); // Set the event listener for the start button
            resetButton.addEventListener('click', resetGame); // Set the event listener for the reset button
            startButton.style.display = 'inline-block'; // Show the start button initially
            resetButton.style.display = 'none'; // Hide the reset button initially

            document.addEventListener('keydown', resetLeaderboardListener);

            displayLeaderboard(); // Display the leaderboard when the page loads
            updatePage();
        },
        startGame: startGame,
        savePlayerName: savePlayerName // Expose savePlayerName function
    }
}
