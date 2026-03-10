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
    await searchPage.enterSearchInput(searchTestData.validPostalCode);
    await searchPage.acceptCookies();
    await searchPage.enterSearchInput(searchTestData.validPostalCode);
    await searchPage.selectSuggestionFromDropdown(searchTestData.validSuggestion);
    const listResultCountAndItem = await searchPage.getListResultsCountAndItem();
    const listResults = await listResultCountAndItem[0].textContent();
    expect(listResults).toBeTruthy();
    const count = Number(listResults?.trim().split(' ')[0]);
    expect(count).toBeGreaterThan(0);
    const mapMarkers = await searchPage.getMapMarkers();
    expect (await mapMarkers.count()).toBeGreaterThan(0);

})

test('should verify if the search returns the entire list when searching ', async({})=>{
    const searchPage = new SearchPage(page);
    await searchPage.enterSearchInput(searchTestData.unsupportedInput);
    await searchPage.acceptCookies();
    await searchPage.enterSearchInput(searchTestData.unsupportedInput);
    const errorMessage = searchPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(searchTestData.invalidSearchErrorMessage);
})