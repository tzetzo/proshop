import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../store";

const UserUpdateScreen = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({});

  const [updateUser, { isLoading: loadingUpdateUser }] =
    useUpdateUserMutation();

  const { id } = useParams();
  const {
    data: user,
    isLoading: loadingUser,
    error,
  } = useGetUserByIdQuery(id);

  useEffect(() => user && setState(user), [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUser({ id, body: state });
      // this handles the case when admin user is attempted for deletion(backend doesnt allow it and returns error)
      if (res.error) return toast.error(res.error.data.errors[0].msg);
      toast.success("User updated");
      setState({})
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go back
      </Link>
      <FormContainer>
        <h1>Update user</h1>
        {loadingUpdateUser && <Loader />}

        {loadingUser ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data?.message || error.error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email" className="my-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={state.email}
                onChange={(e) => setState({ ...state, email: e.target.value })}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="isAdmin" className="my-2">
              <Form.Check
                type="switch"
                label="Is Admin"
                checked={state.isAdmin}
                onChange={(e) => setState({ ...state, isAdmin: e.target.checked })}
              />
            </Form.Group>
            
            <Button type="submit" variant="primary" className="my-2">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserUpdateScreen;
