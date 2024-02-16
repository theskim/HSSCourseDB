import React, { useState, useMemo } from 'react';

const CoursesTable = ({ courses }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'code', ascending: true });
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 10;

    const requestSort = (key) => {
        let ascending = true;
        if (sortConfig.key === key && sortConfig.ascending) {
            ascending = false;
        } else {
            ascending = true;
        }
        setSortConfig({ key, ascending });
    };

    const gradeValues = {
        'A+': 12, 'A': 11, 'A-': 10,
        'B+': 9, 'B': 8, 'B-': 7,
        'C+': 6, 'C': 5, 'C-': 4,
        'D+': 3, 'D': 2, 'D-': 1,
        'F': 0, 'N/A': -1 
    };

    const sortCoursesByGrade = (a, b) => {
        return (gradeValues[b.course_avg] || -1) - (gradeValues[a.course_avg] || -1);
    };

    const sortedCourses = useMemo(() => {
        let sortableCourses = [...courses];
        if (sortConfig.key === 'course_avg') 
            return sortableCourses.sort(sortCoursesByGrade);
        else if (sortConfig.key !== null) {
            sortableCourses.sort((a, b) => { 
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.ascending ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.ascending ? 1 : -1;
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
        <div className="table-responsive">
            <table>
            <thead>
                <tr>
                <th onClick={() => requestSort('code')}>Course Code</th>
                <th onClick={() => requestSort('title')}>Title</th>
                <th onClick={() => requestSort('course_avg')}>Typical Avg.</th>
                <th onClick={() => requestSort('description')}>Why this Course?</th>
                <th onClick={() => requestSort('summer')}>Summer?</th>
                </tr>
            </thead>
            <tbody>
                {currentCourses.map((course) => (
                <tr key={course.id}>
                    <td><a href={course.url}>{course.code}</a></td>
                    <td>{course.title}</td>
                    <td>{course.course_avg}</td>
                    <td>{course.description}</td>
                    <td>
                        {course.summer ? '✓' : '✕'}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div> 
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
