import * as PIXI from "pixi.js";

export class Card
{
    static ANIMATION_TIME = 2.0;

    private x: number;
    private y: number;
    private targetX: number = 0;
    // is the card currently moving
    b_move: boolean = false;
    // has the card already been moved to the new stack
    b_swapedStacks: boolean = false;
    sprite: PIXI.Sprite | null = null;
    timer: number = 0;

    constructor( x: number , y: number , cardTexture: PIXI.Texture )
    {
        this.x = x;
        this.y = y;
        this.init( cardTexture );
    }

    // reset the card back to its initial state
    reset( x: number , y: number )
    {
        this.x = x;
        this.y = y;
        this.b_move = false;
        this.b_swapedStacks = false;
        this.timer = 0;
        this.sprite!.x = this.x;
        this.sprite!.y = this.y;
    }

    update( dt: number )
    {
        if ( !this.b_move ) return;

        this.timer += dt;
        let t = this.timer/Card.ANIMATION_TIME;
        let x = lerp( this.x , this.targetX , t );
        let y = this.y + arc( -300 , t );
        this.sprite!.x = x;
        this.sprite!.y = y;
        this.sprite!.rotation += Math.PI*dt;
        if ( this.timer >= Card.ANIMATION_TIME )
        {
            this.x = this.targetX;
            this.sprite!.x = this.x;
            this.sprite!.y = this.y;
            this.timer = 0;
            this.b_move = false;
        }
    }

    moveTo( x: number )
    {
        this.targetX = x;
        this.b_move = true;
    }

    private init( cardTexture: PIXI.Texture )
    {
        this.sprite = new PIXI.Sprite( cardTexture );
        this.sprite.anchor.set( 0.5 );
        this.sprite.scale.x = 3;
        this.sprite.scale.y = 3;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.rotation = Math.random()*Math.PI*2.0;
    }
}

function lerp( a: number , b: number , t: number )
{
    return a + t * ( b - a );
}

function arc( h: number , t: number )
{
    return h * ( 1 - 4 * ( t - 0.5 ) * ( t - 0.5 ) );
}