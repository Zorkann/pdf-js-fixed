import { useState } from "react";

function goToPage(pageNumber: number) {
  const page = document.querySelector(
    `.page[data-page-number="${pageNumber}"]`
  );

  if (page) {
    page.scrollIntoView();
  }
}

export default function Toolbar({ length }: { length: number }) {
  const [currentPage, setCurrentPage] = useState(1);

  function back() {
    if (currentPage === 1) return;

    setCurrentPage(currentPage - 1);
    goToPage(currentPage - 1);
  }

  function forward() {
    if (currentPage === length) return;

    setCurrentPage(currentPage + 1);
    goToPage(currentPage + 1);
  }

  return (
    <div className="toolbar">
      <button onClick={back}>{"<"}</button>
      <span>
        {currentPage}/{length}
      </span>
      <button onClick={forward}>{">"}</button>
    </div>
  );
}
