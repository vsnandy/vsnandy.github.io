import React from 'react';
import Pagination from "react-bootstrap/Pagination";

const PaginationControls = ({ page, pageSize, total, onPageChange }) => {
  const lastPage = Math.floor(total / pageSize) + 1;

  return (
    <Pagination className="justify-content-center">
      <Pagination.First
        disabled={page === 1}
        onClick={() => onPageChange(1)}
      />
      <Pagination.Prev
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      />

      <Pagination.Item active>
        Page {page} of {lastPage}
      </Pagination.Item>

      <Pagination.Next
        disabled={page === lastPage}
        onClick={() => onPageChange(page + 1)}
      />

      <Pagination.Last
        disabled={page === lastPage}
        onClick={() => onPageChange(lastPage)}
      />
    </Pagination>
  );
}

export default PaginationControls;