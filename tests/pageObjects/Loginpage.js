class Loginpage {
    constructor(page) {
        this.page = page;
        this.userEmail = page.locator('#userEmail');
        this.userPassword = page.locator('#userPassword');
        this.signInBtn = page.locator("[value='Login']");
    }

    async goto() {
        await this.page.goto('https://rahulshettyacademy.com/client');
    }

    async validLogin(email, password) {
        await this.userEmail.fill(email);
        await this.userPassword.fill(password);
        await this.signInBtn.click();
    }
}

module.exports = { Loginpage };
