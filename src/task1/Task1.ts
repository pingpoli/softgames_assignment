import * as PIXI from "pixi.js";
import { Card } from "./Card";

export class Task1
{
    private app: PIXI.Application;
    // all cards
    private cards: Card[];
    // only the cards that are moving, so we don't have to update all of them
    private updatingCards: Card[] = [];
    // the main container/stack
    private container: PIXI.Container;
    // the second container/stack where the cards are being moved to, for the render order so that the second stack also fills from the bottom up, we could also depth sort the cards instead
    private container2: PIXI.Container;
    // load the card textures here once instead of the card instances
    private cardTextures: PIXI.Texture[] = [];
    private timer: number = 0;
    // location of the 2 card stacks
    private stack1X: number = 0;
    private stack2X: number = 0;
    private stackY: number = 0;
    private cardIndex: number = 0;

    constructor( app: PIXI.Application )
    {
        this.app = app;
        this.container = new PIXI.Container();
        this.container.visible = false;
        this.app.stage.addChild( this.container );
        this.container2 = new PIXI.Container();
        this.container2.visible = false;
        this.app.stage.addChild( this.container2 );

        this.cards = [];

        this.init();
    }

    update( dt: number )
    {
        if ( this.container.visible )
        {
            this.timer += dt;

            if ( this.timer >= 1.0 )
            {
                if ( this.cardIndex >= 0 )
                {
                    // move the top card
                    let card = this.cards[this.cardIndex];
                    this.cardIndex--;
                    let x = this.stack2X-50+Math.random()*100;
                    card.moveTo( x );
                    this.updatingCards.push( card );

                    this.timer -= 1.0;
                }
            }

            // update the moving cards
            for ( let i = 0 ; i < this.updatingCards.length ; ++i )
            {
                this.updatingCards[i].update( dt );

                // in the middle of the move, change the card's parent, cards are the maximum distance apart here so they don't overlap weirdly when chaning their render order
                if ( this.updatingCards[i].timer > Card.ANIMATION_TIME/2 && !this.updatingCards[i].b_swapedStacks )
                {
                    // remove the card from the normal container
                    this.container.removeChild( this.updatingCards[i].sprite! );
                    // and add it to the second container
                    this.container2.addChild( this.updatingCards[i].sprite! );
                }

                // remove the card from the updating cards when its move is complete
                if ( !this.updatingCards[i].b_move )
                {
                    this.updatingCards.splice( i , 1 );
                    i--;
                }
            }
        }
    }

    show()
    {
        this.container.visible = true;
        this.container2.visible = true;

        // reset when showing
        for ( let i = 0 ; i < 144 ; ++i )
        {
            let x = this.stack1X-50+Math.random()*100;
            let y = this.stackY-50+Math.random()*100;
            this.cards[i].reset( x , y );
        }
        this.cardIndex = this.cards.length-1;
        // move all cards back to the first container/stack
        this.container.removeChildren();
        this.container2.removeChildren();
        for ( let i = 0 ; i < this.cards.length ; ++i )
        {
            this.container.addChild( this.cards[i].sprite! );
        }
    }

    hide()
    {
        this.container.visible = false;
        this.container2.visible = false;
    }

    onresize()
    {
        this.resize();
    }

    async init()
    {
        this.resize();

        // load all textures here
        this.cardTextures.push( await PIXI.Assets.load( './card_heart.png' ) );
        this.cardTextures.push( await PIXI.Assets.load( './card_diamond.png' ) );
        this.cardTextures.push( await PIXI.Assets.load( './card_spade.png' ) );
        this.cardTextures.push( await PIXI.Assets.load( './card_club.png' ) );
        // pixel art texture scaling, i.e. nearest filtering
        this.cardTextures[0]!.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.cardTextures[1]!.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.cardTextures[2]!.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.cardTextures[3]!.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        // initialize the cards
        for ( let i = 0 ; i < 144 ; ++i )
        {
            let x = this.stack1X-50+Math.random()*100;
            let y = this.stackY-50+Math.random()*100;
            this.cards.push( new Card( x , y , this.cardTextures[Math.floor(Math.random()*this.cardTextures.length)] ) );
            this.container.addChild( this.cards[i].sprite! );
        }
        this.cardIndex = this.cards.length-1;
    }

    private resize()
    {
        this.stack1X = window.innerWidth*0.25;
        this.stack2X = window.innerWidth*0.75;
        this.stackY = window.innerHeight*0.5;
    }
}