//
//OBJETIVO:	 Obtencion de factores de transferencia entre medios (VFss, PEF, VF_samb,VF_sesp, VFwamb, VF_wesp, LF, DF_gwsw)
//DESCRIPCION: 	 Este script posee las funciones necesarias para la obtención del Factores de Transferencia entre medios (CMTF: Cross Media Transfer Factors)
//
//
// en general: r=RUN, e=emisor; m=medio;r=receptor;coc=compound of concern
//

function vfss(run,e,m,r,coc){
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
//------------------------------------------------------------------------------
//ASTM Model
//d		Depth of affected soil
//W		Width of source area parallel to groundwater flow direction [m]
//rho_s		Soil bulk density (kg-soil/L-soil)
//U_air		Wind speed above ground surface in ambient mixing zone (m/s)
//delta_air	Ambient air mixing zone height (m)
//D_eff_s	Soil Effective Diffusivity
//H		Henry’s law constant (cm3-H2O)/(cm3-air)
//tau		Averaging time for vapor flux (yr)
//k_s		Soil-water sorption coefficient = foc * koc (g-H2O/g-soil)
//theta_as	Volumetric air content in vadose zone soils (cm3-air/cm3-soil)
	//var Q=
	//var C=e.soil.C
	//var D_eff_s=
	//var H=coc.H
	//var tau=r.tau
	var theta_as=m.theta_as
	var theta_ws=m.theta_ws
	
	var d=e.soil.d
	var W=e.soil.W
	var rho_s=m.soil.rho_s
	var U_air=m.air.u
	var delta_air=m.air.h
	var H=coc.H
	var tau=r.exposure_params.tau
	
	if(run.transport_opts.vfss == "USEPA"){
		//USEPA Q/C Model 1
		VFS=(2*rho_s/(Q/C))*Math.sqrt(D_eff_s*H/(pi*tau*(theta_ws+k_s*rho_s+H*theta_as)))*10e4
	}
	else if (run.transport_opts.vfss == "USEPA Q/C simple"){
    		VFS=rho_s * d / (tau*Q/C) * 10e4
	
	}	
	else if (run.transport_opts.vfss == "ASTM"){
    		VFS= 2*W*rho_s / U_air*delta_air * Math.sqrt( D_eff_s*H /(pi*tau*(theta_ws+ k_s*rho_s + H *theta_as)))*10e3 
	}	
	else if (run.transport_opts.vfss == "ASTM simple"){
    		VFS=W* rho_s*d / (U_air*delta_air*tau) * 10e3
    	}
	else{console.log("No ha sido determinado la opcion para el calculo de VFss");}
	return(VFS);
}
//===================================================================================
//Calculo de PEF (Soil Particulate Emission Factor)
//(suelo --> material particulado)
//
function pef(run,e,m,r,coc){
//V		
//U_m		Surface velocity
//U_t		Threshold velocity
//Q		Flux
//C		Concentration

//P_e		Particulate Emission
//W		Width of affected soil
//U_air		Surface wind velocity
//delta_air	Ambient air mixing zone height (m)

	var P_e=0; 	// Hay que averiguar de donde sale!!
	var W=e.soil.W;
	var U_air=m.air.u;
	var delta_air=m.air.h;
	if (run.transport_opts.pef == "USEPA" ){
    		Fx=1;//F(x)                // esta funcion no dice de donde sale!
    		PEF=(1-V)(U_m/U_t)**3 *  Fx /(Q/C) *10e-5
	}
	else if (run.transport_opts.pef == "ASTM" ){
	    	PEF=P_e*W*10e3 / (U_air*delta_air)
	}
	return(PEF)
} 

//===================================================================================
//Calculo de SubSurface Volatilization Factor
//(VF_samb)
//(sub-surf --> aire ambiente)
//
function vfsamb(run,e,m,r,coc){
//H		Henry's law constant
//rho_s		Soil bulk density [kg/L]
//theta_ws	Volumetric Water Content
//k_s		Soil Water Sorption Coeff.
//theta_as	Volumetric Air Content 
//U_air		Surface Wind Velocity
//delta_air	Mixing Height
//L_s		Depth to subsurface soil sources
//D_eff_s	Effective Soil Difussivity 
//W		Width of affected soil
//d_s		Thickness of affected subsurface soil
//tau		Avg Time for vapor flux [yr]
//
	var U_air=m.air.u
	var delta_air=m.air.h
	var tau=r.exposure_params.tau
	var rho_s=m.soil.rho
	var W=e.soil.W
	var d_s=e.soil.h

	if(run.transport_opts.vfsamb == "normal" ){
	    VF_samb=(H*rho_s)*10e3/( (theta_ws + k_s*rho_s+H*theta_as)* (1 + U_air*delta_air*L_s /(D_eff_s*W)) )
	}
	else if (run.transport_opts.vfsamb == "simple" ){
	     VF_samb=W*rho_s*d_s * (U_air*delta_air*tau)*10e3
	}
	return(VF_samb)
}

//===================================================================================
//Subsurface Soil to Enclosed Space Volatilization Factor 
//(VF sesp )
//(subsurface --> aire encerrado)
//
function vfsesp(run,e,m,r,coc){

//L_B	 Enclosed space volume/infiltration area ratio (m)
//ER	 Enclosed-space air exchange rate (l/s)
	var rho_s=m.soil.rho;
	var d_s=e.soil.h;
	var L_B=0; // ! averiguar dedonde sale
	var ER=r.indoor_params.ER;
	var tau=r.exposure_params.tau

	if(run.transport_opts.vfsesp == "normal" ){

	    t1=(H*rho_s) / (theta_ws+ k_s*rho_s + H *theta_as)
	    t2=D_eff/L_s /ER/L_B
	    t3=1+ (D_eff/L_s/ER/L_B) 
	    t4=D_eff/L_s / (eta*D_eff_crack / L_crack)
	    
		if (Q_s == 0) {
	        	VF_sesp=(t1*t2)/(t3+t4) *10e3
		}
	    	else{
	        	t5=D_eff/L_s /(Q_s/A_b);
	        	VF_sesp=t1*t2*exp(xi)/(exp(xi)+t3+t5*(exp(xi)-1));
		}
	}
	else if (run.transport_opts.vfsesp == "simple"){
	    VF_sesp=rho_s*d_s/(L_B*ER*tau) *10e3
	}
	return VF_sesp;
}

//===================================================================================
//Groundwater Volatilization Factor 
//(VF wamb )
//gw --> gas
//
function VF_wamb(){

	if(run.transport_opts.vfwamb == "" ){
	    VF_wamb=H/(1+(U_air*delta_air*L_GW /(D_eff_ws*W)))*10e3
	}
	
	else if(run.transport_opts.vfwamb == ""){
	//Groundwater to Enclosed Space Volatilization Factor (VF wesp )
	//function CM6a():
	//    //Johnson-Ettinger Model
	//    return(VF_wesp)
	}
	else if(run.transport_opts.vfwamb == ""){
	    //Mass Flux Model
	    VF_wesp=2*w*n*Math.sqrt(D_a*L*v/pi)/(BV*ER)
	}
	return VF_wesp;
}

//===================================================================================
//Soil to Groundwater Leaching Factor 
//(LF)
// soil --> gw

function lf(run,e,m,r,coc){
//I 	Infiltration rate of water through soil (cm/year)
//b	Aquifer saturated thickness

	var rho_s=m.soil.rho;
	var k_s=0;			//averiguar de donde sale
	var H=coc.H;
	var theta_ws=m.soil.theta_w;
	var theta_as=m.soil.theta_a;
	var L1=e.soil.d;
	var L2=e.soil.d_gw + L1;
	var b=m.gw.h;
	var I=m.soil.I;
	var V_gw=m.gw.v;
	var W=e.soil.W;

	    K_sw=rho_s/(theta_ws+k_s*rho_s+H*theta_as)
	    SAM=L1/L2
	    delta_gw=Math.min(b,0.010583*W+b*(1+Math.exp((-I*W)/(V_gw*b))) )
	    LDF=1 + V_gw*delta_gw / (I*W)
	
	LF=K_sw*SAM / LDF
	    
	return LF;
}

//===================================================================================
//Groundwater to Surface Water Dilution Factor
//(DF gwsw )
// gw --> sw
function DF_wgsw(run,e,m,r,coc){
	var Q_sw=m.sw.Q;
	var V_gw=m.gw.v;
	var delta_sw=e.gw.d;
	var W_gwse=m.sw.W;

	DF_gwsw=1/( 1+ Q_sw / (V_gw*delta_sw*W_gwsw) )
	
	return DW_gwsw;
}
	

//===================================================================================
// Linear Sorption/Desorption coeffs:
function k_s(type){
        if(type=="organic"){
            k_s=k_OC*frac_OC
	}
        else{ k_s=k_d}
        return(k_s)
}

//Soil-Water Sorption/Desorption   
//	function CM13(){
	
