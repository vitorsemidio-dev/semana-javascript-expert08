import Clock from './deps/clock.js';
import { fakeFetch } from './fake-fetch.js';
import View from './view.js';

const clock = new Clock();
const view = new View();
let took = '';

const worker = new Worker(new URL('./worker/worker.js', import.meta.url), {
  type: 'module',
});

worker.onmessage = ({ data }) => {
  if (data.status !== 'done') return;
  console.log('Worker concluído');
  clock.stop();
  view.updateElapsedTime(`Process took ${took.replace('ago', '')}`);
  console.log('recebi no processo do app.js', data);
};

view.configureOnFileChange((file) => {
  worker.postMessage({
    file,
  });
  clock.start((time) => {
    took = time;
    view.updateElapsedTime(`Process started ${time}`);
  });
});

fakeFetch();
