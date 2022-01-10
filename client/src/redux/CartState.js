
const setCart = (state = [], action) => {
    switch (action.type) {
        case "updateCart":
            console.log("in reducer", JSON.parse(localStorage.getItem('cart')))
            return JSON.parse(localStorage.getItem('cart'));
        case "updateLoggedinCart":
            console.log("in reducer social", JSON.stringify(sessionStorage.getItem('cart')))
            return JSON.parse(sessionStorage.getItem('cart'));
        default: return state;
    }
}
export default setCart;
