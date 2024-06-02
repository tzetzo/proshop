import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { searchTerm: urlSearchTerm } = useParams();
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm || "");
  const pathname = window.location.pathname;

  const submitHandler = (e) => {
    e.preventDefault();
  
    if (searchTerm.trim()) {
      if (!pathname.includes("admin")) {
        navigate(`/searchTerm/${searchTerm}`);
      } else navigate(`/admin/productlist/searchTerm/${searchTerm}`);

      setSearchTerm("");
    } else {
      if (!pathname.includes("admin")) {
        navigate("/");
      } else navigate(`/admin/productlist`);
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="q"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>
      <Button type="submit" variant="outline-light" className="p-2 mx-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
