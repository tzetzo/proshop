import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import { useGetProductQuery, useUpdateProductMutation, useUploadImageMutation } from "../../store";

const ProductUpdateScreen = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({});

  const [updateProduct, { isLoading: loadingUpdateProduct }] =
    useUpdateProductMutation();

  const [uploadImage, { isLoading: loadingUploadImage }] = useUploadImageMutation(); 

  const { id } = useParams();
  const {
    data: product,
    isLoading: loadingProduct,
    error,
  } = useGetProductQuery(id);

  useEffect(() => product && setState(product), [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({ id, body: state });
      toast.success("Product updated");
      navigate("/admin/productlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadImageHandler = async (e) => {
    const formData= new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadImage(formData).unwrap();
      toast.success(res.message);
      setState({ ...state, image: res.image });
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go back
      </Link>
      <FormContainer>
        <h1>Edit product</h1>
        {loadingUpdateProduct && <Loader />}

        {loadingProduct ? (
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
            <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={state.image}
                onChange={(e) => setState({ ...state, image: e.target.value })}
              ></Form.Control>
              <Form.Control
                type="file"
                label="Choose file"
                onChange={uploadImageHandler}
              ></Form.Control>
            </Form.Group>
            {loadingUploadImage && <Loader />}
            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={state.brand}
                onChange={(e) => setState({ ...state, brand: e.target.value })}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={state.category}
                onChange={(e) =>
                  setState({ ...state, category: e.target.value })
                }
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={state.description}
                onChange={(e) =>
                  setState({ ...state, description: e.target.value })
                }
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="price" className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                min="0"
                placeholder="Enter price"
                value={state.price}
                onChange={(e) => setState({ ...state, price: e.target.value })}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                min="0"
                placeholder="Enter Count In Stock"
                value={state.countInStock}
                onChange={(e) =>
                  setState({ ...state, countInStock: e.target.value })
                }
              ></Form.Control>
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

export default ProductUpdateScreen;
