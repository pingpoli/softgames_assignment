import * as PIXI from "pixi.js";

// very simple button class
export class Button
{
    private app: PIXI.Application;
    private str: string;
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private graphics: PIXI.Graphics;
    private text: PIXI.Text;
    onclick: Function | null;
    
    constructor( app: PIXI.Application , str : string , x: number , y: number , width: number , height: number )
    {
        this.app = app;
        this.str = str;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill( 0xcc0000 );
        this.graphics.drawRect( 0 , 0 , this.width , this.height );
        this.graphics.endFill();
        this.graphics.x = this.x;
        this.graphics.y = this.y;

        // make the button clickable
        this.graphics.eventMode = "static";
        this.onclick = null;
        this.graphics.on( "click" , () => {
            if ( this.onclick !== null ) this.onclick(); 
        } );

        // add a hover effect
        this.graphics.on( "mouseenter" , () => {
            this.graphics.clear();
            this.graphics.beginFill( 0xee0000 );
            this.graphics.drawRect( 0 , 0 , this.width , this.height );
            this.graphics.endFill();
        } );
        this.graphics.on( "mouseleave" , () => {
            this.graphics.clear();
            this.graphics.beginFill( 0xcc0000 );
            this.graphics.drawRect( 0 , 0 , this.width , this.height );
            this.graphics.endFill();
        } );

        // add the text
        this.text = new PIXI.Text( this.str , {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            align: 'center',
        } );
        this.text.x = this.width/2;
        this.text.y = this.height/2;
        this.text.anchor.set( 0.5 );
        this.graphics.addChild( this.text );

        this.app.stage.addChild( this.graphics );
    }

    show()
    {
        this.graphics.visible = true;
    }

    hide()
    {
        this.graphics.visible = false;
    }

    center()
    {
        this.x = Math.floor( ( window.innerWidth - this.width ) * 0.5 );
        this.graphics.x = this.x;
    }
}