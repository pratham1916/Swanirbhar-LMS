import axios from 'axios';
import AllRoutes from './AllRoutes/AllRoutes';
import './App.css'

export const baseUrl = "https://swanirbhar-lms-backend.onrender.com"
export const token = localStorage.getItem("token");
export const userId = localStorage.getItem("userId");

export const axiosInstance = axios.create({
  headers: {
    'Authorization': token
  },
});

function App() {
  return (
    <div className="app">
      <AllRoutes/>
    </div>
  )
}

export default App;
