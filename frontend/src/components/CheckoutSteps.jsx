import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { enabled: step1, text: "Sign In", link: "/login" },
    { enabled: step2, text: "Shipping", link: "/shipping" },
    { enabled: step3, text: "Payment", link: "/payment" },
    { enabled: step4, text: "Place order", link: "/placeorder" },
  ];

  return (
    <Nav className="justify-content-center mb-4">
      {steps.map((step) => (
        <Nav.Item key={step.text}>
          {step.enabled ? (
            <LinkContainer to={step.link}>
              <Nav.Link>{step.text}</Nav.Link>
            </LinkContainer>
          ) : (
            <Nav.Link disabled>{step.text}</Nav.Link>
          )}
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default CheckoutSteps;
