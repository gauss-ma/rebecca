// tier 1:  REVISAR ESTOS CALCULOS! 

function calc_RBSL(){
	AT = (coc.is_carc) ? (365*70) : (365*r.ED)

//=============================================================================================================================================
// Calculo de Risk Based Screening Level (RBSL)
//		RBSL = RBEL x NAFcm
//	donde:
//		RBEL= TR / E * SF   (carc)
//		RBEL= THQ*RfD / E   (no carc)
// Entiendo que son los niveles aceptables basados en los riesgos.
	RBSL={
		gw:0,
		ss:0,
		s:0,
		//sw:
	}

SF=coc.SF_o*1e6	     //SF_o    [kgdia/mg]    
RfDo=coc.RfDo*1e-6   //RfDo    [mg/kgdia ]   
RfDi=coc.RfDi*1e-6   //RfDi    [mg/m3    ]   
URFi=coc.URFi*1e9    //URFi    [m3/ug] 	     
ED=r.ED	//yr
EF=r.EF	//dia/yr
BW=r.BW	//kg
AT = (coc.is_carc) ? (365*r.ATc) : (365*r.ED)

// --------------------------------------------------------------------------------------------------------------------------------------------
//GROUNDWATER PATHWAY:

CR=r.IRw*1e3	//L/dia 
E=CR*EF*ED/(BW*AT)

//Ingestion de agua de pozo:
RBSL.gw= (coc.is_carc)? (TR/(E*SF)) : (THQ*RfDo/E)
// SSTL_wg= RBSL_wg * DAF
NAFcm=1/LF

//Ingestion de agua de pozo lixiviada desde suelo: 
RBSL.s= RBSL.gw*NAFcm 
// SSTL_s = RBSL_s * DAF

// --------------------------------------------------------------------------------------------------------------------------------------------
//SOIL PATHWAY
	//ingesta directa de suelo
CR=r.IRs*1e6	//IRs[mg/día] 
E=CR*EF*ED/(AT*BW)
	RBSL_ingest=(coc.is_carc)? (TR /(SF*E*coc.BA)) : (THQ*RfDo/(E*coc.BA))
	//contacto dermico
CR=r.SA*r.M	//m2
E=CR*EF*ED/(AT*BW)
	RBSL_dermal=(coc.is_carc)? (TR/ (E*SF*coc.ads_derm)) : (THQ*RfDo/(E*coc.ads_derm))
	//inhalación
E=EF*ED/AT
NAFcm=1/(VFss+PEF)
	RBSL_inhal=(coc.is_carc)? (TR*NAFcm/(E*URFi)) : (THQ*RfDi*NAFcm/E)
	//ingesta de  vegetacion plantadas en suelo contaminado (solo para receptor residencial)
CR=r.IRag
E=CR*EF*ED/(AT*BW)
	  RBEL_ag=(coc.is_carc)? (TR/E*SF) : (THQ*RfDo/E)
CR=r.IRbg
E=CR*EF*ED/(AT*BW)
	  RBEL_bg=(coc.is_carc)? (TR/E*SF) : (THQ*RfDo/E)

VG_ag=1.0	//factores de correcion
VG_bg=1.0	//factores de correcion
	  RCF=0.82+10**(0.77*Math.log(coc.Kow)-1.52)
	  LCF=(0.784*10**(-0.434*((Math.log(coc.Kow)-1.78)**2)/2.44) *(0.82+10**(0.95*(Math.log(coc.Kow)-2.05))))

	RBSL_veg= (coc.organic)? (Ksw / ( RCF*VG_bg / RBEL_bg + LCF*VG_ag/RBEL_ag ) ) : ( coc.theta_ag /RBEL_ag + coc.theta_bg /RBEL_bg)

RBSL.ss = 1/ ( 1/RBSL_ingest + 1/RBSL_dermal + 1/RBSL_inhal)// + 1/RBSL_veg )
//SSTL_ss = RBSL_ss  (receptor=fuente)
// --------------------------------------------------------------------------------------------------------------------------------------------
// AIR PATHWAY

E=EF*ED/(AT)
//volatiliz de suelo
NAFcm=1/VFsamb
RBSL.s=(coc.is_carc)?(TR*NAFcm/(E*URFi)):(THQ*RfDi*NAFcm/E);

//volatiliz de gw
NAFcm=1/VFwamb
RBSL.gw=(coc.is_carc)?(TR*NAFcm/(E*URFi)):(THQ*RfDi/E);

	return (RBSL)
}
