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

    async enterSearchInput(postalCode: string){
        await this.searchInputField.scrollIntoViewIfNeeded();
        await this.searchInputField.clear();
        await this.searchInputField.click();
        await this.searchInputField.fill(postalCode);
    }

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

    async acceptCookies() {
        await this.acceptCookiesButton.waitFor({'state':'visible'});
        await this.acceptCookiesButton.click();
        await expect(this.acceptCookiesButton).toBeHidden();
        
    }

    async submitSearch(){
        await this.searchButton.click();
    }

    async getListResultsCountAndItem() {
        await expect(this.listResultsCount).toBeVisible();
        await expect(this.listItem.first()).toBeVisible();
        return [this.listResultsCount, this.listItem];
    }

    async getMapMarkers() {
        await this.mapMarkers.first().waitFor({ 'state': 'visible' });
        return this.mapMarkers;
    }

    getErrorMessage(){
        return this.invalidSearchErrorMessage;
    }

}