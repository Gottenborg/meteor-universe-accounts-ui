import utils from '../utils';
import i18n from '{universe:i18n}';

//instance of translate component in "accounts-ui" namespace
const T = i18n.createComponent(i18n.createTranslator('accounts-ui'));

export default React.createClass({
    displayName: 'PasswordForm',
    propTypes: {
        clearErrors: React.PropTypes.func.isRequired,
        onError: React.PropTypes.func.isRequired,
        type: React.PropTypes.oneOf(['login', 'register']).isRequired,
        passwordStrengthCheck: React.PropTypes.bool,
        termsCheckbox: React.PropTypes.bool,
        termsLink: React.PropTypes.string
    },
    getInitialState () {
        return {
            loading: false
        };
    },
    checkPasswordStrength(password){
        let errors = [];
        let status = false;

        if(!/[a-z]/.test(password)){
            errors.push('lowercase letter');
            status = true;
        }
        if(!/[A-Z]/.test(password)){
            errors.push('uppercase letter');
            status = true;
        }
        if(!/[0-9]/.test(password)){
            errors.push('number');
            status = true;
        }
        if(/^[a-zA-Z0-9.]*$/.test(password)){
            errors.push('special character');
            status = true;
        }
        if(password.length < 8){
            errors.push('at least 8 signs');
            status = true;
        }
        return {status, errors};
    },
    handleSubmit (e) {
        e.preventDefault();

        const { clearErrors, onError } = this.props;
        var passwordNode = this.refs.password;
        var emailNode = this.refs.email;


        if (this.props.type === 'login') {
            // log in / sign in

            this.setState({loading: true});
            Meteor.loginWithPassword(
                emailNode.value,
                passwordNode.value,
                (err) => {
                    // let errors = this.state.errors;
                    this.setState({loading: false});

                    if (err && err.error === 400) {
                        onError(i18n.__('accounts-ui', 'invalid_usename_or_password'));
                    } else if (err) {
                        onError(err.reason || i18n.__('accounts-ui', 'unknown_error'));
                    } else {
                        clearErrors();
                    }
                }
            );
        } else {
            // register / sign up
            var passwordNode2 = this.refs.password2;

            if (passwordNode.value !== passwordNode2.value) {
                onError(i18n.__('accounts-ui', 'passwords_dont_match'));
                return;
            }

            if(this.props.passwordStrengthCheck){
                let passwordCheck = this.checkPasswordStrength(passwordNode.value);
                if(passwordCheck.status){
                    onError(onError(i18n.__('accounts-ui', 'password_dont_have')) + passwordCheck.errors.join(', '));
                    return
                }
            }

            if(this.props.termsCheckbox){
                let terms = this.refs.terms;
                if(!terms.checked){
                    onError(i18n.__('accounts-ui', 'terms_accept_required'));
                    return;
                }
            }

            this.setState({loading: true});

            Accounts.createUser({
                email: emailNode.value,
                password: passwordNode.value
            }, (err) => {
                this.setState({loading: false});
                if (err) {
                    onError(err.reason || i18n.__('accounts-ui', 'unknown_error'));
                } else {
                    clearErrors();
                    // this.refs.form.reset();
                }
            });

        }
    },
    render () {
        if (!utils.hasPasswordService()) {
            return <div></div>;
        }
        let isRegistration = (this.props.type === 'register');

        return (
            <form onSubmit={this.handleSubmit}
                  className={'ui large form' + (this.state.loading ? ' loading' : '')}
                  ref="form">

                <div className="required field">
                    <label><T>email</T></label>
                    <input type="email"
                           placeholder={ i18n.__('accounts-ui', 'email') }
                           ref="email"
                    />
                </div>

                <div className="required field">
                    <label><T>password</T></label>
                    <input
                        type="password"
                        placeholder={ i18n.__('accounts-ui', 'password') }
                        ref="password"/>
                </div>

                {isRegistration ?
                <div className="required field">
                    <label><T>repeat_password</T></label>
                    <input
                        type="password"
                        placeholder={ i18n.__('accounts-ui', 'repeat_password') }
                        ref="password2"/>
                </div>
                    : ''}

                {isRegistration && this.props.termsCheckbox ?
                    <div className="required field">
                        <label className="terms">
                            <input type="checkbox" ref="terms" value="accept"/>
                            <T>terms_accept</T> <a href={this.props.termsLink}><T>terms_conditions</T></a></label>
                    </div>
                    : ''}

                <button type="submit"
                        className="ui fluid large primary button">
                    { isRegistration ?
                        i18n.__('accounts-ui', 'sign_up') :
                        i18n.__('accounts-ui', 'sign_in') }
                </button>
            </form>
        );
    }
});