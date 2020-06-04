// =============================
//  R   E   B   E   C   C   A	
// -----------------------------
// sample run.
//
//Objetivo final: evaluar riesgos de base.
//
//Objetivo inmediato: calcular naf


//Referencias:
//run=parametros de corrida
//s=Source
//m=Transport Media
//r=Receptor
//coc= Compound of Concern


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
	   run.tier  	= $('input:radio[name=tier ]').val();                    //run.tier 1 ó tier 2/3
	   run.fwd_calc = $('input:checkbox[name=fwd]').prop("checked");	   //calcular modelo directo?
	   run.bwd_calc = $('input:checkbox[name=bwd]').prop("checked");      //calcular modelo inverso?
	   run.risks 	= $('input:radio[name=risks]').val();                    //1:riesgos Individuales;2: Acumulados;                    
	   run.decaimiento_on = $('input:checkbox[name=decaimiento_on]').prop("checked"); //decaimiento-on?;              
	   run.tiempo 	= $('input:text[name=tiempo]').val();                               //tiempo riesgo futuro
      

	//Fuente: 
	s={
	   surf:{
	   	DX:1. ,	//largo
	   	DY:1. ,	//ancho
	   	DZ:0. ,	//espesor
	   	C: 0.	//concentración
	   },
	   soil:{
		z: 1. , //profundidad (desde la superficie)
	   	DX:2. , //largo
	   	DY:2. , //ancho
	   	DZ:1. , //espesor
	   	C: 0.
	   },
	   gw:{
		z :5. , //profundidad (desde la superficie)
	   	DX:3. , //largo
	   	DY:2. , //ancho
	   	DZ:2. , //espesor
	   	C: 0.
	   }
	};
		//s.air={
		//	DX:   ,
		//	DY:   ,
		//	DZ:   ,
		//	C:   
		//};



	//Medio:
	m={}		//(site-specific parameters)
            m.soil={
                h:3.0,  	 	//grosor total [m]
                h_zc: 0.05,             //grossor de zona capilar [m]
                theta:0.38,             //porosidad
                theta_w:0.12,           //contenido de agua volumetrico
                theta_a:0.26,           //contenido de aire volumetrico
                theta_a_zc:0.342,       //contenido de aire volumetrico en zona capilar
                theta_w_zc:0.038,       //contenido de agua volumetrico en zona capilar
                rho_s:1.7,              //densidad [kg/L]
                k_s:864,                //conductividad hidraulica vertical [cm/d]
                k_v:1e-12,              //permeabilidad de vapor [m2]
                I:30.0,                 //Infiltracion neta [cm/yr]
                fOC:0.01,               //frac organica todo el perfil
                fOC_zc:0.02,            //frac organica zona capilar
                pH:6.8                  //pH
          	};
            m.gw={
                h:2.0,                  //grosor del acuifero
                k_s:680 ,               //cond hidraulica [cm/d]
                i:1e-2,                 //gradiente hidraulico
                theta:0.38,             //porosidad effectiva
                v:6.9,                  //velocidad de Darcy
                v_s:18.1,               //velocidad especifica (v/theta)
                fOC:1e-3,               //fracc organica
                pH:6.2,                 //pH
                sigma_x:1.0,            //dispersividad.x
                sigma_y:1.0,
                sigma_z:1.0
          	};
            m.air={
                h_mix:2.0,              //altura de zona de mezcla
                u:2.25,                 //velocidad del viento
                sigma_y:1.0,            //dispersividad
                sigma_z:1.0
          	}
            m.sw={
                Q:20,   		//Caudal río [m3/s]
                A:10,   		//seccion rio
		};






	//Receptores y vias de exposición.
	r=recep.residential.adult       	//elijo param de exposicion
                // ATc:     average time for carcinogenes(yr)
                // AT:      average time for non-carcino (yr)
                // BW:      body weight
                // ED:      exposure duration(yr)
                // EF:      exposure frequency
                // EFd:     exposure frequency for dermal exposure
                // IRw:     ingestion rate for water (L/day)
                // IRs:     ingestion rate for soil  (mg/day)
                // SA:      skin surface area (dermal)
                // M:       soil-skin adherence factor
                // swED:    swimming exposure time
                // swEF:    swminig exposure frequency (event/yr)
                // swIRw:   ingestion Rate while swimming
                // swSA:    skin surface area while swimming
                // IRfsh:   ingestion rate fish (kg/yr)
                // fshFI:   contaminated fish fraction
                // IRbg:    below ground ingestion rate of vegetables
                // IRag:    above ground ingestion rate of vegetables
                // vegVGbg: correction factor for b-g veg ingestion
                // vegVGag: correction factor for a-g veg ingestion
                // tau:     average time for vapor flux

	

	//COCs
	coc=GSIdata[0]                  //agarro un compuesto
		// name      | Name of the compound of interest             
		// CAS       | Chemical Abstracts Service Registry Number   
		// type      | Type (O:Organic; I:Inorganic)                
		// m_mol     | Molecular Weight (g/mol)                     
		// S         | Solubility @ 20-25 degC (mg/L)               
		// p_vap     | Vapor pressure @ 20-25 degC (mmHG)           
		// H         | Henrys Law constant @ 20 degC                
		// Koc       | Sorption coefficient (log L/kg) Koc          
		// Kow       | Octanol-water partition coefficient (log L/kg
		// D_air     | Diffusion coefficient in air (cm2/s)         
		// D_w       | Diffusion coefficient in water (cm2/s)       
		// BA        | Relative bioavailability factor (-)          
		// LoD_w     | Water (mg/L)                                 
		// LoD_s     | Soil (mg/kg)                                 
		//lambda_s   | Saturated zone                               
		//lambda_u   | Unsaturated zone                             
		//theta_ag   | Above ground veg.                            
		//theta_bg   | Below ground veg.                            
		//EPA_w      | EPA weight of evidence                       
		//is_carc    | Carcinogen                                   
		//SF_o       | Oral slope factor (1/[mg/kg/day])            
		//UR_inhal   | Inhalation unit risk factor (1/[ug/m3])      
		//RfDo       | Oral reference dose (mg/kg/day)              
		//RfDi       | Inhalation reference conc. (mg/m3)           
		//ads_derm   | Dermal adsorption fraction (-)               
		//ads_gast   | Gastrointestinal adsorption fraction (-)     
		//derm_per   | Dermal permeability coefficient (cm/hr)      
		//derm_lag   | Lag time for dermal exposure (hr)            
		//derm_exp   | Critical dermal exposure time (hr)           
		//derm_contr | Relative contribution of perm. coeff. (-)    
		//MCL_1      | Primary CL                                   
		//MCL_2      | Secondary CL                                 
		//PEL_TWA    | Occupational Air PEL/TWA (mg/m3)             
		//AqLP_w     | Aquatic life protection: Fresh water biota   
		//AqLP_bio   | Aquatic life protection: arine biota         
		//HH_w_drink | Human health: Drinking / freshwater fish     
		//HH_fish    | Human health: Fresh water fishing only       
		//HH_fish_salt | Human health: Salt water fishing only      


	//TIER-1
		VFss  =vfss(run,s,m,r,coc);
		PEF   =pef(run,s,m,r,coc);
		VFsamb=vfsamb(run,s,m,r,coc);
		VFsesp=vfsesp(run,s,m,r,coc);
		VFwamb=vfwamb(run,s,m,r,coc);
		VFwesp=vfwesp(run,s,m,r,coc);
		LF    =lf(run,s,m,r,coc);
		DFwgsw=dfwgsw(run,s,m,r,coc)

		RBSL=calc_RBSL()

	////TIER-2
	////Calcular factores de transporte lateral:
        //DAF=daf(run,s,m,r,coc);
        //ADF=adf(run,s,m,r,coc);
	//
	//////Calcular NAF
	//NAFair=ADF/(VFss +PEF) + (ADF/VFsamb) + 1/VFsesp + ADF/VFwamb + 1/VFwesp
        //NAFgw =DAF/LF + DAF + 1/DFgwsw
	//
	//	SSTL=calc_SSTL()


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
