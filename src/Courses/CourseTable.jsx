import React, { useState, useCallback, useMemo, useEffect } from 'react';

const CoursesTable = ({ courses }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'code', ascending: true });
    const [currentPage, setCurrentPage] = useState(() => {
        return Number(localStorage.getItem('currentPage')) || 1;
    });
    const coursesPerPage = 17;
    const rangeSize = 5;
    const [pageRange, setPageRange] = useState({ start: 1, end: 5 });
    const [searchQuery, setSearchQuery] = useState('');
    const [lastAction, setLastAction] = useState('sort');
    const [sortMessage, setSortMessage] = useState("Sort by Course Code in Ascending Order"); 

    // 0: Fall > Winter > Summer, 1: Winter > Summer > Fall, 2: Summer > Fall > Winter
    const [seasonSortOrder, setSeasonSortOrder] = useState(0); 

    // store current paghe in local storage to maintain it when refreshed
    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    const requestSort = (key) => {
        let ascending = true;
        if (sortConfig.key === key && sortConfig.ascending)
            ascending = false;
        else 
            ascending = true;
        setSortConfig({ key, ascending });

        var message;
        if (key === 'season') {
            setSeasonSortOrder(prevOrder => (prevOrder + 1) % 3);
            message = "Sort by Terms in ";
            if (seasonSortOrder === 0)
                message += "Fall → Winter → Summer Order";
            else if (seasonSortOrder === 1)
                message += message += "Winter → Summer → Fall Order";
            else
                message += message += "Summer → Fall → Winter Order";

            setSortMessage(message);
        }
        else {
            setCurrentPage(1);
            if (key === 'code')
                message = "Sort by Course Code in "
            else if (key === 'title')
                message = "Sort by Course Title in "
            else if (key === 'course_avg')
                message = "Sort by Course Average in "
            else if (key === 'description')
                message = "Sort by Course Description in "

            if (ascending)
                message += "Ascending Order";
            else
                message += "Descending Order";
                
            setSortMessage(message);
        }

        setLastAction('sort');
    };

    const gradeValues = {
        'A+': 12, 'A': 11, 'A-': 10,
        'B+': 9, 'B': 8, 'B-': 7,
        'C+': 6, 'C': 5, 'C-': 4,
        'D+': 3, 'D': 2, 'D-': 1,
        'F': 0, 'N/A': -1 
    };
    
    const sortCoursesByGrade = useCallback((a, b) => {
        if (sortConfig.ascending)
            return (gradeValues[b.course_avg] || -1) - (gradeValues[a.course_avg] || -1);
        else
            return (gradeValues[a.course_avg] || -1) - (gradeValues[b.course_avg] || -1);
    }, [sortConfig, gradeValues]);


    const sortedCourses = useMemo(() => {
        const filteredCourses = courses.filter(course =>
            !searchQuery ||
            course.code.toLowerCase().includes(searchQuery) ||
            course.title.toLowerCase().includes(searchQuery)
        );

        const applySortConfig = (a, b) => {
            if (sortConfig.key === 'course_avg')
                return sortCoursesByGrade(a, b);
            else if (sortConfig.key){
                let compareResult = 0;
                if (sortConfig.key === 'code') {
                    const splitRegex = /(\D+)(\d+)/; 
                    let aMatches = a.code.match(splitRegex);
                    let bMatches = b.code.match(splitRegex);

                    let aDepartment = aMatches[1];
                    let bDepartment = bMatches[1];
                    let aNum = parseInt(aMatches[2], 10);
                    let bNum = parseInt(bMatches[2], 10);

                    if (aDepartment !== bDepartment) {
                        compareResult = sortConfig.toggle ? bDepartment.localeCompare(aDepartment) : aDepartment.localeCompare(bDepartment);
                    }
                    else 
                        compareResult = aNum - bNum;
                    

                    return sortConfig.ascending ? compareResult : -compareResult;
                } else if (sortConfig.key === 'season'){
                    const termScores = [
                        { Fall: 3, Winter: 2, Summer: 1 }, // Fall > Winter > Summer
                        { Winter: 3, Summer: 2, Fall: 1 }, // Winter > Summer > Fall
                        { Summer: 3, Fall: 2, Winter: 1 }  // Summer > Fall > Winter
                    ][seasonSortOrder];
                    
                    const getTermScore = (course) => {
                        let score = 0;
                        if (course.fall) score += termScores.Fall;
                        if (course.winter) score += termScores.Winter;
                        if (course.summer) score += termScores.Summer;
                        return score;
                    };

                    const aScore = getTermScore(a);
                    const bScore = getTermScore(b);
                    return bScore - aScore;
                } 
                else 
                    compareResult = a[sortConfig.key].localeCompare(b[sortConfig.key]);

                return sortConfig.ascending ? compareResult : -compareResult;
            }

            return 0; 
        };

        return filteredCourses.sort((a, b) => {
            if (lastAction === 'search' && searchQuery) {
                let aScore = (a.code.toLowerCase().includes(searchQuery) ? 2 : 0) + (a.title.toLowerCase().includes(searchQuery) ? 1 : 0);
                let bScore = (b.code.toLowerCase().includes(searchQuery) ? 2 : 0) + (b.title.toLowerCase().includes(searchQuery) ? 1 : 0);
                
                if (aScore !== bScore) 
                    return bScore - aScore;
            }
            return applySortConfig(a, b);
        });
    }, [courses, searchQuery, sortConfig, lastAction, sortCoursesByGrade]);


    const currentCourses = useMemo(() => {
        const start = (currentPage - 1) * coursesPerPage;
        const end = start + coursesPerPage;
        return sortedCourses.slice(start, end);
    }, [currentPage, sortedCourses, coursesPerPage]);

    const pageCount = Math.ceil(sortedCourses.length / coursesPerPage);
    useEffect(() => {
        setPageRange(prevRange => {
            const newEnd = Math.min(prevRange.start + rangeSize - 1, pageCount);
            return { start: prevRange.start, end: Math.max(newEnd, 1) };
        });
        setCurrentPage(1); 
    }, [pageCount]);

    const updatePageRange = (direction) => {
        if (direction === 'next' && pageRange.end < pageCount){
            const newEnd = Math.min(pageRange.end + rangeSize, pageCount);
            setPageRange({ start: pageRange.end + 1, end: newEnd });
        } else if (direction === 'prev' && pageRange.start > 1){
            const newStart = Math.max(pageRange.start - rangeSize, 1);
            const newEnd = newStart + rangeSize - 1;
            setPageRange({ start: newStart, end: Math.min(newEnd, pageCount) });
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
        setCurrentPage(1);
        setLastAction('search');
    };

    return (
        <>
            <div className="search-wrapper">
                <div className="search-container" style={{ marginBottom: '20px', position: 'relative', maxWidth: '500px' }}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by course code or name..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="clear-button"
                        >
                            &#x2715; 
                        </button>
                    )}
                </div>
            </div>
            <div id="sortMessageContainer">{sortMessage}</div>
            {sortedCourses.length > 0 ? (
                <>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                <th onClick={() => requestSort('code')}>Course Code</th>
                                <th className="title" onClick={() => requestSort('title')}>Title</th>
                                <th onClick={() => requestSort('course_avg')}>Typical Avg.</th>
                                <th onClick={() => requestSort('description')}>Why this Course?</th>
                                <th onClick={() => requestSort('season')}>Terms</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {currentCourses.map((course) => (
                                    <tr key={course.code}>
                                        <td><a href={course.url}>{course.code}</a></td>
                                        <td className="title">{course.title}</td>
                                        <td>{course.course_avg}</td>
                                        <td>{course.description}</td>
                                        <td>
                                            {course.fall && (
                                                <div className="tooltip">
                                                <span>&#x1F342;</span>
                                                <span className="tooltiptext">Fall</span>
                                                </div>
                                            )}
                                            {course.winter && (
                                                <div className="tooltip">
                                                <span>&#x2744;&#xFE0F;</span>
                                                <span className="tooltiptext">Winter</span>
                                                </div>
                                            )}
                                            {course.summer && (
                                                <div className="tooltip">
                                                <span>&#x1F31E;</span>
                                                <span className="tooltiptext">Summer</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div> 
                    <div className="pagination">
                        {pageRange.start > 1 && (
                            <button onClick={() => updatePageRange('prev')}>«</button>
                        )}
                        {Array.from({ length: pageRange.end - pageRange.start + 1 }, (_, index) => (
                            <button
                                key={index + pageRange.start}
                                className={currentPage === index + pageRange.start ? 'active' : ''}
                                onClick={() => setCurrentPage(index + pageRange.start)}
                            >
                                {index + pageRange.start}
                            </button>
                        ))}
                        {pageRange.end < pageCount && (
                            <button onClick={() => updatePageRange('next')}>»</button>
                        )}
                    </div>
                </>
            ) : (
                <p>No courses found matching your criteria.</p>
            )}
            <br /><br />
        </>
    );
};

export default CoursesTable;
