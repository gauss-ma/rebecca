//Funciones para navegación
screen_i=0
var screens=[]
function setScreens(tier){
	if (tier == 1){
 		screens=[
			{title:"MENU-PRINCIPAL",
			subtitle:"",
			text:"",
			},
			{title:"General",
			subtitle:"Datos del proyecto",
			text:"Datos generales del proyecto. Todos los datos ingresados y generados por REBECA se ejecutan del lado del usuario, haciendo posible su uso off-line y garantizando que la seguridad del usuario sea preservada.",
			},
			{title:"Contaminantes",
               subtitle:"Contaminantes de interés",
               text:"El análisis de RBCA se realiza para uno ó más compuestos involucrados en la zona afectada, y los riesgos se evaluan de forma individual para cada uno de ellos así tambien como de forma acumulada.",
			},
			{title:"Fuente",
               subtitle:"Características del medio contaminado."	,
               text:"La geometría de los cuerpos contaminados, así como los mecanísos de exposición son escenciales para la caracterización del riesgo.",
			},
			{
			title:"Inputs",
			subtitle:"Revisá y modificá las entradas que serán utilizadas para el análisis.",
			text:"En esta ultima etapa podés verificar los datos ingresado y modificar entradas generadas por default para adaptarlo a tu proyecto."
			},
			{
			title:"Outputs",
			subtitle:"El análisis ha sido realizado, estos son los resultados.",
			text:"En cada solapa podes encontrar distintos tipos de resultados requeridos para el análisis de RBCA."
			}
			];
	}
	else{
 		screens=[
			{title:"MENU-PRINCIPAL",
			subtitle:"",
   		    text:"",
       		},
       		{title:"General",
       		 subtitle:"Datos del proyecto",
       		 text:"Datos generales del proyecto. Todos los datos ingresados y generados por REBECA se ejecutan del lado del usuario, haciendo posible su uso off-line y garantizando que la seguridad del usuario sea preservada.",
       		},
			{title:"Mapa",
			 subtitle:"",
			 text:"",
			},
      			{title:"Contaminantes",
      			subtitle:"Contaminantes de interés",
     			text:"El análisis de RBCA se realiza para uno ó más compuestos involucrados en la zona afectada, y los riesgos se evaluan de forma individual para cada uno de ellos así tambien como de forma acumulada.",
       		},
       		{title:"Fuente",
       		subtitle:"Características del medio contaminado."	,
       		text:"La geometría de los cuerpos contaminados, así como los mecanísos de exposición son escenciales para la caracterización del riesgo.",
       		},
			{title:"SiteSpecificParams",
			subtitle:"",
			text:"",
			},
			{
			title:"Inputs",
			subtitle:"Revisá y modificá las entradas que serán utilizadas para el análisis.",
			text:"En esta ultima etapa podés verificar los datos ingresado y modificar entradas generadas por default para adaptarlo a tu proyecto."
			},
			{
			title:"Outputs",
			subtitle:"El análisis ha sido realizado, estos son los resultados.",
			text:"En cada solapa podes encontrar distintos tipos de resultados requeridos para el análisis de RBCA."
			}
			];
	}
}
function anterior(){
	screen_i=(screen_i-1)%screens.length;
	mostrar(screens[screen_i].title);
                                                                            
	//if (screen_i == 0 || screen_i == 1){ $("#botonSiguiente").toggle();}
	$("#StoryStepper").slideToggle(400);
	ActualizarStoryStepper();
	if (screen_i != 0 ){$("#StoryStepper").slideToggle(400);}
}
function siguiente(){
	screen_i=(screen_i+1)%screens.length;
	mostrar(screens[screen_i].title);

	//if (screen_i == 0 || screen_i == 1){ $("#botonSiguiente").toggle();}
	$("#StoryStepper").slideToggle(400);
	ActualizarStoryStepper()
	if (screen_i != 0 & screen_i != 1){$("#StoryStepper").slideToggle(400);}
}

function ActualizarStoryStepper(){
setTimeout(function(){
	$(".StoryStepper-title").text(screens[screen_i].title);
	$(".StoryStepper-subtitle").text(screens[screen_i].subtitle);
	$(".StoryStepper-paragraph").text(screens[screen_i].text);

	$(".StoryStepper-progress-indicator-current").text(screen_i);
	$(".StoryStepper-progress-indicator-total").text(screens.length-1);
	$(".StoryStepper-progress-indicator-bar-progress").width((screen_i+1)/screens.length*100+"%")
}, 400);
}

function mostrar(id){
console.log(id);
    var screenss= document.getElementsByClassName("screen")
    for (i = 0; i < screenss.length; i++) {
        screenss[i].className = screenss[i].className.replace(" activo", "");
    }
    var pantalla = document.getElementById(id)
    pantalla.className += " activo";
}

	//document.onkeydown = function(e) {
	//    switch(e.which) {
	//        case 37: if (screen_i!=0){anterior();};// left
	//        break;
	//
	//        case 38: // up
	//        break;
	//
	//        case 39: if (screen_i!=0){siguiente();}// right
	//        break;
	//
	//        case 40: // down
	//        break;
	//
	//        default: return; // exit this handler for other keys
	//    }
	//    e.preventDefault(); // prevent the default action (scroll / move caret)
    //};
    




 	// TABLAS
    $(document).ready(function() {
    MiTabla= $('#COCsTable').DataTable( {
            data: GSIdata,
            "columns": [
                { "data": "name" },
                { "data": "CAS" }
            ]
        } );

   //Cuando clickeo en una fila, se selecciona:
    MiTabla.on( 'click', 'tr', function () {
        $(this).toggleClass('selected');
	printLista();
    } );


        //Boton de borrar selección.
    $('#cleanAll').click( function () {
    	MiTabla.$('tr.selected').removeClass('selected');
        $(".listaCompuestos").empty();
    });


    function printLista(){
      	cocLista='<h3> COCs seleccionados: </h3> <table><tr><th>Compuesto</th><th>Concentración (ug/m3)</th></tr>'
      	for (i=0;i< MiTabla.rows(".selected").data().length;i++){
      		coc=MiTabla.rows(".selected").data()[i];
      		cocLista+=`<tr><td>`+coc.name+`</td><td> <input type="text" name="` + coc.CAS + `"></td></tr>`
      	}
      	cocLista+=`</table>`
     	$(".listaCompuestos").empty();
      	$(".listaCompuestos").append(cocLista);
  };

});