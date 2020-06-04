//
// Este script posee las funciones necesarias
//para la obtención del NAF (Natural Atenuation Factor)
//
// generalmente: run:corrida, s:source/emisor, m:medio, r:receptor, coc:compuesto of concern


// CROSS-MEDIA ATENUATION FACTORS:
//
//OBJETIVO:	 Obtencion de factores de transferencia entre medios (VFss, PEF, VF_samb,VF_sesp, VFwamb, VF_wesp, LF, DF_gwsw)
//

function vfss(run,s,m,r,coc){
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
//	if(run.transport_opts.vfss == "USEPA"){
//		//USEPA Q/C Model 1
//		VFS=(2*rho_s/(Q/C))*Math.sqrt(D_eff_s*H/(pi*tau*(theta_ws+k_s*rho_s+H*theta_as)))*10e4
//	}
//	else if (run.transport_opts.vfss == "USEPA Q/C simple"){
//		VFS=rho_s * d / (tau*Q/C) * 10e4
//	
//	}	

//------------------------------------------------------------------------------
//ASTM Model

	var W=s.soil.DY                 //Width of source area parallel to groundwater flow direction [m]
	var d=s.soil.DZ			//Depth of affected soil
	var theta_as=m.soil.theta_a     //Volumetric air content in vadose zone soils 
	var theta_ws=m.soil.theta_w
	var rho_s=m.soil.rho_s		//Soil bulk density (kg-soil/L-soil)
	var U_air=m.air.u		//wind speed
	var delta_air=m.air.h_mix	//mixing height
	var H=coc.H			//Henry's law constant
	var tau=r.AT			//Averaging time for vapor flux (yr)
	
	//else if (run.transport_opts.vfss == "ASTM"){
    	  	VFS= 2*W*rho_s / U_air*delta_air * Math.sqrt( D_eff_s*H /(pi*tau*(theta_ws+ k_s*rho_s + H *theta_as)))*10e3 
	//}	
	//else if (run.transport_opts.vfss == "ASTM simple"){
    	//	VFS=W* rho_s*d / (U_air*delta_air*tau) * 10e3
    	//}
	//else{console.log("No ha sido determinado la opcion para el calculo de VFss");}
	return(VFS);
}



//===================================================================================
//Calculo de SubSurface Volatilization Factor
//(VF_samb)
//(sub-surf --> aire ambiente)
//
function vfsamb(run,s,m,r,coc){

	var U_air=m.air.u		//wind vel
	var delta_air=m.air.h_mix	//mixing-height
	var tau=r.AT			//avg time for vapor flux
	var rho_s=m.soil.rho_s		//soil bulk density [kg/L]
	var k_s=m.soil.k_s		//soil water sorption coeff.
	var W=s.soil.DY			//width of affected soil (perpendicular to wind dir)
	var d_s=s.soil.DZ		//thicknes of affected soil
	var H=coc.H;			//Henry's law constant
	var theta_ws=m.soil.theta_w	//soil water content
	var theta_as=m.soil.theta_a	//soil air content
	var L_s=s.soil.z		//Depth of soil from surface
	//if(run.transport_opts.vfsamb == "normal" ){
	//    VF_samb=(H * rho_s)*10e3 /( (theta_ws + k_s*rho_s + H*theta_as)*(1 + U_air*delta_air*L_s/(D_eff_s*W)) )
	//}
	//else if (run.transport_opts.vfsamb == "simple" ){
	    VF_samb= W * rho_s * d_s / (U_air * delta_air * tau) * 10e3
	//}
	return(VF_samb)
}
//===================================================================================
//Groundwater Volatilization Factor 
//(VF wamb )
//gw --> gas
function vfwamb(run,s,m,r,coc){	
//Cair = VFwamb * Cgw
	//ASTM model:
	var H=coc.H			//Henry's Law Constant
	var U_air=m.air.u		//wind velocitiy
	var delta_air=m.air.h_mix	//mixing-height
	var L_GW=s.gw.z			//prof a acuifero
	var W=s.gw.DY
	VF_wamb=H/(1+(U_air*delta_air*L_GW /(D_eff_ws*W)))*10e3
	return(VF_wamb);
}
//===================================================================================
//Calculo de PEF (Soil Particulate Emission Factor)
//(suelo --> material particulado)
//
function pef(run,e,m,r,coc){
//----------------------------------------------------------------------------------
//USEPA:
//V		
//U_m		Surface velocity
//U_t		Threshold velocity
//Q		Flux
//C		Concentration
//if (run.transport_opts.pef == "USEPA" ){
//	Fx=1;//F(x)                // esta funcion no dice de donde sale!
//	PEF=(1-V)(U_m/U_t)**3 *  Fx /(Q/C) *10e-5
//}

//----------------------------------------------------------------------------------
// ASTM:
	var P_e=6.9e-14			 //Particulate Emission (g/cm2, valor conservativo)
	var W=s.surf.DY                  // Width of affected soil
	var U_air=m.air.u;               // Surface wind velocity
	var delta_air=m.air.h_mix;       // Ambient air mixing zone height (m)
	
	//else if (run.transport_opts.pef == "ASTM" ){
	    	PEF=P_e*W*10e3 / (U_air*delta_air)
	//}
	return(PEF)
} 
//Soil to Groundwater Leaching Factor 
//(LF)
// soil --> gw

function lf(run,s,m,r,coc){

	var rho_s=m.soil.rho_s 		//densidad del suelo
	var H=coc.H 			//cte de Henry
	var theta_ws=m.soil.theta_w 	//contenido de agua
	var theta_as=m.soil.theta_a 	//contenido de aire
	var L1=s.soil.DZ		//grosor de suelo afectado
	var L2=m.soil.h - s.soil.z 	//desdeel tope del suelo afectado hasta gw.
	var b=m.gw.h 			//grosor del acuifero
	var I=m.soil.I 			//infiltracion (cm/yr)
	var V_gw=m.gw.v 		//velocidad del acuifero
	var W=s.soil.DY 		//ancho de suelo afectado

	    //Ksw=rho_s/(theta_ws+k_s*rho_s+H*theta_as)
	    SAM=L1/L2
	    delta_gw=Math.min(b,0.010583*W+b*(1+Math.exp((-I*W)/(V_gw*b))) )
	    LDF=1 + V_gw*delta_gw / (I*W)
	
	LF=Ksw*SAM / LDF
	    
	return(LF);
}


//Soil-Water Partition Factor (Ksw)
function Ksw(run,s,m,r,coc){
	var rho_s=m.soil.rho_s;
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
function dfwgsw(run,s,m,r,coc){
	var Q_sw=m.sw.Q;
	var V_gw=m.gw.v;
	var delta_sw=m.gw.h;
	var W_gwsw=s.gw.DY

	DF_gwsw=1/( 1+ Q_sw / (V_gw*delta_sw*W_gwsw) )
	
	return(DF_gwsw)
}

//===================================================================================
//===================================================================================
// I N D O O R :
//Subsurface Soil to Enclosed Space Volatilization Factor 
//(VF sesp )
//(subsurface --> aire encerrado)
//
function vfsesp(run,s,m,r,coc){

//L_B	 Enclosed space volume/infiltration area ratio (m)
//ER	 Enclosed-space air exchange rate (l/s)
	  var rho_s=m.soil.rho_s;
	  var d_s=s.soil.h;
	  var L_B=0; // ! averiguar dedonde sale
	  var ER=1.0 //indoor_params.ER;
	  var tau=r.AT

	////if(run.transport_opts.vfsesp == "normal" ){

	//    t1=(H*rho_s) / (theta_ws+ k_s*rho_s + H *theta_as)
	//    t2=D_eff/L_s /ER/L_B
	//    t3=1+ (D_eff/L_s/ER/L_B) 
	//    t4=D_eff/L_s / (eta*D_eff_crack / L_crack)
	//    
	//	if (Q_s == 0) {
	//        	VF_sesp=(t1*t2)/(t3+t4) *10e3
	//	}
	//    	else{
	//        	t5=D_eff/L_s /(Q_s/A_b);
	//        	VF_sesp=t1*t2*exp(xi)/(exp(xi)+t3+t5*(exp(xi)-1));
	//	}
	//}
	//else if (run.transport_opts.vfsesp == "simple"){
	    VF_sesp=rho_s*d_s/(L_B*ER*tau) *10e3
	//}
	return VF_sesp;
}

//Groundwater Volatilization Factor (INDOOR)
function vfwesp(run,e,m,r,coc){
	var rho_s=m.soil.rho_s;
        var d_s=s.soil.h;
        var L_B=0; // ! averiguar dedonde sale
        var ER=1.0//indoor_params.ER;
        var BV=1.0//indoor_params.BV;
        var tau=r.AT;
	var L=1.0//indoor_params.L
	var w=1.0//indoor_params.w
	var v=m.gw.v_s
	var D_a=coc.D_w	//coef de diff aparente (no se de donde sale)
	var n=m.gw.theta
	//if(run.transport_opts.vfwamb == "Johnson-Ettinger"){
	//Groundwater to Enclosed Space Volatilization Factor (VF wesp )
	//function CM6a():
	//    //Johnson-Ettinger Model
	//    return(VF_wesp)
	//}
	//else if(run.transport_opts.vfwamb == "mass flux"){
	    //Mass Flux Model
	    VF_wesp=2*w*n*Math.sqrt(D_a*L*v/pi)/(BV*ER)
	//}
	return VF_wesp;
}

//===================================================================================
//===================================================================================














































//========================================================================================//
// LATERAL TRANSPORT FACTORS (eqs LT-1  and LT-2)

function daf(run,e,m,r,coc){
//Equation LT- 1: Lateral Groundwater Dilution Attenuation Factor
//Variables:
//C(x)_i      Concentration of constituent i at distance x downstream of source (mg/L) or (mg/m3)
//C_si        Concentration of constituent i in Source Zone 		      	(mg/L) or (mg/m3)
//BC i        Biodegradation capacity available for constituent i
//BC T        Total biodegradation capacity of all electron acceptors in groundwater
//C(ea) n     Concentration of electron acceptor n in groundwater
//UF_n        Utilization factor for electron acceptor n (i.e.,mass ratio of electron acceptor to hydrocarbo consumed in biodegradation reaction)
//y           Lateral distance from centre of source (cm)
//z           Vertical distance below top of source (cm)
//alpha_x     Longitudinal groundwater dispersivity (cm)
//alpha_y     Transverse groundwater dispersivity (cm)
//alpha_z     Vertical groundwater dispersivity (cm)
//lambda_i    First-order degradation rate (day-1) for constituent i
//nu          Groundwater seepage velocity (cm/day)
//K           Hydraulic conductivity (cm/day) 685
//theta_e     Effective soil porosity
//i           Hydraulic gradient (cm/cm) 
//R i         Constituent retardation factor 
//k_s         Soil-water sorption coefficient = foc * koc (g-k s H2O/g-soil)
//S w         Source width (m) 
//rho_s       Soil bulk density (g-soil/cm3-soil) 1.7
	var K=m.gw.k_s
	var i=m.gw.i
	var theta_e=m.soil.theta
	var rho_s=m.soil.rho_s
	var y=0;
	var z=0;
	var alpha_x=m.gw.sigma_x
	var alpha_y=m.gw.sigma_y
	var alpha_z=m.gw.sigma_z
	var lambda=coc.lambda
	var S_w=s.gw.DX
	var S_d=s.gw.DZ
	var nu=m.gw.v_s
	
	var x=r.offsite1.gw_dist

	//if (run.transport_opts.daf=="simple"){
	    //LT-1a: Solute Transport with First-Order Decay:
	    v=K*i/theta_e;
	    R_i=1+k_s*rho_s/theta_e

	    phi_x=0.25*Math.exp((x/2*alpha_x)*(1-Math.sqrt(1+(4*lambda*alpha_x*R_i /v))))
	    phi_y=erf((y+S_w*0.5)/2*Math.sqrt(alpha_y*x))-erf((y-S_w*0.5)/2*Math.sqrt(alpha_y*x))
	    phi_z=erf((y+S_d)/2*Math.sqrt(alpha_z*x))-erf((y-S_d)/2*Math.sqrt(alpha_z*x))
	    return(1/(phi_x*phi_y*phi_z))
	//}
	//else if(run.transport_opts.daf=="biodegradation"){
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
function adf(run,e,m,r,coc){
//Variables:
//Uair        Wind Speed (m/sec) 
//sigma_y     Transverse air dispersion coefficient (cm)
//sigma_z     Vertical air dispersion coefficient (cm)
//y_air       Lateral distance from source zone (cm) 2.25
//z_air       Height of breathing zone (assumed equal to δ air)
//A           Cross-sectional area of air emissions source (m2)
//L           Length of air emission source parallel to wind direction (m)
//delta_air   Ambient air mixing zone height (m) 2
	var U_air=m.air.u
	var x=r.offsite1.air_dist
	
	var sigma_y=Math.sqrt(2*x*m.air.sigma_y / U_air)
	var sigma_z=Math.sqrt(2*x*m.air.sigma_z / U_air)
	var y=0;
	var z=0;
	var A=s.surf.DY
	var L=s.surf.DX
	var delta_air=m.air.h_mix

	    Q=U_air*delta_air*A/L
	    M=Q/(2*pi*U_air*sigma_y*sigma_z)
	    phi_y=Math.exp(-0.5*y*y/(sigma_y*sigma_y))
	    phi_z= Math.exp(-0.5*(z-delta_air)**2 /(2*sigma_z*sigma_z)) + Math.exp(-0.5*(z+delta_air)**2 /(2*sigma_z*sigma_z)) 
	
	    return(M*phi_y*phi_z)
}



