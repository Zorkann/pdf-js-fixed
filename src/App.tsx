import { useEffect, useRef, useState } from "react";

import "./App.css";
import * as pdfjs from "pdfjs-dist";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";
import pdfFile from "./assets/test2.pdf";
import { changeNodes } from "./utils";
import { TextContent } from "pdfjs-dist/types/web/text_layer_builder";
import Toolbar from "./Toolbar";

const SCALE = 1.5;

const createContainers = ({ pageNumber }: { pageNumber: number }) => {
  const container = document.querySelector(".viewer") as HTMLDivElement;
  container.style.setProperty("--scale-factor", SCALE.toString());
  const canvas = document.createElement("canvas");
  const page = document.createElement("div");
  page.className = "page";
  page.dataset.pageNumber = pageNumber.toString();

  return { container, canvas, page };
};

const buildTextLayer = async ({
  textContent,
  viewPort,
}: {
  textContent: TextContent;
  viewPort: pdfjs.PageViewport;
}) => {
  const builder = new pdfjsViewer.TextLayerBuilder({});
  builder.setTextContentSource(textContent);

  await builder.render(viewPort);

  return changeNodes(builder);
};

const getDocumentPage = async ({
  pdfDocument,
  pageNumber,
}: {
  pdfDocument: pdfjs.PDFDocumentProxy;
  pageNumber: number;
}) => {
  const pdfPage = await pdfDocument.getPage(pageNumber);
  const viewPort = pdfPage.getViewport({ scale: SCALE });
  const textContent = await pdfPage.getTextContent();

  return { pdfPage, viewPort, textContent };
};

const getPdfDocument = async () => {
  const loadingTask = await pdfjs.getDocument({
    url: pdfFile,
    cMapUrl: "../node_modules/pdfjs-dist/cmaps/",
    cMapPacked: true,
    enableXfa: true,
  });
  const pdfDocument = await loadingTask.promise;

  return { pdfDocument };
};

const renderPdfToCanvas = async ({
  pdfPage,
  canvas,
  viewPort,
}: {
  pdfPage: pdfjs.PDFPageProxy;
  canvas: HTMLCanvasElement;
  viewPort: pdfjs.PageViewport;
}) => {
  pdfPage.render({
    canvasContext: canvas.getContext("2d") as CanvasRenderingContext2D,
    viewport: viewPort,
  });

  canvas.width = viewPort.width;
  canvas.height = viewPort.height;
};

async function render({
  pdfDocument,
  pageNumber = 1,
}: {
  pdfDocument: pdfjs.PDFDocumentProxy;
  pageNumber?: number;
}) {
  const { container, page, canvas } = createContainers({ pageNumber });
  const { pdfPage, viewPort, textContent } = await getDocumentPage({
    pdfDocument,
    pageNumber,
  });
  renderPdfToCanvas({ pdfPage, canvas, viewPort });

  const layer = await buildTextLayer({ textContent, viewPort });

  page.appendChild(canvas);
  page.appendChild(layer);
  container.appendChild(page);
}

function App() {
  const [length, setLength] = useState(1);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;

    didInit.current = true;

    async function handlePDF() {
      const { pdfDocument } = await getPdfDocument();

      setLength(pdfDocument.numPages);

      for (let i = 0; i < pdfDocument.numPages; i++) {
        await render({ pdfDocument, pageNumber: i + 1 });
      }
    }

    handlePDF();
  }, []);

  return (
    <div className="app">
      {length ? <Toolbar length={length} /> : null}
      <div className="viewer" />
    </div>
  );
}

export default App;
