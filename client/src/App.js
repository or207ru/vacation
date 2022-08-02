///////////////////////////////////////////////////////////
//
// Holding the entire components and navigate between them
//
///////////////////////////////////////////////////////////


import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './components/Admin';
import Edit from './components/Edit';
import Login from './components/Login';
import Register from './components/Register';
import Vacations from './components/Vacations';

const App = () => {

  return (
    // possesing the component inside routes
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/vacations' element={<Vacations />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/edit' element={<Edit />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

