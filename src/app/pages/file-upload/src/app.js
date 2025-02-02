import Clock from './deps/clock.js';
import { fakeFetch } from './fake-fetch.js';
import View from './view.js';

const clock = new Clock();
const view = new View();
let took = '';

const worker = new Worker(new URL('./worker/worker.js', import.meta.url), {
  type: 'module',
});

worker.onerror = (error) => {
  console.error(error);
};

worker.onmessage = ({ data }) => {
  if (data.status !== 'done') return;
  console.log('Worker concluído');
  clock.stop();
  view.updateElapsedTime(`Process took ${took.replace('ago', '')}`);
  console.log('recebi no processo do app.js', data);
  if (data.buffers?.length) {
    view.downloadBlobAsFile(data.buffers, data.filename);
  }
};

view.configureOnFileChange((file) => {
  const canvas = view.getCanvas();
  worker.postMessage(
    {
      file,
      canvas,
    },
    [canvas],
  );

  clock.start((time) => {
    took = time;
    view.updateElapsedTime(`Process started ${time}`);
  });
});

fakeFetch();
