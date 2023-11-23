import { Container, Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { useSelector } from "react-redux";
import { useEffect } from "react";

const AdminHero = () => {

  const { adminInfo } = useSelector((state) => state.adminAuth);
  

  return (
    <div className=" py-5">
      <h2>DASHBOARD</h2>
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column align-items-center hero-card bg-light w-75">
          {adminInfo ? (
            <>
              <h2 className="text-center mb-4">
                {" "}
                Welcome{" "}
              </h2>
              <p className="text-center mb-4"> Email: {adminInfo.email} </p>
             
            </>
          ) : (
            <>
              <h2 className="text-center mb-4"> Admin </h2>
              <p className="text-center mb-4">
                {" "}
                Please Login to access Admin Dashboard{" "}
              </p>
              <div className="d-flex">
                <LinkContainer to="/admin/login">
                  <Button variant="primary" className="me-3">
                    Login
                  </Button>
                </LinkContainer>
              </div>
            </>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default AdminHero;
