import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login"; 
import Home from "./Home"; 
import NewHome from "./NewHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} />
        <Route path='/newhome' element={<NewHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;