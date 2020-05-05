// =============================
//  R   E   B   E   C   C   A	
// -----------------------------
// sample run.
//
//Objetivo final: evaluar riesgos de base.
//
//Objetivo inmediato: calcular naf

function main(){

	//Config. de la corrida:
	run=new CORRIDA();
        
	//Levanto inputs de corrida
	run.metadata.sitio = $('#sitio').val(); // proyecto
        run.metadata.autor = $('#autor').val(); // autor
        run.metadata.ubic  = $('#ubic').val();  // ubicacion		
        run.metadata.fecha = $('#fecha').val(); // fecha
        run.metadata.id    = $('#id').val();    // doc id

	run.tier  = $('input:radio[name=tier ]').val()                     //run.tier 1 ó tier 2/3
	run.fwd_calc = $('input:checkbox[name=fwd]').prop("checked");	   //calcular modelo directo?
	run.bwd_calc = $('input:checkbox[name=bwd]').prop("checked");      //calcular modelo inverso?
	run.risks = $('input:radio[name=risks]').val()                     //1:riesgos Individuales;2: Acumulados;                    
	run.decaimiento_on = $('input:checkbox[name=decaimiento_on]').prop("checked"); //decaimiento-on?;              
	run.tiempo = $('input:text[name=tiempo]').val();                               //tiempo riesgo futuro
      
	//Levanto opciones de calculo de transporte                        

	run.calc_opts.vfss=   $('input:radio[name=vfss]:checked').val();   //soil-sfc  -->  air (gas)
	run.calc_opts.pef=    $('input:radio[name=pef]:checked').val();    //soil-sfc  -->  air (pm)
	run.calc_opts.vfsamb= $('input:radio[name=vfsamb]:checked').val(); //soil      -->  air (gas,outdoor)
	run.calc_opts.vfsesp= $('input:radio[name=vfsesp]:checked').val(); //soil      -->  air (gas,indoor)
	run.calc_opts.vfwamb= $('input:radio[name=vfwamb]:checked').val(); //gw        -->  air (gas,outdoor)
	run.calc_opts.vfwesp= $('input:radio[name=vfwesp]:checked').val(); //gw        -->  air (gas,indoor)
	run.calc_opts.lf=     $('input:radio[name=lf]:checked').val();     //soil      -->  gw

	run.calc_opts.adf=$('input:radio[name=adf]:checked').val();        //air dispersion factor (ADF)
	run.calc_opts.daf=$('input:radio[name=daf]:checked').val();        //gw dilution attenuation factor (DAF)
	run.calc_opts.dfgwsw= $('input:radio[name=dfgwsw]:checked').val(); //gw        -->  sup water

	

	//Fuente: 
	s=new FUENTE();
		s.gw.C=1.3e-2	//concentracion de COC en la fuente.











	//Medio:
	m=new MEDIO();		//(site-specific parameters)














	//Receptores y vias de exposición.
	r=new RECEPTOR();
		r.pathways.gw_ingestion=true;
		r.type="residential"
		//On-site
		r.onsite.soil.type= $('#onsite_soil_type').val(); //tipo de receptor
		r.onsite.soil.dist= $('#onsite_soil_x').val();    //distancia de receptor
		r.onsite.gw.type= $('#onsite_gw_type').val();    
		r.onsite.gw.dist= $('#onsite_gw_x').val();       
		r.onsite.air.type= $('#onsite_air_type').val();  
		r.onsite.air.dist= $('#onsite_air_x').val();    
		//Offsite-1
		r.offsite1.soil.type= $('#offsite1_soil_type').val(); //tipo de receptor
		r.offsite1.soil.dist= $('#offsite1_soil_x').val();    //distancia de receptor
		r.offsite1.gw.type= $('#offsite1_gw_type').val();    
		r.offsite1.gw.dist= $('#offsite1_gw_x').val();       
		r.offsite1.air.type= $('#offsite1_air_type').val();  
		r.offsite1.air.dist= $('#offsite1_air_x').val();    
		//Offsite-2
		r.offsite2.soil.type= $('#offsite2_soil_type').val(); //tipo de receptor
		r.offsite2.soil.dist= $('#offsite2_soil_x').val();    //distancia de receptor
		r.offsite2.gw.type= $('#offsite2_gw_type').val();    
		r.offsite2.gw.dist= $('#offsite2_gw_x').val();       
		r.offsite2.air.type= $('#offsite2_air_type').val();  
		r.offsite2.air.dist= $('#offsite2_air_x').val();    
		
		//PATHWAYS
                r.pathways.soil_ingestion =$('input:checkbox[name=soil_ingestion]').prop("checked");
                r.pathways.soil_dermal    =$('input:checkbox[name=soil_dermal]').prop("checked");
                r.pathways.soil_inhalation=$('input:checkbox[name=soil_inhalation]').prop("checked");
                r.pathways.soil_veg_ingestion =$('input:checkbox[name=soil_veg_ingestion]').prop("checked");
                
		r.pathways.gw_ingestion=$('input:checkbox[name=gw_ingestion]').prop("checked");
                r.pathways.sw_ingestion=$('input:checkbox[name=sw_ingestion]').prop("checked");
                r.pathways.sw_swimming =$('input:checkbox[name=sw_swimming]').prop("checked");
                r.pathways.sw_fish_consumption=$('input:checkbox[name=sw_fish_consumption]').prop("checked");
                
		r.pathways.air_inhalation =true;   
	

	//COCs
	coc=new COC();
		//c.set("contaminante"); //si "contaminante" existe ya està, sino hay que especificarle todos los parametros.





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

	return 0;
}

