import puppeteer from 'puppeteer';

class GmailSignIn {

    constructor() {
        this.elements = {
            nextButton: `button`,

            firstStep: {
                firstNameInput: `input[name="firstName"]`,
            },
            secondStep: {
                dayInput: `input[name="day"]`,
                monthSelect: `select[id="month"]`,
                yearInput: `input[name="year"]`,
                genderSelect: `select[id="gender"]`,
            },
            thirdStep: {
                usernameInput: `input[name="Username"]`,
                createUsernameOption: `div[aria-labelledby="selectionc2"]`
            },
            fourthStep: {
                passwordInput: `input[name="Passwd"]`,
                passwordConfirmInput: `input[name="PasswdAgain"]`,
            },
        };
        
        this.defaultType = { delay: 30 };
        this.sleep = (waitTimeInMs) => new Promise((r) => setTimeout(r, waitTimeInMs));
        
        this.browser = null;
        this.page = null;
        this.pageUrl = `https://accounts.google.com/lifecycle/steps/signup/name?dsh=S1744937095:1700071373578596&flowEntry=SignUp&flowName=GlifWebSignIn&hl=en-GB&ifkv=AVQVeyw_DbwChqz7WIxiAvGxOG3Q0zxbfqa_ET-a4z7c7NcwT6ltD5m4XUmz06zEmom2sUqSXGylfg&theme=glif&TL=AIBe4_ItXNv0mrHbxiYGzEbFh1mFDD_5CpnwC2JEKWYpAv9msAkeXfTS7N_w2OCm`
    
        this.generatedPassword = '#johnmockpassword123xxx'
        this.generatedUsername = this.#setUsername();
    }

    async init() {
        this.browser = await puppeteer.launch({headless: false});
        this.page = await this.browser.newPage(); 
        await this.page.setViewport({width: 1080, height: 1024});
        await this.page.goto(this.pageUrl);
    }

    async terminate() {
        await this.browser.close();
    }

    async #goToNextPage() {
        await this.page.click('button') // click 'next' button
        await this.sleep(1000) // wait for page to load
    }

    async enterFirstName() {
        console.log('entering first name...');
        const fNameInputSelector = this.elements.firstStep.firstNameInput;
        await this.page.type(fNameInputSelector, 'john');
        await this.#goToNextPage();
    }

    async enterBirthAndGender() {
        const dayInput = this.elements.secondStep.dayInput;
        const monthSelect = this.elements.secondStep.monthSelect;
        const yearInput = this.elements.secondStep.yearInput;
        const genderSelect = this.elements.secondStep.genderSelect;

        await this.page.type(dayInput, '1')
        await this.page.select(monthSelect, '1') // 1 = 'January'
        await this.page.type(yearInput, '2000')
        await this.page.select(genderSelect, '3') // 3 = 'Rather not say'

        await this.#goToNextPage();
    }

    async enterUsername() {
        const fillUsername = async () => {
            const usernameInput = this.elements.thirdStep.usernameInput;
            await this.page.type(usernameInput, this.generatedUsername);
        }

        const createUsernameOption = this.elements.thirdStep.createUsernameOption;
        const areOptionsPresent = await this.page.$(createUsernameOption);

        if (!areOptionsPresent) {
            await fillUsername();
        } else {      
            await this.page.click(createUsernameOption);
            await fillUsername();
        }

        await this.#goToNextPage();
    }

    async enterPassword() {
        
        const { passwordInput } = this.elements.fourthStep
        const { passwordConfirmInput } = this.elements.fourthStep

        await this.page.type(passwordInput, this.generatedPassword)
        await this.page.type(passwordConfirmInput, this.generatedPassword)

        await this.#goToNextPage();
    }

    #setUsername() {
        const randomInteger = Math.floor(Math.random() * 9000000000) + 1000000000;
        return `john${randomInteger}`
    }

    async verifyResults() {
        const searchText = 'Sorry, we could not create your Google Account.';
        const isTextPresent = await this.page.evaluate((searchText) => {
            const pageText = document.body.innerText;
            return pageText.includes(searchText);
        }, searchText);

        if (isTextPresent) {
            console.log("ERROR: Sorry, we could not create your Google Account.")
        } else {
            console.log(`
            SUCCESS: Account has been created.
            \nUSERNAME: ${generatedUsername}
            \PASSWORD: ${generatedPassword}`
            );
        }
    }
}

export default GmailSignIn;