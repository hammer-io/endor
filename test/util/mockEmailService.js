export default class MockEmailService {
    constructor(fromAddress, logger, transportOptions) {
        this.from = fromAddress;
        this.log = logger;
        this.transporter = {transportOptions};
        this.shouldFail = false;
    }

    //noinspection JSUnusedLocalSymbols
    async emailInvite(user, project, invite) {
        return new Promise((resolve, reject) => {
            if (this.shouldFail) {
                reject();
            } else {
                resolve();
            }
        });
    }

    setSuccess(shouldFail) {
        this.shouldFail = shouldFail;
    }
}
