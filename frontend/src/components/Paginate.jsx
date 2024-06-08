import { Link } from "react-router-dom";
import { Pagination } from "react-bootstrap";

const Paginate = ({ page, pages, isAdmin = false, searchTerm = "" }) => {
  const getLink = (pn) => {
    if (!isAdmin) {
      if (searchTerm) return `/searchTerm/${searchTerm}/page/${pn}`;
      return `/page/${pn}`;
    } else {
      if (searchTerm)
        return `/admin/productlist/searchTerm/${searchTerm}/page/${pn}`;
      return `/admin/productlist/page/${pn}`;
    }
  };

  let paginationItems = [];
  for (let pageNumber = 1; pageNumber <= pages; pageNumber++) {
    paginationItems.push(
      <Pagination.Item
        active={pageNumber === page}
        as={Link}
        key={pageNumber}
        to={getLink(pageNumber)}
      >
        {pageNumber}
      </Pagination.Item>,
    );
  }

  return pages > 1 && <Pagination>{paginationItems}</Pagination>;
};

export default Paginate;
