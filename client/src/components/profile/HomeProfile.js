import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { Col, Row, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from '../../apiCalls/services';
import { updateProfile } from '../../redux/actions';
const regexname = RegExp(/^[A-Za-z]{2,30}$/);

export default function HomeProfile() {
    const dispatch = useDispatch();
    const data = useSelector(state => state.setUserProfile);
    const hiddenFileInput = useRef(null);
    const [editFlag, setEditFlag] = useState(false);
    const [error, setError] = useState({ name: "" });
    const [show, setShow] = useState({ alert: false, message: '' });
    const [inputDetails, setinputDetails] = useState({ firstName: data.name.split(" ")[0], lastName: data.name.split(" ")[1], email: data.email });
    useEffect(() => {
        renderDetails();
        setinputDetails({ firstName: data.name.split(" ")[0], lastName: data.name.split(" ")[1], email: data.email });
    }, [data]);
    const renderDetails = () => {
        document.getElementById("firstName").value = data.name.split(" ")[0];
        document.getElementById("lastName").value = data.name.split(" ")[1];
        document.getElementById("email").value = data.email;
        document.getElementById("type").value = data.type;
    }
    const updateDetails = () => {

        setError({ name: '' });
        if (inputDetails.firstName == '' || inputDetails.lastName == '') {
            setShow({ alert: true, message: "Both Name Fields are Required" })
        }
        else {
            error.name = (!regexname.test(inputDetails.firstName) || !regexname.test(inputDetails.lastName)) ? "Both Name Field should contain a minimum of 3 characters and should contain only alphabets" : "";
            setError({ ...error })
            if (error.name == "") {
                updateData();
            }
        }
    }
    const updateData = () => {
        let payload = new FormData();
        console.log(document.getElementById('image').files[0]);
        payload.append('file', document.getElementById('image').files[0]);
        payload.append('name', `${inputDetails.firstName} ${inputDetails.lastName}`);
        updateUserDetails(data.email, payload).then(res => {
            console.log(res.data)
            sessionStorage.setItem('user', JSON.stringify(res.data.responseData));
            dispatch(updateProfile());

        });
        setEditFlag(!editFlag)
    }
    const handleClick = () => {
        hiddenFileInput.current.click();
    };
    return (
        <div>
            <Form className='m-5 formpage'>
                <h3 className='mb-4 text-center'> Neo<span className='text-danger'>Store</span> Profile</h3>
                {show.alert && <Alert id="alert" variant="danger" onClose={() => setShow({ message: "", alert: false })} dismissible>
                    <Alert.Heading>Oh snap! You some an error!</Alert.Heading>
                    <p>
                        {show.message}
                    </p>
                </Alert>}
                <Row>
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" id='firstName' placeholder="Enter First Name" onChange={e => setinputDetails({ ...inputDetails, firstName: e.target.value })} disabled={!editFlag} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" id='lastName' placeholder="Enter Last Name" onChange={e => setinputDetails({ ...inputDetails, lastName: e.target.value })} disabled={!editFlag} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Form.Text className="text-danger">
                        {error.name}
                    </Form.Text>
                </Row>
                <Form.Group className='d-flex justify-content-center'>
                    <Button
                        className='mb-4 btn btn-primary'
                        variant="contained"
                        component="label"
                        style={{ width: '70%' }}
                        onClick={handleClick}
                        disabled={!editFlag}

                    >
                        Update user logo
                        <input
                            type="file"
                            ref={hiddenFileInput}
                            name="file"
                            id="image"

                            hidden
                        />
                    </Button>
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" id='email' placeholder="Enter email" disabled />
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label>Account Type</Form.Label>
                    <Form.Control type="text" id='type' disabled />
                </Form.Group>
                {!editFlag ?
                    <Button variant='primary' onClick={() => setEditFlag(!editFlag)}>Edit </Button>
                    :
                    <Button variant='success' onClick={() => updateDetails()}>Update Details </Button>
                }

            </Form>
        </div>
    )
}
