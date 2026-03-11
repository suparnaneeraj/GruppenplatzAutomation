import { Page, Locator, expect } from "@playwright/test";

export class SearchPage {

    private readonly page: Page;
    private searchInputField: Locator;
    private optionInDropdown: Locator;
    private listResultsCount: Locator;
    private acceptCookiesButton: Locator;
    private cookieModal: Locator;
    private searchButton: Locator;
    private listItem: Locator;
    private mapMarkers: Locator;
    private invalidSearchErrorMessage : Locator

    constructor(page: Page) {
        this.page = page;
        this.searchInputField = this.page.getByRole('combobox');
        this.optionInDropdown = this.page.getByRole('option');
        this.listResultsCount = this.page.locator('div#b4-b1-b18-ResultCountContainer span');
        this.acceptCookiesButton = this.page.getByRole('button', { name: /accept all/i });
        this.cookieModal = this.page.getByRole('dialog');
        this.searchButton = this.page.getByText('Gruppen suchen');
        this.listItem = this.page.locator('.map-list-item');
        this.mapMarkers = this.page.locator('.leaflet-marker-icon');
        this.invalidSearchErrorMessage = this.page.locator('.feedback-message-error');

    }

    //This method is to enter an input in the search input field
    async enterSearchInput(searchInput: string){
        await this.searchInputField.scrollIntoViewIfNeeded();
        await this.searchInputField.clear();
        await this.searchInputField.click();
        await this.searchInputField.fill(searchInput);
    }

    //This method is to select an option from the suggestions dropdown
    async selectSuggestionFromDropdown(suggestion? : string){
        let option: Locator;
        if(suggestion){
            option = this.optionInDropdown.filter({hasText:suggestion}).first();
        }
        else{
            option = this.optionInDropdown.first();
        }
            await option.waitFor({ 'state': 'visible' });
            await option.click();
    }

    //This method is to wait for the cookies modal to be displayed and then accept the cookies by clicking Accept button 
    async acceptCookies() {
        await this.acceptCookiesButton.waitFor({'state':'visible'});
        await this.acceptCookiesButton.click();
        await expect(this.acceptCookiesButton).toBeHidden();
        
    }

    //This method is to click the Search button
    async submitSearch(){
        await this.searchButton.click();
    }

    //This method is to fetch the total results count and the items in the first page of the list once the search is performed
    async getListResultsCountAndItem() {
        await expect(this.listResultsCount).toBeVisible();
        await expect(this.listItem.first()).toBeVisible();
        return [this.listResultsCount, this.listItem];
    }

    //This method is to get the markers in the map after search is performed
    async getMapMarkers() {
        await this.mapMarkers.first().waitFor({ 'state': 'visible' });
        return this.mapMarkers;
    }

    //This method is to get the error message when a search is performed with an invalid input
    getErrorMessage(){
        return this.invalidSearchErrorMessage;
    }

}