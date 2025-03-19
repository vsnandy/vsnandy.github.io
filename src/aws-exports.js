const awsExports = {
    Auth: {
        Cognito: {
            region: process.env.REGION,
            userPoolId: process.env.USER_POOL_ID,
            userPoolClientId: process.env.USER_POOL_CLIENT_ID,
            loginWith: {
                email: true,
            }
        },
        mfa: {
            status: 'on',
            totpEnabled: true
        },
    }
}

export default awsExports;