import { Container } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminHeader from "./components/adminComponents/adminHeader";

const App = () => {
  const location = useLocation();

  return (
    <>
      <AdminHeader />

      <ToastContainer />
      <Container className="my-2">
        <Outlet />
      </Container>
    </>
  );
};

export default App;
