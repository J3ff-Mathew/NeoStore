import React, { useEffect, useState } from 'react'
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FrontEndPath, getOrder } from '../../apiCalls/services';

export default function Orders() {
    const userData = useSelector(state => state.setUserProfile);
    const navigate = useNavigate();
    const [orderList, setOrderList] = useState([])
    useEffect(() => {
        getOrder(userData.email).then(res => {
            if (res.data.length != 0) {
                setOrderList([...res.data])
            }
        });
    }, [])
    return (
        <div>
            <Container className='formpage my-5'>

                <h3 className='mb-4 text-center'>Neo<span className='text-danger'>Store</span> Orders</h3>
                <hr className='text-white' />
                <div style={{ overflow: "auto", maxHeight: "300px" }}>
                    {orderList.length == 0 ?
                        <div id="errorPage" style={{ maxHeight: "300px" }}>
                            <div className="fof">
                                <h1>No <span className='text-danger'>Orders</span> Placed Yet!!!!</h1>
                            </div>
                        </div>
                        :
                        orderList.map((order, index) =>
                            <Card bg='dark mt-3' key={index}>
                                {console.log(order)}
                                <Card.Header>Order_NO: {order._id}</Card.Header>
                                <Card.Body>
                                    <span style={{ fontSize: "0.7rem " }}>{order.order_date.slice(0, 10).replace(/-/g, '/')}</span>
                                    <blockquote className="blockquote mb-0 my-3" style={{ fontSize: "0.8rem" }}>
                                        <Row className='my-1'>
                                            {order.order_items.map((product, index) =>
                                                <Col key={`product${index}`} className='d-flex justify-content-center'>
                                                    <img src={`${FrontEndPath}/images/products/${product.product_image}`} alt={`image of Product${index}`} height="100" width="100" />
                                                </Col>
                                            )}
                                        </Row>
                                        <Row>
                                            <Col xs={10}>
                                                <p>
                                                    {order.reciever.address}
                                                </p>
                                                <footer className="blockquote-footer">
                                                    {order.reciever.contact}
                                                </footer>
                                            </Col>
                                            <Col xs={2}>
                                                <Button variant='primary' onClick={() => navigate(`/invoice/${order._id}`)}>Invoice</Button>
                                            </Col>
                                        </Row>
                                    </blockquote>
                                </Card.Body>
                            </Card>
                        )
                    }
                </div>
            </Container >
        </div >
    )
}
