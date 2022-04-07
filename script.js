const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeElBtn = document.getElementById('complete-button');

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// set the date input mini with todays date
const today = new Date().toISOString().split('T')[0];
// dateEl.setAttribute('min', today);

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

// populate countdown / complete UI
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;
    console.log('distance', distance);

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour); // % referes to the remiander operater
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);
    console.log(days, hours, minutes, seconds);

    // hide input
    inputContainer.hidden = true;

    // if the countdown has ened show complete
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      // else show countdown in prgress
      // populate countdown
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);

}

// take values from form inputs
function updateCountdown(e) {
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  // console.log(countdownTitle, countdownDate);
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate
  };
  // console.log(savedCountdown);
  localStorage.setItem('countdown', JSON.stringify(savedCountdown)); // json need for the server

  if (countdownDate === '') {
    alert('Please select a date for the countdown');
  } else {
    // get number of current date, update dom
    countdownValue = new Date(countdownDate).getTime();
    // console.log('countdown value:', countdownValue);
    updateDOM();
  }

}

// reset all values
function reset() {
  // hide countdowns show input
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  // stop countdown
  clearInterval(countdownActive);
  // reset values
  countdownTitle = '';
  countdownDate = '';
  localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
  console.log('here');
  // get countdown from local storage if availabel
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeElBtn.addEventListener('click', reset);

// onload check local storage
restorePreviousCountdown();