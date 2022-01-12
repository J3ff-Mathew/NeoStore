import React, { useEffect, useState } from 'react'
import { Alert, Carousel } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';


export default function DashHome() {
    const location = useLocation();
    const [index, setIndex] = useState(0);
    const [show, setShow] = useState({ alert: false, message: '' });

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    useEffect(() => {
        if (location.state != null) {
            if (location.state.order)
                setShow({ message: "The Order was Placed Successfully", alert: true })
        }
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
        </div>
    )
}
