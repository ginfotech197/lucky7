
function rollDice(x,y) {
    const dice = [...document.querySelectorAll(".die-list")];
    var i=0;
    dice.forEach(die => {
      toggleClasses(die);
      if(i==0){
        die.dataset.roll = x;
        // die.dataset.roll = getRandomNumber(1, 6);
      }
      if(i==1){
        die.dataset.roll = y;
        // die.dataset.roll = getRandomNumber(1, 6);
      }
      i++; 
      
    });
  }
  
  function toggleClasses(die) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
  }
  
  function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
//   document.getElementById("roll-button").addEventListener("click", rollDice);
