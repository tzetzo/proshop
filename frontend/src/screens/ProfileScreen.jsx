import { useEffect, useState } from "react";
import { Table, Form, Button, Col, Row, Modal } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTimes, FaTrash } from "react-icons/fa";

import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  setCredentials,
  useProfileMutation,
  useGetMyOrdersQuery,
  useDeleteOrderMutation,
} from "../store";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
  const [idToDelete, setIdtoDelete] = useState("");

  const dispatch = useDispatch();

  const [updateUserProfile, { isLoading: loadingUpdateUserProfile }] =
    useProfileMutation();

  const { data: myOrders, isLoading, error, refetch: refetchMyOrders } = useGetMyOrdersQuery();

  const { userInfo } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const res = await updateUserProfile({ name, email, password }).unwrap(); // unwrap allows us to use try catch
      dispatch(setCredentials(res));
      toast.success("Profile updated successfully");
    } catch (error) {
      error.data.errors.map((err) => toast.error(err.msg));
    }
  };

  const [deleteOrder, { isLoading: loadingDeleteOrder }] =
    useDeleteOrderMutation();

  const deleteOrderHandler = async () => {
    setToggleDeleteModal(!toggleDeleteModal);
    try {
      await deleteOrder(idToDelete);
      refetchMyOrders();
      toast.success("Order deleted");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Row>
        <Col md={3}>
          <h2>User profile</h2>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email" className="my-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="password" className="my-2">
              <Form.Label title="Current password if no change required">
                Password<strong>*</strong>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="confirmPassword" className="my-2">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="my-2"
              disabled={loadingUpdateUserProfile}
            >
              Update
            </Button>
            {loadingUpdateUserProfile && <Loader />}
          </Form>
        </Col>
        <Col md={9}>
          <h2>My orders</h2>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <Table striped hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>${order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: "red" }}></FaTimes>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: "red" }}></FaTimes>
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className="btn-sm" variant="light">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => {
                          setIdtoDelete(order._id);
                          setToggleDeleteModal(!toggleDeleteModal);
                        }}
                        disabled={loadingDeleteOrder}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
      <Modal
        show={toggleDeleteModal}
        onHide={() => setToggleDeleteModal(!toggleDeleteModal)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete order</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the order?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setToggleDeleteModal(!toggleDeleteModal)}
            disabled={loadingDeleteOrder}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={deleteOrderHandler}
            disabled={loadingDeleteOrder}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileScreen;
