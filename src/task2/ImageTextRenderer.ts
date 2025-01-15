/*
a class to render text and images to an OffscreenCanvas
*/
export class ImageTextRenderer
{
    private str: string;
    private fontSize: number;
    private images: HTMLImageElement[];
    canvas: OffscreenCanvas;
    private ctx: OffscreenCanvasRenderingContext2D | null;

    constructor( str: string , fontSize: number , images: HTMLImageElement[] )
    {
        this.str = str;
        this.fontSize = fontSize;
        this.images = images;
        this.canvas = new OffscreenCanvas( 1 , 1 );
        this.ctx = this.canvas.getContext( "2d" );
        this.setFont( "monospace" , this.fontSize , "normal" );

        this.render();
    }

    update( str: string , fontSize: number )
    {
        this.str = str;
        this.fontSize = fontSize;
        this.clear();
        this.setFont( "monospace" , this.fontSize , "normal" );
        this.render();
    }

    private clear()
    {
        this.ctx!.clearRect( 0 , 0 , this.canvas.width , this.canvas.height );
    }

    private setSize( width: number , height: number )
    {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    private setFont( font: string , size: number , style: string )
    {
        if ( style ) this.ctx!.font = style+" "+size+"px "+font;
        else this.ctx!.font = size+"px "+font;
    }

    private render()
    {
        // parse the text and split it into images and text
        const parts = this.parseText( this.str );

        // calculate the total width of the string
        let widths = [];
        let totalWidth = 0;
        for ( let i = 0 ; i < parts.length ; ++i )
        {
            if ( parts[i].startsWith( "{" ) )
            {
                let imageName = parts[i].substring( 1 , parts[i].length-1 );
                let image = this.getImage( imageName );
                if ( image !== null )
                {
                    widths.push( image.width );
                    totalWidth += image.width;
                }
                else
                {
                    widths.push( 0 );
                }
            }
            else
            {
                let width = this.getTextSize( parts[i] ).width;
                widths.push( width );
                totalWidth += width;
            }
        }

        // resize the canvas
        this.setSize( totalWidth , 100 );

        this.setFont( "monospace" , this.fontSize , "normal" );

        // draw the images and texts
        let xPos = 0;
        for ( let i = 0 ; i < parts.length ; ++i )
        {
            // image
            if ( parts[i].startsWith( "{" ) )
            {
                let imageName = parts[i].substring( 1 , parts[i].length-1 );
                let image = this.getImage( imageName );
                if ( image !== null )
                {
                    this.drawImage( image , xPos , 0 );
                }
            }
            // text
            else
            {
                this.fillText( parts[i] , xPos , 20 , "#000000" );
            }
            xPos += widths[i];
        }
    }

    private fillText( str: string , x: number , y: number , color: string )
    {
        this.ctx!.fillStyle = color;
        this.ctx!.fillText( str , x , y );
    }

    private drawImage( image: HTMLImageElement , x: number , y: number )
    {
        this.ctx!.drawImage( image , x , y );
    }

    private getTextSize( str: string )
    {
        var textMetrics = this.ctx!.measureText( str );
        var textHeight = Math.ceil( textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent );
        return { width: textMetrics.width , height: textHeight };
    }

    private parseText( str: string )
    {
        // regular expression to match text parts and image names in curly brackets, thank you ChatGPT for the regex ;)
        const regex = /({[^}]+})|([^{}]+)/g;
        const result = [];
        let match;

        // iterate through all matches and add them to the result array
        while ( ( match = regex.exec( str ) ) !== null )
        {
            if ( match[1] )
            {
                // matched an image name in curly brackets
                result.push( match[1] );
            }
            else if ( match[2].trim() )
            {
                // matched a text part
                result.push( match[2] );
            }
        }

        return result;
    }

    private getImage( filename: string ) : HTMLImageElement | null
    {
        for ( let i = 0 ; i < this.images.length ; ++i )
        {
            if ( this.images[i].src.search( filename ) !== -1 ) return this.images[i];
        }
        return null;
    }
}
