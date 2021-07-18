import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Admin from './components/Admin';
import Edit from './components/Edit';
import Login from './components/Login';
import Register from './components/Register';
import Vacations from './components/Vacations';

const App = () => {

  return (
    <div>
      <BrowserRouter>
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/vacations' component={Vacations} />
        <Route path='/admin' component={Admin} />
        <Route path='/edit' component={Edit} />
        <Route path='/' exact component={Login} />
      </BrowserRouter>
    </div >
  )
}

export default App;
