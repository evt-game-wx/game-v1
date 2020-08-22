module qmr
{

    export class LoginViewUI extends SuperBaseModule
    {
        public labContent:eui.Label;
public btnClose:eui.Image;
public btnReturn:eui.Image;


        public constructor()
        {
            super();
            this.qmrSkinName = "LoginViewSkin";
        }
    }
}