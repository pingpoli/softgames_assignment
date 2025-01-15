import * as PIXI from "pixi.js";

// helper class for the animated fire
export class Fire
{
    private container: PIXI.Sprite;
    private x: number;
    private y: number;
    private sprite: PIXI.AnimatedSprite | null = null;

    constructor( container: PIXI.Sprite , x: number , y: number , scale: number , spritesheet: PIXI.Spritesheet )
    {
        this.container = container;
        this.x = x;
        this.y = y;
        this.init( spritesheet , scale );
    }

    private init( spritesheet: PIXI.Spritesheet , scale: number )
    {
        this.sprite = new PIXI.AnimatedSprite( spritesheet.animations.fire );
        this.sprite.anchor.set( 0.5 );
        this.sprite.scale.x = scale;
        this.sprite.scale.y = scale;
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        // set the animation speed
        this.sprite.animationSpeed = 1;
        // play the animation on a loop
        this.sprite.play();

        this.container.addChild( this.sprite );
    }
}