import CoursesTable from './CourseTable';
import data from './courses.json';
import './App.css';

import React, { useState } from 'react';

const courses = data;

const App = () => {
    const year = new Date().getFullYear();
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
        setSelectedFields({
            csc: false,
            businessMinor: false,
            aiMinor: false,
            geography: false,
            architecture: false,
            mythology: false,
            communication: false,
            goal: 'minimizeWorkload' 
        });
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
        if (selectedFields.businessMinor){
            prioritizedCourses = sortedCourses.filter(course => course.code.startsWith('JRE'));

            if (selectedFields.geography)
                prioritizedCourses = [...new Set([...prioritizedCourses, ...sortedCourses.filter(course => course.code.startsWith('GGR252'))])];
            else 
                prioritizedCourses = [...new Set([...prioritizedCourses, ...sortedCourses.filter(course => course.code.startsWith('TEP'))])];
            return prioritizedCourses.slice(0, 4);
        }

        if (selectedFields.aiMinor){
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
        if (selectedFields.mythology){
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
            <a href="https://forms.gle/ED68qWhJpU43JghN6">Request Bird Course or Correct Info</a>
            <br/><br/>
            <button className="button" onClick={() => setIsModalOpen(true)}>Automatically Pick Courses</button>
            {isModalOpen && (
                <div className="modal-background">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeXModal}>✕</button>
                            {!showTopCourses ? (
                                <form className="form" onSubmit={handleSubmit}>
                                    <div className="checkbox-group">
                                        <label>
                                            <b>This prompt is just a guide; use it for reference only.<br/>Please select all options that apply to you:</b>
                                        </label>
                                        <label>
                                            <input type="checkbox" name="csc" onChange={handleCheckboxChange} />
                                            I plan to take 3 CSC courses (excluding CSC300).
                                        </label>
                                        <label>
                                            <input type="checkbox" name="businessMinor" onChange={handleCheckboxChange} />
                                            I am planning to pursue a minor in Engineering Business.
                                        </label>
                                        <label>
                                            <input type="checkbox" name="aiMinor" onChange={handleCheckboxChange} />
                                            I am aiming for an AI minor and wish to avoid ECE368.
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
                                            I want to minimize my workload.
                                        </label>
                                        <label>
                                            <input type="radio" name="goal" value="gpaBooster" onChange={handleGoalChange} />
                                            I am looking for GPA boosters.
                                        </label>
                                    </div>
                                    <button className="button submit-button" type="submit">Find Courses</button>
                                </form>
                            ) : (
                                <>
                                    <label><b>Predicted HSS Courses</b></label>
                                    <>
                                        {topCourses.map(course => (
                                            <label key={course.id}><a href={course.url}>{course.code}</a> - {course.title}</label>
                                        ))}
                                    </>
                                </>
                            )}
                    </div>
                </div>
            )}
            <CoursesTable courses={data} />
            <footer className="App-footer">
                <a href="https://www.youtube.com/watch?v=ZV7vFkZ1bsM">.</a>
            </footer>
        </div>
    );
};

export default App;
