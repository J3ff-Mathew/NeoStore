import React, { useEffect, useState } from 'react'
import { Container, Alert, Button, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { addAddress, deleteUserAddress, getAddress, updateAddress } from '../../apiCalls/services';
const regexname = RegExp(/^[A-Za-z]{2,30}$/);
const regexpin = RegExp("\\d{6}");
const regexphone = RegExp(/^[987][0-9]{9}$/);
export default function Address() {
    const [modalShow, setModalShow] = useState(false);
    const [inputDetails, setinputDetails] = useState({ state: '', district: '', firstName: '', lastName: '', address: '', country: '', pincode: '', contact: '' });
    const [error, setError] = useState({ name: "", address: "", location: '', pincode: '', contact: '' });
    const data = useSelector(state => state.setUserProfile);
    const [address, setAddress] = useState([]);
    const [updateFlag, setUpdateFlag] = useState({ flag: false, id: null });
    const [show, setShow] = useState({ alert: false, message: '' });
    const refreshAddress = () => {
        getAddress(data.email).then(res => {
            console.log(res.data);
            setAddress(res.data);
        })
    };
    useEffect(() => {
        refreshAddress();
    }, []);
    const saveUserAddress = () => {
        setError({ name: "", address: "", location: '', pincode: '', contact: '' })
        if (inputDetails.state == "" || inputDetails.district == "" || inputDetails.firstName == "" || inputDetails.lastName == "" || inputDetails.address == "" || inputDetails.country == "" || inputDetails.pincode == "" || inputDetails.contact == '') {
            setShow({ alert: true, message: 'All inputfields are Required' })
        }
        error.name = (!regexname.test(inputDetails.firstName) || !regexname.test(inputDetails.lastName)) ? "Both Name Field should contain a minimum of 2 characters and should contain only alphabets" : "";
        error.address = (inputDetails.address.length < 10) ? "address field must contain 10 or more characters" : '';
        error.location = (!regexname.test(inputDetails.state) || !regexname.test(inputDetails.district) || !regexname.test(inputDetails.country)) ? "Enter a valid Location Name" : "";
        error.pincode = !regexpin.test(inputDetails.pincode) ? "Enter a valid pincode" : "";
        error.contact = !regexphone.test(inputDetails.contact) ? "Enter a valid Phone number" : "";
        setError({ ...error });
        if (error.name == '' && error.address == '' && error.location == '' && error.pincode == '' && error.contact == '') {
            const payload = {
                name: `${inputDetails.firstName} ${inputDetails.lastName}`,
                address: `${inputDetails.address}, ${inputDetails.district}, ${inputDetails.state}, ${inputDetails.country} - ${inputDetails.pincode}`,
                contact: inputDetails.contact
            }
            console.log(payload)
            if (updateFlag.flag) {
                console.log('in address')
                updateAddress(data.email, updateFlag.id, payload).then(res => {
                    if (res.data.err == 0) {
                        refreshAddress();
                        setModalShow(false);
                        console.log('in address')
                        setUpdateFlag({ flag: false, id: null });
                        setinputDetails({ state: '', district: '', firstName: '', lastName: '', address: '', country: '', pincode: '', contact: '' });
                    }
                });
            }
            else {
                addAddress(data.email, payload).then(res => {
                    if (res.data.err == 0) {
                        refreshAddress();
                        setModalShow(false);
                    }
                });
            }

        }

    }

    const deleteAddress = (id) => {
        const email = data.email;
        console.log(email, id)
        deleteUserAddress(email, id).then(res => {
            if (res.data.err == 0) {
                refreshAddress();
            }
        });

    }

    const editAddress = (element) => {
        setModalShow(true);
        setUpdateFlag({ flag: true, id: element._id });
        const address = element.address.split(", ");
        const [country, pincode] = address.pop().split(' - ');
        const state = address.pop();
        const district = address.pop();
        const streetAddress = address.join(", ");
        setinputDetails({
            firstName: element.name.split(" ")[0],
            lastName: element.name.split(" ")[1],
            contact: element.contact,
            state: state,
            district: district,
            address: streetAddress,
            country: country,
            pincode: pincode
        })

    }
    const renderData = () => {
        console.log(inputDetails)
        document.getElementById("firstName").value = inputDetails.firstName;
        document.getElementById("lastName").value = inputDetails.lastName;
        document.getElementById("address").value = inputDetails.address;
        document.getElementById("district").value = inputDetails.district;
        document.getElementById("state").value = inputDetails.state;
        document.getElementById("country").value = inputDetails.country;
        document.getElementById("pincode").value = inputDetails.pincode;
        document.getElementById("contact").value = inputDetails.contact;
    }
    return (
        <div>
            <Container className='formpage my-5'>


                <h3 className='mb-4 text-center'>Neo<span className='text-danger'>Store</span> Saved Delivery Address</h3>
                <button className='btn41-43 btn-42' onClick={() => setModalShow(true)}>Add Address</button>
                <hr className='text-white' />
                <div style={{ overflow: "auto", maxHeight: "300px" }}>
                    {address == [] ? <h3>No address to dis play Add some Address to deliver</h3> :
                        address.map((ele, index) =>
                            <Card bg='dark mt-3' key={index}>
                                <Card.Header>{ele.name}</Card.Header>
                                <Card.Body>
                                    <blockquote className="blockquote mb-0" style={{ fontSize: "0.8rem" }}>
                                        <Row>
                                            <Col xs={8}>
                                                <p>
                                                    {ele.address}
                                                </p>
                                                <footer className="blockquote-footer">
                                                    {ele.contact}
                                                </footer>
                                            </Col>
                                            <Col xs={4}>
                                                <Row>
                                                    <Col xs={{ span: 4, offset: 2 }}>
                                                        <Button variant='danger' onClick={() => deleteAddress(ele._id)}>Delete</Button>
                                                    </Col>
                                                    <Col xs={{ span: 4, offset: 2 }}>
                                                        <Button variant='primary' onClick={() => editAddress(ele)}>Edit</Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </blockquote>
                                </Card.Body>
                            </Card>
                        )
                    }
                </div>
            </Container>
            <Modal
                onShow={() => renderData()}
                style={{ padding: 0 }}
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                    setError({ name: "", address: "", location: '', pincode: '', contact: '' });
                    setinputDetails({ state: '', district: '', firstName: '', lastName: '', address: '', country: '', pincode: '', contact: '' });
                }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <p>Add Address <span className='text-danger'>to Deliver</span></p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                    <Row>
                        <Form.Group className="mb-3" >
                            <Form.Label>House Address</Form.Label>
                            <Form.Control type="text" id='address' placeholder="Enter House Address" onChange={e => setinputDetails({ ...inputDetails, address: e.target.value })} />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Text className="text-danger">
                            {error.address}
                        </Form.Text>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" >
                                <Form.Label>District</Form.Label>
                                <Form.Control type="text" id='district' placeholder="Enter District" onChange={e => setinputDetails({ ...inputDetails, district: e.target.value })} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" >
                                <Form.Label>State</Form.Label>
                                <Form.Control type="text" id='state' placeholder="Enter State" onChange={e => setinputDetails({ ...inputDetails, state: e.target.value })} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" >
                                <Form.Label>Country</Form.Label>
                                <Form.Control type="text" id='country' placeholder="Enter Country" onChange={e => setinputDetails({ ...inputDetails, country: e.target.value })} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Form.Text className="text-danger">
                            {error.location}
                        </Form.Text>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" >
                                <Form.Label>Pincode</Form.Label>
                                <Form.Control type="text" id='pincode' placeholder="Enter Pincode" onChange={e => setinputDetails({ ...inputDetails, pincode: e.target.value })} />
                            </Form.Group>
                            <Row className="mb-3">
                                <Form.Text className="text-danger">
                                    {error.pincode}
                                </Form.Text>
                            </Row>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" >
                                <Form.Label>Contact No</Form.Label>
                                <Form.Control type="text" id='contact' placeholder="Enter Contact Info" onChange={e => setinputDetails({ ...inputDetails, contact: e.target.value })} />
                            </Form.Group>
                            <Row className="mb-3">
                                <Form.Text className="text-danger">
                                    {error.contact}
                                </Form.Text>
                            </Row>
                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => saveUserAddress()}>Save Address</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
