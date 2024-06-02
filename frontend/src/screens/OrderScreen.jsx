// to test in development teh PayPal workflow:
// 1. https://developer.paypal.com/dashboard/accounts
// 2. Click on the `Personal` account used to simulate payments(as opposed to `Business` for receiving money)
// 3. Copy/Paste the email into the PayPal popup after clicking on the PayPal button - Next
// 4. Copy/Paste the password into the PayPal popup - Log in

import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Card,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  clearCart,
  useGetOrderByIdQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useUpdateOrderToDeliveredMutation
} from "../store";

const OrderScreen = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data = {}, refetch: refetchOrder, isLoading, error } = useGetOrderByIdQuery(id);
  const {
    _id = "",
    user = "",
    shippingAddress = "",
    isDelivered = false,
    deliveredAt = "",
    paymentMethod = "",
    isPaid = false,
    paidAt = "",
    cartItems = [],
    itemsPrice = "",
    shippingPrice = "",
    taxPrice = "",
    totalPrice = "",
  } = data;

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, {isLoading: loadingDeliverOrder}] = useUpdateOrderToDeliveredMutation();

  const [{ isPending, options }, paypalDispatch] = usePayPalScriptReducer(); // https://www.npmjs.com/package/@paypal/react-paypal-js
  const {
    data: paypal = {},
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();
  const { userInfo } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            ...options,
            clientId: paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (!isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [isPaid, paypal.clientId, paypalDispatch, loadingPayPal, errorPayPal, options]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: totalPrice,
            },
          },
        ],
      })
      .then((orderId) => orderId);
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (orderDetails) {
      try {
        await payOrder({ orderId: _id, orderDetails });
        dispatch(clearCart());
        refetchOrder();
        toast.success("Payment successful");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }

  const onError = (err) => {
    toast.error(err.message);
  };

  //   async function onApproveTest() { console.log(_id)
  //     await payOrder({ orderId: _id, orderDetails: { payer: {}, id:'123', email_address: "t@w.nom", update_time: '132443543556', status: 'status' } });
  //     refetchOrder();
  //     toast.success("Payment successful");
  //   };

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(_id).unwrap();
      refetchOrder();
      toast.success('Order delivered')
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <>
      <h1>Order {_id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {user.name}
              </p>
              <p>
                <strong>Email: </strong> {user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city}{" "}
                {shippingAddress.postalCode},{shippingAddress.country}
              </p>
              {isDelivered ? (
                <Message variant="success">Delivered on {deliveredAt}</Message>
              ) : (
                <Message variant="danger">Not delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment method</h2>
              <p>
                <strong>Method: </strong> {paymentMethod}
              </p>
              {isPaid ? (
                <Message variant="success">Paid on {paidAt}</Message>
              ) : (
                <Message variant="danger">Not paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Cart items:</h2>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.productId}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/products/${item.product}`}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} X {item.price} = ${item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: "10px" }}
                      >
                        Test pay order
                      </Button> */}
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliverOrder && <Loader />}
              {userInfo?.isAdmin && isPaid && !isDelivered && (
                <ListGroup.Item><Button type='button' className='btn btn-block' onClick={deliverOrderHandler}>Mark as delivered</Button></ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
