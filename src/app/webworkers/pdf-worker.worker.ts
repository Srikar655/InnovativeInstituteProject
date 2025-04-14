/// <reference lib="webworker" />

import jsPDF from "jspdf";

addEventListener('message', ({ data }) => {
  const {taskImages}=data;
  const pdf=new jsPDF();
  taskImages.forEach((image: any, index: number) => {
    if (index > 0) {
      pdf.addPage();
    }
    const imgData = 'data:image/png;base64,' + image;
    pdf.addImage(imgData, 'PNG', 0, 0, 200, 200);
  });

  const pdfBlob = new Blob([pdf.output('arraybuffer')], { type: 'application/pdf' });
  
  postMessage(pdfBlob);
});
