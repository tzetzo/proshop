import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";

import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../store";

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, shippingAddress, paymentMethod } = useSelector(({ cart }) => cart);

  useEffect(() => {
    // redirect to '/' if cart is empty
    if (cartItems.length === 0) navigate("/");
    
    // redirect to shipping if its not provided yet
    if (!shippingAddress.postalCode) {
      navigate("/shipping");
    }
  }, [cartItems.length, shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          {/* <Form.Label as="legend">Select payment method: </Form.Label> */}
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="PayPal or Credit card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={(e) => dispatch(savePaymentMethod(e.target.value))}
            />
            {/* Stripe not yet implemented */}
            <Form.Check
              type="radio"
              className="my-2"
              label="Stripe"
              id="stripe"
              name="paymentMethod"
              value="Stripe"
              checked={paymentMethod === "Stripe"}
              onChange={(e) => dispatch(savePaymentMethod(e.target.value))}
            />
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
