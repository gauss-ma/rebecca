//
// Este script posee las funciones necesarias
//para la obtención del NAF (Natural Atenuation Factor)
//
// generalmente: config:corrida, s:source/emisor, m:medio, r:receptor, coc:compuesto of concern


// CROSS-MEDIA ATENUATION FACTORS:
//
//OBJETIVO:	 Obtencion de factores de transferencia entre medios (VFss, PEF, VF_samb,VF_sesp, VFwamb, VF_wesp, LF, DF_gwsw)
//

function vfss(config,s,m,r,coc){
//===================================================================================
//Calculo de VFss (Surface Soil Volatillization Factor)
//(suelo --> gas)
//------------------------------------------------------------------------------
//USEPA Q/C 
//rho_s		Soil bulk density (kg-soil/L-soil)
//Q		
//C		Concentration of contaminant
//D_eff_s	Soil Effective Diffusivity
//H		Henry’s law constant (cm3-H2O)/(cm3-air)
//tau		Averaging time for vapor flux (yr)
//theta_as	Volumetric air content in vadose zone soils (cm3-air/cm3-soil)
//theta_ws	Volumetric water content in vadose zone soils (cm3-H2O/cm3-soil)
//	if(config.transport_opts.vfss == "USEPA"){
//		//USEPA Q/C Model 1
//		VFS=(2*rho_s/(Q/C))*Math.sqrt(D_eff_s*H/(pi*tau*(theta_ws+k_s*rho_s+H*theta_as)))*1e4
//	}
//	else if (config.transport_opts.vfss == "USEPA Q/C simple"){
//		VFS=rho_s * d / (tau*Q/C) * 1e4
//	
//	}	

//------------------------------------------------------------------------------
//ASTM Model
	var W=s.soil.DY                 //[m] Width of source area parallel to groundwater flow direction [m]
	var d=s.soil.DZ			//[m] Depth of affected soil
	var rho_s=m.soil.rho_s		//[kg/m3] Soil bulk density (kg-soil/L-soil)
	var theta_as=m.soil.theta_a     //[-]Volumetric air content in vadose zone soils 
	var theta_ws=m.soil.theta_w	//[-]
	var U_air=m.air.u		//[m/s]wind speed
	var delta_air=m.air.h_mix	//[m]mixing height
	var H=coc.H			//Henry's law constant
	var tau=r.AT*60*60*24*365			//Averaging time for vapor flux (yr)
	//k_s=soil-water sorption coef	[m3/kg]

	//else if (config.transport_opts.vfss == "ASTM"){
    	  	VF_ss= 2*W*rho_s / U_air*delta_air * Math.sqrt( D_eff_s*H /(pi*tau*(theta_ws+ k_s*rho_s + H *theta_as)))
	//}	
	//else if (config.transport_opts.vfss == "ASTM simple"){
    	//	VFS=W* rho_s*d / (U_air*delta_air*tau) * 1e3
    	//}
	//else{console.log("No ha sido determinado la opcion para el calculo de VFss");}
	return(VF_ss);
}



//===================================================================================
//Calculo de SubSurface Volatilization Factor
//(VF_samb)
//(sub-surf --> aire ambiente)
//
function vfsamb(config,s,m,r,coc){

	var U_air=m.air.u		//wind vel
	var delta_air=m.air.h_mix	//mixing-height
	var tau=r.AT*60*60*24*365	//avg time for vapor flux
	var rho_s=m.soil.rho_s		//soil bulk density [kg/L]
	var k_s=m.soil.k_s		//soil water sorption coeff.
	var W=s.soil.DY			//width of affected soil (perpendicular to wind dir)
	var d_s=s.soil.DZ		//thicknes of affected soil
	var H=coc.H 			//Henry's law constant
	var theta_ws=m.soil.theta_w	//soil water content
	var theta_as=m.soil.theta_a	//soil air content
	var L_s=s.soil.z		//Depth of soil from surface
	//if(config.transport_opts.vfsamb == "normal" ){
	//    VF_samb=(H * rho_s)*10e3 /( (theta_ws + k_s*rho_s + H*theta_as)*(1 + U_air*delta_air*L_s/(D_eff_s*W)) )
	//}
	//else if (config.transport_opts.vfsamb == "simple" ){
	    VF_samb= W * rho_s * d_s / (U_air * delta_air * tau) 
	//}
	return(VF_samb)
}
//===================================================================================
//Groundwater Volatilization Factor 
//(VF wamb )
//gw --> gas
function vfwamb(config,s,m,r,coc){	
//Cair = VFwamb * Cgw
	//ASTM model:
	var H=coc.H			//Henry's Law Constant
	var U_air=m.air.u		//wind velocitiy
	var delta_air=m.air.h_mix	//mixing-height
	var Lgw=s.gw.z			//prof a acuifero
	var W=s.gw.DY
	VF_wamb=H/(1+(U_air*delta_air*Lgw/(D_eff_ws*W)))
	return(VF_wamb);
}
//===================================================================================
//Calculo de PEF (Soil Particulate Emission Factor)
//(suelo --> material particulado)
//
function pef(config,e,m,r,coc){
//----------------------------------------------------------------------------------
//USEPA:
//V		
//U_m		Surface velocity
//U_t		Threshold velocity
//Q		Flux
//C		Concentration
//if (config.transport_opts.pef == "USEPA" ){
//	Fx=1;//F(x)                // esta funcion no dice de donde sale!
//	PEF=(1-V)(U_m/U_t)**3 *  Fx /(Q/C) *10e-5
//}

//----------------------------------------------------------------------------------
// ASTM:
	var P_e=6.9e-13		 //kg/m3 Particulate Emission 6.9e-14(g/cm2), valor conservativo)
	var W=s.surf.DY                  // Width of affected soil
	var U_air=m.air.u;               // Surface wind velocity
	var delta_air=m.air.h_mix;       // Ambient air mixing zone height (m)
	
	//else if (config.transport_opts.pef == "ASTM" ){
	    	PEF=P_e*W / (U_air*delta_air)
	//}
	return(PEF)
} 
//Soil to Groundwater Leaching Factor 
//(LF)
// soil --> gw

function lf(config,s,m,r,coc){

	var rho_s=m.soil.rho_s 		//densidad del suelo
	var H=coc.H 			//cte de Henry
	var theta_ws=m.soil.theta_w 	//contenido de agua
	var theta_as=m.soil.theta_a 	//contenido de aire
	var L1=s.soil.DZ		//grosor de suelo afectado
	var L2=m.soil.h - s.soil.z 	//desdeel tope del suelo afectado hasta gw.
	var I=m.soil.I*1e-2/(365*60*60*24)	//infiltracion (cm/yr)
	var V_gw=m.gw.v 		//velocidad del acuifero
	var W=s.soil.DY 		//ancho de suelo afectado
	var b=m.gw.h 			//grosor del acuifero

	    SAM=L1/L2
	    delta_gw=Math.min(b,0.010583*W+b*(1+Math.exp((-I*W)/(V_gw*b))) )
	    LDF=1 + V_gw*delta_gw / (I*W)
	
	LF=Ksw*SAM / LDF
	    
	return(LF);
}


//Soil-Water Partition Factor (Ksw)
function ksw(config,s,m,r,coc){
	var rho_s=m.soil.rho_s 
	var H=coc.H 			//cte de Henry  
        var theta_ws=m.soil.theta_w 	//contenido de agua
        var theta_as=m.soil.theta_a 	//contenido de aire
	 
	Ksw=rho_s/(theta_ws+k_s*rho_s+H*theta_as)

	return(Ksw)
}

//===================================================================================
//Groundwater to Surface Water Dilution Factor
//(DF gwsw )
// gw --> sw
function dfwgsw(config,s,m,r,coc){
	var Q_sw=m.sw.Q;
	var V_gw=m.gw.v;
	var delta_sw=m.gw.h;
	var W_gwsw=s.gw.DY

	DF_gwsw=1/( 1+ Q_sw / (V_gw*delta_sw*W_gwsw) )
	
	return(DF_gwsw)
}

////===================================================================================
////===================================================================================
//// I N D O O R :
////Subsurface Soil to Enclosed Space Volatilization Factor 
////(VF sesp )
////(subsurface --> aire encerrado)
////
//function vfsesp(config,s,m,r,coc){
//
////L_B	 Enclosed space volume/infiltration area ratio (m)
////ER	 Enclosed-space air exchange rate (l/s)
//	  var rho_s=m.soil.rho_s;
//	  var d_s=s.soil.h;
//	  var L_B=0; // ! averiguar dedonde sale
//	  var ER=1.0 //indoor_params.ER;
//	  var tau=r.AT*60*60*24*365
//
//	////if(config.transport_opts.vfsesp == "normal" ){
//
//	//    t1=(H*rho_s) / (theta_ws+ k_s*rho_s + H *theta_as)
//	//    t2=D_eff/L_s /ER/L_B
//	//    t3=1+ (D_eff/L_s/ER/L_B) 
//	//    t4=D_eff/L_s / (eta*D_eff_crack / L_crack)
//	//    
//	//	if (Q_s == 0) {
//	//        	VF_sesp=(t1*t2)/(t3+t4) *10e3
//	//	}
//	//    	else{
//	//        	t5=D_eff/L_s /(Q_s/A_b);
//	//        	VF_sesp=t1*t2*exp(xi)/(exp(xi)+t3+t5*(exp(xi)-1));
//	//	}
//	//}
//	//else if (config.transport_opts.vfsesp == "simple"){
//	    VF_sesp=rho_s*d_s/(L_B*ER*tau) *1e3
//	//}
//	return VF_sesp;
//}
//
////Groundwater Volatilization Factor (INDOOR)
//function vfwesp(config,e,m,r,coc){
//	var rho_s=m.soil.rho_s;
//        var d_s=s.soil.h;
//        var L_B=0; // ! averiguar dedonde sale
//        var ER=1.0//indoor_params.ER;
//        var BV=1.0//indoor_params.BV;
//        var tau=r.AT*60*60*24*365;
//	var L=1.0//indoor_params.L
//	var w=1.0//indoor_params.w
//	var v=m.gw.v_s
//	var D_a=coc.D_w	//coef de diff aparente (no se de donde sale)
//	var n=m.gw.theta
//	//if(config.transport_opts.vfwamb == "Johnson-Ettinger"){
//	//Groundwater to Enclosed Space Volatilization Factor (VF wesp )
//	//function CM6a():
//	//    //Johnson-Ettinger Model
//	//    return(VF_wesp)
//	//}
//	//else if(config.transport_opts.vfwamb == "mass flux"){
//	    //Mass Flux Model
//	    VF_wesp=2*w*n*Math.sqrt(D_a*L*v/pi)/(BV*ER)
//	//}
//	return VF_wesp;
//}
//
//===================================================================================
//===================================================================================






//========================================================================================//
// LATERAL TRANSPORT FACTORS (eqs LT-1  and LT-2)

function daf(x,config,e,m,r,coc){
//Equation LT- 1: Lateral Groundwater Dilution Attenuation Factor
	var K=m.gw.k_s   //[m/s] Hydraulic conductivity (cm/day)
	var i=m.gw.i		    //[-]  Hydraulic gradient (cm/cm) 
	var theta_e=m.gw.theta      //[-] Effective soil porosity
	var rho_s=m.soil.rho_s      //[kg/m3] rho_s       Soil bulk density 
	var y=0;		    //[m] 
	var z=0;		    //[m] 
	var alpha_x=m.gw.sigma_x    //[m] alpha_x  Longitudinal groundwater dispersivity (cm)
	var alpha_y=m.gw.sigma_y    //[m] alpha_y  Transverse groundwater dispersivity (cm)
	var alpha_z=m.gw.sigma_z    //[m] alpha_z  Vertical groundwater dispersivity (cm)
	var lambda=1/coc.lambda_s/(60*60*24)
	var S_w=m.gw.Y		    //[m] Source width
	var S_d=m.gw.Z		    //[m] Source depth
	var nu=m.gw.v_s/(60*60*24)  //[m/day] Groundwater seepage velocity (cm/day)
	//var v=m.gw.v
	//if (config.transport_opts.daf=="simple"){
	    //LT-1a: Solute Transport with First-Order Decay:
	    v=K*i/theta_e;
	    //v=nu;
	    R_i=1+k_s*rho_s/theta_e

	    phi_x=0.25*Math.exp((0.5*x/alpha_x)*(1-Math.sqrt(1+(4*lambda*alpha_x*R_i/v))))
	    phi_y=erf((y+S_w*0.5)*0.5/Math.sqrt(alpha_y*x))-erf((y-S_w*0.5)*0.5/Math.sqrt(alpha_y*x))
	    phi_z=erf((z+S_d)*0.5/Math.sqrt(alpha_z*x))-erf((z-S_d)*0.5/Math.sqrt(alpha_z*x))
	    return(phi_x*phi_y*phi_z)
	//}
	//else if(config.transport_opts.daf=="biodegradation"){
		//C(x)_i      Concentration of constituent i at distance x downstream of source (mg/L) or (mg/m3)
		//C_si        Concentration of constituent i in Source Zone 		      	(mg/L) or (mg/m3)
		//BC i        Biodegradation capacity available for constituent i
		//BC T        Total biodegradation capacity of all electron acceptors in groundwater
		//C(ea) n     Concentration of electron acceptor n in groundwater
		//UF_n        Utilization factor for electron acceptor n (i.e.,mass ratio of electron acceptor to hydrocarbo consumed in biodegradation reaction)
		//y           Lateral distance from centre of source (cm)
		//z           Vertical distance below top of source (cm)
		//lambda_i    First-order degradation rate (day-1) for constituent i
		//R i         Constituent retardation factor 
		//k_s         Soil-water sorption coefficient = foc * koc (g-k s H2O/g-soil)
	   // //Solute Transport with Biodegradation by Electron-Acceptor Superposition Method
	   // Ci=BC_T*C_si/sum(C_si)
	   // BC_T=sum(C(ea)_n/UF_n))
	   // //DAF = C_si /C(x,y,z)i
	
	   // phi_x=0.25*(C_si+BC_i)
	   // phi_y=erf((y+S_w*0.5 )/(2*Math.sqrt(alpha_y*x)))-erf((y-S_w*0.5 )/(2*Math.sqrt(alpha_y*x)))
	   // phi_z=erf((z+S_d*0.5 )/(2*Math.sqrt(alpha_z*x)))-erf((z-S_d*0.5 )/(2*Math.sqrt(alpha_z*x)))
	   // 
	   //return(phi_x*phi_y*phi_z-BC_i)
	//}
}

//Equation LT-2: Lateral Air Dispersion Factor
//
function adf(x,config,e,m,r,coc){
//sigma_y     Transverse air dispersion coefficient (cm)
//sigma_z     Vertical air dispersion coefficient (cm)
	var U_air=m.air.u			// Wind Speed (m/sec) 
	
	var sigma_y=Math.sqrt(2*x*m.air.sigma_y / U_air)
	var sigma_z=Math.sqrt(2*x*m.air.sigma_z / U_air)
	var y=0;			//[m]
	var z=0;			//[m]
	var A=s.surf.DY			//[m2]	area o emision source
	var L=s.surf.DX			//[m]	length of source parallel to wind
	var delta_air=m.air.h_mix	//[m]	mixing height

	    Q=U_air*delta_air*A/L
	    M=Q/(2*pi*U_air*sigma_y*sigma_z)
	    phi_y=Math.exp(-0.5*y*y/(sigma_y*sigma_y))
	    phi_z= Math.exp(-0.5*(z-delta_air)**2 /(2*sigma_z*sigma_z)) + Math.exp(-0.5*(z+delta_air)**2 /(2*sigma_z*sigma_z)) 
	
	    return(M*phi_y*phi_z)
}


