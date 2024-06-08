import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useGetProductsQuery } from "../store";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(3);
  const { page, searchTerm } = useParams();
  const {
    data,
    isFetching,
    error,
    refetch: refetchProducts,
  } = useGetProductsQuery({ page, perPage, searchTerm });

  // if backend returns different page from the one we are already on; this happens when we request page 3 but there are only 2 pages for ex
  useEffect(() => {
    if (data?.page < page) navigate(`/page/${data.page}`);
  }, [data]);

  useEffect(() => {
    refetchProducts();
  }, [perPage, page, refetchProducts]);

  return (
    <>
      {!searchTerm ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go back
        </Link>
      )}
      {isFetching ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Row>
            <Col>
              <Paginate
                page={data.page}
                pages={data.pages}
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
    </>
  );
};

export default HomeScreen;
