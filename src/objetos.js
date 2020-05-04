//
// O B J E T O S
// -------------
var a=0;
function CORRIDA(){

	this.metadatos={
		sitio:"",
		ubicacion:"",
		autor:"",
		fecha:"",
		id:"" };
	
	//opciones de ejecucion:
	this.tier=1;		   //1:"Tier-1"; 2:"Tier-2/3"	
	this.direccion="forward";  //forward/backgards/both
	this.risks=1;              //1:individual/2:indiviudal+cumulative
	this.depletion_on=false;   //apply depletion?
	this.time_exposure=5;      //Time to Future Exposure

	//opciones para el modelado de transporte:
	this.transport_opts={
		vfss:"ASTM",	//volatiliz soil (USEPA/ASTM)
		pef:"",		//partic. emis	
		vfsamb:"",	//volatiliz subsuelo 	outdoor	
		vfsesp:"",	//volatiliz subsuelo 	indoor
		vfwamp:"",	//volatiliz gw 		outdoor
		vfwesp:"",	//volatiliz gw 		indoor
		lf:"",		//leachate soil-->gw
		dfgwsw:"",	//dilution gw-->sw
		//lateral_dispersion:"gaussiano"	//gaussiano/lineal/
		adf:"simple",
		daf:"simple",
	};


	//factores de transferencia
	this.vfss=0;
	this.pef=0;
	this.vfsamb=0;
	this.vfsesp=0;
	this.vfwamp=0;
	this.vfwesp=0;
	this.lf=0;
	this.dfgwsw=0;

	//factores de transporte lateral
	this.adf=0;
	this.daf=0;
	

	//factor de atenuacion natural
	this.naf={
		air:0,	// adf/(vfss+pef) + (adf/vfsamb) + 1/vfsesp + adf/wamb + 1/vfwesp
		gw:0,	// daf/lf  + daf + 1/dfgwsw
	}
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
		d_gw:0, //distancia a gw
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
		theta_w_zc:0.038, //contenido de agua volumetrico en zona capilar
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
		W:10,	//seccion rio
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

	this.exp_params={
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
	
	this.indoor_params={
		BVAR:0,	//building volumen/area ratio
		BA:0,	//foundation area
		BP:0,	//foundation perimeter
		BH:0,	//height
		BV:0,	//volumen
		ER:0,   //building air exchage rate
		dsf:0,  //depth of fundation slab to bottom
		cafc:0, //convective air flow through cracks
		ft:0,	//foundation thickness
		fcf:0,	//foundation crack fraction
		theta_w:0,	//volumetric water content of cracks
		theta_a:0,	//volumetric air content of cracks
		dp_io:0,	//difference of pressure in-outdoor
		L:0,		//largo edificio
		w:0,		//ancho edificio
	}

}




//
//COCs
//
// 
function COC(){
	this.name="";
	this.CAS="";
	this.type="";		//O:organic, I:inorganic, M:metal, OB:Organic Base, OA: Organic Acid, OT: HC petroleo.
	this.m_mol=0;		//Peso molecular 
	this.H=0;		//Constante de Henry
	this.C_sol=0;		//solubilidad acuosa [mg/L]
	this.Log_Koc_Kd=0;	//Particion agua/carbono organico
	this.Log_K_ow=0;	//Particion Octanol/Agua
	this.Diff_mol=0;	//Difusividad molecular
	this.D_a=0;		//Difusividad en aire
	this.D_w=0;		//Difusividad en agua
	this.epsilon=0;		//Limite de detección
	this.lambda=0;		//Coeff. de decaimiento
	this.bioac_sp=0;	//Coeff. de bioacumulacion suelo-planta
	this.BCF=0;		//factor de bioacumulacion

        this.DA=0;		//soil adherence factor
	this.is_carcinogenic=false; //is carcinogenic?
}


