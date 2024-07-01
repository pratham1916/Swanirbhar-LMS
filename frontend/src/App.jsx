import axios from 'axios';
import AllRoutes from './AllRoutes/AllRoutes';
import './App.css'
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { isAuth } from './AllRoutes/PrivateRoutes';

export const baseUrl = "http://localhost:8080"
export const token = localStorage.getItem("token");
export const userId = localStorage.getItem("userId");

export const axiosInstance = axios.create({
  headers: {
    'Authorization': token
  },
});

// https://swanirbhar-lms-backend.onrender.com


function App() {
  const [userDetails, setUserDetails] = useState({});

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/${userId}`);
      setUserDetails(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchUserDetails();
    }
  }, []);

  return (
    <div className="app">
      <AllRoutes userDetails={userDetails} />
    </div>
  )
}

export default App;
