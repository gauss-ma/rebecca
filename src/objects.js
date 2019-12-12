//
// O B J E T O S
// -------------

function CORRIDA(){

	this.metadatos={
		sitio:"",
		ubicacion:"",
		autor:"",
		fecha:"",
		id:"" };
	
	//opciones de ejecucion:
	this.tier=1;		   //1:"Tier-1"; 2:"Tier-2/3"	
	this.direccion="forward";	   //forward/backgards/both
	this.risks=1;              //1:individual/2:indiviudal+cumulative
	this.depletion_on=false;   //apply depletion?
	this.time_exposure=5;      //Time to Future Exposure

	//opciones para el modelado de transporte:
	this.transport_opts={
		vfss:"",	//volatiliz soil (USEPA/ASTM)
		pef:"",		//partic. emis	
		vfsamb:"",	//volatiliz subsuelo 	outdoor	
		vfsesp:"",	//volatiliz subsuelo 	indoor
		vfwamp:"",	//volatiliz gw 		outdoor
		vfwesp:"",	//volatiliz gw 		indoor
		lf:"",		//leachate soil-->gw
		dfgwsw:"",	//dilution gw-->sw
		lateral_dispersion:"gaussiano"	//gaussiano/lineal/
	};


//	calcular_transferencias();
//	calcular_atenuacion_natural();
//	calcular_exposicion();
//		

}


//
//SOURCE
//
//

function FUENTE(){

	this.soil={
		W:.0,	//largo en la direccion de dispersion
		d:.0,	//grosor 
		C:.0,	//concentracion
		to_air:false,	//activar volatiliz y particulado
		to_gw:false,	//activar leaching a columna de suelo
		
	};
	this.subs={
		W:.0,	//largo
		d:.0,	//grosor
		C:.0,	//concentracion
		to_gw:false,	//activar leaching a gw
		
	};
	this.gw={
		W:.0,	//largo 
		d:.0,	//grosor
		C:.0,	//Concentracion
		to_sw:false,	//activar dilution to rivers
	};
	this.air={
		L:.0,	//Largo de la fuente de emision
		A:.0,	//Area transversal de fuente de emission
		C:.0,	//concentracion
		to_soil:false,	//activar deposición (todavia no implementado!)
	};

}


//
//MEDIO
//
//Parametros del medio de transporte

function MEDIO(){
	this.soil={
		h:3.0,	     	//grosor total [m]
		d_gw: 2.95,  	//distancia a zona saturada [m]
		h_zc: 0.05,  	//grossor de zona capilar [m]
		theta_w:0.12,	//contenido de agua volumetrico
		theta_a:0.26,	//contenido de aire volumetrico
		theta_a_zc:0.342, //contenido de aire volumetrico en zona capilar
		theta_w_zc:0.038, //contenido de aire volumetrico en zona capilar
		theta:0.38,	//porosidad
		rho_s:1.7,   	//densidad [kg/L]
		k_s:864,     	//conductividad hidraulica vertical [cm/d]
		k_v:1e-12, 	//permeabilidad de vapor [m2]
		I:30.0,	     	//Infiltracion neta [cm/yr]
		fracOC:0.01,	//frac organica todo el perfil
		fracOC_zc:0.02, //frac organica zona capilar
		pH:6.8		//pH
	};
	this.gw={
		h:2.0,		//grosor del acuifero
		k_s:680	,	//cond hidraulica [cm/d]
		i:1e-2,		//gradiente hidraulico
		theta:0.38,	//porosidad effectiva
		v:6.9,		//velocidad de Darcy
		v_s:18.1,	//velocidad especifica (v/theta)
		fracOC:1e-3,	//fracc organica
		pH:6.2,		//pH

		sigma_x:1.0,	//dispersividad.x
		sigma_y:1.0,
		sigma_z:1.0
	};
	this.air={
		h:2.0,	//altura de zona de mezcla
		u:2.25,	//velocidad del viento
	
		sigma_y:1.0,	//dispersividad
		sigma_z:1.0
	};

	this.sw={
		Q:20,	//Caudal río [m3/s]
	};
}

//
//RECEPTORES
//
//Vias de exposicion y parametros

function RECEPTOR(){

	this.tipo="";		//residential comercial user-defined
	
	this.pathways={
		gw_ingestion:false,
		sw_swimming:false,
		sw_fish_consumption:false,		
		soil_ingestion:false,
		soil_dermal_contact:false,
		soil_inhalation:false,
		soil_veg_ingestion:false,
		air_inhalation:true
	};

	this.water_quality_criteria=999;

	this.onsite={
		air_dist:0,
		gw_dist:0,
		soil_dist:0,
		air_type:"none",	//Residencial / Comercial / User
		gw_type:"none",		//Residencial / Comercial / User
		soil_type:"none"	//Residencial / Comercial / User
	};

	this.offsite1={
		air_dist:0,
		gw_dist:0,
		soil_dist:0,
		air_type:"none",	//Residencial / Comercial / User
		gw_type:"none",		//Residencial / Comercial / User
		soil_type:"none",	//Residencial / Comercial / User
	};
	this.offsite2={
		air_dist:0,
		gw_dist:0,
		soil_dist:0,
		air_type:"none",	//Residencial / Comercial / User
		gw_type:"none",		//Residencial / Comercial / User
		soil_type:"none"	//Residencial / Comercial / User
	};

	this.exposure_params={
		ATc:	0, //average time for carcinogenes(yr)
		AT:	0, //average time for non-carcino (yr)
		BW:	0, //body weight
		ED:	0, //exposure duration(yr)
		EF:	0, //exposure frequency
		EFd:	0, //exposure frequency for dermal exposure
		IRw:	0, //ingestion rate for water (L/day)
		IRs:	0, //ingestion rate for soil  (mg/day)
		SA:	0, //skin surface area (dermal)
		M:	0, //soil-skin adherence factor
		swED:   0, //swimming exposure time
		swEF:   0, //swminig exposure frequency (event/yr)
		swIRw:  0, //ingestion Rate while swimming
		swSA:	0, //skin surface area while swimming
		fshIR:	0, //ingestion rate fish (kg/yr)
		fshFI:	0, //contaminated fish fraction
		vegIRbg:0, //below ground ingestion rate of vegetables
		vegIRg: 0, //above ground ingestion rate of vegetables
		vegVGbg:0, //correction factor for b-g veg ingestion
		vegVGag:0, //correction factor for a-g veg ingestion
		tau:	0, //average time for vapor flux
	};

}




//
//COCs
//
// 
function COC(){
	this.coc={
		name:"",
		CAS:"",
		type:""		,//O:organic, I:inorganic, M:metal, OB:Organic Base, OA: Organic Acid, OT: HC petroleo.
		m_mol:""	,//Peso molecular 
		H:""		,//Constante de Henry
		C_sol:""	,//solubilidad acuosa [mg/L]
		Log_Koc_Kd:""	,//Particion agua/carbono organico
		Log_K_ow:""	,//Particion Octanol/Agua
		Diff_mol:""	,//Difusividad molecular
		epsilon:""	,//Limite de detección
		lambda:	""	,//Coeff. de decaimiento
		bioac_sp:""	,//Coeff. de bioacumulacion suelo-planta
		BCF:""			//factor de bioacumulacion
		};

	
}
