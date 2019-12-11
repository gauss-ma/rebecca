//
//OBJETIVO:	 Obtencion de factores de transferencia entre medios (VFss, PEF, VF_samb,VF_sesp, VFwamb, VF_wesp, LF, DF_gwsw)
//DESCRIPCION: 	 Este script posee las funciones necesarias para la obtención del Factores de Transferencia entre medios (CMTF: Cross Media Transfer Factors)
//

//===================================================================================
//Calculo de VFss (Surface Soil Volatillization Factor)
//(suelo --> gas)
//------------------------------------------------------------------------------
//USEPA Q/C 
//rho_s		Soil bulk density (kg-soil/L-soil)
//Q		Surface water flow rate
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
function VF_ss(){
	if(run.model_opts.vfss == "USEPA"){
		//USEPA Q/C Model 1
		VFS=(2*rho_s/(Q/C))*sqrt(D_eff_s*H/(pi*tau*(theta_ws+k_s*rho_s+H*theta_as)))*10e4
	}
	else if (run.model_opts.vfss == "USEPA Q/C simple"){
    		VFS=rho_s * d / (tau*Q/C) * 10e4
	
	}	
	else if (run.model_opts.vfss == "ASTM"){
    		VFS= 2*W*rho_s / U_air*delta_air * sqrt( D_eff_s*H /(pi*tau*(theta_ws+ k_s*rho_s + H *theta_as)))*10e3 
	}	
	else if (run.model_opts.vfss == "ASTM simple"){
    		VFS=W* rho_s*d / (U_air*delta_air*tau) * 10e3
    	}
	else{console.log("No ha sido determinado la opcion para el calculo de VFss");}
	return(VFS);
}
//===================================================================================
//Calculo de PEF (Soil Particulate Emission Factor)
//(suelo --> material particulado)
//
//V		
//U_m		Surface velocity
//U_t		Threshold velocity
//Q		Flux
//C		Concentration

//P_e		Particulate Emission
//W		Width of affected soil
//U_air		Surface wind velocity
//delta_air	Ambient air mixing zone height (m)

function PEF(){
	if (run.model_opts.pef == "" ){
    		Fx=F(x)                // esta funcion no dice de donde sale!
    		PEF=(1-V)(U_m/U_t)**3 *  Fx /(Q/C) *10e-5
	}
	else if (run.model_opts.pef == "" ){
	    	PEF=P_e*W*10e3 / (U_air*delta_air)
	}
	return(PEF)
} 

//===================================================================================
//Calculo de SubSurface Volatilization Factor
//(VF_samb)
//(sub-surf --> aire ambiente)
//
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
function VF_samb(){

	if(run.model_opts.vfsamb == "" ){
	    VF_samb=(H*rho_s)*10e3/( (theta_ws + k_s*rho_s+H*theta_as)* (1 + U_air*delta_air*L_s /(D_eff_s*W)) )
	}
	else if (run.model_opts.vfsamb == "" ){
	     VF_samb=W*rho_s*d_s * (U_air*delta_air*tau)*10e3
	}
	return(VFsamb)
}

//===================================================================================
//Subsurface Soil to Enclosed Space Volatilization Factor 
//(VF sesp )
//(subsurface --> aire encerrado)
//
function VF_sesp(){
	if(run.model_opts.vfsesp == "" ){

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
	else if (run.model_opts.vfsesp == ""){
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

	if(run.model_opts.vfwamb == "" ){
	    VF_wamb=H/(1+(U_air*delta_air*L_GW /(D_eff_ws*W)))*10e3
	}
	
	else if(run.model_opts.vfwamb == ""){
	//Groundwater to Enclosed Space Volatilization Factor (VF wesp )
	//function CM6a():
	//    //Johnson-Ettinger Model
	//    return(VF_wesp)
	}
	else if(run.model_opts.vfwamb == ""){
	    //Mass Flux Model
	    VF_wesp=2*w*n*sqrt(D_a*L*v/pi)/(BV*ER)
	}
	return VF_wesp;
}

//===================================================================================
//Soil to Groundwater Leaching Factor 
//(LF)
// soil --> gw

function LF(){

	    K_sw=rho_s / (theta_ws+k_s*rho_s+H*theta_as)
	    SAM=L1/L2
	    delta_gw=min( b , 0.010583*W+b(1+exp((-I*W)/(V_gw*b))) )
	    LDF=1 + V_gw*delta_gw / (I*W)
	
	LF=K_sw*SAM / LDF
	    
	return LF;
}

//===================================================================================
//Groundwater to Surface Water Dilution Factor
//(DF gwsw )
// gw --> sw

function DF_wgsw(){
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
	
