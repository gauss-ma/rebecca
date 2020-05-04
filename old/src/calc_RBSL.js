// Calculo de Risk Based Screening Level


//=============================================================================================================================================
//GROUNDWATER PATHWAY:

//Groundwater ingestion:
RBSL_gw= (coc.is_carcinogenic)? ( TR * BW * AT_c * 365 /  (SF_o * EF * ED * IR_w) ) : ( THQ * R*f*D_o * BW * AT * 365 / (EF * ED * IR_w))
// SSTL_wg= RBSL_wg * DAF

//Soil 
RBSL_s= (coc.is_carcinogenic)? ( TR * BW * AT_c * 365 / (SF_o * EF * ED * IR_w * LF) ) : ( THQ * R*f*D_o * BW * AT * 365 / (EF * ED * IR_w * LF )) 
// SSTL_s = RBSL_s * DAF



//=============================================================================================================================================
//SOIL PATHWAY

RBSL_ingest=(coc.is_carcinogenic)? (TR*BW*AT_c*365 / (SF_o*EF*ED*IR_s*RBAF*10e-6)) : (THQ*R*f*D_o*BW*AT_n*365/(EF*ED*IR_s*RBAF*10e-6))

RBSL_dermal=(coc.is_carcinogenic)? (TR*BW*AT_c*365 / (SF_o*EF*ED*SA*M*RAF_d*10e-6)) : (THQ*R*f*D_o*BW*AT_n*365/(EF*ED*SA*M*RAF_d*10e-6))

RBSL_inhal=(coc.is_carcinogenic)? (TR*AT_c*365 / (EF*ED*URF*1000*(vfss+pef))) : (THQ*R*f*C*AT_n/(EF*ED*(vfss+pef)))



RBEL_abgveg=(coc.is_carcinogenic)? (TR*BW*AT_c*365/(SF_o*EF*ED*IR_abg) : (THQ*RfD_o*BW*AT_n*365/(EF*ED*IR_abg)))
RBEL_bgveg=(coc.is_carcinogenic)? (TR*BW*AT_c*365/(SF_o*EF*ED*IR_bg) : (THQ*RfD_o*BW*AT_n*365/(EF*ED*IR_bg)))



LCF=(0.784*10**(-0.434*(Math.log(K_ow-1.78)**2)/2.44) *(0.82+10**(0.95*Math.log(K_ow-2.05))))

RBSL_veg= (coc.organic)? (K_sw / ( RCF*VG_bg / RBEL_bgveg + LCF*VG_abg/RBEL_abgveg ) ) : ( BR_abg /RBEL_abgveg + BR_bg /RBEL_bgveg)

 










RBSL_ss = 1/ ( 1/RBSL_ingest + 1/RBSL_dermal + 1/RBSL_inhal + 1/RBSL_veg )

