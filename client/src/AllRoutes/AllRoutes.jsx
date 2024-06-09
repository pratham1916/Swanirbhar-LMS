import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import PrivateRoute from './PrivateRoutes';
import AllCourses from '../pages/AllCourses';
import SingleCourse from '../pages/SingleCourse';
import MyCourses from '../pages/MyCourses';

const AllRoutes = ({ setIsUser }) => {
    const isUser = localStorage.getItem("user");

    return (
        <Routes>
            <Route path="/" element={<Navigate to={isUser ? "/allCourses" : "/login"} />} />
            <Route path="/login" element={<LoginForm setIsUser={setIsUser} />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path='/allCourses' element={<PrivateRoute><AllCourses/></PrivateRoute>}/>
            <Route path='/singleCourses/:courseId' element={<PrivateRoute><SingleCourse/></PrivateRoute>}/>
            <Route path='/myCourses' element={<PrivateRoute><MyCourses/></PrivateRoute>}/>

        </Routes>
    );
}

export default AllRoutes;

