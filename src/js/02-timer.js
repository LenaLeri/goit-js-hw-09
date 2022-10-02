import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

require('flatpickr/dist/themes/confetti.css');

Notify.init({
  width: '280px',
  position: 'center-top',
  timeout: 1000,
});

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() < Date.now()) {
      Notify.failure('Please choose a date in the future');
      return;
    }
    Notify.success('Success date, push start, please!');
    refs.startBtn.disabled = false;

    return;
  },
};

const flatpickrTime = flatpickr(refs.input, options);

refs.startBtn.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  if (flatpickrTime.selectedDates[0].getTime() > Date.now()) {
    refs.startBtn.disabled = true;
    refs.input.disabled = true;

    const timerId = setInterval(() => {
      let deltaTime = flatpickrTime.selectedDates[0].getTime() - Date.now();

      timeUpdate(convertMs(deltaTime));
      timerEnd(deltaTime, timerId);
    }, 1000);
  }
}

function timerEnd(e, timerId) {
  if (e < 0) {
    clearInterval(timerId);
    Notify.success('End');
    timeClear();
  }
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function timeUpdate({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

const addLeadingZero = value => value.toString().padStart(2, 0);

function timeClear() {
  refs.days.textContent = '00';
  refs.hours.textContent = '00';
  refs.minutes.textContent = '00';
  refs.seconds.textContent = '00';
}
