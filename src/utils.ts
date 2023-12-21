import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";

export function changeNodes(builder: pdfjsViewer.TextLayerBuilder) {
  const parent = builder.div.cloneNode(true) as HTMLDivElement;
  const children = Array.from(parent.children) as HTMLElement[];

  children.forEach((el) => {
    if (el.nodeName === "BR") {
      return el.remove();
    }

    const newDiv = document.createElement("div");

    parent.appendChild(newDiv);
    newDiv.appendChild(el);
  });

  return parent;
}
