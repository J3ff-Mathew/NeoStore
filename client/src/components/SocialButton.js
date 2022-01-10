import React from "react";
import SocialLogin from "react-social-login";

class SocialButton extends React.Component {
    render() {
        const { children, triggerLogin, ...props } = this.props;
        return (
            <p style={{ border: 'none', outline: 'none', background: 'white' }} onClick={triggerLogin} {...props}>
                {children}
            </p>
        );
    }
}

export default SocialLogin(SocialButton);