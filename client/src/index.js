import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore, combineReducers } from 'redux';
import { userReducer, vacationsReducer } from './reducers';


// initializing redux store, combining of two reducers
const store = createStore(combineReducers({
  user: userReducer,
  vacations: vacationsReducer
}));

// Places the entire application inside redux scope
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
