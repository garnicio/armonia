function borrador( context )
{
	this.init( context );
}

borrador.prototype =
{
	context: null,

	prevMouseX: null, prevMouseY: null,

	init: function( context )
	{
		this.context = context;
		this.context.globalCompositeOperation = 'source-over';
	},

	destroy: function()
	{
	},

	strokeStart: function( mouseX, mouseY )
	{
		this.prevMouseX = mouseX;
		this.prevMouseY = mouseY
	},

	stroke: function( mouseX, mouseY )
	{
		this.context.clearRect (mouseX-(BRUSH_SIZE*2), mouseY-(BRUSH_SIZE*2),BRUSH_SIZE*4  ,BRUSH_SIZE*4 );
	},

	strokeEnd: function()
	{
		
	}
}
