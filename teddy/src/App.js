import './App.css';
import MainPage from './pages/MainPage';
import SignInPage from './pages/SignInPage';
import {BrowserRouter as Router, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <Route path='/' exact component={MainPage}></Route>
        <Route path='/signin' component={SignInPage}></Route>
      </div>
    </Router>
  );
}

export default App;
