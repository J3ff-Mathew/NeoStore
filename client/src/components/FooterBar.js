import React from "react"
import { FormControl, Form, Button } from 'react-bootstrap'
import { FrontEndPath } from "../apiCalls/services"


export default function FooterBar() {
    return (
        <footer className="page-footer font-small blue bg-dark text-white pt-4" style={{ width: '100%', fontSize: '0.8rem' }}>
            {/* bottom: '0', position: 'absolute', */}
            <div className="container-fluid text-center text-md-left">
                <div className="row d-flex justify-content-between">
                    <div className="col-md-3 mt-md-0 mt-3">
                        <h5 className="text-uppercase">About Company</h5>
                        <ul className="list-unstyled">
                            <li>NeoSOFT Technologies is here at your quick and easy service  for shopping.</li>
                            <li>Contact information</li>
                            <li>Email: contact@neosoftteach.com</li>
                            <li>Phone: +91 0000000000</li>
                            <li>Mumbai, India </li>
                        </ul>



                    </div>

                    {/* <hr className="clearfix w-100 d-md-none pb-0" /> */}

                    <div className="col-md-3 mb-md-0 mb-1">
                        <h5 className="text-uppercase">Information</h5>
                        <ul className="list-unstyled">
                            <li><a href={`${FrontEndPath}/NeoStore_TermsAndCondition.pdf`} target="_blank">Terms and Conditions</a></li>
                            <li>Guarantee and Return policy</li>
                            <li>Contact Us</li>
                            <li>Privacy Policy</li>
                            <li> <a href="https://www.google.com/maps/search/neosoft+technologies/@18.8371776,73.2505919,9.63z" target="_blank">Locate Us</a> </li>
                        </ul>
                    </div>

                    <div className="col-md-3 mb-md-0 mb-1">
                        <h5 className="text-uppercase">Newsletter</h5>
                        <ul className="list-unstyled">
                            <li>Signup to get exclusive offer from our favorite brands and to be well informed of the news</li>
                            <li><Form className="d-flex flex-column">
                                <FormControl
                                    placeholder="Email ID"
                                    className="me-2"
                                />
                                <Button variant="outline-danger" className="my-2">Subscribe</Button>
                            </Form></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer-copyright text-center py-1">© 2021 Copyright:
                NeoSOFT Technologies All rights reserved | Design by Jeff Mathew
            </div>

        </footer>
    )
}
