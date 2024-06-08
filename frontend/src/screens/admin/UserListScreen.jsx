import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, Table } from "react-bootstrap";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetUsersQuery, useDeleteUserMutation } from "../../store";

const UserListScreen = () => {
  const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
  const [idToDelete, setIdtoDelete] = useState("");

  const {
    data: allUsers,
    refetch: refetchUsers,
    isLoading,
    error,
  } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDeleteUser }] =
    useDeleteUserMutation();

  const deleteUserHandler = async () => {
    setToggleDeleteModal(!toggleDeleteModal);
    try {
      const res = await deleteUser(idToDelete);
      // this handles the case when admin user is attempted for deletion(backend doesnt allow it and returns error)
      if (res.error) return toast.error(res.error.data.message);
      refetchUsers();
      toast.success("User deleted");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <h1>Users</h1>
      {loadingDeleteUser && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>CREATED AT</th>
              <th>UPDATED AT</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: "green" }}></FaCheck>
                  ) : (
                    <FaTimes style={{ color: "red" }}></FaTimes>
                  )}
                </td>
                <td>{user.createdAt}</td>
                <td>{user.updatedAt}</td>
                <td>
                  <Button
                    variant="light"
                    className="btn-sm"
                    as={Link}
                    to={`/admin/user/${user._id}/update`}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => {
                      setIdtoDelete(user._id);
                      setToggleDeleteModal(!toggleDeleteModal);
                    }}
                    disabled={loadingDeleteUser}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal
        show={toggleDeleteModal}
        onHide={() => setToggleDeleteModal(!toggleDeleteModal)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete user</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the user?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setToggleDeleteModal(!toggleDeleteModal)}
            disabled={loadingDeleteUser}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={deleteUserHandler}
            disabled={loadingDeleteUser}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserListScreen;
