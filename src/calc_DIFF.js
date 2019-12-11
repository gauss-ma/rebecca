//===================================================================================
//Diffusion Coeffs:
//Eff. diff in vadose zone soilds-
D_eff_s=D_air*(theta_as**(3.33)/(theta_T**2))+(D_wat/H)*(theta_ws*3.33/(theta_T**2))

//Eff. diff above the water table.
D_eff_ws=(h_c+h_v)*(1/(h_c/D_eff_cap + h_v/D_eff_s))

//Eff. diff. through foundation cracks
D_eff_crack=D_air*((theta_acrack**3.33)/(theta_T**2))+(D_wat/H)*((theta_acrack**3.33)/theta_T**2)

//Eff. diff in the capillary zone:
D_eff_cap=D_air*((theta_acrack**3.33)/theta_T**2)+ (D_wat/H)*((theta_acrack**3.33)/theta_T**2)

//===================================================================================
//Convective air flow through fundation carck
Q_s=2*pi*deltap*k_v*X_crack/(eta_a *log(2*Z_crack*X_crack/A_b*eta))

xi=Q_s/A_b/((D_eff_crack/L_crack)*eta)

