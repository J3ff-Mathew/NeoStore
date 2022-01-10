import { combineReducers } from "redux";
import setLoginStatus from "./LoginState";
import setUserProfile from "./UpdateProfileDetails"
import setCart from './CartState'
const rootReducer = combineReducers({ setLoginStatus, setUserProfile, setCart });
export default rootReducer;