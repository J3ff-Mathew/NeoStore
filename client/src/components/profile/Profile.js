import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Outlet, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import { updateProfile } from '../../redux/actions';
import { FrontEndPath } from '../../apiCalls/services';


export default function Profile() {
    const userData = useSelector(state => state.setUserProfile);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(updateProfile());
    }, [])
    return (
        <Row style={{ margin: '0', padding: '0' }}>
            {userData && <>
                <Col xs={5}>
                    <Row xs={3} className='my-5 d-flex justify-content-center align-items-center' >
                        {userData.image != "" ?
                            <img style={{ padding: 0, height: "170px", width: "170px", borderRadius: "50%" }} src={(/platform/.test(userData.image) || /google/.test(userData.image)) ? userData.image : `${FrontEndPath}/${userData.image}`} />
                            :
                            <>
                                <Avatar round size='170' color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])} name={userData.name} />
                            </>
                        }

                    </Row>

                    <Row>
                        {userData && <h3 className='text-center text-danger mb-5'>{userData.name}</h3>}

                        <Link className='text-center text-primary mb-4 profileLinks' to="/profile">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mx-1 bi bi-person-fill" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            </svg>
                            HomeProfile</Link> <br />
                        <Link className='text-center text-primary mb-4 profileLinks' to="/profile/orders">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mx-1 bi bi-list-ol" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" />
                                <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z" />
                            </svg>
                            Orders</Link><br />
                        <Link className='text-center text-primary mb-4 profileLinks' to="/profile/address">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mx-1 bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                            </svg>

                            Address</Link><br />
                        <Link className='text-center text-primary mb-5 profileLinks' to="/profile/changePassword">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mx-1 bi bi-arrow-left-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z" />
                            </svg>

                            Change Password</Link><br />

                    </Row>

                </Col>
                <Col style={{ padding: '0' }}><Outlet /></Col>

            </>}

        </Row>
    )
}
