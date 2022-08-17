// =============================
//  R   E   B   E   C   C   A	
// -----------------------------
// sample run.
//

//Referencias:
//config | Params de corrida
//s      | Source
//m      | Transport Media
//r      | Receptor
//coc    | Compound of Concern

function main(){
	

	//INPUTS:
	
	//   Variables globales:
	tier=2;

	forewardCalculations=true;//$('input:checkbox[name=fwd]').prop("checked");	          //calcular modelo directo?
	backwardCalculations=false;//$('input:checkbox[name=bwd]').prop("checked");      	  //calcular modelo inverso?
	
	risks=false ;//$('input:radio[name=risks]').val();                    	  //1:riesgos Individuales;2: Acumulados;                    
	decay=false ;//$('input:checkbox[name=decaimiento_on]').prop("checked");  //decaimiento-on?;              
	futureTime=0;//$('input:text[name=tiempo]').val();                        //tiempo riesgo futuro
	
	cocName='toluene'	//Compuesto de interés ("Compound of Concern")


	//   Objetos:
	config=getRunConfiguration();

	source=getSourceParameters();

	media=getMediaParameters();

	coc=getCOCParameters(cocName);


	//CALCULOS:
	
	if (tier == 1){

		for (i=0;i< config.receptores.length;i++){	

			receptor=getReceptorParameters(i);
			
			calculateCoeficients(config,source,media,receptor,coc)
			tier1(config,source,media,receptor,coc);

			printResults(i);
		};

	} else if (tier == 2){
		for (i=0;i< config.receptores.length;i++){	

			receptor=getReceptorParameters(i);

			calculateCoeficients(config,source,media,receptor,coc)
			tier1(config,source,media,receptor,coc,config.receptores[i].distance);
			tier2(config,source,media,receptor,coc,config.receptores[i].distance);

			printResults(i);
		};

	};
	
	//OUTPUT:
	
	//printResults();

	return 0;
};

function getRunConfiguration(){
	//Config. de la corrida:
	config={}
	//Levanto inputs de corrida
	config.metadata={sitio: $('#sitio').val(),// proyecto
                     autor: $('#autor').val(), // autor
                     ubic : $('#ubic').val(),  // ubicacion		
                     fecha: $('#fecha').val(), // fecha
                     id   : $('#id').val(),    // doc id
	}
	config.tier     = 1; //$('input:radio[name=tier ]').val();                   //config.tier 1 ó tier 2/3
	config.fwd      = $('input:checkbox[name=fwd]').prop("checked");	     //calcular modelo directo?
	config.bwd      = $('input:checkbox[name=bwd]').prop("checked");      	     //calcular modelo inverso?
	config.risks    = $('input:radio[name=risks]').val();                        //1:riesgos Individuales;2: Acumulados;                    
	config.decay_on = $('input:checkbox[name=decaimiento_on]').prop("checked");  //decaimiento-on?;              
	config.time     = $('input:text[name=tiempo]').val();                        //tiempo riesgo futuro
      
	config.srcs={surf:false,soil:false,gw:false};

	config.receptores=[
		{
		 nombre:"emisor",
		 distance:0,	
		 tipo:"residencial",
		},
		{
		 nombre:"receptor",
		 distance:1000,
		 tipo:"comercial",
		}
			]

	return config;
}

function getSourceParameters(){
	//FUENTE: 
	s={
	   surf:{
		z:0.0 ,
	   	DX:1. ,	//[m]largo
	   	DY:1. ,	//[m]ancho
	   	DZ:0. ,	//[m]espesor
	   	C: 0.	//[mg/m3]concentración
	   },
	   soil:{
		z: 1. , //[m]profundidad (desde la superficie)
	   	DX:2. , //[m]largo
	   	DY:3. , //[m]ancho
	   	DZ:1. , //[m]espesor
	   	C: 0.	//[mg/m3]
	   },
	   gw:{
		z :5. , //[m]profundidad (desde la superficie)
	   	DX:3. , //[m]largo
	   	DY:10. , //[m]ancho
	   	DZ:3. , //[m]espesor
	   	C: 0.	//[mg/m3]
	   }
	};
		//s.air={
		//	DX:   ,
		//	DY:   ,
		//	DZ:   ,
		//	C:   
		//};

	return s;
};

function getMediaParameters(){
	//MEDIO:
	m={}		//(site-specific parameters)
            m.soil={
                h:5.0,  	   // [m]     grosor total
                h_zc: 0.05,        // [m]     grossor de zona capilar
                theta:0.38,        // [-]     porosidad
                theta_w:0.15,      // [-]     contenido de agua volumetrico
                theta_a:0.23,      // [-]     contenido de aire volumetrico
                theta_a_zc:0.342,  // [-]     contenido de aire volumetrico en zona capilar
                theta_w_zc:0.038,  // [-]     contenido de agua volumetrico en zona capilar
                rho_s:1700,        // [kg/m3] densidad 
                k_s:864,           // [cm/d]  conductividad hidraulica vertical 
                k_v:1e-12,         // [m2]    permeabilidad de vapor 
                I:30.0,            // [cm/yr] Infiltracion neta 
                fOC:0.01,          // [-]     frac organica todo el perfil
                fOC_zc:0.02,       // [-]     frac organica zona capilar
                pH:6.8             // [-]     pH
          	};
            m.gw={
                h:2.0,             // [m]    grosor del acuifero
                k_s:2.5*1e-6,      // [m/s]  cond hidraulica saturada
                i:1e-2,            // [-]    gradiente hidraulico
                theta:0.38,        // [-]    porosidad effectiva
                v:0.2,             // [m/d]  velocidad de Darcy
                v_s:0.66,          // [m/-]  velocidad especifica (v/theta)
                fOC:1e-3,          // [-]    fracc organica
                pH:6.2,            // [-]    pH
                sigma_x:40,        // [m]    dispersividad.x
                sigma_y:10,	   // [m]    dispersividad.y
                sigma_z:0.01,	   // [m]    dispersividad.z
		Y:240,		   // [m]    ancho de acuifero
		Z:6,		   // [m]    grosor de acuifero
          	};
            m.air={
                h_mix:2.0,         // [m]      altura de zona de mezcla
                u:2.25,            // [m/s]    velocidad del viento
                sigma_y:1.0,       // [  ]     dispersividad
                sigma_z:1.0
          	}
            m.sw={
                Q:20,   	// [m3/s]  Caudal río 
                A:10,   	// [m2]    Seccion rio
		};

	return m;
};

function getReceptorParameters(i){

	//RECEPTOR
	r=recep[config.receptores[i].tipo].adult       	//elijo param de exposicion
                // ATc:     [yr]     average time for carcinogenes
                // AT:      [yr]     average time for non-carcino 
                // BW:      [kg]     body weight
                // ED:      [yr]     exposure duration
                // EF:      [dia/yr] exposure frequency
                // EFd:     [dia/yr] exposure frequency for dermal exposure
                // IRw:     [L/dia]  ingestion rate for water
                // IRs:     [mg/día] ingestion rate for soil
                // SA:      [m3]     skin surface area (dermal)
                // M:       [-]      soil-skin adherence factor
                // EDsw:    [hrs]    swimming exposure time
                // EFsw:    [1/yr]   swminig exposure frequency
                // IRsw:    [L/hr]   ingestion Rate while swimming
                // SAsw:    [cm2]    skin surface area while swimming
                // IRfsh:   [kg/yr]  ingestion rate fish (kg/yr)
                // Frfsh:   [ ]      contaminated fish fraction
                // IRbg:    [ ]      below ground ingestion rate of vegetables
                // IRag:    [ ]      above ground ingestion rate of vegetables
                // vegVGbg: [ ]      correction factor for b-g veg ingestion
                // vegVGag: [ ]      correction factor for a-g veg ingestion
                // tau:     [ ]      average time for vapor flux
	return r;
};

function getCOCParameters(cocName='benzene'){

	//coc=GSIdata[407]   //agarro un compuesto
        coc=GSIdata.find(element => element.name==cocName)

	return coc;
};


function calculateCoeficients(config,s,m,r,coc){
		//Linear Sorption/Desorption coef: [L-w/kg-soil]
		k_s=coc.Koc*m.soil.fOC*1e-3 //m3/kg
		//Factor de particion suelo-agua [(mg/m3- w)/ (mg/kg-s)]
		Ksw=ksw(config,s,m,r,coc)

		//Calcular difusiones efectivas:
        	//Eff. diff in vadose zone soil [cm2/s]
        	D_eff_s=( coc.D_a*(m.soil.theta_a**3.33 / m.soil.theta**2 )+(coc.D_w/coc.H *  m.soil.theta_w**3.33 / m.soil.theta**2) )*1e-4 //m2/s
        	//Eff. diff in the capillary zone:[cm2/s]
        	D_eff_cap=(coc.D_a*(m.soil.theta_a_zc**3.33/m.soil.theta**2) + (coc.D_w/coc.H * m.soil.theta_w_zc**3.33 / m.soil.theta**2)) * 1e-4 //m2/s
        	//Eff. diff above the water table.[cm2/s]
        	D_eff_ws=( m.soil.h  / (m.soil.h_zc / D_eff_cap + (m.soil.h-m.soil.h_zc) / D_eff_s) ) 	//m2/s
}
		
function tier1(config,s,m,r,coc){
	//TIER-1
	console.log("Tier 1.. ");
        	
        	TR=1.0e-5	//TR  = target risk (input)
        	THQ=1.0e0	//THQ = target hazard quotient (input)

		//Cross-media atenuation factors:
		VFss  =vfss(config,s,m,r,coc);	//surf --> air 		[mg/m3 -air  / mg/kg-soil]
		PEF   =pef(config,s,m,r,coc);	//surf --> air(PM)	[g/cm2 -soil]
		VFsamb=vfsamb(config,s,m,r,coc);	//soil --> air		[mg/m3 -air  / mg/kg-soil]
		VFwamb=vfwamb(config,s,m,r,coc);	//gw   --> air		[mg/m3 -air  / mg/L-water]
		//VFsesp=vfsesp(config,s,m,r,coc);
		//VFwesp=vfwesp(config,s,m,r,coc);
		LF    =lf(config,s,m,r,coc);	//soil --> gw		[mg/L-water / mg/kg-soil]
		//DFwgsw=dfwgsw(config,s,m,r,coc)	//gw   --> sw		[-]

		RBSL  =calc_RBSL()
};

function tier2(config,s,m,r,coc,distance){
	//TIER-2
	console.log("Tier 2.. ");
		////Calcular factores de transporte lateral:
        	DAF=daf(distance,config,s,m,r,coc);		//(mg/L - GW at POC)/ (mg/L - GW at POE)
        	ADF=adf(distance,config,s,m,r,coc);		//(mg/m 3 - air at POC_/ (mg/m 3 at POE)
		
		SSTL = calc_SSTL()
		//////Calcular NAF
		//NAFair=ADF/(VFss +PEF) + (ADF/VFsamb) + 1/VFsesp + ADF/VFwamb + 1/VFwesp
        	//NAFgw =DAF/LF + DAF + 1/DFgwsw
		//
		//	SSTL=calc_SSTL()

};


function printResults(i){

	//prints:
		console.log(config.receptores[i].nombre)
		console.log("-OK---------------------")
		console.log("k_s: "+k_s)
		console.log("K_sw: "+Ksw)
		
		console.log("-OK---------------------")
		console.log("D_s: "+D_eff_s)
		console.log("D_cap: "+D_eff_cap)
		console.log("D_ws: "+D_eff_ws)
	
		console.log("-OK---------------------")
		console.log("Volatiliz. Factor from soil: (VFss): "+VFss)
		console.log("Volatiliz. Factor from subsurf: (VFsamb): "+VFsamb)
		console.log("Volatiliz. Factor from gw: (VFwamb): "+VFwamb)
		console.log("Leaching Factor (LF): "+LF)
		
		console.log("------------------------")
		console.log("Risk-Based Screening Levels:")
		console.log(RBSL)
		console.log("------------------------")

		console.log("Dilution Atenuation Factor (DAF): "+DAF)
		console.log("Air Dispersion Factor (ADF): "+ADF)

		console.log("------------------------")

		console.log(SSTL)
};
