import React from 'react';
import { HashRouter, Routes, Route, Outlet, NavLink } from "react-router-dom";
import SignIn from './pages/SignIn';
// import Home from './pages/Home';
// import { loader } from './pages/Home';

import './app.css';


function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          {/* <Route
            loader={loader}
            path="/" element={<Home />}></Route> */}
          <Route path='/signin' element={<SignIn />}></Route>
        </Routes>
      </HashRouter>

    </>
  );
}

export default App;
