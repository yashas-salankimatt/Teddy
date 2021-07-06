import './App.css';
import Navbar from './components/Navbar';
import BucketView from './components/BucketView';
import CalendarView from './components/CalendarView';
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
