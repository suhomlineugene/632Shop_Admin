import { 632ShopTemplatePage } from './app.po';

describe('632Shop App', function () {
    let page: 632ShopTemplatePage;

    beforeEach(() => {
        page = new 632ShopTemplatePage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('app works!');
    });
});
