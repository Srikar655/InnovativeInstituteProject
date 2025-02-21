/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const {file}=data;
  const reader = new FileReader();
        reader.onload = async () => {
          const bytes =  new Uint8Array(reader.result as ArrayBuffer) ;
          postMessage(bytes);
        };
        reader.readAsArrayBuffer(file); 
         
});
