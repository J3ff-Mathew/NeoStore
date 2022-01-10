
const setUserProfile = (state = JSON.parse(sessionStorage.getItem('user')), action) => {
    switch (action.type) {
        case "updateProfile":
            return JSON.parse(sessionStorage.getItem('user'));
        default: return state;
    }
}
export default setUserProfile;
