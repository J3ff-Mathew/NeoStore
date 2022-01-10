import React, { useState } from 'react';
import { Col, Row, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';
import { addUser, addUserSocial } from '../apiCalls/services';
import SocialButton from './SocialButton';
import { useNavigate } from 'react-router-dom'
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regexname = RegExp(/^[A-Za-z]{2,30}$/);
const regexpass = RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()]).{8,}");

export default function Registration() {
    const navigate = useNavigate();
    const [viewPassword, setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
    const [inputDetails, setinputDetails] = useState({ email: '', password: '', firstName: '', lastName: '', confirmPassword: '' });
    const [error, setError] = useState({ email: '', password: '', name: '', confirmPassword: '' })
    const [show, setShow] = useState({ alert: false, message: '' });
    const handleSocialLogin = (user) => {
        console.log(user._profile)
        let data = {
            name: user._profile.name,
            email: user._profile.email,
            image: user._profile.profilePicURL,
            type: "social"
        }
        addUserSocial(data).then(res => {
            if (res.data.error != "") {

                setShow({ alert: true, message: res.data.error });

            } else {
                navigate("/login")
            }
        })

    };

    const handleSocialLoginFailure = (err) => {

        if (err == "User already connected") {
            setShow({ alert: true, message: "User exists in DataBase Try loging in" });
        }
    };
    const validate = (event) => {
        event.preventDefault();
        setError({ email: '', password: '', name: '', confirmPassword: '' });
        if (inputDetails.email == '' || inputDetails.firstName == '' || inputDetails.lastName == '' || inputDetails.password == '' || inputDetails.confirmPassword == '') {
            setShow({ alert: true, message: "All  input Fields are Required" })
        }
        else {
            error.name = (!regexname.test(inputDetails.firstName) || !regexname.test(inputDetails.lastName)) ? "Both Name Field should contain a minimum of 3 characters and should contain only alphabets" : "";
            error.email = (!regForEmail.test(inputDetails.email)) ? "Enter valid email" : "";
            error.password = (!regexpass.test(inputDetails.password)) ? "Password should must have atlesr 8 characters be Alphanumeric and contain 1 uppercase & 1 lowercase with a special char" : "";
            error.confirmPassword = (inputDetails.password != inputDetails.confirmPassword) ? "Password and confirm password must be same" : "";
            setError({ ...error })
            if (error.name == "" && error.email == "" && error.confirmPassword == "" && error.password == "") {
                addData();
            }
        }
    }
    const addData = async () => {
        // console.log("add successfully")
        let data = {
            name: `${inputDetails.firstName} ${inputDetails.lastName}`,
            email: inputDetails.email,
            password: inputDetails.password,
            type: "remote"
        }
        await addUser(data).then(res => {
            if (res.data.error) {
                setShow({ alert: true, message: res.data.error });
            }
            else {
                document.getElementById("firstName").value = '';
                document.getElementById("lastName").value = '';
                document.getElementById("email").value = '';
                document.getElementById("password").value = '';
                document.getElementById("confirmPassword").value = '';
                navigate("/login");
            }
        });

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
                        <Button variant="danger" ><SocialIcon bgColor='white' className='mx-2' network="google" /> Register in With Google</Button>
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
                        <Button variant="primary" ><SocialIcon bgColor='white' className='mx-2' network="facebook" /> Register in With Facebook</Button>
                    </SocialButton>
                </Col>
            </Row>

            <Row className='d-flex justify-content-center' style={{ margin: '2rem 0', padding: '0' }}>
                <Col xs={7}>
                    {show.alert && <Alert id="alert" variant="danger" onClose={() => setShow({ message: "", alert: false })} dismissible>
                        <Alert.Heading>Oh snap! You some an error!</Alert.Heading>
                        <p>
                            {show.message}
                        </p>
                    </Alert>}

                    <Form className='formpage'>
                        <h3 className='mb-4 text-center'>Register To Neo<span className='text-danger'>Store</span></h3>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" >
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" id='firstName' placeholder="Enter First Name" onChange={e => setinputDetails({ ...inputDetails, firstName: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" id='lastName' placeholder="Enter Last Name" onChange={e => setinputDetails({ ...inputDetails, lastName: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Form.Text className="text-danger">
                                {error.name}
                            </Form.Text>
                        </Row>
                        <Form.Group className="mb-3" >
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" id='email' placeholder="Enter email" onChange={e => setinputDetails({ ...inputDetails, email: e.target.value })} />
                        </Form.Group>
                        <Row className="mb-3">
                            <Form.Text className="text-danger">
                                {error.email}
                            </Form.Text>
                        </Row>
                        <Form.Group className="mb-3" >
                            <Form.Label>Password</Form.Label>
                            <InputGroup>

                                <Form.Control type={viewPassword ? "text" : "password"} id='password' placeholder="Password" onChange={e => setinputDetails({ ...inputDetails, password: e.target.value })} />
                                <div className='icons'>
                                    {viewPassword ?
                                        <button type="button" className="icon-btn" onClick={() => setViewPassword(false)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                            </svg>
                                        </button>
                                        :
                                        <button className="icon-btn" type="button" onClick={() => setViewPassword(true)} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                                <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                                                <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                                            </svg>
                                        </button>}</div>
                            </InputGroup>
                        </Form.Group>
                        <Row className="mb-3">
                            <Form.Text className="text-danger">
                                {error.password}
                            </Form.Text>
                        </Row>
                        <Form.Group className="mb-3" >
                            <Form.Label>Confirm Password</Form.Label>
                            <InputGroup>

                                <Form.Control type={viewConfirmPassword ? "text" : "password"} id='confirmPassword' placeholder="Confirm Password" onChange={e => setinputDetails({ ...inputDetails, confirmPassword: e.target.value })} />
                                <div className='icons'>
                                    {viewConfirmPassword ?
                                        <button type="button" className="icon-btn" onClick={() => setViewConfirmPassword(false)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                            </svg>
                                        </button>
                                        :
                                        <button className="icon-btn" type="button" onClick={() => setViewConfirmPassword(true)} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                                <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                                                <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                                            </svg>
                                        </button>}</div>
                            </InputGroup>
                        </Form.Group>
                        <Row className="mb-3">
                            <Form.Text className="text-danger">
                                {error.confirmPassword}
                            </Form.Text>
                        </Row>
                        <Button variant='success' onClick={validate}>Register user </Button>
                    </Form>
                </Col>
            </Row>
        </Col>
    )
}
