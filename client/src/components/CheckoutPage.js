import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addCart, addOrder, getAddress } from '../apiCalls/services';
import { updateLoggedinCart } from '../redux/actions';
const regexForCardno = RegExp(/^[0-9]{16}$/);
const regexForCvv = RegExp(/^([0-9]{3})$/);
export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const list = useSelector(state => state.setCart);
    const [inputDetails, setInputDetails] = useState({ cardno: "", cvv: "", address: {}, orderDate: "" });
    const [total, setTotal] = useState({ totalBeforeTax: 0, totalAfterTax: 0, taxAmount: 0 });
    const [address, setAddress] = useState([]);
    const userData = useSelector(state => state.setUserProfile);

    useEffect(() => {
        getAddress(userData.email).then(res => {
            console.log(res.data);
            if (res.data.length == 0) {
                navigate('/profile/address')
            }
            else {
                setAddress(res.data);
                const today = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
                setInputDetails({ ...inputDetails, address: res.data[0], orderDate: today });
                setTotal({ totalBeforeTax: location.state.total, totalAfterTax: location.state.total + location.state.total * 0.12, taxAmount: location.state.total * 0.12 })
            }

        })
    }, [])
    useEffect(() => {
        console.log(inputDetails)
    }, [inputDetails])
    const validateCard = () => {
        let cardNumber = inputDetails.cardno;
        let cvvNumber = inputDetails.cvv;
        if (!regexForCardno.test(cardNumber) && regexForCvv.test(cvvNumber)) {
            const payload = {
                buyer: {
                    name: userData.name,
                    email: userData.email
                },
                reciever: {
                    name: inputDetails.address.name,
                    address: inputDetails.address.address,
                    contact: inputDetails.address.contact
                },
                order_items: [...list],
                totalBeforeTax: total.totalBeforeTax,
                totalTax: total.taxAmount,
                totalAfterTax: total.totalAfterTax
            }
            addOrder(payload).then(res => {
                if (res.status == 201) {
                    navigate('/', { state: { order: true } });
                    sessionStorage.setItem('cart', JSON.stringify([]));
                    dispatch(updateLoggedinCart());
                    addCart(userData.email, []);
                }

            });

        } else {
            console.log(!regexForCardno.test(cardNumber));
            console.log(!regexForCvv.test(cvvNumber));
            alert("Invalid Card Credentials");

        }
    }
    return (
        <div className='d-flex justify-content-center align-items-center flex-column'>
            <h1 className='text-primary' style={{ fontSize: '4rem' }}>Order Chekout</h1>
            {userData != undefined && list.length != 0 &&
                <>
                    <Container>
                        <Form.Select onChange={(e) => setInputDetails({ ...inputDetails, address: JSON.parse(e.target.value) })}>
                            {address.length != 0 &&
                                address.map(ele =>
                                    <option value={JSON.stringify(ele)}>{ele.name} , {ele.address} , Contact- {ele.contact}</option>
                                )

                            }

                        </Form.Select>
                    </Container>
                    <div className='text-primary text-end' >
                        <p onClick={() => navigate('/profile/address')}> + Add Address</p>
                    </div>
                    <h1 style={{ fontSize: '3rem', marginTop: '2rem' }}>Buyer Details</h1>
                    <div>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr >
                                    <th className='px-4 py-2'>Name</th>
                                    <th className='px-4 py-2'>Email</th>
                                    <th className='px-4 py-2'> Order Date </th>
                                    <th className='px-4 py-2'>Grand Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='px-4 py-2'>{userData.name}</td>
                                    <td className='px-4 py-2'>{userData.email}</td>
                                    <td className='px-4 py-2'>{inputDetails.orderDate}</td>
                                    <td className="text-success px-4 py-2"> &#8377;{total.totalAfterTax}/-</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <h1 style={{ fontSize: '3rem', marginTop: '2rem' }}>Reciver Details</h1>
                    <div>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr >
                                    <th className='px-4 py-2'>Name</th>
                                    <th className='px-4 py-2'>Address</th>
                                    <th className='px-4 py-2'>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='px-4 py-2'>{inputDetails.address.name}</td>
                                    <td className='px-4 py-2'>{inputDetails.address.address}</td>
                                    <td className="text-success px-4 py-2">{inputDetails.address.contact}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <h1 style={{ fontSize: '3rem', marginTop: '2rem' }}>Order Details</h1>
                    <Container>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr >
                                    <th className='px-4 py-2'>Item Name</th>
                                    <th className='px-4 py-2'>Price</th>
                                    <th className='px-4 py-2'>Quantity</th>
                                    <th className='px-4 py-2'>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map(ele =>
                                    <tr>
                                        <td className='px-4 py-2'>{ele.product_name}</td>
                                        <td className='px-4 py-2'>&#8377;{ele.product_cost}</td>
                                        <td className='px-4 py-2'>{ele.quantity}</td>
                                        <td className=" px-4 py-2"> &#8377;{parseInt(ele.product_cost) * parseInt(ele.quantity)}/-</td>
                                    </tr>)}
                                <tr>
                                    <td className='px-4 py-2 fw-bold' colSpan={3}>SubTotal</td>
                                    <td className='px-4 py-2 fw-bold'> &#8377;{total.totalBeforeTax}/-</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-2 fw-bold' colSpan={3}>GST(12%)</td>
                                    <td className='px-4 py-2 fw-bold'> &#8377;{total.taxAmount}/-</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-2 fw-bold' colSpan={3}>Grand Total</td>
                                    <td className='px-4 py-2 fw-bold'> &#8377;{total.totalAfterTax}/-</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Container>

                </>
            }
            <Form className="m-5 formpage">
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Visa Card Number</Form.Label>
                    <Form.Control type="text" placeholder="Enter Card Number" onChange={(e) => setInputDetails({ ...inputDetails, cardno: e.target.value })} />
                    <Form.Text className="text-muted">
                        We'll never share your Card details with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>CVV</Form.Label>
                    <Form.Control type="text" placeholder="Enter CVV" onChange={(e) => setInputDetails({ ...inputDetails, cvv: e.target.value })} />
                </Form.Group>
                <Button variant="primary" className="my-3" type="button" onClick={() => validateCard()}>
                    Pay
                </Button>
            </Form>
        </div >
    )
}
