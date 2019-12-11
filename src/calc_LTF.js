//
// Este script posee las funciones necesarias
//para la obtención del NAF (Natural Atenuation Factor)
//

//========================================================================================//
// Lateral Transport Factors (eqs LT-1  and LT-2)

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


	function LT1a(){
	    //LT-1a: Solute Transport with First-Order Decay:
	    v=K*i/theta_e;
	    R_i=1+k_s*rho_s/theta_e
	    phi_x=0.25*exp((x/2*alpha_x)*(1-sqrt(1+(4*lambda_i*alpha_x*R_i /v))))
	    phi_y=erf((y+S_w*0.5)/2*sqrt(alpha_y*x))-erf((y-S_w*0.5)/2*sqrt(alpha_y*x))
	    phi_z=erf((y+S_d)/2*sqrt(alpha_z*x))-erf((y-S_d)/2*sqrt(alpha_z*x))
	    return(C_si*phi_x*phi_y*phi_z)
	}
	
	function LT1b(){
	    //Solute Transport with Biodegradation by Electron-Acceptor Superposition Method
	    Ci=BC_T*C_si/sum(C_si)
	    BC_T=sum(C(ea)_n/UF_n)
	    //DAF = C_si /C(x,y,z)i
	
	    phi_x=0.25*(C_si+BC_i)
	    phi_y=erf((y+S_w*0.5 )/(2*sqrt(alpha_y*x)))-erf((y-S_w*0.5 )/(2*sqrt(alpha_y*x)))
	    phi_z=erf((z+S_d*0.5 )/(2*sqrt(alpha_z*x)))-erf((z-S_d*0.5 )/(2*sqrt(alpha_z*x)))
	    
	    return(phi_x*phi_y*phi_z-BC_i)
	}
//Equation LT-2: Lateral Air Dispersion Factor
//
//Variables:
//Uair        Wind Speed (m/sec) 
//sigma_y     Transverse air dispersion coefficient (cm)
//sigma_z     Vertical air dispersion coefficient (cm)
//y_air       Lateral distance from source zone (cm) 2.25
//z_air       Height of breathing zone (assumed equal to δ air)
//A           Cross-sectional area of air emissions source (m2)
//L           Length of air emission source parallel to wind direction (m)
//delta_air   Ambient air mixing zone height (m) 2


	function LT2(){
	    Q=U_air*delta_air*A/L
	    M=Q/(2*pi*U_air*sigma_y*sigma_z)
	    phi_y=exp(-0.5*y_air*y_air/(sigma_y*sigma_y))
	    phi_z= exp(-0.5*(z_air-delta_air)**2 /(s*sigma_z*sigma_z)) + exp(-0.5*(z_air+delta_air)**2 /(s*sigma_z*sigma_z)) 
	
	    return(M*phi_y*phi_z)
	}
