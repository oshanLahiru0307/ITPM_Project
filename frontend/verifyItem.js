const { Builder, By } = require('selenium-webdriver');
const assert = require('assert');

async function verifyItem() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Navigate to the website
        await driver.get('http://localhost:3000');

        let loginButtonElement = await driver.findElement(
            By.xpath('//button[@type="submit"][.//span[text()="Login"]]')
        );
        let loginButtonText = await loginButtonElement.getText();
        assert.strictEqual(loginButtonText, 'Login', 'Login button text does not match!');
        console.log('Test case 1: Login button text is correct.');

        // Test Case 2: Verify Email Input Field
        let emailInput = await driver.findElement(By.xpath('//input[@id="email"]'));
        assert.ok(emailInput, 'Test Case 2 Failed: Email input field not found');
        console.log('Test Case 2: Email input field is present.');

        // Test Case 3: Verify Password Input Field
        let passwordInput = await driver.findElement(By.xpath('//input[@type="password"]'));
        assert.ok(passwordInput, 'Test Case 3 Failed: Password input field not found');
        console.log('Test Case 3: Password input field is present.');

    } catch (error) {
        console.error('Error:', error);
        console.log('Test failed.');
    } finally {
        // Close the browser
        await driver.quit();
    }
}

verifyItem();
