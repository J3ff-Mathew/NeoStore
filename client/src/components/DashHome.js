import React, { useEffect, useState } from 'react'
import { Alert, Carousel, Card, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FrontEndPath, getTopRatedProducts } from '../apiCalls/services';
import Rating from './Reusables/Rating';


export default function DashHome() {
    const navigate = useNavigate();
    const location = useLocation();
    const [index, setIndex] = useState(0);
    const [show, setShow] = useState({ alert: false, message: '' });
    const [AvgCustomerProducts, setAvgCustomerProducts] = useState([]);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    useEffect(() => {
        if (location.state != null) {
            if (location.state.order)
                setShow({ message: "The Order was Placed Successfully", alert: true })
        }

        getTopRatedProducts().then(res => {
            console.log(res.data)
            setAvgCustomerProducts(res.data);
        })
    }, [])
    return (
        <div>
            {show.alert && <Alert id="alert" variant="success" onClose={() => setShow({ message: "", alert: false })} dismissible>
                <Alert.Heading>Success!!</Alert.Heading>
                <p>
                    {show.message}
                </p>
            </Alert>}
            <Carousel activeIndex={index} onSelect={handleSelect}>
                <Carousel.Item>
                    <img src="images/slider2.jpg" className="d-block " height="660px" alt="..." />
                    <Carousel.Caption>

                        <button className="btn btn-dark">Shop Now -&gt;</button>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src="images/slider3.jpg" className="d-block " height="660px" alt="..." />

                    <Carousel.Caption>
                        <h1>Explore The JOY of <br />Basketball</h1>
                        <h5>Get <span className="text-danger"> 40%</span> off on All Basketball Accessories</h5>

                        <button className="btn btn-primary">Shop Now -&gt;</button>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src="images/slider4.jpg" className="d-block " height="660px" alt="..." />
                    <Carousel.Caption className='text-dark d-flex justify-content-end align-items-start'>
                        <h1>The World Of <br /> Extreme Sports</h1>
                        <h5>Shop for <span className="text-primary"> 20%</span> off on All Apparel</h5>
                        <button className="btn btn-dark">Shop Now -&gt;</button>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <section className="container my-3" id="services">
                <div className="bg-info text-white ">
                    <span className="material-icons my-2">
                        flight
                    </span>FREE SHIPPING WORLDWIDE
                </div>
                <div className="bg-warning text-white">
                    <span className="material-icons my-2">
                        loop
                    </span>100% MONEY BACK - 48 HOURS
                </div>
                <div className="bg-danger text-white">
                    <span className="material-icons my-2">
                        support_agent
                    </span>24/7 ONLINE CUSTOMER SUPPORT
                </div>
            </section>
            <section className="container">
                <hr className="my-4" />
            </section>
            <section>
                <h3 className='text-center'>Products by Avg. Customer Reviews</h3>
                <section className="container">
                    <hr className="my-4" />
                </section>
                <Row>
                    {AvgCustomerProducts.length != 0 &&

                        AvgCustomerProducts.map((product, index) =>
                            <Col key={`product${index}`} xs={12} s={6} md={4} lg={3} className='d-flex justify-content-center'>
                                <Card style={{ width: "17rem", height: "30rem" }} className='text-center m-2' onClick={() => navigate(`/productDetail/${product._id}`)}>
                                    <Card.Img className='img img-center' variant="top" src={`${FrontEndPath}/images/products/${product.product_image}`} style={{ width: '100%', height: '17rem' }} />
                                    <Card.Body>
                                        <Card.Title className='text-danger' style={{ height: "3.5rem" }}>{product.product_name}</Card.Title>
                                        <Card.Text style={{ height: "1rem" }}>
                                            <Rating productRating={product.product_rating} className='my-1' />
                                        </Card.Text>
                                        <Card.Text style={{ height: "1rem" }}>

                                            &#8377;{product.product_cost}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </section>
        </div>
    )
}
