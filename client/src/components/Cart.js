import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Alert } from 'react-bootstrap';
import { updateCart, updateLoggedinCart } from '../redux/actions';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const list = useSelector(state => state.setCart);
    const loginStatus = useSelector(state => state.setLoginStatus);
    const [show, setShow] = useState({ alert: false, message: '' });
    const [gt, setGt] = useState(0);
    const loadData = () => {
        let total = 0;
        console.log(list)
        for (let i = 0; i < list.length; i++) {
            document.getElementById(`cartProduct${i}`).value = list[i].quantity;
            total += list[i].product_cost * list[i].quantity;
        }
        setGt(total);
    }
    useEffect(() => {
        loadData();
    }, []);
    useEffect(() => {
        if (loginStatus) {
            console.log("inside useEffect")
            dispatch(updateLoggedinCart());
        }
        loadData();
    }, [loginStatus]);
    const addQuantity = (index) => {
        list[index].quantity += 1;
        if (!loginStatus) {
            localStorage.setItem('cart', JSON.stringify(list));
            dispatch(updateCart());
        }
        else {
            sessionStorage.setItem('cart', JSON.stringify(list));
            dispatch(updateLoggedinCart());
        }

        loadData();
    }
    const subQuantity = (index) => {

        list[index].quantity -= 1;
        if (!loginStatus) {
            localStorage.setItem('cart', JSON.stringify(list));
            dispatch(updateCart());
        }
        else {
            sessionStorage.setItem('cart', JSON.stringify(list));
            dispatch(updateLoggedinCart());
        }
        loadData();


    }
    const deleteProduct = (index) => {
        list.splice(index, 1);
        if (!loginStatus) {
            localStorage.setItem('cart', JSON.stringify(list));
            dispatch(updateCart());
        }
        else {
            sessionStorage.setItem('cart', JSON.stringify(list));
            dispatch(updateLoggedinCart());
        }
        loadData();
    }
    const sendData = () => {
        navigate('/checkout', { state: { total: gt } });
    }
    return (
        <div>
            {show.alert && <Alert id="alert" variant="danger" onClose={() => setShow({ message: "", alert: false })} dismissible>
                <Alert.Heading>Oh snap! You some an error!</Alert.Heading>
                <p>
                    {show.message}
                </p>
            </Alert>}
            {list.length != 0 ?
                <div style={{ minHeight: "60vh" }}>
                    {list.map((ele, index) =>
                        <Card className="my-4" key={`ProductCart${index}`}>
                            <Card.Header as="h5">{ele.product_name}</Card.Header>
                            <Card.Body className='d-flex justify-content-around flow-row align-items-center'>
                                <Card.Img variant="left" src={`http://localhost:3000/images/products/${ele.product_image}`} style={{ height: "100px" }} />
                                <table width="70%">
                                    <tbody>
                                        <tr className='text-center'>
                                            <td><Card.Title className="text-danger">  Price Per Item: &#8377; {ele.product_cost}</Card.Title></td>
                                            <td> <span id={`cartProduct${index}`} style={{ width: '3rem' }} ><Button variant='danger' onClick={() => subQuantity(index)} className='me-2 quantitySymbol' disabled={ele.quantity <= 1}>-</Button><span className='btn quantity'>{ele.quantity}</span><Button onClick={() => addQuantity(index)} className='ms-2  quantitySymbol'>+</Button></span></td>
                                            <td><Card.Title className="text-danger"> Product Price: &#8377; {ele.product_cost * ele.quantity}</Card.Title></td>
                                            <td><Button variant="danger" onClick={() => deleteProduct(index)}>Delete</Button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card.Body>
                        </Card>)}
                    < div className="d-flex justify-content-around align-items-center">
                        <div className="text-success" style={{ fontSize: '2.2rem' }}>
                            Grand Total : &#8377;{gt}/-
                        </div>
                        <Button variant="dark" className="m-5 px-5 py-3" onClick={() => loginStatus ? sendData() : setShow({ alert: true, message: "You need to login inorder to Order" })}>Checkout =&gt;</Button>
                    </div>
                </div>
                :
                <div id="errorPage">
                    <div className="fof">
                        <h1>Your Cart is <span className='text-danger'>Empty</span>!!!!</h1>
                    </div>
                </div>
            }
        </div>
    )
}
