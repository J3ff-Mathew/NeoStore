export const enableLoginStatus = () => {
    console.log("in action")
    return { type: "enable" };
}
export const disableLoginStatus = () => {
    console.log("in action")
    return { type: "disable" };
}
export const updateProfile = () => {
    console.log("in action")
    return { type: "updateProfile" };
}

export const updateCart = () => {
    console.log("in action")
    return { type: "updateCart" };
}
export const updateLoggedinCart = () => {
    console.log("in action update cart");
    return { type: "updateLoggedinCart" };
}