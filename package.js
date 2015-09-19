Package.describe({
    name: 'universe:accounts-ui',
    version: '0.0.1',
    summary: 'Accounts UI replacement for Universe using React and Semantic UI',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.3');

    api.use([
        'universe:modules',
        'react-meteor-data',
        'service-configuration',
        'accounts-base'
    ]);

    // Export Accounts (etc) to packages using this one.
    api.imply('accounts-base');

    // Allow us to call Accounts.oauth.serviceNames, if there are any OAuth services.
    // Allow us to directly test if accounts-password (which doesn't use Accounts.oauth.registerService) exists.
    api.use([
        'accounts-oauth',
        'accounts-password'
    ], {weak: true});

    api.addFiles([
        'utils.import.js',
        'components/ComboBox.import.jsx',
        'components/LoggedIn.import.jsx',
        'components/LoginBox.import.jsx',
        'components/LoginForm.import.jsx',
        'components/OAuthButton.import.jsx',
        'components/PasswordForm.import.jsx',
        'components/RegisterBox.import.jsx',
        'components/RegisterForm.import.jsx',
        'components/ResetPasswordBox.import.jsx',
        'main.import.jsx',
        'system.js'
    ]);
});
