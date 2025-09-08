import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <div className='pagination'>
      <button 
        className='page-btn' 
        onClick={() => onPageChange(page - 1)} 
        disabled={page <= 1}
      >
        Previous
      </button>
      <span>Page {page} of {totalPages}</span>
      <button 
        className='page-btn' 
        onClick={() => onPageChange(page + 1)} 
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
