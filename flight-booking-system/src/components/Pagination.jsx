import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';
import '../styles/Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // คำนวณหน้าที่จะแสดงในการนำทาง
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // จะแสดงปุ่มหน้าได้มากสุด 5 ปุ่ม
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // ถ้ามีหน้าน้อยกว่าหรือเท่ากับจำนวนปุ่มที่กำหนด แสดงทุกหน้า
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // คำนวณหน้าที่จะแสดง โดยให้หน้าปัจจุบันอยู่ตรงกลาง
      const leftOffset = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(currentPage - leftOffset, 1);
      const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
      
      // ปรับ startPage หากจำนวนหน้าที่แสดงน้อยกว่าที่กำหนด
      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
      }
      
      // เพิ่มหมายเลขหน้าเข้าไปในอาร์เรย์
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="custom-pagination">
      <BootstrapPagination>
        <BootstrapPagination.First 
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        />
        <BootstrapPagination.Prev 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        
        {getPageNumbers().map(number => (
          <BootstrapPagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => onPageChange(number)}
          >
            {number}
          </BootstrapPagination.Item>
        ))}
        
        <BootstrapPagination.Next 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <BootstrapPagination.Last 
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </BootstrapPagination>
    </div>
  );
};

export default Pagination;