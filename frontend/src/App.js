import Login from './Components/Login'
import Dashbord from './Components/Dashbord';
import AdminDashboard from './Components/AdminDashboard';
import Register from './Components/Register';
import Sample from './Components/Sample';
import AdminBanerAdd from './adminComponents/AdminBanerAdd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashbord />} />
          <Route path='/admindashboard' element={<AdminDashboard />} />
          <Route path='/sapmle' element={<Sample />} />
          <Route path='/adminbaneradd' element={<AdminBanerAdd />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
