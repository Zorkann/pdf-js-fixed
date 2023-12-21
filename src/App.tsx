import { useEffect, useRef } from "react";

import "./App.css";
import * as pdfjs from "pdfjs-dist";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";
import pdfFile from "./assets/test2.pdf";

function changeNodes(builder: pdfjsViewer.TextLayerBuilder) {
  builder.div.childNodes.forEach((el) => {
    // Create a new div element
    const newDiv = document.createElement("div");
    // Create a new span element within the div
    const layerSpan = document.createElement("span");
    layerSpan.style.transform = "none";
    layerSpan.style.left = el.style.left;
    layerSpan.style.top = el.style.top;

    // newDiv.appendChild(layerSpan);
    // Create a new p element within the div
    const newP = document.createElement("p");

    newP.textContent = el.textContent; // Copy the text content from the original span

    for (let i = 0; i < el.attributes.length; i++) {
      const attribute = el.attributes[i];
      newP.setAttribute(attribute.name, attribute.value);
    }

    newDiv.appendChild(newP);
    // Replace the original span with the new div
    builder.div.replaceChild(newDiv, el);
  });
}

function App() {
  const layerRef = useRef<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>();

  async function manualPdfToCanvas() {
    const layer = layerRef.current;
    const canvas = canvasRef.current;

    const loadingTask = await pdfjs.getDocument({
      url: pdfFile,
      cMapUrl: "../node_modules/pdfjs-dist/cmaps/",
      cMapPacked: true,
      enableXfa: true,
    });

    const pdfDocument = await loadingTask.promise;

    const pdfPage = await pdfDocument.getPage(1);

    const viewPort = pdfPage.getViewport({ scale: 1.5 });

    canvas.width = viewPort.width;
    canvas.height = viewPort.height;

    pdfPage.render({
      canvasContext: canvas?.getContext("2d"),
      viewport: viewPort,
    });

    //////

    const textContent = await pdfPage.getTextContent();

    const builder = new pdfjsViewer.TextLayerBuilder({});

    builder.setTextContentSource(textContent);

    await builder.render(viewPort);

    changeNodes(builder);

    document.querySelector(".page")?.appendChild(builder.div);
  }

  useEffect(() => {
    manualPdfToCanvas();
  }, []);

  return (
    <>
      <div className="page">
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}

export default App;
