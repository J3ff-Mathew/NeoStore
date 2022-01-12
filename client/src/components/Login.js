import React, { useState } from 'react'
import { Col, Row, Button, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SocialIcon } from 'react-social-icons';
import { getCart, getSocialUser, getUser } from '../apiCalls/services';
import SocialButton from './SocialButton';
import { enableLoginStatus, updateLoggedinCart, updateProfile } from '../redux/actions';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [viewPassword, setViewPassword] = useState(false);
    const [inputDetails, setinputDetails] = useState({ email: '', password: '' });
    const [show, setShow] = useState({ alert: false, message: '' });
    const handleSocialLogin = (user) => {
        getSocialUser(user._profile.email).then(res => {
            if (res.data.err != 0) {
                setShow({ alert: true, message: res.data.msg })
            }
            else {
                dispatch(enableLoginStatus());
                sessionStorage.setItem('user', JSON.stringify(res.data.responseData));
                sessionStorage.setItem('token', JSON.stringify(res.data.token));
                appendCart(user._profile.email);
                dispatch(updateProfile());
                navigate('/');
            }
        })
        console.log(user);

    };

    const handleSocialLoginFailure = (err) => {
        console.error(err);
    };
    const validate = (event) => {
        event.preventDefault();
        if (inputDetails.email === '' || inputDetails.password === '') {
            setShow({ alert: true, message: "Both input fields are necessary" })
        }
        else {
            getUser(inputDetails.email, inputDetails.password).then(res => {
                if (res.data.err != 0) {
                    setShow({ alert: true, message: res.data.msg })
                }
                else {
                    dispatch(enableLoginStatus());
                    sessionStorage.setItem('user', JSON.stringify(res.data.responseData));
                    sessionStorage.setItem('token', JSON.stringify(res.data.token));
                    appendCart(inputDetails.email);
                    dispatch(updateProfile());
                    navigate('/');
                }
            });
        }
    }


    const appendCart = (email) => {
        let cart = JSON.parse(localStorage.getItem('cart'));
        if (JSON.parse(localStorage.getItem('cart')) != undefined) {
            getCart(email).then(res => {
                if (res.data.length === 0) {
                    sessionStorage.setItem('cart', JSON.stringify(cart));
                    localStorage.setItem('cart', JSON.stringify([]));
                } else if (cart.length === 0) {
                    sessionStorage.setItem('cart', JSON.stringify(res.data));
                }
                else {
                    let cartDataArray = res.data;
                    cart.map(localElement => {
                        let flag = true;
                        cartDataArray.map(dataElement => {
                            if (localElement._id === dataElement._id) {
                                dataElement.quantity = localElement.quantity + dataElement.quantity;
                                flag = false;
                            }
                        });
                        if (flag)
                            cartDataArray.push(localElement);

                    });
                    console.log(cartDataArray);
                    sessionStorage.setItem('cart', JSON.stringify(cartDataArray));
                    localStorage.setItem('cart', JSON.stringify([]));
                    // dispatch(updateLoggedinCart());

                }
                dispatch(updateLoggedinCart());
            });
        }

    }
    return (
        <Col >
            <Row style={{ margin: '0', padding: '0', borderBottom: '2px solid black' }}>
                <Col className='mt-3 px-5 d-flex align-items-end justify-content-end' >
                    <SocialButton
                        provider="google"
                        appId="592593185581-qk5enpiqver56v50kamu0nd3fvimunvu.apps.googleusercontent.com"
                        onLoginSuccess={handleSocialLogin}
                        onLoginFailure={handleSocialLoginFailure}
                        className=''
                    >
                        <Button variant="danger" ><SocialIcon bgColor='white' className='mx-2' network="google" /> Log in With Google</Button>
                    </SocialButton>
                </Col>
                <Col className='mt-3 px-5 d-flex align-items-end justify-content-start'>
                    <SocialButton
                        provider="facebook"
                        appId="224795383074770"
                        onLoginSuccess={handleSocialLogin}
                        onLoginFailure={handleSocialLoginFailure}
                        className=''
                    >
                        <Button variant="primary" ><SocialIcon bgColor='white' className='mx-2' network="facebook" /> Log in With Facebook</Button>
                    </SocialButton>
                </Col>
            </Row>

            <Row className='d-flex justify-content-center' style={{ margin: '2rem 0 ', padding: '0' }}>
                <Col xs={7}>
                    {show.alert && <Alert id="alert" variant="danger" onClose={() => setShow({ message: "", alert: false })} dismissible>
                        <Alert.Heading>Oh snap! You some an error!</Alert.Heading>
                        <p>
                            {show.message}
                        </p>
                    </Alert>}
                    <Form className='formpage'>
                        <h3 className='mb-4 text-center'>Login To Neo<span className='text-danger'>Store</span></h3>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={e => setinputDetails({ ...inputDetails, email: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type={viewPassword ? "text" : "password"} placeholder="Password" onChange={e => setinputDetails({ ...inputDetails, password: e.target.value })} />
                            <Form.Group className="my-3" id="formGridCheckbox">
                                <Form.Check type="checkbox" label="Show Password" onClick={() => setViewPassword(!viewPassword)} />
                            </Form.Group>
                        </Form.Group>
                        <Button variant='success' onClick={validate}>Log In </Button>
                        <p className='mx-2 my-4'>
                            <Link to='/forgetPassword' >Forgot Password?</Link>
                        </p>
                    </Form>
                </Col>
            </Row>
        </Col>
    )
}
