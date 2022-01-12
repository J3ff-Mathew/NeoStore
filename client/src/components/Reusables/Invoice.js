import React, { useEffect, useState, useRef } from 'react'
import { Button, Row, Col, Container, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getSpecificOrder } from '../../apiCalls/services';
import ReactToPdf from "react-to-pdf";
import { useNavigate, useParams } from 'react-router-dom';


const options = {
    orientation: 'potrait',
    unit: 'in',
    format: 'A4'
};

export default function Invoice() {
    const userData = useSelector(state => state.setUserProfile);
    const navigate = useNavigate();
    const pdfRef = useRef(null);
    const [order, setOrder] = useState(null);
    const { id } = useParams();
    useEffect(() => {
        getSpecificOrder(userData.email, id).then(res => {
            console.log(res.data[0]);
            setOrder({ ...res.data[0] });
        });

    }, [])
    return (
        <Container>
            {order != null ?
                <>
                    <Button className='mt-5' onClick={() => navigate('/profile/orders')}>Back to Orders</Button>


                    <div ref={pdfRef}>
                        <div style={{ padding: 20 }}>
                            <Row style={{ borderBottom: "2px solid black" }}>
                                <Col >
                                    <div style={{ fontSize: '2rem', fontWeight: '900' }}>Neo<span className='text-danger text-center'>Store</span></div>
                                </Col>
                            </Row>

                            <Row gutter={24} style={{ marginTop: 32 }}>
                                <Col xs={3}>
                                    <h3>{order.reciever.name}</h3>
                                    <div>{order.reciever.address}</div>
                                    <div>Contact - {order.reciever.contact}</div>
                                </Col>
                                <Col xs={{ span: 5, offset: 4 }} >
                                    <ul className="list-unstyled">
                                        <li className='fw-bold'>NeoSOFT Technologies</li>
                                        <li>NTPL SEZ (Blueridge), IT-06/09, 1st Floor, Hinjewadi Phase 1 Rd, Hinjewadi Rajiv Gandhi Infotech Park, Hinjawadi, Pune, Maharashtra 411057 </li>
                                        <li>Email: contact@neosoftteach.com</li>
                                        <li>Phone: +91 0000000000</li>
                                    </ul>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: 48 }}>
                                <div>Paid By: <strong>{order.buyer.name}</strong></div>
                                <div>Email : {order.buyer.email}</div>
                            </Row>


                            <Row style={{ marginTop: 48 }}>
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
                                            {order.order_items.map((ele, index) =>
                                                <tr key={`order${index}`}>
                                                    <td className='px-4 py-2'>{ele.product_name}</td>
                                                    <td className='px-4 py-2'>&#8377;{ele.product_cost}</td>
                                                    <td className='px-4 py-2'>{ele.quantity}</td>
                                                    <td className=" px-4 py-2"> &#8377;{parseInt(ele.product_cost) * parseInt(ele.quantity)}/-</td>
                                                </tr>)}
                                            <tr>
                                                <td className='px-4 py-2 fw-bold' colSpan={3}>SubTotal</td>
                                                <td className='px-4 py-2 fw-bold'> &#8377;{order.totalBeforeTax}/-</td>
                                            </tr>
                                            <tr>
                                                <td className='px-4 py-2 fw-bold' colSpan={3}>GST(12%)</td>
                                                <td className='px-4 py-2 fw-bold'> &#8377;{order.totalTax}/-</td>
                                            </tr>
                                            <tr>
                                                <td className='px-4 py-2 fw-bold' colSpan={3}>Grand Total</td>
                                                <td className='px-4 py-2 fw-bold text-success'> &#8377;{order.totalAfterTax}/-</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Container>
                            </Row>

                            <Row style={{ marginTop: 48 }}>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Invoice # :</th>
                                            <td>{order._id}</td>
                                        </tr>
                                        <tr>
                                            <th>Invoice Date : </th>
                                            <td> {order.order_date.slice(0, 10).replace(/-/g, '/')}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Row>
                        </div>
                    </div>


                    <ReactToPdf targetRef={pdfRef} filename={`${order._id}_invoice.pdf`} options={options} x={0.2} y={1.5} scale={0.6}>
                        {({ toPdf }) => (
                            <Button onClick={() => {
                                toPdf();
                            }} variant="primary" className='mb-5'>
                                Download
                            </Button>
                        )}
                    </ReactToPdf>
                </>
                :
                <div id="errorPage">
                    <div className="fof">
                        <h1>Loading.....</h1>
                    </div>
                </div>
            }
        </Container>
    )
}
