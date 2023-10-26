import Clock from './deps/clock.js';
import { fakeFetch } from './fake-fetch.js';
import View from './view.js';

const clock = new Clock();
const view = new View();
let took = '';

view.configureOnFileChange((file) => {
  clock.start((time) => {
    took = time;
    view.updateElapsedTime(`Process started ${time}`);
  });
  setTimeout(() => {
    clock.stop();
    view.updateElapsedTime(`Process took ${took.replace('ago', '')}`);
  }, 5000);
});

fakeFetch();
