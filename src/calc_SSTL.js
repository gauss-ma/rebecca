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


//SSTL_soil= RBEL_air * ADF / ( VF_ss + PEF )
//
//SSTL_gw= RBEL_gw * DAF * WDF
//
//SSTL_soil2= RBEL_gw * LDF * DAF * WDF / K_sw
