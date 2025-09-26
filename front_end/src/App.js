import logo from './logo.svg';
import './App.css';
import Prediction from "./components/Prediction";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home';
import Result from './components/Result';
import StudentPerformance from './components/StudentPerformance';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/prediction" element={<Prediction/>}/>
        <Route path="/result" element={<Result/>}/>
        <Route path="/student/:studentId" element={<StudentPerformance/>}/>
      </Routes>
    </BrowserRouter>
     
    
  );
}

export default App;
