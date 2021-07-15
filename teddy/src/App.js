import './App.css';
import MainPage from './pages/MainPage';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import UserProvider from './providers/UserProvider';

function App() {

  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Route path='/' exact component={MainPage}></Route>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
