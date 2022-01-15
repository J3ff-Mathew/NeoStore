import React, { useEffect, useState } from 'react'
import { Col, Row, Button, Card, Form } from 'react-bootstrap';

import ReactPaginate from 'react-paginate'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { FrontEndPath, getAllProducts, getCategoriesAndColors, getFilteredProducts } from '../apiCalls/services'
import Rating from './Reusables/Rating';

export default function Products() {
    const navigate = useNavigate();
    const location = useLocation();
    const loginStatus = useSelector(state => state.setLoginStatus);
    const [products, setProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [sort, setSort] = useState({ price: false, rating: false });
    const [categories, setCategories] = useState([]);
    const getAllProductsAndSet = () => {
        getAllProducts().then(res => {
            setProducts(res.data);
        });
    }
    useEffect(() => {
        getAllProductsAndSet();
        getCategoriesAndColors().then(res => {
            setColors(res.data.colors);
            setCategories(res.data.categories);
        })
    }, []);

    useEffect(() => {
        console.log("in price rating")
        if (sort.price == true)
            products.sort((a, b) => (a.product_cost > b.product_cost) ? 1 : -1)
        else
            products.sort((a, b) => (a.product_cost > b.product_cost) ? -1 : 1);
        setProducts([...products]);
    }, [sort.price]);

    useEffect(() => {
        console.log("in sort rating")
        if (sort.rating == true)
            products.sort((a, b) => (a.product_rating > b.product_rating) ? 1 : -1)
        else
            products.sort((a, b) => (a.product_rating > b.product_rating) ? -1 : 1)
        setProducts([...products]);
    }, [sort.rating])

    const clearAllFilters = () => {
        const colorsFields = document.querySelectorAll('.colorSwitch input');
        const categoryFields = document.querySelectorAll('.categoryRadio input');
        colorsFields.forEach(color => {
            if (color.checked) {
                color.checked = false;
            }
        })
        categoryFields.forEach(category => {
            // console.log(categoryFields)
            if (category.checked) {
                category.checked = false;
            }
        })
        getAllProductsAndSet();
    }

    const filterProducts = () => {
        const colorsFields = document.querySelectorAll('.colorSwitch input');
        const categoryFields = document.querySelectorAll('.categoryRadio input');
        const filter = { colorFilter: [], category: "" }
        colorsFields.forEach(color => {
            if (color.checked) {
                filter.colorFilter.push(color.value);
            }
        })
        categoryFields.forEach(category => {
            // console.log(categoryFields)
            if (category.checked) {
                filter.category = category.value;
            }

        })
        console.log(filter, filter.category == '', filter.colorFilter.toString() == [], filter.colorFilter);
        if (filter.category == '' && filter.colorFilter.toString() == []) {
            getAllProductsAndSet();
        }
        else
            getFilteredProducts(filter).then(res => { console.log("inset Diltered products", res.data); setProducts(res.data) });
    }

    function Items({ currentItems }) {
        return (
            <>
                {currentItems ?
                    <Row className='pagi' style={{ overflow: "auto", maxHeight: "60vh " }} >
                        {currentItems.map((ele, index) =>
                            <Col key={`product${index}`} xs={12} md={6} lg={4} className='d-flex justify-content-center'>
                                <Card style={{ width: "17rem", height: "30rem" }} className='text-center m-2' onClick={() => navigate(`/productDetail/${ele._id}`)}>
                                    <Card.Img className='img img-center' variant="top" src={`${FrontEndPath}/images/products/${ele.product_image}`} style={{ width: '100%', height: '17rem' }} />
                                    <Card.Body>
                                        <Card.Title className='text-danger' style={{ height: "3.5rem" }}>{ele.product_name}</Card.Title>
                                        <Card.Text style={{ height: "1rem" }}>
                                            <Rating productRating={ele.product_rating} className='my-1' />
                                        </Card.Text>
                                        <Card.Text style={{ height: "1rem" }}>

                                            &#8377;{ele.product_cost}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}
                    </Row>
                    :
                    <h3>No Products To Load</h3>
                }
            </>
        );
    }

    function PaginatedItems({ itemsPerPage }) {
        // We start with an empty list of items.
        const [currentItems, setCurrentItems] = useState(null);
        const [pageCount, setPageCount] = useState(0);
        // Here we use item offsets; we could also use page offsets
        // following the API or data you're working with.
        const [itemOffset, setItemOffset] = useState(0);

        useEffect(() => {
            // Fetch items from another resources.
            const endOffset = itemOffset + itemsPerPage;
            // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
            setCurrentItems(products.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(products.length / itemsPerPage));
        }, [itemOffset, itemsPerPage]);

        // Invoke when user click to request another page.
        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % products.length;
            // console.log(
            //     `User requested page number ${event.selected}, which is offset ${newOffset}`
            // );
            setItemOffset(newOffset);
        };

        return (
            <>
                <Items currentItems={currentItems} />
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                />
            </>
        );
    }




    return (
        <div>
            <Row>
                <Col md={4} lg={2} style={{ borderRight: "2px solid black" }}>
                    <Form className='text-center'>
                        <h4 className='text text-danger'>Colors</h4>
                        <table className='mx-auto'>
                            <tbody>
                                {colors.map((ele, index) =>
                                    <tr key={`color${index}`}>

                                        <td>
                                            <div style={{ display: 'inline-block', height: '1.5rem', width: '1.5rem', backgroundColor: ele.color_code, marginRight: '1rem', marginLeft: '1rem', borderRadius: '50%' }}></div>
                                        </td>
                                        <td>
                                            <Form.Check.Label>{ele.color_name}</Form.Check.Label>
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="switch"
                                                className='colorSwitch'
                                                value={ele._id}
                                                isValid
                                            />
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                        <hr />
                        <h4 className='text text-danger'>Category</h4>
                        <table className='mx-auto'>
                            <tbody>
                                {categories.map((ele, index) =>
                                    <tr key={`category${index}`}>

                                        <td>
                                            <div style={{ display: 'inline-block', height: '1.5rem', width: '1.5rem', backgroundColor: ele.color_code, marginRight: '1rem', marginLeft: '1rem', borderRadius: '50%' }}></div>
                                        </td>
                                        <td>
                                            <Form.Check.Label>{ele.category_name}</Form.Check.Label>
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="radio"
                                                name="category"
                                                className='categoryRadio'
                                                value={ele._id}
                                                isValid
                                            />
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                        <Button className='m-2' variant="danger" onClick={() => filterProducts()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel-fill" viewBox="0 0 16 16">
                                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z" />
                            </svg> Filter</Button>
                        <Button className='m-2' variant='warning' onClick={() => clearAllFilters()}>Clear Filters</Button>
                    </Form>
                </Col>
                <Col>
                    <Row >
                        <div className='d-flex justify-content-end sortFilter'>
                            <button onClick={() => setSort({ ...sort, rating: !sort.rating })}>Sort by Rating  {sort.rating ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
                                <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-up-alt" viewBox="0 0 16 16">
                                <path d="M3.5 13.5a.5.5 0 0 1-1 0V4.707L1.354 5.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 4.707V13.5zm4-9.5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z" />
                            </svg>}</button>   <button onClick={() => setSort({ ...sort, price: !sort.price })}>Sort by Price  {sort.price ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
                                <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-up-alt" viewBox="0 0 16 16">
                                <path d="M3.5 13.5a.5.5 0 0 1-1 0V4.707L1.354 5.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 4.707V13.5zm4-9.5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z" />
                            </svg>}</button>
                        </div>
                    </Row>
                    <Row>
                        <PaginatedItems itemsPerPage={9} />
                    </Row>
                </Col>
            </Row>
        </div>
    )
}
