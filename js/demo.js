var DemoController = function (sequenceStr) {
  var buttons = document.querySelectorAll('.btn');
  var startTime; // Will be set when the game starts
  var seqIndex = 0;
  var sequence = sequenceStr.toLowerCase().split(' ');
  var remainingClicks = sequence.length;
  var won = false;
  var timerInterval; // Variable to hold the reference to setInterval

  // Disables all buttons initially
  buttons.forEach(button => button.disabled = true);

  function runInterval(loopAfter) {
    if (!startTime) return; // Ensure we have a start time set

    // Clear any existing timer to prevent multiple intervals
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(function() {
        var elapsedTime = Date.now() - startTime; // Use the globally scoped startTime
        var time = (elapsedTime / 1000).toFixed(3);
        document.getElementById('timer').innerHTML = time + ' seconds'; // Update the timer display
    }, 1); // Update every 1 millisecond for precise updates

    setTimeout(() => {
        if (!won) { // Only clear and reset interval if the game hasn't been won
            clearInterval(timerInterval);
            runInterval(loopAfter);
        }
    }, loopAfter);
}


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
  }


  function successFunction() {
      won = true; // Mark the game as won
      clearInterval(timerInterval); // Stop the timer
      var endTime = Date.now();
      var timeTaken = ((endTime - startTime) / 1000).toFixed(3);
      updateLeaderboard(timeTaken);
      showMessage('Congratulations!');
      changeBackground('#6435c9');
      changeTextColor('white', '#fbbd08');
  }

  function updateLeaderboard(timeTaken) {
      var leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
      leaderboard.push(timeTaken);
      leaderboard.sort(function (a, b) { return a - b; });
      leaderboard = leaderboard.slice(0, 10);
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
      displayLeaderboard();
  }

  function displayLeaderboard() {
      var leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
      var leaderboardHTML = leaderboard.map(function (time, index) {
          return (index + 1) + '. ' + time + 's';
      }).join('<br>');
      document.getElementById('leaderboard-content').innerHTML = leaderboardHTML;
  }

  function showMessage(successMessage) {
      document.getElementById('success-text').innerHTML = successMessage;
      document.getElementById('success-text-container').classList.remove('hidden');
  }

  function changeBackground(color) {
      document.body.style['background-color'] = color;
  }

  function changeTextColor(color, shadow) {
      document.body.style['color'] = color;
      if (shadow) {
          document.body.style['text-shadow'] = '0 1px 1px ' + shadow;
      }
  }

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
          runInterval(5000);
      }
      document.getElementById('success-text-container').classList.add('hidden');
      document.body.style['background-color'] = 'white';
      document.body.style['color'] = 'black';
      if (this.classList.contains(sequence[seqIndex])) {
          seqIndex++;
          remainingClicks--;
      } else {
          seqIndex = 0;
          alert('Wrong, Try again! (Hint: start with ' + sequence[0] + ', end with ' + sequence.slice(-1) + ')');
          remainingClicks = sequence.length;
      }
      updatePage();
  }

  return {
      init: function() {
          buttons.forEach(function(button) {
              button.addEventListener('click', buttonEventHandler);
          });
          updatePage();
      },
      startGame: startGame,
  }
}
