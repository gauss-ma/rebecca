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
		s.soil={
			DX:   ,
			DY:   ,
			DZ:   ,
			C:   
		};

		s.gw={
			DX:   ,
			DY:   ,
			DZ:   ,
			C:   
		};
		s.air={
			DX:   ,
			DY:   ,
			DZ:   ,
			C:   
		};

		s.gw.C=1.3e-2	//concentracion de COC en la fuente.






	//Medio:
	m=new MEDIO();		//(site-specific parameters)
            m.soil={
                h:$("#soil_h").val(),            //grosor total [m]
                h_zc: 0.05,                      //grossor de zona capilar [m]
                theta:0.38,                      //porosidad
                theta_w:0.12,                    //contenido de agua volumetrico
                theta_a:0.26,                    //contenido de aire volumetrico
                theta_a_zc:0.342,                //contenido de aire volumetrico en zona capilar
                theta_w_zc:0.038,                //contenido de agua volumetrico en zona capilar
                rho_s:1.7,                       //densidad [kg/L]
                k_s:864,                         //conductividad hidraulica vertical [cm/d]
                k_v:1e-12,                       //permeabilidad de vapor [m2]
                I:30.0,                          //Infiltracion neta [cm/yr]
                fracOC:0.01,                     //frac organica todo el perfil
                fracOC_zc:0.02,                  //frac organica zona capilar
                pH:6.8                           //pH
          	};
            m.gw={
                h:2.0,                           //grosor del acuifero
                k_s:680 ,                        //cond hidraulica [cm/d]
                i:1e-2,                          //gradiente hidraulico
                theta:0.38,                      //porosidad effectiva
                v:6.9,                           //velocidad de Darcy
                v_s:18.1,                        //velocidad especifica (v/theta)
                fracOC:1e-3,                     //fracc organica
                pH:6.2,                          //pH

                sigma_x:1.0,                     //dispersividad.x
                sigma_y:1.0,
                sigma_z:1.0
          	};
            m.air={
                h:mix:2.0,                       //altura de zona de mezcla
                u:2.25,                          //velocidad del viento
                sigma_y:1.0,                     //dispersividad
                sigma_z:1.0
          	}
            m.sw={
                Q:20,   			//Caudal río [m3/s]
                W:10,   			//seccion rio
		};






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

