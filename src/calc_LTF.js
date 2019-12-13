//
// Este script posee las funciones necesarias
//para la obtención del NAF (Natural Atenuation Factor)
//
// generalmente: run:corrida, e:emisor, m:medio, r:receptor, coc:compuesto of concern
//========================================================================================//
// Lateral Transport Factors (eqs LT-1  and LT-2)

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
	var rho_s=m.soil.rho
	var y=0;
	var z=0;
	var alpha_x=m.gw.sigma_x
	var alpha_y=m.gw.sigma_y
	var alpha_z=m.gw.sigma_z
	var lambda=coc.lambda
	var S_w=e.gw.W
	var S_d=e.gw.d
	var nu=m.gw.v_s
	
	var x=r.offsite1.gw_dist

	if (run.transport_opts.daf=="simple"){
	    //LT-1a: Solute Transport with First-Order Decay:
	    v=K*i/theta_e;
	    R_i=1+k_s*rho_s/theta_e

	    phi_x=0.25*Math.exp((x/2*alpha_x)*(1-Math.sqrt(1+(4*lambda*alpha_x*R_i /v))))
	    phi_y=erf((y+S_w*0.5)/2*Math.sqrt(alpha_y*x))-erf((y-S_w*0.5)/2*Math.sqrt(alpha_y*x))
	    phi_z=erf((y+S_d)/2*Math.sqrt(alpha_z*x))-erf((y-S_d)/2*Math.sqrt(alpha_z*x))
	    return(1/(phi_x*phi_y*phi_z))
	}
	else if(run.transport_opts.daf=="biodegradation"){
	   // //Solute Transport with Biodegradation by Electron-Acceptor Superposition Method
	   // Ci=BC_T*C_si/sum(C_si)
	   // BC_T=sum(C(ea)_n/UF_n))
	   // //DAF = C_si /C(x,y,z)i
	
	   // phi_x=0.25*(C_si+BC_i)
	   // phi_y=erf((y+S_w*0.5 )/(2*Math.sqrt(alpha_y*x)))-erf((y-S_w*0.5 )/(2*Math.sqrt(alpha_y*x)))
	   // phi_z=erf((z+S_d*0.5 )/(2*Math.sqrt(alpha_z*x)))-erf((z-S_d*0.5 )/(2*Math.sqrt(alpha_z*x)))
	   // 
	   // return(phi_x*phi_y*phi_z-BC_i)
	}
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
	var z=1.25;
	var A=e.air.A
	var L=e.air.L
	var delta_air=m.air.h

	    Q=U_air*delta_air*A/L
	    M=Q/(2*pi*U_air*sigma_y*sigma_z)
	    phi_y=Math.exp(-0.5*y*y/(sigma_y*sigma_y))
	    phi_z= Math.exp(-0.5*(z-delta_air)**2 /(2*sigma_z*sigma_z)) + Math.exp(-0.5*(z+delta_air)**2 /(2*sigma_z*sigma_z)) 
	
	    return(M*phi_y*phi_z)
	}
