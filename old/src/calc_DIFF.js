//===================================================================================
//Diffusion Coeffs:
function calc_diff_coefs(m,r,coc){
	//m:medio ; r:receptor ; coc:compound of concern


	//Eff. diff in vadose zone soil
	D_eff_s=coc.D_a*(m.soil.theta_a**(3.33)/(m.soil.theta**2))+(coc.D_w/coc.H)*(m.soil.theta_w*3.33/(m.soil.theta**2))
	
	//Eff. diff in the capillary zone:
	D_eff_cap=coc.D_air*((m.soil.theta_cz**3.33)/(m.soil.theta**2)) + (coc.D_w/coc.H)*((m.soil.theta_cz**3.33)/(m.soil.theta**2))
	
	//Eff. diff above the water table.
	D_eff_ws=(m.soil.h_zc+m.soil.h)*(1/(m.soil.h_cz/D_eff_cap + m.soil.h/D_eff_s))
	
	//Eff. diff. through foundation cracks
	//theta_w_crack=r.indoor_params.theta_w
	//theta_a_crack=r.indoor_params.theta_a
	//D_eff_crack=D_air*((theta_a_crack**3.33)/(m.soil.theta**2))+(coc.D_w/coc.H)*((theta_a_crack**3.33) / (m.soil.theta**2))
}

//===================================================================================
//Convective air flow through fundation crack
//function calc_flow_through_fundation_cracks(){
//	var eta=r.indoor_params.fcf;
//	var dp = r.indoor.dp_io;
//
//	// Q_s=2*pi*dp*k_v*X_crack/(mu_a *log(2*Z_crack*X_crack/A_b*eta))
//
//	// xi=Q_s/A_b/((D_eff_crack/L_crack)*eta)
//}
