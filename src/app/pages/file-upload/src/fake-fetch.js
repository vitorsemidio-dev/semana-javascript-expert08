export async function fakeFetch() {
  const filePath = '/videos/frag_bunny.mp4';
  const response = await fetch(filePath);
  const file = new File([await response.blob()], filePath, {
    type: 'video/mp4',
    lastModified: new Date(),
  });

  const event = new Event('change');
  Reflect.defineProperty(event, 'target', { value: { files: [file] } });

  document.getElementById('fileUpload').dispatchEvent(event);
}
