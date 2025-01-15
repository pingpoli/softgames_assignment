import './style.css'
import * as PIXI from 'pixi.js';
import { Button } from './Button';
import { Task1 } from './task1/Task1';
import { Task2 } from './task2/Task2';
import { Task3 } from './task3/Task3';

// create the application
const app = new PIXI.Application( {
    resizeTo: window,
    backgroundColor: 0x222222,
} );

// add the view to the DOM
document.body.appendChild( app.view as HTMLCanvasElement );

// listen for window resize events
window.addEventListener( "resize" , () => {
    centerButtons();
    task1.onresize();
    task2.onresize();
    task3.onresize();
} );

// create the main menu buttons
let yPos = 100;
let button1 = new Button( app , "Ace of Shadows" , 200 , yPos , 200 , 50 );
button1.onclick = () => {
    hideMainMenu();
    task1.show();
    backButton.show();
};
yPos += 100;
let button2 = new Button( app , "Magic Words" , 200 , yPos , 200 , 50 );
button2.onclick = () => {
    hideMainMenu();
    task2.show();
    backButton.show();
};
yPos += 100;
let button3 = new Button( app , "Phoenix Flame" , 200 , yPos , 200 , 50 );
button3.onclick = () => {
    hideMainMenu();
    task3.show();
    backButton.show();
};
let backButton = new Button( app , "<" , 20 , 30 , 40 , 40 );
backButton.onclick = () => {
    task1.hide();
    task2.hide();
    task3.hide();
    backButton.hide();
    showMainMenu();
};
backButton.hide();

// some helper functions for the main menu
let showMainMenu = () => {
    button1.show();
    button2.show();
    button3.show();
};
let hideMainMenu = () => {
    button1.hide();
    button2.hide();
    button3.hide();
};
let centerButtons = () => {
    button1.center();
    button2.center();
    button3.center();
};
centerButtons();

// initialize the tasks
let task1 = new Task1( app );
let task2 = new Task2( app );
let task3 = new Task3( app );

// add the fps text
let fpsText = new PIXI.Text( "FPS: 60" , {
    fontFamily: 'Arial',
    fontSize: 16,
    fill: 0xffffff,
    align: 'center',
} );
fpsText.x = 5;
fpsText.y = 5;
app.stage.addChild( fpsText );

// main update function
let timer = 0;
app.ticker.add( () => {
    task1.update( app.ticker.elapsedMS/1000 );
    task2.update( app.ticker.elapsedMS/1000 );
    task3.update( app.ticker.elapsedMS/1000 );
    timer += app.ticker.elapsedMS/1000;
    // don't update the fps text every frame
    if ( timer >= 1.0 )
    {
        fpsText.text = "FPS: "+app.ticker.FPS.toFixed();
        fpsText.updateText( true );
        timer = 0;
    }
} );