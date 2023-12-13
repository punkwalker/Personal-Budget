const { Builder, By } = require('selenium-webdriver');
const { Eyes, 
    ClassicRunner,
    VisualGridRunner, 
    RunnerOptions,
    Target, 
    RectangleSize, 
    Configuration, 
    BatchInfo,
    BrowserType,
    ScreenOrientation,
    DeviceName } = require('@applitools/eyes-selenium');
const webdriver = require('selenium-webdriver');

var assert = require('assert');

describe('Personal Budget Tracker', () => {

    // This Mocha test case class contains everything needed to run a full visual test against the Budget Tracker App site.
    // It runs the test once locally.
    // If you use the Ultrafast Grid, then it performs cross-browser testing against multiple unique browsers.
    
    // Settings to control how tests are run.
    // These could be set by environment variables or other input mechanisms.
    // They are hard-coded here to keep the example project simple.
    const USE_ULTRAFAST_GRID = true;
    const USE_EXECUTION_CLOUD = false;
    
    // Test control inputs to read once and share for all tests
    //var applitoolsApiKey = process.env.APPLITOOLS_API_KEY;
    applitoolsApiKey = '97BtB4jk2l106ScDO7UBFRHjEayfPPYjVBOcXrr81Ou7OE110';
    var headless;

    // Applitools objects to share for all tests
    let batch;
    let config;
    let runner;
    
    // Test-specific objects
    let driver;
    let eyes;

    before(async () => {

        // Read the headless mode setting from an environment variable.
        // Use headless mode for Continuous Integration (CI) execution.
        // Use headed mode for local development.
        headless = process.env.HEADLESS? ['headless'] : []

        if (USE_ULTRAFAST_GRID) {
            // Create the runner for the Ultrafast Grid.
            // Concurrency refers to the number of visual checkpoints Applitools will perform in parallel.
            // Warning: If you have a free account, then concurrency will be limited to 1.
            runner = new VisualGridRunner(new RunnerOptions().testConcurrency(5));
        }
        else {
            // Create the classic runner.
            runner = new ClassicRunner();
        }

        // Create a new batch for tests.
        // A batch is the collection of visual checkpoints for a test suite.
        // Batches are displayed in the Eyes Test Manager, so use meaningful names.
        const runnerName = (USE_ULTRAFAST_GRID) ? 'Ultrafast Grid' : 'Classic runner';
        batch = new BatchInfo(`Example: Selenium JavaScript Mocha with the ${runnerName}`);

        // Create a configuration for Applitools Eyes.
        config = new Configuration();
        
        // Set the Applitools API key so test results are uploaded to your account.
        // If you don't explicitly set the API key with this call,
        // then the SDK will automatically read the `APPLITOOLS_API_KEY` environment variable to fetch it.
        config.setApiKey(applitoolsApiKey);

        // Set the batch for the config.
        config.setBatch(batch);

        if (USE_ULTRAFAST_GRID) {

            // Add 3 desktop browsers with different viewports for cross-browser testing in the Ultrafast Grid.
            // Other browsers are also available, like Edge and IE.
            config.addBrowser(800, 600, BrowserType.CHROME);
            config.addBrowser(1600, 1200, BrowserType.FIREFOX);
            config.addBrowser(1024, 768, BrowserType.SAFARI);
        
            // Add 2 mobile emulation devices with different orientations for cross-browser testing in the Ultrafast Grid.
            // Other mobile devices are available, including iOS.
            config.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);
            config.addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE);
        }
    });
    
    beforeEach(async function() {
        //This method sets up each test with its own ChromeDriver and Applitools Eyes objects.
       
        // Open the browser with the ChromeDriver instance.
        // Even though this test will run visual checkpoints on different browsers in the Ultrafast Grid,
        // it still needs to run the test one time locally to capture snapshots.
        var capabilities = {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: headless,
            },
        };

        if (USE_EXECUTION_CLOUD) {
            // Open the browser remotely in the Execution Cloud.
            let url = await Eyes.getExecutionCloudUrl();
            driver = new Builder().usingServer(url).withCapabilities(capabilities).build();
        }
        else {
            // Create a local WebDriver.
            driver = new Builder().withCapabilities(capabilities).build();
        }

        // Set an implicit wait of 10 seconds.
        // For larger projects, use explicit waits for better control.
        // https://www.selenium.dev/documentation/webdriver/waits/
        // The following call works for Selenium 4:
        await driver.manage().setTimeouts( { implicit: 10000 } );

        // If you are using Selenium 3, use the following call instead:
        // await driver.manage().timeouts().implicitlyWait(10000);
        
        // Create the Applitools Eyes object connected to the runner and set its configuration.
        eyes = new Eyes(runner);
        eyes.setConfiguration(config);

        // Open Eyes to start visual testing.
        // It is a recommended practice to set all four inputs:
        await eyes.open(
            
            // WebDriver object to "watch".
            driver,
            
            // The name of the application under test.
            // All tests for the same app should share the same app name.
            // Set this name wisely: Applitools features rely on a shared app name across tests.
            'Budget Tracker App',
            
            // The name of the test case for the given application.
            // Additional unique characteristics of the test may also be specified as part of the test name,
            // such as localization information ("Home Page - EN") or different user permissions ("Login by admin"). 
            this.currentTest.fullTitle(),
            
            // The viewport size for the local browser.
            // Eyes will resize the web browser to match the requested viewport size.
            // This parameter is optional but encouraged in order to produce consistent results.
            new RectangleSize(1200, 600)
        );
    });
  
  it('Should login and show the dashboard for the user', async () => {
    // Visit the homepage
    await driver.get('http://localhost:4200');

    await eyes.check(Target.window().fully().withName("PersonalBudget"));
    await driver.findElement(By.css(".dropdown-standalone-trigger")).click();
    await driver.findElement(By.css(".dropdown-menu-item")).click();
    await driver.findElement(By.id("username")).sendKeys("a@b.com");
    await driver.findElement(By.id("password")).sendKeys("Abcde@1234");
    await driver.findElement(By.css(".cc78b8bf3")).click();
  });
    afterEach(async function() {

        // Close Eyes to tell the server it should display the results.
        await eyes.closeAsync();

        // Quit the WebDriver instance.
        await driver.quit();

        // Warning: `eyes.closeAsync()` will NOT wait for visual checkpoints to complete.
        // You will need to check the Eyes Test Manager for visual results per checkpoint.
        // Note that "unresolved" and "failed" visual checkpoints will not cause the Mocha test to fail.

        // If you want the ACME demo app test to wait synchronously for all checkpoints to complete, then use `eyes.close()`.
        // If any checkpoints are unresolved or failed, then `eyes.close()` will make the ACME demo app test fail.

    });

    after(async () => {
        // Close the batch and report visual differences to the console.
        // Note that it forces Mocha to wait synchronously for all visual checkpoints to complete.
        const allTestResults = await runner.getAllTestResults();
        console.log(allTestResults);
    });
});