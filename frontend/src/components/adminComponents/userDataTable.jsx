import { useState, useEffect } from "react";
import { Button, Modal, Table, Form as BootstrapForm } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";

import {
  useDeleteUserMutation,
  useUpdateUserByAdminMutation,
} from "../../slices/adminApiSlice";

const UsersDataTable = ({ users }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false); // State for the confirmation dialog
  const [userIdToDelete, setUserIdToDelete] = useState(null); // Track the user ID to delete

  const [showUpdateModal, setShowUpdateModal] = useState(false); // State for the update modal
  const [userIdToUpdate, setUserIdToUpdate] = useState("");
  const [userNameToUpdate, setUserNameToUpdate] = useState("");
  const [userEmailToUpdate, setUserEmailToUpdate] = useState("");
  const [userIdToBlock, setUserIdToBlock] = useState(null);
  const [designation, setDesignation] = useState("");
  const [gender, setGender] = useState("");
  const [courses, setCourses] = useState([]);
  const [profileImage, setProfileImage] = useState();
  const [userCount, setUserCount] = useState(0);
  const [mobile, setmobile] = useState();
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    setUserCount(filteredUsers.length);
  }, [filteredUsers]);

  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const [updateUserByAdmin, { isLoading: isUpdating }] =
    useUpdateUserByAdminMutation();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase2(file);
  };

  const setFileToBase2 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    a;
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
  };
  const handleDelete = async () => {
    try {
      const responseFromApiCall = await deleteUser({ userId: userIdToDelete });
      toast.success("User Deleted Successfully.");
      setUserIdToDelete(null);
      setShowConfirmation(false);

      window.location.reload();
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  const handleOpenUpdateModal = (user) => {
    setUserIdToUpdate(user._id);
    setUserNameToUpdate(user.name);
    setUserEmailToUpdate(user.email);
    setCourses(user.courses);
    setmobile(user.mobile);
    setGender(user.gender);
    setDesignation(user.designation);
    setProfileImage(user.profileImageName);
    setShowUpdateModal(true);
  };

  const handleUpdate = async () => {
    try {
      const responseFromApiCall = await updateUserByAdmin({
        userId: userIdToUpdate,
        name: userNameToUpdate,
        email: userEmailToUpdate,
        mobile: mobile,
        designation: designation,
        gender: gender,
        courses: courses,
        profileImage: profileImage,
      });
      console.log(responseFromApiCall);

      toast.success("User Updated Successfully.");
      setUserIdToUpdate(null); // Clear the user ID to update
      setShowUpdateModal(false); // Close the update modal

      // Reload the page to reflect the updated data
      window.location.reload();
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <>
      <p>Total Users: {userCount}</p>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>

            <th>Picture</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Courses</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={user.profileImageName || "default-profile-image-url.jpg"}
                  alt={`Profile of ${user.name}`}
                  rounded
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>{user.designation}</td>
              <td>{user.gender}</td>
              <td>{user.courses.join(", ")}</td>

              <td>
                <Button
                  type="button"
                  variant="info"
                  className="mt-3"
                  onClick={() => handleOpenUpdateModal(user)}
                >
                  Update
                </Button>
              </td>

              <td>
                <Button
                  type="button"
                  variant="danger"
                  className="mt-3"
                  onClick={() => {
                    setUserIdToDelete(user._id); // Set the user ID to delete
                    setShowConfirmation(true); // Open the confirmation dialog
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <BootstrapForm>
        <BootstrapForm.Group
          className="mt-3"
          controlId="exampleForm.ControlInput1"
        >
          <BootstrapForm.Label>Search users:</BootstrapForm.Label>
          <BootstrapForm.Control
            style={{ width: "500px" }}
            value={searchQuery}
            type="text"
            placeholder="Enter Name or email........"
            onChange={handleSearch}
          />
        </BootstrapForm.Group>
      </BootstrapForm>

      {/* Confirmation Dialog */}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update User Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BootstrapForm>
            <BootstrapForm.Group controlId="name">
              <BootstrapForm.Label>Name</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                value={userNameToUpdate}
                onChange={(e) => setUserNameToUpdate(e.target.value)}
              />
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="email">
              <BootstrapForm.Label>Email</BootstrapForm.Label>
              <BootstrapForm.Control
                type="email"
                value={userEmailToUpdate}
                onChange={(e) => setUserEmailToUpdate(e.target.value)}
              />
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="mobile">
              <BootstrapForm.Label>Mobile</BootstrapForm.Label>
              <BootstrapForm.Control
                type="Mobile"
                value={mobile}
                onChange={(e) => setmobile(e.target.value)}
              />
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="designation">
              <BootstrapForm.Label>Designation</BootstrapForm.Label>
              <BootstrapForm.Control
                as="select"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
              </BootstrapForm.Control>
            </BootstrapForm.Group>

            {/* Gender Radio Buttons */}
            <BootstrapForm.Group controlId="gender">
              <BootstrapForm.Label>Gender</BootstrapForm.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Male"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Female"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                {/* Add more options as needed */}
              </div>
            </BootstrapForm.Group>

            {/* Courses Checkbox */}
            <BootstrapForm.Group controlId="courses">
              <BootstrapForm.Label>Courses</BootstrapForm.Label>
              <div>
                <Form.Check
                  inline
                  type="checkbox"
                  label="MCA"
                  value="MCA"
                  checked={courses.includes("MCA")}
                  onChange={(e) => {
                    const updatedCourses = e.target.checked
                      ? [...courses, e.target.value]
                      : courses.filter((course) => course !== e.target.value);
                    setCourses(updatedCourses);
                  }}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="BCA"
                  value="BCA"
                  checked={courses.includes("BCA")}
                  onChange={(e) => {
                    const updatedCourses = e.target.checked
                      ? [...courses, e.target.value]
                      : courses.filter((course) => course !== e.target.value);
                    setCourses(updatedCourses);
                  }}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="BSC"
                  value="BSC"
                  checked={courses.includes("BSC")}
                  onChange={(e) => {
                    const updatedCourses = e.target.checked
                      ? [...courses, e.target.value]
                      : courses.filter((course) => course !== e.target.value);
                    setCourses(updatedCourses);
                  }}
                />
              </div>

              <BootstrapForm.Group controlId="profileImage">
                <BootstrapForm.Label>Profile Image</BootstrapForm.Label>
                <BootstrapForm.Control type="file" onChange={handleImage} />
              </BootstrapForm.Group>
            </BootstrapForm.Group>
          </BootstrapForm>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={userIdToBlock !== null}
        onHide={() => setUserIdToBlock(null)}
      ></Modal>
    </>
  );
};

export default UsersDataTable;
