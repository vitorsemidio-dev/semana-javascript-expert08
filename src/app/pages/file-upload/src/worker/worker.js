onmessage = ({ data }) => {
  console.log('Iniciando Worker', data);

  setTimeout(() => {
    self.postMessage({
      status: 'done',
    });
  }, 2000);

  // troll
  // while (true) {}
};
