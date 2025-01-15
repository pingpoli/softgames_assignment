import * as PIXI from "pixi.js";
import { ImageTextRenderer } from "./ImageTextRenderer";

/*
there are a few ways to do this, I went with an OffscreenCanvas approach. Everything gets rendered with the HTML5 Canvas API and then turned into a PIXI Texture. You could use a Bitmap Font too and add the images as Sprites in between but that would require multiple draw calls.
This can render text of the type "some words with {image1.png} images {image2.png} in between"
also, not sure whether the random font size was for the full text or a random size for every word. This could be done with additional formatting options too.
Also, I don't think this is fully robost, and would require additional escaping in case you wanted to render text that would contain a {*} pattern, but probably out of scope for this
I'm using some icon images, but any other images would work too // and all unicode symbols and emojis too
*/

export class Task2
{
    // since the images are preloaded, specify the images here. we could do fully on the fly images too, but they would need to be loaded dynamically. since most games would use icons that are known during development, preloading the icons on startup would be my solution
    private filenames: string[] = [ "./icon_attackspeed.png" , "./icon_critchance.png" , "./icon_critpower.png" , "./icon_damage.png" ];

    private app: PIXI.Application;
    private container: PIXI.Container;
    private images: HTMLImageElement[] = [];
    private imageTextRenderer: ImageTextRenderer | null = null;
    private texture: PIXI.Texture | null = null;
    private sprite: PIXI.Sprite | null = null;
    private progressBar: PIXI.Graphics | null = null;
    private timer: number = 0;

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
            this.timer += dt;

            // update the progress bar
            this.progressBar!.scale.x = (2.0-this.timer)/2.0;
            let currentWidth = ((2.0-this.timer)/2.0)*200;
            this.progressBar!.x = Math.floor((window.innerWidth-currentWidth)*0.5);

            // every 2 seconds, update the text with a random text and font size
            if ( this.timer >= 2.0 )
            {
                let text = this.generateText();
                let fontSize = Math.floor( 12+Math.random()*20 );
                // update the canvas
                this.imageTextRenderer!.update( text , fontSize );
                // update the sprite's texture
                this.sprite!.texture.update();
                this.centerSprite();

                this.timer -= 2.0;
            }
        }
    }

    show()
    {
        this.app.renderer.background.color = 0xcccccc;
        this.container.visible = true;
    }

    hide()
    {
        this.app.renderer.background.color = 0x222222;
        this.container.visible = false;
    }

    onresize()
    {
        this.centerSprite();
        this.progressBar!.y = Math.floor((window.innerHeight-100)*0.5)+50;
    }

    async init()
    {
        // load all images
        for ( let i = 0 ; i < this.filenames.length ; ++i )
        {
            const img = new Image();
            img.src = this.filenames[i];
            await img.decode();
            this.images.push( img );
        }

        // create the initial text
        let text = this.generateText();
        let fontSize = Math.floor( 12+Math.random()*20 );
        this.imageTextRenderer = new ImageTextRenderer( text , fontSize , this.images );
        this.texture = PIXI.Texture.from( this.imageTextRenderer.canvas );
        this.sprite = new PIXI.Sprite( this.texture );

        this.container.addChild( this.sprite );

        // add a progress bar
        this.progressBar = new PIXI.Graphics();
        this.progressBar.beginFill( 0x555555 );
        this.progressBar.drawRect( 0 , 0 , 200 , 2 );
        this.progressBar.endFill();
        this.progressBar!.x = Math.floor((window.innerWidth-200)*0.5);
        this.progressBar!.y = Math.floor((window.innerHeight-100)*0.5)+50;
        this.container.addChild( this.progressBar );

        this.centerSprite();
    }

    private centerSprite()
    {
        this.sprite!.x = Math.floor((window.innerWidth-this.sprite!.width)*0.5);
        this.sprite!.y = Math.floor((window.innerHeight-this.sprite!.height)*0.5);
    }

    // helper function to create a random text with words and images
    private generateText() : string
    {
        let result = "";
        let rolls = Math.floor( 3 + Math.random()*8 );
        for ( let i = 0 ; i < rolls ; ++i )
        {
            if ( Math.random() < 0.5 )
            {
                result += words[Math.floor(Math.random()*words.length)]+" ";
            }
            else
            {
                result += "{"+this.filenames[Math.floor(Math.random()*this.filenames.length)]+"} ";
            }
        }
        return result;
    }
}

// random words, looks better than completely random characters
const words = [
"Dragon",
"Wizard",
"Dwarf",
"Elf",
"Goblin",
"Orc",
"Troll",
"Unicorn",
"Griffin",
"Phoenix",
"Mermaid",
"Centaur",
"Minotaur",
"Sphinx",
"Hydra",
"Chimera",
"Basilisk",
"Wyvern",
"Dragonfly",
"Direwolf",
"Gryphon",
"Roc",
"Serpent",
"Kraken",
"Behemoth",
"Leviathan",
"Golem",
"Gargoyle",
"Imp",
"Demon",
"Devil",
"Angel",
"Archangel",
"Seraph",
"Cherub",
"Fairy",
"Pixie",
"Sprite",
"Gnome",
"Hobgoblin",
"Ogre",
"Giant",
"Titan",
"Cyclops",
"Siren",
"Harpy",
"Banshee",
"Wraith",
"Ghost",
"Spectre",
"Poltergeist",
"Vampire",
"Werewolf",
"Mummy",
"Zombie",
"Skeleton",
"Lich",
"Necromancer",
"Sorcerer",
"Mage",
"Warlock",
"Witch",
"Druid",
"Shaman",
"Paladin",
"Knight",
"Warrior",
"Rogue",
"Assassin",
"Bard",
"Minstrel",
"Jester",
"King",
"Queen",
"Prince",
"Princess",
"Duke",
"Duchess",
"Lord",
"Lady",
"Baron",
"Baroness",
"Earl",
"Count",
"Countess",
"Viscount",
"Viscountess",
"Marquis",
"Marquise",
"Duke",
"Duchess",
"Princess",
"Prince",
"Queen",
"King",
"Emperor",
"Empress",
"Archmage",
"Grandmaster",
"Champion",
"Hero",
"Villain",
"Monster",
"Beast",
"Creature",
"Beastie",
"Wyrm",
"Drake",
"Imp",
"Sprite",
"Goblin",
"Ogre",
"Giant",
"Titan",
"Cyclops",
"Mermaid",
"Siren",
"Harpy",
"Banshee",
"Wraith",
"Ghost",
"Spectre",
"Poltergeist",
"Vampire",
"Werewolf",
"Mummy",
"Zombie",
"Skeleton",
"Lich",
"Necromancer"];