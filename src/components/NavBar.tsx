import { useState, useEffect } from "react";
import { Container, Navbar, Nav, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const NavBar: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.cart);
  const [productCount, setProductCount] = useState<number>(0);

  useEffect(() => {
    const countTotal = cart.reduce((acc, product) => acc + (product.quantity || 1), 0);
    setProductCount(countTotal);
  }, [cart]);

  return (
    <Navbar bg="warning" expand="lg" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/" className="text-white">STORE</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/cart">Cart<Badge className="ms-1 bg-white text-dark">{productCount}</Badge></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;