// =============================
//  R   E   B   E   C   C   A	
// -----------------------------
// sample run.
//

//Referencias:
//run | Params de corrida
//s   | Source
//m   | Transport Media
//r   | Receptor
//coc | Compound of Concern

function main(){

	//Config. de la corrida:
	run={}
	//Levanto inputs de corrida
	run.metadata={sitio: $('#sitio').val(), // proyecto
                     autor: $('#autor').val(), // autor
                     ubic : $('#ubic').val(),  // ubicacion		
                     fecha: $('#fecha').val(), // fecha
                     id   : $('#id').val(),    // doc id
	}
	//run.tier  	= $('input:radio[name=tier ]').val();                             //run.tier 1 ó tier 2/3
	run.fwd_calc = $('input:checkbox[name=fwd]').prop("checked");	                  //calcular modelo directo?
	run.bwd_calc = $('input:checkbox[name=bwd]').prop("checked");      		  //calcular modelo inverso?
	run.risks 	= $('input:radio[name=risks]').val();                    	  //1:riesgos Individuales;2: Acumulados;                    
	run.decaimiento_on = $('input:checkbox[name=decaimiento_on]').prop("checked");    //decaimiento-on?;              
	run.tiempo 	= $('input:text[name=tiempo]').val();                             //tiempo riesgo futuro
      
	run.srcs={surf:false,soil:false,gw:false};
	run.receptores=[
			{
			 nombre:"emisor",
			 dist:0,	
			 tipo:"residencial",
			},
			{
			 nombre:"receptor",
			 dist:1000,
			 tipo:"comercial",
			}
			]

for (i=0;i< run.receptores.length;i++){
		console.log(i);
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

	//MEDIO:
	m={}		//(site-specific parameters)
            m.soil={
                h:5.0,  	   //   [m]     grosor total
                h_zc: 0.05,        //   [m]     grossor de zona capilar
                theta:0.38,        //   [-]     porosidad
                theta_w:0.15,      //   [-]     contenido de agua volumetrico
                theta_a:0.23,      //   [-]     contenido de aire volumetrico
                theta_a_zc:0.342,  //   [-]     contenido de aire volumetrico en zona capilar
                theta_w_zc:0.038,  //   [-]     contenido de agua volumetrico en zona capilar
                rho_s:1700,         //  [kg/m3]  densidad 
                k_s:864,           //   [cm/d]  conductividad hidraulica vertical 
                k_v:1e-12,         //   [m2]    permeabilidad de vapor 
                I:30.0,            //   [cm/yr] Infiltracion neta 
                fOC:0.01,          //   [-]     frac organica todo el perfil
                fOC_zc:0.02,       //   [-]     frac organica zona capilar
                pH:6.8             //   [-]     pH
          	};
            m.gw={
                h:2.0,             //  [m]     grosor del acuifero
                k_s:2.5*1e-6,      //  [m/s]  cond hidraulica saturada
                i:1e-2,            //  [-]     gradiente hidraulico
                theta:0.38,        //  [-]     porosidad effectiva
                v:0.2,             //  [m/d]  velocidad de Darcy
                v_s:0.66,          //  [m/-]  velocidad especifica (v/theta)
                fOC:1e-3,          //  [-]     fracc organica
                pH:6.2,            //  [-]     pH
                sigma_x:40,        //   [m]     dispersividad.x
                sigma_y:10,	   //  [m]     dispersividad.y
                sigma_z:0.01,	   //  [m]     dispersividad.z
		Y:240,		   //[m] ancho de acuifero
		Z:6,		   //[m] grosor de acuifero
          	};
            m.air={
                h_mix:2.0,         //   [m]     altura de zona de mezcla
                u:2.25,            //   [m/s]    velocidad del viento
                sigma_y:1.0,       //   [  ]    dispersividad
                sigma_z:1.0
          	}
            m.sw={
                Q:20,   	//   [m3/s]  Caudal río 
                A:10,   	//   [m2]    Seccion rio
		};

	//RECEPTOR
	r=recep[run.receptores[i].tipo].adult       	//elijo param de exposicion
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
	//COCs
	coc=GSIdata[407]                   //agarro un compuesto
		// name                   Name of the compound of interest             
		// CAS                    Chemical Abstracts Service Registry Number   
		// type                   Type (O:Organic; I:Inorganic)                
		// m_mol      [g/mol    ] Molecular Weight (g/mol)                     
		// S          [mg/L     ] Solubility @ 20-25 degC (mg/L)               
		// p_vap      [mmHg     ] Vapor pressure @ 20-25 degC (mmHG)           
		// H          [   -     ] Henrys Law constant @ 20 degC                
		// Koc        [L/kg     ] Sorption coefficient (log L/kg) Koc          
		// Kow        [   -     ] Octanol-water partition coefficient (log L/kg
		// D_air      [cm2/s    ] Diffusion coefficient in air (cm2/s)         
		// D_w        [cm2/s    ] Diffusion coefficient in water (cm2/s)       
		// BA         [  -      ] Relative bioavailability factor (-)          
		// LoD_w      [mg/L     ] Water (mg/L)                                 
		// LoD_s      [mg/kg    ] Soil (mg/kg)                                 
		//lambda_s    [dias     ] Saturated zone                               
		//lambda_u    [dias     ] Unsaturated zone                             
		//theta_ag    [   -     ] Above ground veg.                            
		//theta_bg    [   -     ] Below ground veg.                            
		//EPA_w       [         ] EPA weight of evidence                       
		//is_carc     [         ] Carcinogen                                   
		//SF_o        [kgdia/mg ] Oral slope factor (1/[mg/kg/day])            
		//UR_inhal    [m3/ug    ] Inhalation unit risk factor (1/[ug/m3])      
		//RfDo        [mg/kgdia ] Oral reference dose (mg/kg/day)              
		//RfDi        [mg/m3    ] Inhalation reference conc. (mg/m3)           
		//ads_derm    [    -    ] Dermal adsorption fraction (-)               
		//ads_gast    [    -    ] Gastrointestinal adsorption fraction (-)     
		//derm_per    [   cm/hr ] Dermal permeability coefficient (cm/hr)      
		//derm_lag    [    hr   ] Lag time for dermal exposure (hr)            
		//derm_exp    [    hr   ] Critical dermal exposure time (hr)           
		//derm_contr  [    -    ] Relative contribution of perm. coeff. (-)    
		//MCL_1       [         ] Primary CL                                   
		//MCL_2       |         | Secondary CL                                 
		//PEL_TWA     [   mg/m3 ] Occupational Air PEL/TWA (mg/m3)             
		//AqLP_w      |         | Aquatic life protection: Fresh water biota   
		//AqLP_bio    |         | Aquatic life protection: arine biota         
		//HH_w_drink  |         | Human health: Drinking / freshwater fish     
		//HH_fish     |         | Human health: Fresh water fishing only       
		//HH_fish_salt          | Human health: Salt water fishing only      


		//Linear Sorption/Desorption coef: [L-w/kg-soil]
		k_s=coc.Koc*m.soil.fOC*1e-3	//m3/kg
		//Factor de particion suelo-agua [(mg/m3- w)/ (mg/kg-s)]
		Ksw=ksw(run,s,m,r,coc)
		//Calcular difusiones efectivas:
        	//Eff. diff in vadose zone soil [cm2/s]
        	D_eff_s=( coc.D_a*(m.soil.theta_a**3.33 / m.soil.theta**2 )+(coc.D_w/coc.H *  m.soil.theta_w**3.33 / m.soil.theta**2) )*1e-4	//m2/s
        	//Eff. diff in the capillary zone:[cm2/s]
        	D_eff_cap=(coc.D_a*(m.soil.theta_a_zc**3.33/m.soil.theta**2) + (coc.D_w/coc.H * m.soil.theta_w_zc**3.33 / m.soil.theta**2)) * 1e-4	//m2/s
        	//Eff. diff above the water table.[cm2/s]
        	D_eff_ws=( m.soil.h  / (m.soil.h_zc / D_eff_cap + (m.soil.h-m.soil.h_zc) / D_eff_s) ) 					//m2/s
	
		

	//TIER-1
        	//TR  = target risk (input)
        	TR=1.0e-5
        	//THQ = target hazard quotient (input)
        	THQ=1.0e0

		//Cross-media atenuation factors:
		VFss  =vfss(run,s,m,r,coc);	//surf --> air 		[mg/m3 -air  / mg/kg-soil]
		PEF   =pef(run,s,m,r,coc);	//surf --> air(PM)	[g/cm2 -soil]
		VFsamb=vfsamb(run,s,m,r,coc);	//soil --> air		[mg/m3 -air  / mg/kg-soil]
		VFwamb=vfwamb(run,s,m,r,coc);	//gw   --> air		[mg/m3 -air  / mg/L-water]
		//VFsesp=vfsesp(run,s,m,r,coc);
		//VFwesp=vfwesp(run,s,m,r,coc);
		LF    =lf(run,s,m,r,coc);	//soil --> gw		[mg/L-water / mg/kg-soil]
		//DFwgsw=dfwgsw(run,s,m,r,coc)	//gw   --> sw		[-]

		RBSL  =calc_RBSL()

	//TIER-2
		////Calcular factores de transporte lateral:
        	DAF=daf(run.receptores[i].dist,run,s,m,r,coc);		//(mg/L - GW at POC)/ (mg/L - GW at POE)
        	ADF=adf(run.receptores[i].dist,run,s,m,r,coc);		//(mg/m 3 - air at POC_/ (mg/m 3 at POE)
		
		SSTL = calc_SSTL()
		//////Calcular NAF
		//NAFair=ADF/(VFss +PEF) + (ADF/VFsamb) + 1/VFsesp + ADF/VFwamb + 1/VFwesp
        	//NAFgw =DAF/LF + DAF + 1/DFgwsw
		//
		//	SSTL=calc_SSTL()



	//prints:

		console.log(run.receptores[i].nombre)
		console.log("-OK---------------------")
		console.log("k_s: "+k_s)
		console.log("K_sw: "+Ksw)
		
		console.log("-OK---------------------")
		console.log("D_s: "+D_eff_s)
		console.log("D_cap: "+D_eff_cap)
		console.log("D_ws: "+D_eff_ws)
	
		console.log("-OK---------------------")
		console.log("VFss: "+VFss)
		console.log("VFsamb: "+VFsamb)
		console.log("VFwamb: "+VFwamb)
		console.log("LF: "+LF)
		
		console.log("------------------------")
		console.log(RBSL)
		console.log("------------------------")

		console.log("DAF: "+DAF)
		console.log("ADF: "+ADF)

		console.log("------------------------")

		console.log(SSTL)
}
	return 0;
}




	//Levanto opciones de calculo de transporte                        
	//run.calc_opts.vfss=   $('input:radio[name=vfss]:checked').val();   //soil-sfc  -->  air (gas)
	//run.calc_opts.pef=    $('input:radio[name=pef]:checked').val();    //soil-sfc  -->  air (pm)
	//run.calc_opts.vfsamb= $('input:radio[name=vfsamb]:checked').val(); //soil      -->  air (gas,outdoor)
	//run.calc_opts.vfsesp= $('input:radio[name=vfsesp]:checked').val(); //soil      -->  air (gas,indoor)
	//run.calc_opts.vfwamb= $('input:radio[name=vfwamb]:checked').val(); //gw        -->  air (gas,outdoor)
	//run.calc_opts.vfwesp= $('input:radio[name=vfwesp]:checked').val(); //gw        -->  air (gas,indoor)
	//run.calc_opts.lf=     $('input:radio[name=lf]:checked').val();     //soil      -->  gw

	//run.calc_opts.adf=$('input:radio[name=adf]:checked').val();        //air dispersion factor (ADF)
	//run.calc_opts.daf=$('input:radio[name=daf]:checked').val();        //gw dilution attenuation factor (DAF)
	//run.calc_opts.dfgwsw= $('input:radio[name=dfgwsw]:checked').val(); //gw        -->  sup water




//r=new RECEPTOR();
//	r.pathways.gw_ingestion=true;
//	r.type="residential"
//	//On-site
//	r.onsite.soil.type= $('#onsite_soil_type').val(); //tipo de receptor
//	r.onsite.soil.dist= $('#onsite_soil_x').val();    //distancia de receptor
//	r.onsite.gw.type= $('#onsite_gw_type').val();    
//	r.onsite.gw.dist= $('#onsite_gw_x').val();       
//	r.onsite.air.type= $('#onsite_air_type').val();  
//	r.onsite.air.dist= $('#onsite_air_x').val();    
//	//Offsite-1
//	r.offsite1.soil.type= $('#offsite1_soil_type').val(); //tipo de receptor
//	r.offsite1.soil.dist= $('#offsite1_soil_x').val();    //distancia de receptor
//	r.offsite1.gw.type= $('#offsite1_gw_type').val();    
//	r.offsite1.gw.dist= $('#offsite1_gw_x').val();       
//	r.offsite1.air.type= $('#offsite1_air_type').val();  
//	r.offsite1.air.dist= $('#offsite1_air_x').val();    
//	//Offsite-2
//	r.offsite2.soil.type= $('#offsite2_soil_type').val(); //tipo de receptor
//	r.offsite2.soil.dist= $('#offsite2_soil_x').val();    //distancia de receptor
//	r.offsite2.gw.type= $('#offsite2_gw_type').val();    
//	r.offsite2.gw.dist= $('#offsite2_gw_x').val();       
//	r.offsite2.air.type= $('#offsite2_air_type').val();  
//	r.offsite2.air.dist= $('#offsite2_air_x').val();    
//	
//	//PATHWAYS
//        r.pathways.soil_ingestion =$('input:checkbox[name=soil_ingestion]').prop("checked");
//        r.pathways.soil_dermal    =$('input:checkbox[name=soil_dermal]').prop("checked");
//        r.pathways.soil_inhalation=$('input:checkbox[name=soil_inhalation]').prop("checked");
//        r.pathways.soil_veg_ingestion =$('input:checkbox[name=soil_veg_ingestion]').prop("checked");
//        
//	r.pathways.gw_ingestion=$('input:checkbox[name=gw_ingestion]').prop("checked");
//        r.pathways.sw_ingestion=$('input:checkbox[name=sw_ingestion]').prop("checked");
//        r.pathways.sw_swimming =$('input:checkbox[name=sw_swimming]').prop("checked");
//        r.pathways.sw_fish_consumption=$('input:checkbox[name=sw_fish_consumption]').prop("checked");
//        
//	r.pathways.air_inhalation =true;   
////Calc. coefs de difussion y conveccion
//calc_diff_coefs(m,r,coc)
                                                                                                             
////Calcular factores de transferencia:
//run.vfss=vfss(run,s,m,r,coc);
//run.pef=pef(run,s,m,r,coc);
//run.vfsamb=vfsamb(run,s,m,r,coc);
//run.vfsesp=vfsesp(run,s,m,r,coc);
//run.vfwamb=vfwamb(run,s,m,r,coc);
//run.vfwesp=vfwesp(run,s,m,r,coc);
//run.lf=lf(run,s,m,r,coc);
//run.dfwgsw=dfwgsw(run,s,m,r,coc)
////Calcular factores de transporte lateral:
//run.daf=daf(run,s,m,r,coc);
//run.adf=adf(run,s,m,r,coc);
                                                                                                             
////Calcular NAF
//run.naf.air=run.adf/(run.vfss+run.pef) + (run.adf/run.vfsamb) + 1/run.vfsesp + adf/run.wamb + 1/run.vfwesp
//run.naf.gw=run.daf/run.lf  + run.daf + 1/run.dfgwsw
