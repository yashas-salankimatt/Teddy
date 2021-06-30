import './App.css';
import Navbar from './components/navbar';
import BucketView from './components/bucketView';
import CalendarView from './components/calendarView';
import { Button } from 'bootstrap';

function App() {
  return (
    <div className="App">
      <div className="Navbar">
        <Navbar></Navbar>
      </div>
      <div className="MainViewWrapper">
        <div className="Buckets">
          <BucketView></BucketView>
        </div>
        <div className="CalendarView">
          <CalendarView></CalendarView>
        </div>
      </div>
    </div>
  );
}

export default App;
