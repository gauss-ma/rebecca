// tier 2:  SSTL = RBSL x NAFlt

// Calculo de Site-Specific Target Level (SSTL)
//SSTL	Site-Specific Target Level (allowable COC concentration in source medium)

//Variables:
//
//RBEL  Risk-Based Exposure Limit  (allowable COC concentration in point of exposure)
//POC	Point of compilance
//POE	Point of exposure
//
//ADF	Air Dispersion Factor
//DAF	Diluttion Atenuation Factor (groundwater)
//LAF	Leachate Dilution Factor
//VFss	Volatilization Factor from surfaace soil
//PEF	Particulate Emision Factor
//K_sw	Soil/Water Partition Factor
//WDF	Well Dilution Factor

function calc_SSTL(){

	console.log("Calculando Site-Specific Target Level (SSTL)");

        SSTL={
                gw:0,
                s:0,
                air:0,
		//sw
        }

	SSTL.gw=RBSL.gw/DAF
	SSTL.ss=RBSL.ss
	SSTL.s=RBSL.s/ADF
	//SSTL.sw= AQL*DAF*DF/LF


	return SSTL;
}

//SSTL_soil= RBEL_air * ADF / ( VF_ss + PEF )
//
//SSTL_gw= RBEL_gw * DAF * WDF
//
//SSTL_soil2= RBEL_gw * LDF * DAF * WDF / K_sw
