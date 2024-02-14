import CoursesTable from './CourseTable';
import data from './courses.json';
import './App.css';

function App() {
  return (
    <div className="App">
        <p><b>UofT</b> Engineering <b>Bird HSS</b> Courses</p>
        <a href="https://forms.gle/ED68qWhJpU43JghN6">Request Bird Course</a>
        <br/><br/>
        <CoursesTable courses={data} />
    </div>
  );
}

export default App;
