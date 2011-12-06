function colores()
{	
	this.init();
}

colores.prototype = 
{
	container: null,
	
	foregroundColor: null,
	backgroundColor: null,
	
	init: function()
	{
		var option, space, separator, color_width = 25, color_height = 25;
		this.container = document.createElement("div");
		this.container.id = 'colores';
		this.container.style.width = '27px';
		this.container.style.float = 'right';
		this.container.style.marginLeft = '5px';
		
		this.foregroundColor = document.createElement("canvas");
		this.foregroundColor.style.cursor = 'pointer';
		this.foregroundColor.width = color_width;
		this.foregroundColor.height = color_height;
		this.foregroundColor.style.border= 'solid 1px #ccc';
		this.foregroundColor.style.float = 'right';
		this.container.appendChild(this.foregroundColor);
		
		this.setForegroundColor( COLOR );

		this.backgroundColor = document.createElement("canvas");
		this.backgroundColor.style.cursor = 'pointer';
		this.backgroundColor.width = color_width;
		this.backgroundColor.height = color_height;
		this.backgroundColor.style.border= 'solid 1px #ccc';
		this.backgroundColor.style.float = 'right';
		this.backgroundColor.style.marginTop = '6px';
		this.container.appendChild(this.backgroundColor);

		this.setBackgroundColor( BACKGROUND_COLOR );
	},
	setForegroundColor: function( color )
	{
		var context = this.foregroundColor.getContext("2d");
		context.fillStyle = 'rgb(' + color[0] + ', ' + color[1] +', ' + color[2] + ')';
		context.fillRect(0, 0, this.foregroundColor.width, this.foregroundColor.height);
		context.fillStyle = 'rgba(0, 0, 0, 0.1)';
		context.fillRect(0, 0, this.foregroundColor.width, 1);
	},
	
	setBackgroundColor: function( color )
	{
		var context = this.backgroundColor.getContext("2d");
		context.fillStyle = 'rgb(' + color[0] + ', ' + color[1] +', ' + color[2] + ')';
		context.fillRect(0, 0, this.backgroundColor.width, this.backgroundColor.height);
		context.fillStyle = 'rgba(0, 0, 0, 0.1)';
		context.fillRect(0, 0, this.backgroundColor.width, 1);		
	}
}