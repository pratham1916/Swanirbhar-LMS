import { useEffect, useState } from 'react';
import AllRoutes from './AllRoutes/AllRoutes';
import './App.css'
import Navbar from './components/Navbar';

export const baseUrl = "https://swanirbhar-lms-backend.onrender.com"

function App() {
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setIsUser(!!userData);
  }, []);

  return (
    <div className="app">
      {isUser && <Navbar setIsUser={setIsUser} />}
      <AllRoutes setIsUser={setIsUser} />
    </div>
  )
}

export default App;
