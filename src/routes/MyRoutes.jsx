import { BrowserRouter as Router, Routes, Route,  } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";

const MyRoutes = () => {

    return (
      
        <Routes>
          <Route exact path="/Home" element={<Home />} />  
          <Route exact path="/" element={<Login />} />  
          {/* <Route exact path="*" element={<NotFound />} />   */}       
        </Routes>
      
    );
  };
  
  export default MyRoutes;
  