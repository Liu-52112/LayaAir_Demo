import { ui } from "../ui/layaMaxUI";
export class SplashView extends ui.SplashUI {
    constructor() {
        super();
        this.on(Laya.Event.CLICK, this, this.onSplashClick);
    }
    onSplashClick() {
        this.removeSelf();
        Laya.Scene.open("main.scene");
    }
}