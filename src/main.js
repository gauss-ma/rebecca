// =============================
//  R   E   B   E   C   C   A	
// -----------------------------
// sample run.
//
//Objetivo final: evaluar riesgos de base.
//
//Objetivo inmediato: calcular naf

function main(){

	//Config. de la corrida:
	//
	//run=new CORRIDA();
	run.metadatos={
                sitio:"Nowhereland",
                ubic:"Nowhere",
                autor:"Nowhereman",
                fecha:"01-01-2019",
                id:"12345" };
	run.tier=2;
	run.direccion="both"; //fwd bwd both
	run.risks=2;
	run.decaimiento=T;
	run.future_time=0;
	
	//opciones de transporte
	transp_opts.vfss="ASTM";
	transp_opts.pef="ASTM";
	transp_opts.vfsamb="simple";
	transp_opts.vfsesp="simple";
	transp_opts.vfwamb="mass flux"
	transp_opts.adf="simple";
	transp_opts.daf="simple";
	
	//Fuente: 
	s=new FUENTE();
		s.gw.C=1.3e-2	//concentracion de COC en la fuente.

	//Medio:
	m=new MEDIO();		//(site-specific parameters)

	//Receptores y vias de exposición.
	r=new RECEPTOR();
		r.pathways.gw_ingestion=true;
		r.type="residential"
	
	//COCs
	coc=new COC();
		//c.set("contaminante"); //si "contaminante" existe ya està, sino hay que especificarle todos los parametros.


	//Calc. coefs de difussion y conveccion
	calc_diff_coefs(m,r,coc)

	//Calcular factores de transferencia:
	run.vfss=vfss(run,s,m,r,coc);
	run.pef=pef(run,s,m,r,coc);
	run.vfsamb=vfsamb(run,s,m,r,coc);
	run.vfsesp=vfsesp(run,s,m,r,coc);
	run.vfwamb=vfwamb(run,s,m,r,coc);
	run.vfwesp=vfwesp(run,s,m,r,coc);
	run.lf=lf(run,s,m,r,coc);
	run.dfwgsw=dfwgsw(run,s,m,r,coc)
	//Calcular factores de transporte lateral:
	run.daf=daf(run,s,m,r,coc);
	run.adf=adf(run,s,m,r,coc);

	//Calcular NAF
	run.naf.air=run.adf/(run.vfss+run.pef) + (run.adf/run.vfsamb) + 1/run.vfsesp + adf/run.wamb + 1/run.vfwesp
        run.naf.gw=run.daf/run.lf  + run.daf + 1/run.dfgwsw





}

