function grosor_del_pincel(grosor){
	BRUSH_SIZE=grosor;
	document.getElementById('grosor1').style.backgroundColor = '#000000';
	document.getElementById('grosor2').style.backgroundColor = '#000000';
	document.getElementById('grosor3').style.backgroundColor = '#000000';
	document.getElementById('grosor4').style.backgroundColor = '#000000';
	document.getElementById('grosor5').style.backgroundColor = '#000000';
	document.getElementById('grosor6').style.backgroundColor = '#000000';
	document.getElementById('grosor7').style.backgroundColor = '#000000';
	document.getElementById('grosor8').style.backgroundColor = '#000000';
	document.getElementById('grosor9').style.backgroundColor = '#000000';
	document.getElementById('grosor10').style.backgroundColor = '#000000';
	switch(grosor){
		case(1):document.getElementById('grosor1').style.backgroundColor = '#990000';break;
		case(2):document.getElementById('grosor2').style.backgroundColor = '#990000';break;
		case(3):document.getElementById('grosor3').style.backgroundColor = '#990000';break;
		case(4):document.getElementById('grosor4').style.backgroundColor = '#990000';break;
		case(5):document.getElementById('grosor5').style.backgroundColor = '#990000';break;
		case(6):document.getElementById('grosor6').style.backgroundColor = '#990000';break;
		case(7):document.getElementById('grosor7').style.backgroundColor = '#990000';break;
		case(8):document.getElementById('grosor8').style.backgroundColor = '#990000';break;
		case(9):document.getElementById('grosor9').style.backgroundColor = '#990000';break;
		case(10):document.getElementById('grosor10').style.backgroundColor = '#990000';break;
	}
}