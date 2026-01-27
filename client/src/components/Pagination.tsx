import { useSearchParams } from "react-router-dom";

const Pagination = ({
  totalPages,
  changeSearchParams,
}: {
  totalPages: number;
  changeSearchParams: ({
    newQ,
    newPath,
    newPage,
  }: {
    newQ: string;
    newPath: string;
    newPage: string;
  }) => void;
}) => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const path = searchParams.get("path") || "title";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const MAX_VISIBLE_PAGES = 3;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    let start = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    // First page
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Last page
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <nav>
        <ul className="pagination pagination-sm">
          {/* Previous */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() =>
                changeSearchParams({
                  newQ: q,
                  newPath: path,
                  newPage: String(currentPage - 1),
                })
              }
            >
              {"<"}
            </button>
          </li>

          {getPageNumbers().map((pageNum, idx) => (
            <li
              key={idx}
              className={`page-item ${
                pageNum === currentPage ? "active" : ""
              } ${pageNum === "..." ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                style={{ width: "35px" }}
                disabled={pageNum === "..."}
                onClick={() =>
                  typeof pageNum === "number" &&
                  changeSearchParams({
                    newQ: q,
                    newPath: path,
                    newPage: pageNum.toString(),
                  })
                }
              >
                {pageNum}
              </button>
            </li>
          ))}

          {/* Next */}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() =>
                changeSearchParams({
                  newQ: q,
                  newPath: path,
                  newPage: String(currentPage + 1),
                })
              }
            >
              {">"}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
