import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import './index.css';
import Header from "./Layout/Header/Header";
import Home from "./Pages/Home/Home";
import Admin from "./Pages/Admin/Admin";
import Login from "./Pages/Login/Login";

function App() {
  //const hideHeaderRoutes = ["/login"]; // Rotas onde o Header não deve aparecer

  return (
    <>
      {/*!hideHeaderRoutes.includes(location.pathname) && */}
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>  
    </>
  );
}

export default App;
