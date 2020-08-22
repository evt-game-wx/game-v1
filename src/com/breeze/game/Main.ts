class Main extends eui.UILayer {
    protected createChildren(): void {
        super.createChildren();

        qmr.GameMain.setup(this.stage);
    }
}
