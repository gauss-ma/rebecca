// -----------------------------
// Calculo de exposición
exposicion_opt="MLE"  //MLE: Most Likely Exposure 
		      //RME: Rasonable Maximum Exposure

//(CR) : Contact Rate
//(EF) : Exposure Frequency
//(ED) : Exposure Duration
//(BW) : Body Weight
//(SA) : Surface Area Contact
//(AF) : Adherence Factor
//(DA) : COC adherence factor
//(AT) : Average Time (non-carcinogenico: ED*365; carcinogenico ED*365*70)
	
	var CR=r.exp_params.IRw
	var EF=r.exp_params.EF
	var ED=r.exp_params.ED
	var BW=r.exp_params.BW
	var AT=(coc.is_carcino) ? (365*70) : (365*ED)
        this.E.gw=CR*EF*ED/(BW*AT)	//ingestion agua

	CR=r.exp_params.IRs
	EF=r.exp_params.EF
	ED=r.exp_params.ED
	BW=r.exp_params.BW
	AT = (coc.is_carcino) ? (365*70) : (365*ED)
        this.E.soil= CR*EF*ED/(BW*AT)	//ingestion suelo
	
	EF=r.exp_params.EF
	ED=r.exp_params.ED
	AT= (coc.is_carcino) ? (365*70) : (365*ED)
	this.E.air= EF*ED/(AT)			//inhalación
	
	CR=r.exp_params.M*r.exp_params.SA * coc.DA
        EF=r.exp_params.EFd
        ED=r.exp_params.ED
        BW=r.exp_params.BW
        AT= (coc.is_carcino) ? (365*70) : (365*ED)
	this.E.soil2=CR*EF*ED/ (BW*AT)		//dermal
        


	this.E.sw1=(r.IRs * r.swED + r.SA * COC.ABSd ) * (r.swEF * r.swED) / ( r.BW * r.AT )  //swimming
        


	this.E.sw2=(r.fshIR * r.fshIntake * COC.BCF * r.fshED) / (r.BW * r.AT)     //fish ingestion






//Source Medium: The source medium is the value supplied by the user in the Constituents of Concern page. 
	src_med_soil=s.soil.C
	src_med_ssfc=s.ssfc.C
	src_med_gw  =s.fw.C
	src_med_air =s.air.C

//NAF Value: The natural attenuation factor for transport of COCs from one medium to another.
	naf_air=calc_NAF(s,m)
	naf_gw =calc_NAF(s,m)

//Exposure Medium: Concentration in the exposure medium, as calculated by dividing the Source Medium concentration by the NAF value. For soil pathways, there is no NAF, and the exposure medium concentration is the same concentration as the source medium.

	exp_medium_air=
	exp_medium_gw=
	exp_medium_soil=src_med_soil

//Exposure Multiplier:
//	a) Groundwater: Calculated by the equation (Ingestion Rate x Exposure Frequency xExposure Duration) / (Body Weight x Averaging Time).
//	b) Surface Water: Calculated by the equations:
//		Swimming-((Ingestion Rate x Exposure Time) + (Skin Surface Area x Dermal Absorption Factor)) x Number of Events x Exposure Duration) / (Body weight x Averaging time)
//		Fish ingestion-((Ingestion Rate x Fish Intake x Bioconcentration Factor x Exposure Duration) / (Body weight x Averaging time)
//	c/d) Outdoor and Indoor Air: Calculated by the equation
//		(Exposure frequency x Exposure duration) / (Averaging time x 365 days)
//	e) Soil: The exposure multiplier is a combined multiplier for the ingestion/dermal contact and vegetable consumption pathways.
//
function EXPMULT(r){
	this.gw=r.IRw * r.EF * r.ED / ( r.BW * r.AT )
	this.sw=(r.IRs * r.swED + r.SA * COC.ABSd ) * (r.swEF * r.swED) / ( r.BW * r.AT )  //swiming
	this.sw=(r.fshIR * r.fshIntake * COC.BCF * r.fshED) / (r.BW * r.AT)	//fish ingestion
	this.air= r.EF * r.ED / (r.AT * 356)
	this.soil= r.IRs * r.EF * r.ED /  (r.BW * r.AT)  

}

//Average Daily Intake Rate/Average Inhalation Exposure Concentration: Calculated by multiplying the Exposure Medium by Exposure Multiplier.
	avg_daily_intake =  exp_mult * exp_medium
//Is Carcinogenic: The carcinogenicity of the chemical, as specified in the Chemical Toxicity Database.
	is_carcinogenic=COC.is_carcinogenic

//Reference Dose (RD) (soil/gw/sw): The oral and dermal reference doses for the chemical, as specified in the Chemical Toxicity Database.
	rd_soil=COC.rd_soil	
	rd_gw=COC.rd_gw	
	rd_sw=COC.rd_sw

//Slope Factor (SF)  (soil/gw/sw): The oral and dermal slope factors for the chemical, as specified in the Chemical Toxicity Database.
	sf_soil=COC.ref_dose_soil	
        sf_gw=COC.ref_dose_gw	
        sf_sw=COC.ref_dose_sw


//Inhalation Reference Concentration (air pathways): The inhalation reference concentration for the chemical, as specified in the Chemical Toxicity Database.
	irc_air=COC.irc

//Inhalation Unit Risk Factor (air pathways): For carcinogens, the unit risk factor for the chemical, as specified in the Chemical Toxicity Database.
	inhalationUnitRisk_air=COC.iurf	//Inhalation Equivalent Unit Risk Factor

//Intake Rates:
//	a) Groundwater: Maximum Pathway Intake: The maximum Average Daily Intake rate for Soils Leaching to Groundwater Ingestion and Groundwater Ingestion.
//	b) Surface Water Maximum Pathway Intake: Taking the maximum of the Average Daily Intake rate for the Soils Leaching to Groundwater/Discharge to Surface Water/Dermal Contact and Ingestion Via Swimming, Soils Leaching to Groundwater/Discharge to Surface Water/Fish Consumption, and Soils Leaching to Groundwater/Discharge to Surface Water/Fish Consumption pathways.
//	c/d) Outdoor and Indoor Air Total Pathway Exposure: Sum of the average inhalation exposure concentrations for the surface soil, subsurface soil, and groundwater vapor inhalation concentrations. 
//	e) Soil Total Carcinogenic Intake Rate: Combined intake rate for ingestion/dermal contact and vegetable consumption, for carcinogens. 


//Total Toxicant Intake Rate: Combined intake rate for ingestion/dermal contact and vegetable consumption, for systemic toxicants.
//



//Individual COC Risk: 
//	a) Groundwater: Calculated by multiplying the maximum carcinogenic intake rate by the oral slope factor. 
//	b) Surface Water: Calculated by multiplying the maximum intake rate by the slope factor, then adding the risks for dermal and oral exposure.
//	c/d) Outdoor and Indoor Air: Calculated by multiplying the maximum carcinogenic exposure by the unit risk factor.
//	e) Soil: Calculated by multiplying the total carcinogenic intake rate by the slope factor.




//Hazard Quotient: 
//	a) Groundwater: Calculated by multiplying the maximum toxicant intake rate by the oral reference dose.
//	b) Surface Water: Calculated by dividing the maximum toxicant intake rate by the reference, then adding the quotients for dermal and oral exposure.
//	c/d) Outdoor and Indoor Air: Calculated by dividing the total toxicant exposure by the inhalation reference concentration. 
//	e) Soil: Calculated by dividing the total toxicant intake rate by the reference dose.




