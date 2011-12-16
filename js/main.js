const REV = 6,
       BRUSHES = ["circles", "grid", "simple", "squares", "ribbon", "longfur", "fur", "web", "shaded", "sketchy"],
       USER_AGENT = navigator.userAgent.toLowerCase();

var SCREEN_WIDTH = 960,
    SCREEN_HEIGHT = 450,
    BRUSH_SIZE = 1,
    BRUSH_PRESSURE = 1,
    COLOR = [0, 0, 0],
    BACKGROUND_COLOR = [250, 250, 250],
    STORAGE = window.localStorage,
    brush,
    saveTimeOut,
    wacom,
    i,
    mouseX = 0,
    mouseY = 0,
    container,
    foregroundColorSelector,
    backgroundColorSelector,
    menu,
    about,
    canvas,
    flattenCanvas,
    context,
    isFgColorSelectorVisible = false,
    isBgColorSelectorVisible = false,
    isAboutVisible = false,
    isMenuMouseOver = false,
    shiftKeyIsDown = false,
	cuentagota = false,
    altKeyIsDown = false;

init();

function init()
{
	var hash, palette, embed, localStorageImage;
	
	if (USER_AGENT.search("android") > -1 || USER_AGENT.search("iphone") > -1)
		BRUSH_SIZE = 2;	
		
	if (USER_AGENT.search("safari") > -1 && USER_AGENT.search("chrome") == -1) // Safari
		STORAGE = false;
	
	armonia = document.createElement('div');
	armonia.id = 'armonia';
	armonia.style.width = SCREEN_WIDTH+'px';
	armonia.style.height = '630px';
	document.body.appendChild(armonia);
	
	pinceles = document.createElement('div');
	pinceles.id = 'pinceles';
	pinceles.style.cssFloat = 'right';
	pinceles.style.marginBottom = '5px';
	armonia.appendChild(pinceles);
	for (i=0; i<BRUSHES.length; i++)
	{
		imagen = document.createElement('img');
		imagen.src = 'jpg/'+BRUSHES[i]+'.jpg';
		imagen.width = 43;
		imagen.height = 43;
		imagen.alt = '';
		imagen.style.cursor = 'pointer';
		imagen.style.marginLeft = '5px';
		imagen.style.cssFloat = 'right';
		imagen.style.border = 'solid 1px #ccc';
		imagen.id = BRUSHES[i]+'_img';
		pinceles.appendChild(imagen);
		document.getElementById(imagen.id).setAttribute("onclick", "javascript:pincel('"+BRUSHES[i]+"')");
	}
	grosor = document.createElement('div');
	grosor.style.clear = 'both';
	grosor.style.height = 10+'px';
	grosor.style.cssFloat = 'right';
	grosor.style.marginTop = '5px';
	pinceles.appendChild(grosor);
	for (i=1; i<=10; i++)
	{
		enlace = document.createElement('div');
		enlace.style.width = 45+'px';
		enlace.style.height = 10+'px';
		enlace.style.marginLeft = 5+'px';
		enlace.style.cssFloat = 'left';
		enlace.style.cursor = 'pointer';
		enlace.id = 'enlace'+i;
		grosor.appendChild(enlace);
		div = document.createElement('div');
		div.style.height = i+'px';
		div.style.backgroundColor = '#000000';
		div.style.marginTop =  10-i+'px';
		div.id = 'grosor'+i;
		enlace.appendChild(div);
		document.getElementById(enlace.id).setAttribute("onclick", "javascript:grosor_del_pincel("+i+")");
	}
	
	herramientas = document.createElement('div');
	herramientas.id = 'herramientas';
	herramientas.style.width = '27px';
	herramientas.style.cssFloat = 'right';
	herramientas.style.marginLeft = '5px';
	armonia.appendChild(herramientas);
	
	imagen_borrador = document.createElement('img');
	imagen_borrador.src = 'jpg/borrador.jpg';
	imagen_borrador.width = 25;
	imagen_borrador.height = 25;
	imagen_borrador.alt = '';
	imagen_borrador.style.float= 'left';
	imagen_borrador.style.cursor = 'pointer';
	imagen_borrador.id = 'pincel_borrador';
	imagen_borrador.style.border = 'solid 1px #ccc';
	herramientas.appendChild(imagen_borrador);
	document.getElementById(imagen_borrador.id).setAttribute("onclick", "javascript:pincel('borrador')");
	
	imagen_cuentagotas = document.createElement('img');
	imagen_cuentagotas.src = 'jpg/cuentagotas.jpg';
	imagen_cuentagotas.width = 25;
	imagen_cuentagotas.height = 25;
	imagen_cuentagotas.alt = '';
	imagen_cuentagotas.style.float= 'left';
	imagen_cuentagotas.style.marginTop = 6+'px';
	imagen_cuentagotas.style.cursor = 'pointer';
	imagen_cuentagotas.id = 'cuentagotas_img';
	herramientas.appendChild(imagen_cuentagotas);
	document.getElementById(imagen_cuentagotas.id).setAttribute("onclick", "javascript:cuentagotas()");
	imagen_cuentagotas.style.border = 'solid 1px #ccc';
	
	colores = new colores();
	colores.foregroundColor.addEventListener('click', onMenuForegroundColor, false);
	colores.foregroundColor.addEventListener('touchend', onMenuForegroundColor, false);
	colores.backgroundColor.addEventListener('click', onMenuBackgroundColor, false);
	colores.backgroundColor.addEventListener('touchend', onMenuBackgroundColor, false);
	armonia.appendChild(colores.container);
	
	archivo = document.createElement('div');
	archivo.id = 'archivo';
	archivo.style.float = 'right';
	armonia.appendChild(archivo);
	
	imagen_documento_nuevo = document.createElement('img');
	imagen_documento_nuevo.id = 'documento_nuevo_imagen';
	imagen_documento_nuevo.src = 'jpg/documento_nuevo.png';
	imagen_documento_nuevo.width = 46;
	imagen_documento_nuevo.height = 60;
	imagen_documento_nuevo.alt = '';
	imagen_documento_nuevo.id = 'documento_nuevo';
	imagen_documento_nuevo.style.marginLeft = 5+'px';
	imagen_documento_nuevo.style.cursor = 'pointer';
	imagen_documento_nuevo.style.float = 'right';
	archivo.appendChild(imagen_documento_nuevo);
	document.getElementById(imagen_documento_nuevo.id).setAttribute("onclick", "javascript:nuevo()");
	
	imagen_guardar = document.createElement('img');
	imagen_guardar.id = 'guardar_imagen';
	imagen_guardar.src = 'jpg/guardar.png';
	imagen_guardar.width = 59;
	imagen_guardar.height = 60;
	imagen_guardar.alt = '';
	imagen_guardar.id = 'guardar';
	imagen_guardar.style.marginLeft = 5+'px';
	imagen_guardar.style.cursor = 'pointer';
	imagen_guardar.style.float = 'right';
	archivo.appendChild(imagen_guardar);
	document.getElementById(imagen_guardar.id).setAttribute("onclick", "javascript:onMenuSave()");
	
	container = document.createElement('div');
	container.id = 'canvas';
	container.style.width = SCREEN_WIDTH+'px';
	container.style.height = SCREEN_HEIGHT+'px';
	container.style.cssFloat = 'left';
	armonia.appendChild(container);
	
	instrucciones_div = document.createElement('div');
	instrucciones_div.id = 'instrucciones';
	armonia.appendChild(instrucciones_div);
	/*
	 * TODO: In some browsers a naste "Plugin Missing" window appears and people is getting confused.
	 * Disabling it until a better way to handle it appears.
	 * 
	 * embed = document.createElement('embed');
	 * embed.id = 'wacom-plugin';
	 * embed.type = 'application/x-wacom-tablet';
	 * document.body.appendChild(embed);
	 *
	 * wacom = document.embeds["wacom-plugin"];
	 */

	canvas = document.createElement("canvas");
	canvas.width = SCREEN_WIDTH;
	canvas.height = SCREEN_HEIGHT;
	canvas.id = 'lienzo';
	canvas.style.cursor = 'crosshair';
	container.appendChild(canvas);
	context = canvas.getContext("2d");	
	
	respaldo_div = document.createElement("div");
	respaldo_div.id = 'respaldo';
	respaldo_div.style.backgroundColor = '#000';
	respaldo_div.style.width = '100%';
	respaldo_div.style.height = '78px';
	respaldo_div.style.float = 'left';
	respaldo_div.style.border = '#CCC solid 2px';
	respaldo_div.style.marginTop = '15px';
	respaldo_div.style.textAlign = 'center';
	armonia.appendChild(respaldo_div);
	
	for (i=1; i<=8; i++)
	{
		respaldo_1_div = document.createElement("div");
		respaldo_1_div.style.display = 'inline-block';
		respaldo_1_div.id = 'respaldo_fondo_'+i;
		respaldo_div.appendChild(respaldo_1_div);
		txt1 = "localStorage.respaldo";
		txt2 = "localStorage.respaldo_f";
		if(eval(txt1.concat(i)))
		{
		respaldo_1 = document.createElement("img");
		respaldo_1.src = eval(txt1.concat(i));
		respaldo_1.style.backgroundColor = eval(txt2.concat(i));
		}else{
			respaldo_1 = document.createElement("img");
			respaldo_1.style.backgroundColor = 'white';
		}
		respaldo_1.style.cursor = 'pointer';
		respaldo_1.style.border = '4px solid #DDD';
		respaldo_1.style.margin = '7px 5px 7px 5px';
		respaldo_1.style.height = '47px';
		respaldo_1.style.width = '100px';
		respaldo_1.className = 'respaldo';
		respaldo_1.id = 'respaldo_canvas_'+i;
		respaldo_1_div.appendChild(respaldo_1);
		document.getElementById(respaldo_1.id).setAttribute("onclick", "javascript:respaldar("+i+")");
		document.getElementById(respaldo_1.id).setAttribute("onmouseover", "javascript:instrucciones_over('Recuperar respaldo "+i+" = ALT + CLIC','Respaldo "+i+"','"+i+"')");
		document.getElementById(respaldo_1.id).setAttribute("onmouseout", "javascript:instrucciones_out()");
	}
	flattenCanvas = document.createElement("canvas");
	flattenCanvas.width = SCREEN_WIDTH;
	flattenCanvas.height = SCREEN_HEIGHT;
	
	palette = new Palette();
	
	foregroundColorSelector = new ColorSelector(palette);
	foregroundColorSelector.addEventListener('change', onForegroundColorSelectorChange, false);
	container.appendChild(foregroundColorSelector.container);

	backgroundColorSelector = new ColorSelector(palette);
	backgroundColorSelector.addEventListener('change', onBackgroundColorSelectorChange, false);
	container.appendChild(backgroundColorSelector.container);	
	if (STORAGE)
	{
		if (localStorage.canvas)
		{
			localStorageImage = new Image();
		
			localStorageImage.addEventListener("load", function(event)
			{
				localStorageImage.removeEventListener(event.type, arguments.callee, false);
				context.drawImage(localStorageImage,0,0);
			}, false);
			
			localStorageImage.src = localStorage.canvas;			
		}
		
		if (localStorage.brush_color_red)
		{
			COLOR[0] = localStorage.brush_color_red;
			COLOR[1] = localStorage.brush_color_green;
			COLOR[2] = localStorage.brush_color_blue;
		}

		if (localStorage.background_color_red)
		{
			BACKGROUND_COLOR[0] = localStorage.background_color_red;
			BACKGROUND_COLOR[1] = localStorage.background_color_green;
			BACKGROUND_COLOR[2] = localStorage.background_color_blue;
		}
	}

	foregroundColorSelector.setColor( COLOR );
	backgroundColorSelector.setColor( BACKGROUND_COLOR );

	if (!brush)
	{
		brush = eval("new " + BRUSHES[BRUSHES.length-1] + "(context)");
		document.getElementById(BRUSHES[BRUSHES.length-1]+'_img').style.borderColor = '#990000';
		document.getElementById('grosor1').style.backgroundColor = '#990000';
	}
	
	window.addEventListener('mousemove', onWindowMouseMove, false);
	window.addEventListener('keydown', onWindowKeyDown, false);
	window.addEventListener('keyup', onWindowKeyUp, false);
	window.addEventListener('blur', onWindowBlur, false);
	
	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('mouseout', onDocumentMouseOut, false);
	
	document.addEventListener("dragenter", onDocumentDragEnter, false);  
	document.addEventListener("dragover", onDocumentDragOver, false);
	document.addEventListener("drop", onDocumentDrop, false);  
	
	canvas.addEventListener('mousedown', onCanvasMouseDown, false);
	canvas.addEventListener('touchstart', onCanvasTouchStart, false);
}
function respaldar(respaldo){
	if(altKeyIsDown == true){
		var canvas=document.getElementById("lienzo");
		var context=canvas.getContext("2d");
		var img=new Image()
		img.src= document.getElementById("respaldo_canvas_"+respaldo).src;
		context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		saveToLocalStorage();
		context.drawImage(img,0,0);
		document.getElementById('canvas').style.backgroundColor = document.getElementById("respaldo_canvas_"+respaldo).style.backgroundColor;
	}else{
		dataURL = lienzo.toDataURL("image/png");
		document.getElementById("respaldo_canvas_"+respaldo).src = dataURL;
		document.getElementById("respaldo_canvas_"+respaldo).style.backgroundColor = "rgba(" + BACKGROUND_COLOR[0] + ", " + BACKGROUND_COLOR[1] + ", " + BACKGROUND_COLOR[2] + ", " + BRUSH_PRESSURE + ")";
		localStorage.setItem('respaldo'+respaldo,dataURL);
		localStorage.setItem('respaldo_f'+respaldo,document.getElementById("respaldo_canvas_"+respaldo).style.backgroundColor);
	}
}

// WINDOW

function onWindowMouseMove( event )
{
	mouseX = event.clientX-document.getElementById("armonia").offsetLeft-((document.getElementById("canvas").offsetWidth - document.getElementById("canvas").style.width.slice(0,-2))/2)+document.body.scrollLeft;
	mouseY = event.clientY-document.getElementById("armonia").offsetTop-((document.getElementById("canvas").offsetHeight - document.getElementById("canvas").style.height.slice(0,-2))/2)+document.body.scrollTop;
}

function onWindowKeyDown( event )
{
	if (shiftKeyIsDown)
		return;
		
	switch(event.keyCode)
	{
		case 16: // Shift
			shiftKeyIsDown = true;
			foregroundColorSelector.container.style.left = mouseX - 125 + 'px';
			foregroundColorSelector.container.style.top = mouseY - 125 + 'px';
			foregroundColorSelector.container.style.visibility = 'visible';
			break;
			
		case 18: // Alt
			altKeyIsDown = true;
			break;		
	}
}
function nuevo(){
	onMenuClear();
}
function cuentagotas(){
	cuentagota = true;
	document.getElementById('cuentagotas_img').style.borderColor = '#990000';
}
function onWindowKeyUp( event )
{
	switch(event.keyCode)
	{
		case 16: // Shift
			shiftKeyIsDown = false;
			foregroundColorSelector.container.style.visibility = 'hidden';			
			break;
			
		case 18: // Alt
			altKeyIsDown = false;
			break;

		case 66: // b
			document.body.style.backgroundImage = null;
			break;
	}
	
	context.lineCap = BRUSH_SIZE == 1 ? 'butt' : 'round';	
}

function onWindowBlur( event )
{
	shiftKeyIsDown = false;
	altKeyIsDown = false;
}


// DOCUMENT

function onDocumentMouseDown( event )
{
	if (!isMenuMouseOver)
		canvas.onselectstart = function () { return false; } // ie
		canvas.onmousedown = function () { return false; } // mozilla
}

function onDocumentMouseOut( event )
{
	onCanvasMouseUp();
}

function onDocumentDragEnter( event )
{
	event.stopPropagation();
	event.preventDefault();
}

function onDocumentDragOver( event )
{
	event.stopPropagation();
	event.preventDefault();
}

function onDocumentDrop( event )
{
	event.stopPropagation();  
	event.preventDefault();
	
	var file = event.dataTransfer.files[0];
	
	if (file.type.match(/image.*/))
	{
		/*
		 * TODO: This seems to work on Chromium. But not on Firefox.
		 * Better wait for proper FileAPI?
		 */

		var fileString = event.dataTransfer.getData('text').split("\n");
		document.body.style.backgroundImage = 'url(' + fileString[0] + ')';
	}	
}


// COLOR SELECTORS

function onForegroundColorSelectorChange( event )
{
	COLOR = foregroundColorSelector.getColor();
	
	colores.setForegroundColor( COLOR );

	if (STORAGE)
	{
		localStorage.brush_color_red = COLOR[0];
		localStorage.brush_color_green = COLOR[1];
		localStorage.brush_color_blue = COLOR[2];		
	}
}

function onBackgroundColorSelectorChange( event )
{
	BACKGROUND_COLOR = backgroundColorSelector.getColor();
	
	colores.setBackgroundColor( BACKGROUND_COLOR );
	
	document.getElementById('canvas').style.backgroundColor = 'rgb(' + BACKGROUND_COLOR[0] + ', ' + BACKGROUND_COLOR[1] + ', ' + BACKGROUND_COLOR[2] + ')';
	
	if (STORAGE)
	{
		localStorage.background_color_red = BACKGROUND_COLOR[0];
		localStorage.background_color_green = BACKGROUND_COLOR[1];
		localStorage.background_color_blue = BACKGROUND_COLOR[2];				
	}
}


// MENU

function onMenuForegroundColor()
{
	cleanPopUps();
	
	foregroundColorSelector.show();
	foregroundColorSelector.container.style.left = ( ( document.getElementById("canvas").offsetWidth / 2 ) - ( document.getElementById("selectordecolor").offsetWidth/2 ) ) + document.getElementById("canvas").offsetLeft+'px';
	foregroundColorSelector.container.style.top = ( ( document.getElementById("canvas").offsetHeight / 2 ) - ( document.getElementById("selectordecolor").offsetHeight/2 ) ) + document.getElementById("canvas").offsetTop + document.getElementById("armonia").offsetTop+'px';

	isFgColorSelectorVisible = true;
}

function onMenuBackgroundColor()
{
	cleanPopUps();

	backgroundColorSelector.show();
	backgroundColorSelector.container.style.left = ( ( document.getElementById("canvas").offsetWidth / 2 ) - ( document.getElementById("selectordecolor").offsetWidth/2 ) ) + document.getElementById("canvas").offsetLeft + 'px';
	backgroundColorSelector.container.style.top = ( ( document.getElementById("canvas").offsetHeight / 2 ) - ( document.getElementById("selectordecolor").offsetHeight/2 ) ) + document.getElementById("canvas").offsetTop + document.getElementById("armonia").offsetTop + 'px';

	isBgColorSelectorVisible = true;
}

function pincel(pincel)
{
	brush.destroy();
	brush = eval("new " + pincel + "(context)");
	for (i=0; i<BRUSHES.length; i++)
	{
		document.getElementById(BRUSHES[i]+'_img').style.borderColor = '#CCC';
	}
	document.getElementById(pincel+'_img').style.borderColor = '#990000';
	document.getElementById('pincel_borrador').style.borderColor = '#CCC';
	if(pincel=='borrador')
	{
		document.getElementById('pincel_borrador').style.borderColor = '#990000';
	}else{
		document.getElementById(pincel+'_img').style.borderColor = '#990000';
	}
}

function onMenuMouseOver()
{
	isMenuMouseOver = true;
}

function onMenuMouseOut()
{
	isMenuMouseOver = false;
}

function onMenuSave()
{
	// window.open(canvas.toDataURL('image/png'),'mywindow');
	flatten();
	window.open(flattenCanvas.toDataURL('image/png'),'mywindow');
}

function onMenuClear(){
	context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	saveToLocalStorage();
	localStorage.removeItem("respaldo1");
	localStorage.removeItem("respaldo2");
	localStorage.removeItem("respaldo3");
	localStorage.removeItem("respaldo4");
	localStorage.removeItem("respaldo5");
	localStorage.removeItem("respaldo6");
	localStorage.removeItem("respaldo7");
	localStorage.removeItem("respaldo8");
	localStorage.removeItem("respaldo_f1");
	localStorage.removeItem("respaldo_f2");
	localStorage.removeItem("respaldo_f3");
	localStorage.removeItem("respaldo_f4");
	localStorage.removeItem("respaldo_f5");
	localStorage.removeItem("respaldo_f6");
	localStorage.removeItem("respaldo_f7");
	localStorage.removeItem("respaldo_f8");
	document.getElementById("respaldo_canvas_1").src = lienzo.toDataURL("image/png");
	document.getElementById("respaldo_canvas_1").style.backgroundColor = 'white';
	document.getElementById("respaldo_canvas_2").src = lienzo.toDataURL("image/png");
	document.getElementById("respaldo_canvas_2").style.backgroundColor = 'white';
	document.getElementById("respaldo_canvas_3").src = lienzo.toDataURL("image/png");
	document.getElementById("respaldo_canvas_3").style.backgroundColor = 'white';
	document.getElementById("respaldo_canvas_4").src = lienzo.toDataURL("image/png");
	document.getElementById("respaldo_canvas_4").style.backgroundColor = 'white';
	document.getElementById("respaldo_canvas_5").src = lienzo.toDataURL("image/png");
	document.getElementById("respaldo_canvas_5").style.backgroundColor = 'white';
	document.getElementById("respaldo_canvas_6").src = lienzo.toDataURL("image/png");
	document.getElementById("respaldo_canvas_6").style.backgroundColor = 'white';
	document.getElementById("respaldo_canvas_7").src = lienzo.toDataURL("image/png");
	document.getElementById("respaldo_canvas_7").style.backgroundColor = 'white';
	document.getElementById("respaldo_canvas_8").src = lienzo.toDataURL("image/png");
	document.getElementById("respaldo_canvas_8").style.backgroundColor = 'white';
	document.getElementById("canvas").style.backgroundColor = 'white';
	localStorage.background_color_red = BACKGROUND_COLOR[0] = 250;
	localStorage.background_color_green = BACKGROUND_COLOR[1] = 250;
	localStorage.background_color_blue = BACKGROUND_COLOR[2] = 250;
	document.getElementById("color_fondo").getContext("2d").fillStyle = 'rgb(250,250,250)';
	document.getElementById("color_fondo").getContext("2d").fillRect(0, 0,document.getElementById("color_fondo").width,document.getElementById("color_fondo").height);
	localStorage.brush_color_red = COLOR[0] = 0;
	localStorage.brush_color_green = COLOR[1] = 0;
	localStorage.brush_color_blue = COLOR[2] = 0;
	document.getElementById("color_pincel").getContext("2d").fillStyle = 'rgb(0,0,0)';
	document.getElementById("color_pincel").getContext("2d").fillRect(0, 0,document.getElementById("color_pincel").width,document.getElementById("color_pincel").height);
	brush.destroy();
	brush = eval("new " + BRUSHES[BRUSHES.length-1] + "(context)");
	for (i=0; i<=BRUSHES.length-1; i++)
	{
		document.getElementById(BRUSHES[i]+'_img').style.borderColor = '#CCC';
	}
	document.getElementById(BRUSHES[BRUSHES.length-1]+'_img').style.borderColor = '#990000';
	for (i=2; i<=10; i++)
	{
		document.getElementById('grosor'+i).style.backgroundColor = '#000000';
	}
	document.getElementById('grosor1').style.backgroundColor = '#990000';
	BRUSH_SIZE = 1;
}

// CANVAS

function onCanvasMouseDown( event )
{
	var data, position;

	clearTimeout(saveTimeOut);
	cleanPopUps();
	
	if (altKeyIsDown || cuentagota)
	{
		flatten();
		
		data = flattenCanvas.getContext("2d").getImageData(0, 0, flattenCanvas.width, flattenCanvas.height).data;
		position = ( event.clientX-document.getElementById("armonia").offsetLeft-((document.getElementById("canvas").offsetWidth - document.getElementById("canvas").style.width.slice(0,-2))/2)+document.body.scrollLeft + (event.clientY-document.getElementById("canvas").offsetTop-((document.getElementById("canvas").offsetHeight - document.getElementById("canvas").style.height.slice(0,-2))/2)+document.body.scrollTop ) * canvas.width) * 4;
		
		foregroundColorSelector.setColor( [ data[position], data[position + 1], data[position + 2] ] );
		cuentagota = false;
		document.getElementById('cuentagotas_img').style.borderColor = '#CCC';
		return;
	}
	
	BRUSH_PRESSURE = wacom && wacom.isWacom ? wacom.pressure : 1;
	
	brush.strokeStart(  event.clientX-document.getElementById("armonia").offsetLeft-((document.getElementById("canvas").offsetWidth - document.getElementById("canvas").style.width.slice(0,-2))/2)+document.body.scrollLeft, event.clientY-document.getElementById("canvas").offsetTop-((document.getElementById("canvas").offsetHeight - document.getElementById("canvas").style.height.slice(0,-2))/2)+document.body.scrollTop );

	window.addEventListener('mousemove', onCanvasMouseMove, false);
	window.addEventListener('mouseup', onCanvasMouseUp, false);
}

function onCanvasMouseMove( event )
{	
	BRUSH_PRESSURE = wacom && wacom.isWacom ? wacom.pressure : 1;
	brush.stroke( event.clientX-document.getElementById("armonia").offsetLeft-((document.getElementById("canvas").offsetWidth - document.getElementById("canvas").style.width.slice(0,-2))/2)+document.body.scrollLeft, event.clientY-document.getElementById("canvas").offsetTop-((document.getElementById("canvas").offsetHeight - document.getElementById("canvas").style.height.slice(0,-2))/2)+document.body.scrollTop );
}

function onCanvasMouseUp()
{
	brush.strokeEnd();
	
	window.removeEventListener('mousemove', onCanvasMouseMove, false);
	window.removeEventListener('mouseup', onCanvasMouseUp, false);
	
	if (STORAGE)
	{
		clearTimeout(saveTimeOut);
		saveTimeOut = setTimeout(saveToLocalStorage, 2000, true);
	}
}


//

function onCanvasTouchStart( event )
{
	cleanPopUps();		

	if(event.touches.length == 1)
	{
		event.preventDefault();
		
		brush.strokeStart( event.touches[0].pageX, event.touches[0].pageY );
		
		window.addEventListener('touchmove', onCanvasTouchMove, false);
		window.addEventListener('touchend', onCanvasTouchEnd, false);
	}
}

function onCanvasTouchMove( event )
{
	if(event.touches.length == 1)
	{
		event.preventDefault();
		brush.stroke( event.touches[0].pageX, event.touches[0].pageY );
	}
}

function onCanvasTouchEnd( event )
{
	if(event.touches.length == 0)
	{
		event.preventDefault();
		
		brush.strokeEnd();

		window.removeEventListener('touchmove', onCanvasTouchMove, false);
		window.removeEventListener('touchend', onCanvasTouchEnd, false);
	}
}

//

function saveToLocalStorage()
{
	localStorage.canvas = canvas.toDataURL('image/png');
}

function flatten()
{
	var context = flattenCanvas.getContext("2d");
	
	context.fillStyle = 'rgb(' + BACKGROUND_COLOR[0] + ', ' + BACKGROUND_COLOR[1] + ', ' + BACKGROUND_COLOR[2] + ')';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(canvas, 0, 0);
}

function cleanPopUps()
{
	if (isFgColorSelectorVisible)
	{
		foregroundColorSelector.hide();
		isFgColorSelectorVisible = false;
	}
		
	if (isBgColorSelectorVisible)
	{
		backgroundColorSelector.hide();
		isBgColorSelectorVisible = false;
	}
}

function instrucciones_over(metodo_de_teclado,instruccion,respaldo){
	if(document.getElementById('respaldo_canvas_'+respaldo).src){
		document.getElementById('instrucciones').innerHTML = metodo_de_teclado;
	}else{
		document.getElementById('instrucciones').innerHTML = instruccion;
	}
}
function instrucciones_out(){
	document.getElementById('instrucciones').innerHTML = '';
}