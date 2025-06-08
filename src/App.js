import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import './index.css';
import Header from "./Layout/Header/Header";
import Home from "./Pages/Home/Home";
import Admin from "./Pages/Admin/Admin";
import Login from "./Pages/Login/Login";
import Cart from "./Pages/Cart/Cart";
import TalkToUs from "./Pages/TalkToUs/TalkToUs";
import Footer from "./Layout/footer/footer";
import ProdutcPage from "./Pages/ProductPage/ProdutcPage";
import IndividualProduct from "./Pages/ProductPage/individualProduct/IndividualProduct";
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
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/contact" element={<TalkToUs/>}/>
          <Route path="/products" element={<ProdutcPage />}/>
          <Route path="/individualProduct/:id" element={<IndividualProduct/>}/>
        </Routes>

        <Footer/>
      </Router>  
    </>
  );
}

export default App;
