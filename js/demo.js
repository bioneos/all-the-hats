var DemoController = function (sequenceStr) {
  
  var secondsAllowed = 30;
  var secondsRemain = secondsAllowed;

  var seqIndex = 0;
  var sequence = sequenceStr.toLowerCase().split(' ');
  var remainingClicks = sequence.length;

  var won = false;

  // To cheat, just open the console :)
  console.log(sequence);
  
  function reset()
  {
    document.getElementById('success-text-container').classList.add('hidden');
    document.body.style['background-color'] = 'white';
    document.body.style['color'] = 'black';
    remainingClicks = sequence.length;
    seqIndex = 0;
    document.getElementById('remaining-count').innerHTML = remainingClicks;
  }
  
  function successFunction()
  {
    // TODO: Function call for correct function goes in here.
    showMessage('Congratulations!');
    changeBackground('#6435c9');
    changeTextColor('white', '#fbbd08');

    won = true;
  }

  function showMessage(successMessage)
  {
    document.getElementById('success-text').innerHTML = successMessage;
    document.getElementById('success-text-container').classList.remove('hidden');
  }

  function changeTextColor(color, shadow)
  {
    document.body.style['color'] = color;
    if (shadow)
      document.body.style['text-shadow'] = '0 1px 1px' + shadow;
  }

  function changeBackground(color)
  {
    document.body.style['background-color'] = color;
  }

  function updatePage() {
    if (remainingClicks === 0)
    {
      remainingClicks = sequence.length;
      seqIndex = 0;
      successFunction();
    }
    document.getElementById('remaining-count').innerHTML = remainingClicks;
    //document.getElementById("timer").innerHTML = ":" + secondsRemain;
  }

  function buttonEventHandler() {
    document.getElementById('success-text-container').classList.add('hidden');
    document.body.style['background-color'] = 'white';
    document.body.style['color'] = 'black';
    if (this.classList.contains(sequence[seqIndex]))
    {
      // Correct
      seqIndex++;
      remainingClicks--;
    }
    else
    {
      // Incorrect
      seqIndex=0;
      alert('Wrong, Try again! (Hint: start with ' + sequence[0] + ', end with ' + sequence.slice(-1) + ')');
      remainingClicks = sequence.length;
    }

    updatePage();
  }

  return {
    init: function() {
      var buttons = document.querySelectorAll('.btn');
      buttons.forEach(function(button){
        button.addEventListener('click', buttonEventHandler);
      });

      //document.getElementById("timer").innerHTML = ":" + secondsAllowed;
      /*setInterval(function() {

        if (!won) secondsRemain--;
        document.getElementById("timer").innerHTML = ":" + secondsRemain;

        if (secondsRemain == 0)
        {
          secondsRemain = secondsAllowed;
          seqIndex = 0;
          alert('Too slow! Try again...');

          updatePage();
        }
      }, 1000);*/

      
      updatePage();
    },
    reset: reset
  }

}
