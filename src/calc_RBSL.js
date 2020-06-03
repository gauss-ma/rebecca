// tier 1:  

function calc_RBSL(){
	
	LF=lf(run,s,m,r,coc)
	VFsamb=vfsamb(run,s,m,r,coc)
	VFwamb=vfwamb(run,s,m,r,coc)
	VFss=vfss(run,s,m,r,coc)
	PEF=pef(run,s,m,r,coc)
	// Risk Based Exposure Límit (RBEL):
	//RBEL= (coc.is_carcniogenic)? (TR/(E*SF)) : (THQ*RfD/E)
	
	//TR  = target risk (input)
	TR=1.0e-5
	//THQ = target hazard quotient (input)
	THQ=1.0e0
	//SF  = slope-factor (COC)
	//RfD = ref. dose (COC)
	//E   = exposure  (input ó DB)
	//E   =	CR * EF * ED / (BW * AT)
	//	     EF * ED / AT
	AT = (coc.is_carc) ? (365*70) : (365*r.ED)

URF=1.0// UNIT RISK FACTOR (NO SE DE DONDE SALE)
//=============================================================================================================================================
// Calculo de Risk Based Screening Level (RBSL)
//		RBSL = RBEL x NAFcm
//	Entiendo que son los niveles aceptables basados en los riesgos.
	RBSL={
		gw: 0,
		ss: 0,
		s:  0,
		air:0,//RBSL_sw
	}
// --------------------------------------------------------------------------------------------------------------------------------------------
//GROUNDWATER PATHWAY:

//Ingestion de agua de pozo:
RBSL.gw= (coc.is_carc)? ( TR * r.BW * r.ATc * 365 /  (coc.SF_o * r.EF * r.ED * r.IRw) ) : ( THQ * coc.RfDo * r.BW * r.AT * 365 / (r.EF * r.ED * r.IRw))
// SSTL_wg= RBSL_wg * DAF

//Ingestion de agua de pozo lixiviada desde suelo: 
RBSL.gw= RBSL.gw / LF
// SSTL_s = RBSL_s * DAF

// --------------------------------------------------------------------------------------------------------------------------------------------
//SOIL PATHWAY
//ingesta directa
VG_ag=1.0	//factores de correcion
VG_bg=1.0	//factores de correcion
K_sw=0.1	//soil-lechate partition factor
	RBSL_ingest=(coc.is_carc)? (TR*r.BW*r.ATc*365 / (coc.SF_o*r.EF*r.ED*r.IRs*coc.BA*10e-6)) : (THQ*coc.RfDo*r.BW*r.AT*365/(r.EF*r.ED*r.IRs*coc.BA*10e-6))
	//dermica
	RBSL_dermal=(coc.is_carc)? (TR*r.BW*r.ATc*365 / (coc.SF_o*EF*ED*SA*M*coc.ads_derm*10e-6)) : (THQ*coc.RfDo*r.BW*AT*365/(r.EF*r.ED*r.SA*r.M*coc.ads_derm*10e-6))
	//inhalación
	RBSL_inhal=(coc.is_carc)? (TR*r.ATc*365 / (r.EF*r.ED*URF*1000*(vfss+pef))) : (THQ*coc.RfDi*r.AT/(r.EF*r.ED*(VFss+PEF)))
	//ingesta de  vegetacion plantadas en suelo contaminado (solo para receptor residencial)
	  RBEL_ag=(coc.is_carc)? (TR*r.BW*r.ATc*365/(SF_o*r.EF*r.ED*r.IRag)) : (THQ*coc.RfDo*r.BW*r.AT*365/(r.EF*r.ED*r.IRbg))
	  RBEL_bg=(coc.is_carc)? (TR*r.BW*r.ATc*365/(SF_o*EF*ED*r.IRbg)) : (THQ*coc.RfDo*r.BW*r.AT*365/(r.EF*r.ED*r.IRbg))
	  LCF=(0.784*10**(-0.434*((Math.log(coc.Kow)-1.78)**2)/2.44) *(0.82+10**(0.95*(Math.log(coc.Kow)-2.05))))
	RBSL_veg= (coc.organic)? (K_sw / ( RCF*VG_bg / RBEL_bg + LCF*VG_ag/RBEL_ag ) ) : ( coc.theta_ag /RBEL_ag + coc.theta_bg /RBEL_bg)

RBSL.ss = 1/ ( 1/RBSL_ingest + 1/RBSL_dermal + 1/RBSL_inhal)// + 1/RBSL_veg )
//SSTL_ss = RBSL_ss  (receptor=fuente)
// --------------------------------------------------------------------------------------------------------------------------------------------
// AIR PATHWAY

//volatiliz de suelo
RBSL.s=(coc.is_carc)?(TR*r.ATc*365/(r.EF*r.ED*URF*1000*VFsamb)):(THQ*coc.RfDi*r.AT*365/(r.EF*r.ED*VFsamb));

//volatiliz de gw
RBSL.s=(coc.is_carc)?(TR*r.ATc*365/(r.EF*r.ED*URF*1000*VFwamb)):(THQ*coc.RfDi*r.AT*365/(r.EF*r.ED*VFwamb));

	return (RBSL)
}
