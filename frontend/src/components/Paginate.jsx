import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

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
      <LinkContainer key={pageNumber} to={getLink(pageNumber)}>
        <Pagination.Item active={pageNumber === page}>
          {pageNumber}
        </Pagination.Item>
      </LinkContainer>
    );
  }

  return pages > 1 && <Pagination>{paginationItems}</Pagination>;
};

export default Paginate;
