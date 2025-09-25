import React, { Dispatch, SetStateAction } from "react";
import { Col, Row } from "react-bootstrap";

type Props = {
  currentPage: number; // 1-based index
  totalButtonsToShow: number;
  totalPages: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  style?: object;
};

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalButtonsToShow,
  totalPages,
  style,
}: Props) => {
  const half = Math.floor(totalButtonsToShow / 2);
  let startPage = Math.max(1, currentPage - half);
  let endPage = startPage + totalButtonsToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - totalButtonsToShow + 1);
  }

  return (
    <Row style={{ margin: 0 }}>
      <Col style={style}>
        <div className="d-flex justify-content-end mt-0 me-2">
          <ul className="pagination">
            {currentPage > 1 && (
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
            )}

            {Array.from(
              { length: endPage - startPage + 1 },
              (_, index) => startPage + index
            ).map((pageNum) => (
              <li
                key={pageNum}
                className={`page-item ${currentPage === pageNum ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(pageNum)}>
                  {pageNum}
                </button>
              </li>
            ))}

            {currentPage < totalPages && (
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            )}
          </ul>
        </div>
      </Col>
    </Row>
  );
};

export default Pagination;
