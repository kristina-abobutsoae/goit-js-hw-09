import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  btnStart: document.querySelector('[data-start]'),
  timeDays: document.querySelector('[data-days]'),
  timeHours: document.querySelector('[data-hours]'),
  timeMinutes: document.querySelector('[data-minutes]'),
  timeSeconds: document.querySelector('[data-seconds]'),
};

refs.btnStart.disabled = true;
let timeId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    console.log(selectedDates[0]);
    const currentDate = new Date();

    if (selectedDates[0] - currentDate > 0) {
      refs.btnStart.disabled = false;
    } else {
      refs.btnStart.disabled = true;
      Notify.failure('Please choose a date in the future');
    }
  },
};

function addLeadingZero(value) {
  return String(value).padStart(2, 0);
}

function timeStart() {
  const selectedDate = formIn.selectedDates[0];
  refs.btnStart.disabled = true;
  refs.datetimePicker.disabled = true;

  timeId = setInterval(() => {
    const startTime = new Date();
    const countdown = selectedDate - startTime;

    if (countdown < 0) {
      clearInterval(timeId);
      refs.datetimePicker.disabled = false;
      return;
    }
    updateTime(convertMs(countdown));
  }, 1_000);
}

function updateTime({ days, hours, minutes, seconds }) {
  refs.timeDays.textContent = addLeadingZero(days);
  refs.timeHours.textContent = addLeadingZero(hours);
  refs.timeMinutes.textContent = addLeadingZero(minutes);
  refs.timeSeconds.textContent = addLeadingZero(seconds);
}

const formIn = flatpickr('#datetime-picker', options);

refs.btnStart.addEventListener('click', timeStart);
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}