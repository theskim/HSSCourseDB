import React, { useState, useMemo } from 'react';

const CoursesTable = ({ courses }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'code', direction: 'ascending' });
  
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10; 

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending')
      direction = 'descending';
    else 
        direction = 'ascending';
      
    setSortConfig({ key, direction });
  };

  const sortedCourses = useMemo(() => {
    let sortableCourses = [...courses];
    if (sortConfig.key !== null) {
      sortableCourses.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) 
          return sortConfig.direction === 'ascending' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) 
          return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableCourses;
  }, [courses, sortConfig]);

  const pageCount = Math.ceil(sortedCourses.length / coursesPerPage);

  const currentCourses = useMemo(() => {
    const start = (currentPage - 1) * coursesPerPage;
    const end = start + coursesPerPage;
    return sortedCourses.slice(start, end);
  }, [currentPage, sortedCourses, coursesPerPage]);

  return (
    <>
        <table>
            <thead>
            <tr>
                <th onClick={() => requestSort('code')}>Course Code</th>
                <th onClick={() => requestSort('title')}>Title</th>
                <th onClick={() => requestSort('course_avg')}>Typical Avg.</th>
                <th onClick={() => requestSort('description')}>Why this Course?</th>
            </tr>
            </thead>
            <tbody>
            {currentCourses.map((course) => (
                <tr key={course.id}>
                <td><a href={course.url}>{course.code}</a></td>
                <td>{course.title}</td>
                <td>{course.course_avg}</td>
                <td>{course.description}</td>
                </tr>
            ))}
            </tbody>
        </table> <br/>
        <div>
            {Array.from({ length: pageCount }, (_, index) => (
            <button key={index} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
            </button>
            ))}
        </div>
    </>
  );
};

export default CoursesTable;
