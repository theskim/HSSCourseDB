import CoursesTable from './Courses/CourseTable';
import data from './Courses/courses.json';
import './App.css';

import React, { useState } from 'react';

const courses = data;

const App = () => {
    const coursesByInterest = {
        geography: ['GGR124H1', 'GGR252H1', 'GGR217H1', 'GGR107H1', 'GGR223H1', 'GGR251H1', 'GGR254H1'], 
        architecture: ['ARC181H1', 'JAV151H1', 'FAH215H1', 'FAH216H1', 'FAH230H1', 'FAH231H1'], 
        mythology: ['CLA204H1', 'CLA160H1', 'MST201H1', 'CLA236H1', 'CLA201H1', 'CLA230H1', 'CLA231H1', 'CLA232H1', 'CLA233H1'], 
        politics: ['POL101H1', 'POL107H1', 'POL109H1', 'POL214H1', 'POL208H1', 'POL200Y1', 'POL349H1'],
        communication: ['TEP444H1', 'TEP442H1', 'TEP343H1', 'TEP445H1', 'TEP449H1', 'TEP321H1', 'TEP322H1', 'APS500H1'],
        philosophy: ['HPS100H1', 'HPS250H1', 'PHL100Y1', 'PHL100Y1', 'PHL233H1','PHL200Y1', 'PHL256H1', 'PHL205H1'],
        history: ['HPS100H1', 'HPS250H1', 'PHL100Y1', 'PHL233H1', 'PHL200Y1', 'PHL256H1', 'PHL205H1'],
        linguistics: ['LIN101H1', 'LIN102H1', 'LIN201H1', 'LIN203H1', 'LIN200H1','LIN241H1', 'FRE272H1', 'LIN229H1'],
        enviornment: ['FOR308H1', 'ENV100H1', 'GGR107H1', 'ENV221H1', 'FOR303H1', 'ENV323H1','ENV333H1', 'ENV462H1'],
        ai: ['HPS340H1'],
        business: ['GGR252H1', 'TEP444H1', 'APS500H1', 'TEP343H1', 'TEP445H1', 'TEP449H1'],
        communicationCert: ['TEP322H1', 'TEP324H1', 'TEP449H1', 'TEP445H1', 'TEP320H1'],
        leadership: ['TEP444H1', 'TEP343H1', 'TEP447H1', 'TEP449H1', 'TEP445H1'],
    };  

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFields, setSelectedFields] = useState({
        csc: false,
        businessMinor: false,
        aiMinor: false,
        communication: false,
        leadership: false,
        goal: 'minimizeWorkload' 
    });
    const [topCourses, setTopCourses] = useState([]);
    const [alternativeCourses, setAlternativeCourses] = useState([]);
    const [showTopCourses, setShowTopCourses] = useState(false); 

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setSelectedFields(prev => ({
            ...prev,
            [name]: checked,
        }));
    };
        
    const [interestPoints, setInterestPoints] = useState({
        geography: 0,
        architecture: 0,
        mythology: 0,
        communication: 0,
        politics: 0,
        philosophy: 0,
        linguistics: 0,
        enviornment: 0,
    });

    const incrementInterest = (interest) => {
        if (interestPoints[interest] < 4 && getTotalPoints() < 4) {
            setInterestPoints(prev => ({ ...prev, [interest]: prev[interest] + 1 }));
        }
    };

    const decrementInterest = (interest) => {
        if (interestPoints[interest] > 0) {
            setInterestPoints(prev => ({ ...prev, [interest]: prev[interest] - 1 }));
        }
    };

    const getTotalPoints = () => {
        return Object.values(interestPoints).reduce((acc, value) => acc + value, 0);
    };

    const closeXModal = () => {
        setTopCourses([]); 
        setSelectedFields({
            csc: false,
            businessMinor: false,
            aiMinor: false,
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
        let tempAlternativeCourses = [];

        if (selectedFields.businessMinor) {
            prioritizedCourses = sortedCourses.filter(course => course.code.startsWith('JRE'));

            if (interestPoints['geography'] > 0) {
                prioritizedCourses = [...new Set([...prioritizedCourses, ...sortedCourses.filter(course => course.code.startsWith('GGR252'))])];
                sortedCourses = sortedCourses.filter(course => !course.code.startsWith('GGR252'));
            } else { 
                prioritizedCourses = [...new Set([...prioritizedCourses, ...sortedCourses.filter(course => course.code.startsWith('TEP444'))])];
                sortedCourses = sortedCourses.filter(course => !course.code.startsWith('TEP444'));
            }
            const relevantCourses = coursesByInterest['business']?.slice(0, 3) || [];

            relevantCourses.forEach(courseCode => {
                const foundCourse = sortedCourses.find(course => course.code === courseCode);
                if (foundCourse) tempAlternativeCourses.push(foundCourse);
            });
        }

        if (selectedFields.aiMinor) {
            prioritizedCourses = [...new Set([...prioritizedCourses, ...sortedCourses.filter(course => course.code.startsWith('HPS346'))])];
            sortedCourses = sortedCourses.filter(course => !course.code.startsWith('HPS346'));

            const relevantCourses = coursesByInterest['ai'] || [];

            relevantCourses.forEach(courseCode => {
                const foundCourse = sortedCourses.find(course => course.code === courseCode);
                if (foundCourse) tempAlternativeCourses.push(foundCourse);
            });
        }

        if (selectedFields.communication) {
            const relevantCourses = coursesByInterest['communicationCert']?.slice(0, 3) || [];

            relevantCourses.forEach(courseCode => {
                const foundCourse = sortedCourses.find(course => course.code === courseCode);
                if (foundCourse) prioritizedCourses.push(foundCourse);
            });
            
            const somewhatRelevantCourses = coursesByInterest['communicationCert']?.slice(4, 6) || [];
            somewhatRelevantCourses.forEach(courseCode => {
                const foundCourse = sortedCourses.find(course => course.code === courseCode);
                if (foundCourse) tempAlternativeCourses.push(foundCourse);
            });
        }

        if (selectedFields.leadership) {
            const relevantCourses = coursesByInterest['leadership']?.slice(0, 3) || [];

            relevantCourses.forEach(courseCode => {
                const foundCourse = sortedCourses.find(course => course.code === courseCode);
                if (foundCourse) prioritizedCourses.push(foundCourse);
            });

            const somewhatRelevantCourses = coursesByInterest['leadership']?.slice(4, 6) || [];
            somewhatRelevantCourses.forEach(courseCode => {
                const foundCourse = sortedCourses.find(course => course.code === courseCode);
                if (foundCourse) tempAlternativeCourses.push(foundCourse);
            });
        }

        if (selectedFields.csc)
            sortedCourses = sortedCourses.filter(course => !course.code.startsWith('CSC300'));

        let somewhatPrioritizedCourses = [];

        const prioritizeCoursesByInterest = () => {
            Object.entries(interestPoints).forEach(([interest, points]) => {
                if (points <= 0) return;

                const relevantCourses = coursesByInterest[interest]?.slice(0, points) || [];
                const maxSliceIndex = Math.min(2 * points, coursesByInterest[interest]?.length || 0);
                const somewhatRelevantCourses = coursesByInterest[interest]?.slice(points, maxSliceIndex) || [];
                somewhatRelevantCourses.forEach(courseCode => {
                    const foundCourse = sortedCourses.find(course => course.code === courseCode);
                    if (foundCourse) tempAlternativeCourses.push(foundCourse);
                });

                relevantCourses.forEach(courseCode => {
                    const foundCourse = sortedCourses.find(course => course.code === courseCode);
                    if (foundCourse) somewhatPrioritizedCourses.push(foundCourse);
                });

                sortedCourses = sortedCourses.filter(course => !relevantCourses.includes(course.code));
            });
        };

        prioritizeCoursesByInterest();

        if (selectedFields.goal === 'gpaBooster')
            somewhatPrioritizedCourses.sort(sortCoursesByGrade);
        else if (selectedFields.goal === 'minimizeWorkload')
            somewhatPrioritizedCourses.sort(sortCoursesByWorkload);

        let finalCourses = [...new Set([...prioritizedCourses, ...somewhatPrioritizedCourses, ...sortedCourses])];
        let recommandCourses = finalCourses.slice(0, 4);
        
        let altCoursesRemaining = 6 - tempAlternativeCourses.length;
        if (altCoursesRemaining > 0) 
            tempAlternativeCourses = [...tempAlternativeCourses, ...finalCourses.slice(5, 5 + altCoursesRemaining)];

        return [ recommandCourses, tempAlternativeCourses ];
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const [topPicks, alternativePicks] = filterCourses();
        setTopCourses(topPicks);
        setAlternativeCourses(alternativePicks);
        setShowTopCourses(true);
    };

    return (
        <div className="App">
            <p><b>UofT</b> Engineering <b>HSS</b> Courses Selector</p>
            <a href="https://forms.gle/ED68qWhJpU43JghN6">Request Course or Correct Info</a>
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
                                        <input type="checkbox" name="communication" onChange={handleCheckboxChange} />
                                            I am aiming for a Certifcate in Communication.
                                        </label>
                                        <label>
                                        <input type="checkbox" name="communication" onChange={handleCheckboxChange} />
                                            I am aiming for a Certifcate in Engineering Leadership.
                                        </label>
                                    </div>
                                    <div className="radio-group">
                                        <label><b>You can select none if you are not interested in any of them.<br/> Distribute up to 4 points based on your interests:</b></label>
                                        {['geography', 'architecture', 'mythology', 'communication', 'politics', 'philosophy', 'linguistics', 'enviornment'].map((interest) => (
                                            <div key={interest} className="interest-input">
                                                <span>{interest === 'politics' ? 'Political Science' : interest.charAt(0).toUpperCase() + interest.slice(1)}:</span>
                                                <button type="button" onClick={() => decrementInterest(interest)}>-</button>
                                                <input
                                                    type="number"
                                                    name={interest}
                                                    min="0"
                                                    max="4"
                                                    value={interestPoints[interest]}
                                                    readOnly
                                                />
                                                <button type="button" onClick={() => incrementInterest(interest)}>+</button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="radio-group">
                                        <label><b>What is your Goal? (default is workload): </b></label>
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
                                    <label><b>Alternative Suggested Courses</b></label>
                                    <>
                                        {alternativeCourses.map(course => (
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
                Pretty much all from <a href="https://app.powerbi.com/reportEmbed?reportId=644e934c-b65d-41db-8767-84a03f149447&autoAuth=true&ctid=78aac226-2f03-4b4d-9037-b46d56c55210">here</a> except ones not available right now <br />
                Sources: <a href="https://uoftcourses.web.app/">here</a> <a href="https://docs.google.com/spreadsheets/d/1cqcxrcIXoVKsspBXS3WBasdxiaECem2M1t-dGAKVqVU/edit#gid=103767365">here</a>
            </footer>
        </div>
    );
};

export default App;
