import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Scholarship from "../pages/Scholarship";
import Contact from "../pages/Contact";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scholarship" element={<Scholarship />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  </Router>
);

export default AppRouter;
