import React, { useState } from 'react';
import { Container, Row, Form, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import { forgotPasswordOtp } from '../../apiCalls/services';
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
export default function ForgetPassword() {
    const navigate = useNavigate();
    const [show, setShow] = useState({ alert: false, message: '' });
    const [inputDetails, setInputDetails] = useState({ email: '', otp: '', passwprd: '', confirmPassword: '' })
    const validateEmail = () => {
        (!regForEmail.test(inputDetails.email)) ? setShow({ alert: true, message: "Enter valid email" }) : setShow(({ alert: false, message: '' }));
        if (!show.alert) {
            console.log("validateEmail")
            forgotPasswordOtp(inputDetails.email).then(res => {
                if (res.data.err == 1) {
                    setShow({ alert: true, message: res.data.msg });
                }
                else {
                    sessionStorage.setItem('forgetPassword', JSON.stringify(inputDetails.email))
                    navigate('/verifyOtp');
                }

            })
        }
    }
    return (
        <div>
            <Row >
                <button onClick={() => navigate('/login')} className='goBackBtn'>
                    <svg height="22" width="22" fill="white" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                    <span>Go Back to Login</span>
                </button>
            </Row>
            <Row>
                <Container>
                    <Form className='m-5 formpage'>
                        <h3 className='mb-4 text-center'>Change Neo<span className='text-danger'>Store</span> Password</h3>
                        {show.alert && <Alert id="alert" variant="danger" onClose={() => setShow({ message: "", alert: false })} dismissible>
                            <Alert.Heading>Oh snap! You some an error!</Alert.Heading>
                            <p>
                                {show.message}
                            </p>
                        </Alert>}
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={e => setInputDetails({ ...inputDetails, email: e.target.value })} />
                        </Form.Group>
                        <Button variant='primary' onClick={validateEmail}>Get OTP </Button>
                    </Form>
                </Container>
            </Row>

        </div>
    )
}
