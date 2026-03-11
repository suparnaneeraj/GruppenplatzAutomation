import {test, expect, Page} from '@playwright/test';
import { SearchPage } from '../pages/searchPage';
import {searchTestData} from '../test-data/searchData';

let page: Page;

test.beforeEach(async({browser})=>{
    page = await browser.newPage();
    await page.goto('');
})
test('should verify if the search returns results in the list and map for valid postal code', async({})=>{
    const searchPage = new SearchPage(page);
    //Enters a valid postal code in the search input field
    await searchPage.enterSearchInput(searchTestData.validPostalCode);
    //Accepts the cookies by clicking the accept button in the modal
    await searchPage.acceptCookies();
    //Since the click on the cookie modal shifts the focus from the dropdown suggestions, entering the input again
    await searchPage.enterSearchInput(searchTestData.validPostalCode);
    //Selects the option from the dropdwon 
    await searchPage.selectSuggestionFromDropdown(searchTestData.validSuggestion);
    const listResultCountAndItem = await searchPage.getListResultsCountAndItem();
    const listResults = await listResultCountAndItem[0].textContent();
    //verifies if the count is not null or empty string
    expect(listResults).toBeTruthy();
    const count = Number(listResults?.trim().split(' ')[0]);
    //verifies if the count is greater than 0 meaning some results are displayed
    expect(count).toBeGreaterThan(0);
    const mapMarkers = await searchPage.getMapMarkers();
    //verifies if more than 0 map markers are displayed on the map
    expect (await mapMarkers.count()).toBeGreaterThan(0);

})

test('should verify if the search returns the entire list when searching ', async({})=>{
    const searchPage = new SearchPage(page);
    await searchPage.enterSearchInput(searchTestData.unsupportedInput);
    await searchPage.acceptCookies();
    await searchPage.enterSearchInput(searchTestData.unsupportedInput);
    const errorMessage = searchPage.getErrorMessage();
    //verifies if the error message is displayed
    await expect(errorMessage).toBeVisible();
    //verifies if the error message has the given text
    await expect(errorMessage).toContainText(searchTestData.invalidSearchErrorMessage);
})