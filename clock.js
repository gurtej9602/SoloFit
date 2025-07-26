// Penalty Clock Script
// This script updates a clock element with the current time every second
const clockElement = document.getElementById("penaltyClock");
if (!clockElement) {
  console.error("Clock element not found");
}
function updateClock() {
  const now = new Date();
  
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to display the clock immediately
updateClock();
