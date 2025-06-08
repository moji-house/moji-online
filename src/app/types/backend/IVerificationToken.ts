interface IVerificationToken {
    identifier: string;
    token: string;
    expires: Date | string;
}

export default IVerificationToken;