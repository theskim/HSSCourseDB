import CoursesTable from './CourseTable';
import data from './courses.json';
import './App.css';

import React, { useState } from 'react';

const courses = data;

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFields, setSelectedFields] = useState({
        csc: false,
        businessMinor: false,
        aiMinor: false,
        geography: false,
        architecture: false,
        mythology: false,
        communication: false,
        goal: 'minimizeWorkload' 
    });
    const [topCourses, setTopCourses] = useState([]);
    const [showTopCourses, setShowTopCourses] = useState(false); 
    
    const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
        setSelectedFields(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    const closeXModal = () => {
        setTopCourses([]); 
        setShowTopCourses(false); 
        setIsModalOpen(false);
    };

    const handleGoalChange = (event) => {
        setSelectedFields(prev => ({
        ...prev,
        goal: event.target.value,
        }));
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

    const sortCoursesByWorkload = (a, b) => {
        return a.workload - b.workload;
    };
    const filterCourses = () => {
        let sortedCourses = [...courses];
        if (selectedFields.goal === 'gpaBooster') 
            sortedCourses.sort(sortCoursesByGrade);
        else if (selectedFields.goal === 'minimizeWorkload') 
            sortedCourses.sort(sortCoursesByWorkload);

        let prioritizedCourses = [];
        if (selectedFields.businessMinor) {
            prioritizedCourses = sortedCourses.filter(course => course.code.startsWith('JRE'));
            prioritizedCourses = [...new Set([...prioritizedCourses, ...sortedCourses.filter(course => course.code.startsWith('TEP'))])];
            return prioritizedCourses.slice(0, 4);
        }
        if (selectedFields.aiMinor) {
            prioritizedCourses = [...new Set([...prioritizedCourses, ...sortedCourses.filter(course => course.code.startsWith('HPS346'))])];
            sortedCourses = sortedCourses.filter(course => !course.code.startsWith('HPS346'));
        }

        if (prioritizedCourses.length >= 4)
            return prioritizedCourses.slice(0, 4);

        if (selectedFields.csc)
            sortedCourses = sortedCourses.filter(course => !course.code.startsWith('CSC300'));

        let somewhatPrioritizedCourses = [];
        if (selectedFields.architecture){
            somewhatPrioritizedCourses = [...new Set([...somewhatPrioritizedCourses, ...sortedCourses.filter(course => course.code.startsWith('ARC'))])];
            sortedCourses = sortedCourses.filter(course => !course.code.startsWith('ARC'));
        }
        if (selectedFields.architecture){
            somewhatPrioritizedCourses = [...new Set([...somewhatPrioritizedCourses, ...sortedCourses.filter(course => course.code.startsWith('CLA'))])];
            sortedCourses = sortedCourses.filter(course => !course.code.startsWith('CLA'));
        }
        if (selectedFields.geography){
            somewhatPrioritizedCourses = [...new Set([...somewhatPrioritizedCourses, ...sortedCourses.filter(course => course.code.startsWith('GGR'))])];
            sortedCourses = sortedCourses.filter(course => !course.code.startsWith('GGR'));
        }
        if (selectedFields.communication){
            somewhatPrioritizedCourses = [...new Set([...somewhatPrioritizedCourses, ...sortedCourses.filter(course => course.code.startsWith('TEP'))])];
            sortedCourses = sortedCourses.filter(course => !course.code.startsWith('TEP'));
        }
        
        if (selectedFields.goal === 'gpaBooster') 
            somewhatPrioritizedCourses.sort(sortCoursesByGrade);
        else if (selectedFields.goal === 'minimizeWorkload') 
            somewhatPrioritizedCourses.sort(sortCoursesByWorkload);

        let finalCourses = [...new Set([...prioritizedCourses, ...somewhatPrioritizedCourses, ...sortedCourses])];

        return finalCourses.slice(0, 4);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const topPicks = filterCourses();
        setTopCourses(topPicks);
        setShowTopCourses(true);
    };

    return (
        <div className="App">
        <p><b>UofT</b> Engineering <b>Bird HSS</b> Courses</p>
        <a href="https://forms.gle/ED68qWhJpU43JghN6">Request Bird Course</a>
        <br/><br/>
        <button className="button" onClick={() => setIsModalOpen(true)}>Automatically Pick Your Courses</button>
        {isModalOpen && (
            <div className="modal-background">
                <div className="modal-content">
                    <button className="close-button" onClick={closeXModal}>X</button>
                        {!showTopCourses ? (
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="checkbox-group">
                                    <label>
                                        <b>Only use this for reference. Select all that applies:</b>
                                    </label>
                                    <label>
                                        <input type="checkbox" name="csc" onChange={handleCheckboxChange} />
                                        I will be taking 3 CSC Courses (excluding CSC300)
                                    </label>
                                    <label>
                                        <input type="checkbox" name="businessMinor" onChange={handleCheckboxChange} />
                                        I am planning to pursue business minor.
                                    </label>
                                    <label>
                                        <input type="checkbox" name="aiMinor" onChange={handleCheckboxChange} />
                                        I am planning to pursue AI minor and I want to avoid ECE368.
                                    </label>
                                    <label>
                                        <input type="checkbox" name="geography" onChange={handleCheckboxChange} />
                                        I am interested in Geography.
                                    </label>
                                    <label>
                                        <input type="checkbox" name="architecture" onChange={handleCheckboxChange} />
                                        I am interested in Architecture.
                                    </label>
                                    <label>
                                        <input type="checkbox" name="mythology" onChange={handleCheckboxChange} />
                                        I am interested in Classical Mythology.
                                    </label>
                                    <label>
                                        <input type="checkbox" name="communication" onChange={handleCheckboxChange} />
                                        I am interested in Engineering Communication.
                                    </label>
                                </div>
                                <div className="radio-group">
                                    <label><b>What is your Goal?: </b></label>
                                    <label>
                                        <input type="radio" name="goal" value="minimizeWorkload" onChange={handleGoalChange} />
                                        Minimize Workload
                                    </label>
                                    <label>
                                        <input type="radio" name="goal" value="gpaBooster" onChange={handleGoalChange} />
                                        GPA Booster
                                    </label>
                                </div>
                                <button className="button submit-button" type="submit">Find Courses</button>
                            </form>
                        ) : (
                            <>
                                <label><b>Predicted HSS Courses</b></label>
                                <>
                                    {topCourses.map(course => (
                                        <label key={course.id}>{course.code} - {course.title}</label>
                                    ))}
                                </>
                            </>
                        )}
                </div>
            </div>
        )}
        <CoursesTable courses={data} />
        </div>
    );
};

export default App;
