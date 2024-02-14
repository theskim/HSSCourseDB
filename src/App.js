import CoursesTable from './CourseTable';
import data from './courses.json';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>UofT Engineering Bird HSS Courses</h1>
      <a href="https://forms.gle/ED68qWhJpU43JghN6">Request Bird Course</a>
      <CoursesTable courses={data} />
    </div>
  );
}

export default App;
