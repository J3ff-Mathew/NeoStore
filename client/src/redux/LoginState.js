
const setLoginStatus = (state = false, action) => {
    switch (action.type) {
        case "enable":
            return true;
        case "disable":
            return false;
        default: return state;
    }
}
export default setLoginStatus;
