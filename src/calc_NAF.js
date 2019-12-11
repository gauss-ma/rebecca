//
// Este script posee las funciones necesarias
//para la obtención del NAF (Natural Atenuation Factor)
//

//===================================================================
//Calculo de Natural Atenuation Factor

// NAFs por via aerea
function NAF_sfc_soil(){
	NAF= ADF/(VF_ss + PEF)
	return(NAF)
}


function NAF_subsfc_soil1(){
	NAF=ADF/VF_samb
	return(NAF)
}


function NAF_subsfc_soil2(){
	NAF=(1/VF_sesp)
	return(NAF)
}


function NAF_gw1(){
	NAF=ADF/VF_wamb
	return(NAF)
}

function NAF_gw2(){
	NAF=1/VF_wesp
	return(NAF)
}

// NAFs por Exposición a aguas subterraneas
function NAF_soil(){
	NAF=DAF/LF
	return(NAF)
}



function NAF_gw_plume(){
	NAF=DAF
	return(NAF)

}


function NAF_surface_water(){
	NAF=1/DF_gwsw
	return(NAF)
}

