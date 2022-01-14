import React, { useState, useEffect } from 'react'
import { Row, Button, Col, Container, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Magnifier from "react-magnifier";
import {
    EmailShareButton,
    FacebookShareButton,
    WhatsappShareButton,
    TwitterShareButton,
    RedditShareButton,
    FacebookIcon,
    EmailIcon,
    WhatsappIcon,
    TwitterIcon,
    RedditIcon
} from 'react-share';
import { FrontEndPath, getSpecificProducts, updateRating } from '../../apiCalls/services';
import { updateCart, updateLoggedinCart } from '../../redux/actions';
import Rating from './Rating';
import RatingInput from './RatingInput';


export default function ProductPage() {
    const naviagte = useNavigate();
    const dispatch = useDispatch()
    const loginStatus = useSelector(state => state.setLoginStatus);
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState({ display: false, value: 1 });
    const [show, setShow] = useState({ alert: false, message: '' });
    const [variable, setVariable] = useState({ focus: '', title: '' });
    const { id } = useParams();

    useEffect(() => {
        getSpecificProducts(id).then(res => {
            if (res.data.err == 0) {
                setProduct(res.data.product[0]);
                setVariable({ focus: res.data.product[0].product_subimages[0], title: `${res.data.product[0].product_name}(${res.data.product[0].color_id.color_name})` })
                console.log(res.data.product[0]);
            }

        }).catch(res => {
            console.log(res)
            setProduct({ err: 1 });

        });

    }, [id]);

    const addProductToCart = () => {
        if (!loginStatus) {
            const cart = JSON.parse(localStorage.getItem('cart'));
            if (cart != undefined) {
                const duplicacy = cart.find(ele => ele._id == product._id);
                if (!duplicacy) {

                    let arr = [...cart, {
                        _id: product._id,
                        product_image: product.product_image,
                        product_name: product.product_name,
                        product_cost: product.product_cost,
                        quantity: 1
                    }];
                    localStorage.setItem('cart', JSON.stringify(arr));
                    dispatch(updateCart());
                    setShow({ message: "Product Added to cart ", alert: true });
                }
                else {
                    const result = cart.map(ele => ele._id === product._id ? { ...ele, quantity: ele.quantity + 1 } : ele)
                    localStorage.setItem('cart', JSON.stringify(result));
                    dispatch(updateCart());
                    setShow({ message: "Product Quantity Incremented in Cart", alert: true });
                }
            }
        }
        else {
            const cart = JSON.parse(sessionStorage.getItem('cart'));
            if (cart != undefined) {
                const duplicacy = cart.find(ele => ele._id == product._id);
                if (!duplicacy) {
                    let arr = [...cart, {
                        _id: product._id,
                        product_image: product.product_image,
                        product_name: product.product_name,
                        product_cost: product.product_cost,
                        quantity: 1
                    }];
                    sessionStorage.setItem('cart', JSON.stringify(arr));
                    dispatch(updateLoggedinCart());
                    setShow({ message: "Product Added to cart ", alert: true });
                }
                else {
                    const result = cart.map(ele => ele._id === product._id ? { ...ele, quantity: ele.quantity + 1 } : ele)
                    sessionStorage.setItem('cart', JSON.stringify(result));
                    dispatch(updateLoggedinCart());
                    setShow({ message: "Product Quantity Incremented in Cart", alert: true });
                }
            }
        }


    }
    const setRatingCount = (count) => {
        setRating({ ...rating, value: count });
        console.log(count)
    }
    const rateProduct = () => {
        ///make api and complete the logic for rating component
        const newRatingCount = product.product_ratingCount + 1;
        const newRating = product.product_rating + (rating.value - product.product_rating) / newRatingCount;
        const payload = {
            newRatingCount: newRatingCount,
            newRating: newRating
        }
        updateRating(product._id, payload).then(res => {
            if (res.status === 201) {
                setRating({ display: false, value: 1 });
                setProduct({ ...product, product_rating: newRating, product_ratingCount: newRatingCount });
            }
        })
    }
    return (
        <div>
            {product != null ?
                product.err == 1 ?
                    <div id="errorPage">
                        <div className="fof">
                            <h1>Not Found 404.....</h1>
                        </div>
                    </div> :
                    <Container style={{ maxWidth: "90%" }}>
                        <Row className='d-flex justify-content-evenly p-4'>
                            <Col><Button onClick={() => naviagte('/products')}>Back to Products Page</Button></Col>
                            {show.alert &&
                                <Col> <Alert id="alert" variant="success" onClose={() => setShow({ message: "", alert: false })} dismissible>
                                    <Alert.Heading>Success!!!</Alert.Heading>
                                    <p>
                                        {show.message}
                                    </p>
                                </Alert>
                                </Col>}
                            <Col style={{ fontSize: "1.3rem", fontWeight: "700", textAlign: "right" }}>{product.category_id.category_name}({product.color_id.color_name}) </Col>
                        </Row>
                        <hr />
                        <Row className='my-5'>
                            <Col s={12} md={6} lg={5} style={{ borderRight: "2px balck solid", padding: "0" }}>
                                {/* //image */}
                                <Row style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Magnifier src={`${FrontEndPath}/images/products/${variable.focus}`} height="500px" />
                                    </div>
                                </Row>
                                <Row >
                                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexFlow: "row" }}>
                                        {product.product_subimages.map((ele, index) =>


                                            <img key={`image${index}`} className='mx-2 subImg' onClick={() => setVariable({ ...variable, focus: ele })} src={`http://localhost:3000/images/products/${ele}`} />


                                        )}

                                    </div>

                                </Row>
                            </Col>
                            <Col s={12} md={6} lg={{ span: 6, offset: 1 }} >
                                <Row >
                                    <h1>
                                        {product.product_name}

                                    </h1>
                                </Row>
                                <Row className='my-2 '>
                                    <p >
                                        <Rating productRating={product.product_rating} className='my-1' /> <span className='text-muted'>({product.product_ratingCount})</span>
                                    </p>
                                </Row>
                                <Row className='my-2 '>
                                    <h2 className='text-danger'>
                                        &#8377; {product.product_cost}
                                    </h2>
                                    <p className='d-flex align-items-center'>
                                        <span style={{ fontWeight: 700 }}>Color:  &nbsp;</span> {product.color_id.color_name}  <span className='colorSymbol' style={{ backgroundColor: product.color_id.color_code }}></span>
                                    </p>
                                    <p className='d-flex align-items-center'>
                                        <span style={{ fontWeight: 700 }}>Category:  &nbsp;</span> {product.category_id.category_name}
                                    </p>
                                </Row>
                                <Row className='my-2 '>
                                    <p>
                                        <Button variant="danger" onClick={() => addProductToCart()}>Add To Cart</Button>  <Button variant="warning" onClick={() => setRating({ ...rating, display: !rating.display })}>Rate Product</Button>
                                    </p>
                                    {rating.display &&
                                        <div>
                                            Your Rating Is Valuable for other Customers!!!
                                            <RatingInput ratingCount={rating.value} setRatingCount={setRatingCount} />
                                            <Button variant='warning' onClick={() => rateProduct()}>Submit</Button>
                                        </div>
                                    }
                                </Row>
                                <Row className='my-2 '>
                                    <p>
                                        <span style={{ fontWeight: 700 }}>Description: &nbsp;</span> {product.product_desc}
                                    </p>
                                </Row>
                                <Row className='my-2 '>
                                    <p>
                                        <span style={{ fontWeight: 700 }}>Share With Your Friends:  &nbsp;</span>
                                    </p>
                                    <p className='d-flex justify-content-around'>

                                        <FacebookShareButton url={window.location} title={variable.title} windowWidth={1000}>
                                            <FacebookIcon
                                                size='3rem' round={true} />
                                        </FacebookShareButton>
                                        <EmailShareButton url={window.location} title={variable.title} windowWidth={1000}>
                                            <EmailIcon
                                                size='3rem' round={true} />
                                        </EmailShareButton>
                                        <WhatsappShareButton url={window.location} title={variable.title} separator=":: " windowWidth={1000}>
                                            <WhatsappIcon
                                                size='3rem' round={true} />
                                        </WhatsappShareButton>
                                        <TwitterShareButton url={window.location} title={variable.title} windowWidth={1000}>
                                            <TwitterIcon
                                                size='3rem' round={true} />
                                        </TwitterShareButton>
                                        <RedditShareButton url={window.location} title={variable.title} windowWidth={1000}>
                                            <RedditIcon
                                                size='3rem' round={true} />
                                        </RedditShareButton>
                                    </p>
                                </Row>


                            </Col>
                        </Row>
                    </Container>
                :
                <div id="errorPage">
                    <div className="fof">
                        <h1>Loading.....</h1>
                    </div>
                </div>}
        </div>
    )
}
