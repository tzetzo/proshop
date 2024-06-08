import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, Table } from "react-bootstrap";
import { FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useDeleteOrderMutation, useGetAllOrdersQuery } from "../../store";

const OrderListScreen = () => {
  const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
  const [idToDelete, setIdtoDelete] = useState("");

  const {
    data: allOrders,
    isLoading,
    error,
    refetch: refetchAllOrders,
  } = useGetAllOrdersQuery();

  const [deleteOrder, { isLoading: loadingDeleteOrder }] =
    useDeleteOrderMutation();

  const deleteOrderHandler = async () => {
    setToggleDeleteModal(!toggleDeleteModal);
    try {
      await deleteOrder(idToDelete);
      refetchAllOrders();
      toast.success("Order deleted");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <h1>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
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
                  <Button
                    variant="light"
                    className="btn-sm"
                    as={Link}
                    to={`/order/${order._id}`}
                  >
                    Details
                  </Button>
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
      <Modal
        show={toggleDeleteModal}
        onHide={() => setToggleDeleteModal(!toggleDeleteModal)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete order</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this order?</Modal.Body>
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
            Yes, I am admin and know what I'm doing
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderListScreen;
