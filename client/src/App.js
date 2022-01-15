import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Mario from './components/Reusables/Mario1.gif';
import { updateCart, updateLoggedinCart } from './redux/actions';
const Invoice = React.lazy(() => import('./components/Reusables/Invoice'));
const CheckoutPage = React.lazy(() => import('./components/CheckoutPage'));
const SetNewPassword = React.lazy(() => import('./components/ForgetPassword/SetNewPassword'));
const VerifyOtp = React.lazy(() => import('./components/ForgetPassword/VerifyOtp'));
const ForgetPassword = React.lazy(() => import('./components/ForgetPassword/ForgetPassword'));
const ChangePassword = React.lazy(() => import('./components/profile/ChangePassword'));
const ProductPage = React.lazy(() => import('./components/Reusables/ProductPage'));
const NavigationBar = React.lazy(() => import('./components/NavigationBar'));
const FooterBar = React.lazy(() => import('./components/FooterBar'));
const Registration = React.lazy(() => import('./components/Registration'));
const Login = React.lazy(() => import('./components/Login'));
const Profile = React.lazy(() => import('./components/profile/Profile'));
const HomeProfile = React.lazy(() => import('./components/profile/HomeProfile'));
const Orders = React.lazy(() => import('./components/profile/Orders'));
const Address = React.lazy(() => import('./components/profile/Address'));
const DashHome = React.lazy(() => import('./components/DashHome'));
const Products = React.lazy(() => import('./components/Products'));
const Cart = React.lazy(() => import('./components/Cart'));

function App() {
  const dispatch = useDispatch()
  const loginStatus = useSelector(state => state.setLoginStatus);
  useEffect(() => {
    if (JSON.parse(localStorage.getItem('cart')) == undefined) {
      localStorage.setItem('cart', JSON.stringify([]));
    }
    else {
      if (loginStatus) {
        dispatch(updateLoggedinCart())
      } else
        dispatch(updateCart());
    }
  }, []);
  return (
    <div >
      <Suspense fallback={<div className='d-flex justify-content-center align-items-center'>
        <img src={Mario} alt="loading..." />

      </div>}>
        <BrowserRouter>
          <NavigationBar />
          <Routes>
            <Route path='/register' exact element={<Registration />} />
            <Route path='/login' exact element={<Login />} />
            <Route path='/' exact element={<DashHome />} />
            <Route path='/products' exact element={<Products />} />
            <Route path='/productDetail/:id' exact element={<ProductPage />} />
            <Route path='/forgetPassword' exact element={<ForgetPassword />} />
            <Route path='/verifyOtp' exact element={<VerifyOtp />} />
            <Route path='/setNewPassword' exact element={<SetNewPassword />} />
            <Route path='/cart' exact element={<Cart />} />

            {loginStatus &&
              <>
                <Route path='/invoice/:id' exact element={<Invoice />} />
                <Route path='/checkout' exact element={<CheckoutPage />} />
                <Route path='/profile' exact element={<Profile />}>
                  <Route path='' exact element={<HomeProfile />} />
                  <Route path='orders' exact element={<Orders />} />
                  <Route path='address' exact element={<Address />} />
                  <Route path='changePassword' exact element={<ChangePassword />} />
                </Route>
              </>

            }
            <Route path="*" element={
              <div id="errorPage">
                <div className="fof">
                  <h1>Error 404</h1>
                </div>
              </div>} />
          </Routes>
          <FooterBar />
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
