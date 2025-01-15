import * as PIXI from "pixi.js";

// helper class for the sparks
export class Spark
{
    private parent: PIXI.Container;
    private x: number;
    private y: number;
    private dx: number = 0;
    private dy: number = 0;
    private sprite: PIXI.Sprite | null = null;
    private b_alive: boolean = false;

    constructor( parent: PIXI.Container , x: number , y: number , scale: number , texture: PIXI.Texture )
    {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.init( texture , scale );
    }

    spawn( x: number , y: number )
    {
        this.x = x;
        this.y = y;
        this.dy = -100+Math.random()*10;
        this.dx = -50+Math.random()*100;
        this.b_alive = true;
        this.sprite!.visible = true;
    }

    update( dt : number )
    {
        if ( !this.b_alive ) return;

        this.x += this.dx * dt;
        this.y += this.dy * dt;
        this.sprite!.x = this.x;
        this.sprite!.y = this.y;

        if ( Math.random() < 0.05 )
        {
            this.dx *= 1.0-0.1+Math.random()*0.2;
        }
    }

    private init( texture: PIXI.Texture , scale: number )
    {
        this.sprite = new PIXI.Sprite( texture );
        this.sprite.anchor.set( 0.5 );
        this.sprite.scale.x = scale;
        this.sprite.scale.y = scale;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.visible = false;
        this.parent.addChild( this.sprite );
    }
}