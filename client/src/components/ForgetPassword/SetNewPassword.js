import React, { useState } from 'react';
import { Row, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { setUserPassword } from '../../apiCalls/services';
const regexpass = RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()]).{8,}");

export default function SetNewPassword() {
    const navigate = useNavigate();
    const [viewNewPassword, setViewNewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
    const [inputDetails, setinputDetails] = useState({ newPassword: '', confirmPassword: '' });
    const [error, setError] = useState({ newPassword: '', confirmPassword: '' })
    const [show, setShow] = useState({ alert: false, message: '', type: 1 });
    const submitPassword = () => {
        (inputDetails.newPassword == '' || inputDetails.confirmPassword == '') ? setShow({ alert: true, message: 'Both Input Fields are Required' }) : setShow({ alert: false, message: '' });
        error.newPassword = (!regexpass.test(inputDetails.newPassword)) ? "Password should must have atleast 8 characters be Alphanumeric and contain 1 uppercase & 1 lowercase with a special char" : "";
        error.confirmPassword = (inputDetails.newPassword != inputDetails.confirmPassword) ? "Password and confirm password must be same" : "";
        setError({ ...error })
        if (error.newPassword == '' && error.confirmPassword == '') {
            const email = JSON.parse(sessionStorage.getItem('forgetPassword'));
            setUserPassword(email, { password: inputDetails.newPassword }).then(res => {
                if (res.data.err == 1) {
                    setShow({ alert: true, message: res.data.msg, type: 1 })
                }
                else {
                    setShow({ alert: true, message: res.data.msg + "Redirecting to login page in a moment", type: 0 })
                    setTimeout(() => {
                        sessionStorage.clear();
                        navigate('/login')
                    }, 4000);
                }
            })
        }
    }
    return (
        <div>
            {JSON.parse(sessionStorage.getItem('forgotPasswordToken')) == undefined ?
                <div>
                    <h3>You are Not Supposed to be here</h3>
                </div>
                :

                <Form className='m-5 formpage'>
                    <h3 className='mb-4 text-center'>Change Neo<span className='text-danger'>Store</span> Password</h3>
                    {show.alert && <Alert id="alert" variant={show.type == 1 ? "danger" : "success"} onClose={() => setShow({ message: "", alert: false })} dismissible>
                        {show.type == 1 ? <Alert.Heading>Oh snap! You some an error!</Alert.Heading> : <Alert.Heading>Success</Alert.Heading>}
                        <p>
                            {show.message}
                        </p>
                    </Alert>}
                    <Form.Group className="mb-3" >
                        <Form.Label>New Password</Form.Label>
                        <InputGroup>

                            <Form.Control type={viewNewPassword ? "text" : "password"} id='newPassword' placeholder="New Password" onChange={e => setinputDetails({ ...inputDetails, newPassword: e.target.value })} />
                            <div className='icons'>
                                {viewNewPassword ?
                                    <button type="button" className="icon-btn" onClick={() => setViewNewPassword(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                        </svg>
                                    </button>
                                    :
                                    <button className="icon-btn" type="button" onClick={() => setViewNewPassword(true)} >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                            <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                                            <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                                        </svg>
                                    </button>}</div>
                        </InputGroup>
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Text className="text-danger">
                            {error.newPassword}
                        </Form.Text>
                    </Row>
                    <Form.Group className="mb-3" >
                        <Form.Label>Confirm New Password</Form.Label>
                        <InputGroup>

                            <Form.Control type={viewConfirmPassword ? "text" : "password"} id='confirmPassword' placeholder="Confirm New Password" onChange={e => setinputDetails({ ...inputDetails, confirmPassword: e.target.value })} />
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
                    <Button variant='success' onClick={submitPassword}>Change Password </Button>
                </Form>
            }
        </div>
    )
}
