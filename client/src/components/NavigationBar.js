import React, { useEffect } from 'react';
import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { disableLoginStatus, enableLoginStatus, updateCart, updateLoggedinCart, updateProfile } from '../redux/actions';
import { addCart } from '../apiCalls/services';

export default function NavigationBar() {
    const loginStatus = useSelector(state => state.setLoginStatus);
    const cart = useSelector(state => state.setCart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        window.addEventListener('beforeunload', (e) => {
            e.preventDefault();
            return e.returnValue = ''

        })
        window.addEventListener('unload', addCartToDataBase());

        if (sessionStorage.getItem("user") != undefined) {
            dispatch(enableLoginStatus());
            dispatch(updateProfile());
            dispatch(updateLoggedinCart());
        }
        return () => {
            window.removeEventListener('beforeunload', (e) => {
                e.preventDefault();
                return e.returnValue = ''

            })
            window.removeEventListener('unload', addCartToDataBase())
        }
    }, [])
    const logOutUser = () => {

        dispatch(disableLoginStatus());
        addCartToDataBase();
        sessionStorage.clear();
        navigate('/');
        dispatch(updateCart());
    }

    const addCartToDataBase = () => {
        let cart = JSON.parse(sessionStorage.getItem('cart'));
        let user = JSON.parse(sessionStorage.getItem('user'));
        addCart(user.email, cart);
    }
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home" style={{ fontSize: '2rem', fontWeight: '900' }}>Neo<span className='text-danger'>Store</span></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/products">Products</Nav.Link>
                            <Nav.Link as={Link} to="/profile/orders" disabled={!loginStatus}>Order</Nav.Link>

                        </Nav>
                        <Nav>
                            <Form className="d-flex">
                                <FormControl
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"

                                />
                                <Button variant="outline-success">Search</Button>
                            </Form>
                            <Nav.Link as={Link} to="/cart" style={{ marginLeft: '0.5rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
                                    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                                </svg>
                                <span style={{ fontSize: "12px" }} className="translate-middle badge rounded-pill bg-danger">{cart && cart.length}</span>
                            </Nav.Link>
                            <NavDropdown style={{ marginLeft: '0.5rem' }} title={<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                            </svg>
                            } id="collasible-nav-dropdown">
                                {loginStatus ?
                                    <NavDropdown.Item onClick={() => logOutUser()}>Logout</NavDropdown.Item>
                                    :
                                    <>
                                        <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/register">Register</NavDropdown.Item>
                                    </>
                                }

                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/profile" disabled={!loginStatus}>Profile</NavDropdown.Item>

                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div >
    )
}
