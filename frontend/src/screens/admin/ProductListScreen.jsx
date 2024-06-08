import { useEffect, useState } from "react";
import { Button, Form, Modal, Table, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../store";

const ProductListScreen = () => {
  const navigate = useNavigate();

  const [toggleCreateModal, setToggleCreateModal] = useState(false);
  const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
  const [idToDelete, setIdtoDelete] = useState("");
  const [perPage, setPerPage] = useState(3);

  const { page, searchTerm } = useParams();
  const {
    data,
    isLoading,
    error,
    refetch: refetchProducts,
  } = useGetProductsQuery({ page, perPage, searchTerm });

  // if backend returns different page from the one we are already on; this happens when we request page 3 but there are only 2 pages for ex
  useEffect(() => {
    if (data?.page < page) navigate(`/admin/productlist/page/${data.page}`);
  }, [data]);

  useEffect(() => {
    refetchProducts();
  }, [perPage, page, refetchProducts]);

  const [createProduct, { isLoading: loadingCreateProduct }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDeleteProduct }] =
    useDeleteProductMutation();

  const createProductHandler = async () => {
    setToggleCreateModal(!toggleCreateModal);
    try {
      await createProduct();
      refetchProducts();
      toast.success("Product created");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const deleteProductHandler = async () => {
    setToggleDeleteModal(!toggleDeleteModal);
    try {
      await deleteProduct(idToDelete);
      refetchProducts();
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {searchTerm && (
        <Link to="/admin/productlist/" className="btn btn-light mb-4">
          Go back
        </Link>
      )}
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button
            className="btn-sm m-3"
            onClick={() => setToggleCreateModal(!toggleCreateModal)}
            disabled={loadingCreateProduct}
          >
            <FaEdit /> Create product
          </Button>
        </Col>
      </Row>
      {(loadingCreateProduct || loadingDeleteProduct) && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.data?.message || error.error}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      variant="light"
                      className="btn-sm mx-2"
                      as={Link}
                      to={`/admin/product/${product._id}/update`}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => {
                        setIdtoDelete(product._id);
                        setToggleDeleteModal(!toggleDeleteModal);
                      }}
                      disabled={loadingDeleteProduct}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Row>
            <Col>
              <Paginate
                page={data.page}
                pages={data.pages}
                isAdmin
                searchTerm={searchTerm}
              />
            </Col>
            <Col className="text-end" md={1}>
              <Form.Select
                value={perPage}
                onChange={(e) => setPerPage(e.target.value)}
              >
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
              </Form.Select>
            </Col>
          </Row>
        </>
      )}
      <Modal
        show={toggleCreateModal}
        onHide={() => setToggleCreateModal(!toggleCreateModal)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new product</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to create a new product?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setToggleCreateModal(!toggleCreateModal)}
            disabled={loadingCreateProduct}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={createProductHandler}
            disabled={loadingCreateProduct}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={toggleDeleteModal}
        onHide={() => setToggleDeleteModal(!toggleDeleteModal)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete product</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the product?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setToggleDeleteModal(!toggleDeleteModal)}
            disabled={loadingDeleteProduct}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={deleteProductHandler}
            disabled={loadingDeleteProduct}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductListScreen;
