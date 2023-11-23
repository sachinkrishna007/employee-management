import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/loader";
import { useRegisterMutation } from "../../slices/userApiSlice";
import { useEmployeeRegisterMutation } from "../../slices/adminApiSlice";

const Adduser = () => {
  const [email, setEmail] = useState("");

  const [mobile, setMobile] = useState("");

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [gender, setGender] = useState("");
  const [courses, setCourses] = useState([]);
  const [profileImage, setProfileImage] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [AddEmployee, { isLoading }] = useEmployeeRegisterMutation();

  const handleCourseChange = (course) => {
    const updatedCourses = courses.includes(course)
      ? courses.filter((c) => c !== course)
      : [...courses, course];
    setCourses(updatedCourses);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase2(file);
  };

  const setFileToBase2 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();


    if (
      !name ||
      !email ||
      !profileImage ||
      !gender ||
      !courses.length ||
      !mobile ||
      !designation
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

        const phoneNumberRegex = /^\d{10}$/;
        if (!phoneNumberRegex.test(mobile)) {
          toast.error("Please enter a valid 10-digit phone number.");
          return;
        }
    try {
      const res = await AddEmployee({
        name,
        email,
        profileImage,
        gender,
        courses,
        mobile,
        designation,
      }).unwrap();
      navigate("/admin/manage-users");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <FormContainer>
      <h1 style={{ fontFamily: "sans-serif" }}>Create Employee</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="number">
          <Form.Label>mobile</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          ></Form.Control>
          <Form.Group className="my-2" controlId="designation">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              as="select"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            >
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </Form.Control>
          </Form.Group>
        </Form.Group>
        <Form.Group className="my-2">
          <Form.Label>Gender</Form.Label>
          <div>
            <Form.Check
              inline
              label="Male"
              type="radio"
              id="male"
              value="male"
              checked={gender === "male"}
              onChange={() => setGender("male")}
            />
            <Form.Check
              inline
              label="Female"
              type="radio"
              id="female"
              value="female"
              checked={gender === "female"}
              onChange={() => setGender("female")}
            />
          </div>
        </Form.Group>

        <Form.Group className="my-2">
          <Form.Label>Courses</Form.Label>
          <div>
            <Form.Check
              inline
              label="MCA"
              type="checkbox"
              id="MCA"
              checked={courses.includes("MCA")}
              onChange={() => handleCourseChange("MCA")}
            />
            <Form.Check
              inline
              label="BCA"
              type="checkbox"
              id="BCA"
              checked={courses.includes("BCA")}
              onChange={() => handleCourseChange("BCA")}
            />

            <Form.Check
              inline
              label="BSC"
              type="checkbox"
              id="BSC"
              checked={courses.includes("BSC")}
              onChange={() => handleCourseChange("BSC")}
            />
          </div>
        </Form.Group>
        <Form.Group className="my-2" controlId="profileImage">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            accept=".jpg,.png"
            onChange={handleImage}
          ></Form.Control>
        </Form.Group>

        {isLoading && <Loader></Loader>}
        <Button type="submit" varient="primary" className="mt-3">
          Add
        </Button>
      </Form>
    </FormContainer>
  );
};

export default Adduser;
