import * as PIXI from "pixi.js";
import { Fire } from "./Fire";
import { Spark } from "./Spark";

/*
an actual particle effect with just 10 particles would be a bit lame ( a test version of my older 2D webgl system has a fire texture and even my laptop can do 100k+ particles: https://pingpoli.de/sparrow/particles-2d/ -> change display to texture and use "particle.png" with 8 Tiles, and my website has my engine's editor tools enabled too: https://pingpoli.com/ press P or use the gear at the top and you can create a new 2D particle effect on the fly )
anyway, especially in 2D, a better solution for performance and looks is to pre-generate the particle effect with something like EmberGen and Blender and bake it into a sprite sheet. I don't have an EmberGen license at the moment and not enough time, so I just used a pixel art fire effect from the internet

background image: ChatGPT
fire src: https://opengameart.org/content/animated-fire
sound effect: https://freesound.org/people/TheWoodlandNomad/sounds/363092/
*/

export class Task3
{
    private app: PIXI.Application;
    private container: PIXI.Container;
    private backgroundImage: PIXI.Sprite | null = null;
    private soundEffect: HTMLAudioElement | null = null;
    private sparkTexture: PIXI.Texture | null = null;
    private sparks: Spark[] = [];
    private nextSparkIndex: number = 0;

    constructor( app: PIXI.Application )
    {
        this.app = app;
        this.container = new PIXI.Container();
        this.container.visible = false;
        this.app.stage.addChild( this.container );

        this.init();
    }

    update( dt: number )
    {
        if ( this.container.visible )
        {
            // spawn some sparks randomly, go through the list and start from the beginning when we are at the end
            if ( Math.random() < 0.03 )
            {
                this.sparks[this.nextSparkIndex].spawn( this.backgroundImage!.x-5 , this.backgroundImage!.y+110 );
                this.nextSparkIndex++;
                if ( this.nextSparkIndex >= this.sparks.length )
                {
                    this.nextSparkIndex = 0;
                }
            }
            // update the sparks
            for ( let i = 0 ; i < this.sparks.length ; ++i )
            {
                this.sparks[i].update( dt );
            }
        }
    }

    show()
    {
        this.container.visible = true;
        this.soundEffect!.play();
    }

    hide()
    {
        this.container.visible = false;
        this.soundEffect!.pause();
    }

    onresize()
    {
        this.centerSprite();
    }

    private async init()
    {
        // create the background image
        const texture = await PIXI.Assets.load( './scene.webp' );
        this.backgroundImage = new PIXI.Sprite( texture );
        this.backgroundImage.scale.x = 0.5;
        this.backgroundImage.scale.y = 0.5;
        this.backgroundImage.anchor.set( 0.5 );
        this.centerSprite();
        this.container.addChild( this.backgroundImage );

        // create the texture atlas data for the sprite sheet
        let atlasData : AtlasData = {
            frames: {},
            meta: {
                image: './fire1_64.png',
                format: 'RGBA8888',
                size: { w: 640, h: 384 },
                scale: 1
            },
            animations: {
                fire: [] // array of frames by name
            }
        }

        // fill the frames of the texture atlas programatically
        for ( let i = 0 ; i < 60 ; ++i )
        {
            let x = i%10*64;
            let y = Math.floor(i/10)*64;
            atlasData.frames["frame"+i] = {
                frame: { x: x , y: y , w: 64 , h: 64 },
                sourceSize: { w: 64 , h: 64 },
            };
            atlasData.animations.fire.push("frame"+i);
        }

        // create the sprite sheet
        const spritesheet = new PIXI.Spritesheet( PIXI.BaseTexture.from( atlasData.meta.image ) , atlasData );
        spritesheet!.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        // generate the sprite sheet
        await spritesheet.parse();

        // add the animated fire sprite sheet
        new Fire( this.backgroundImage , -5 , 110 , 6 , spritesheet );

        // add a nice crackling fire sound effect
        this.soundEffect = new Audio( "./fire.ogg" );
        this.soundEffect.loop = true;

        // load the spark texture
        this.sparkTexture = await PIXI.Assets.load( './spark.png' );

        // add some sparks
        for ( let i = 0 ; i < 9 ; ++i )
        {
            let spark = new Spark( this.container , 0 , 0 , 1 , this.sparkTexture! );
            this.sparks.push( spark );
        }
    }

    private centerSprite()
    {
        this.backgroundImage!.x = Math.floor(window.innerWidth*0.5);
        this.backgroundImage!.y = Math.floor(window.innerHeight*0.5);
    }
}

// interfaces so that typescript doesn't complain when creating the texture atlas data programatically
interface Frame {
    frame: { x: number; y: number; w: number; h: number };
    sourceSize: { w: number; h: number };
}
interface AtlasData {
    frames: Record<string, Frame>;
    meta: {
        image: string;
        format: string;
        size: { w: number; h: number };
        scale: number;
    };
    animations: Record<string, string[]>;
}