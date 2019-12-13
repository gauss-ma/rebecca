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
	run=new CORRIDA();
		run.metadatos={
        	        sitio:"Nowhereland",
        	        ubicacion:"Nowhere",
        	        autor:"Nowhereman",
        	        fecha:"01-01-2019",
        	        id:"12345" };
		run.tier=2;
		run.direccion="both"; //fwd bwd both
		run.risks=2;
		run.transport_opts.vfss="ASTM";
		run.transport_opts.pef="ASTM";
		run.transport_opts.vfsamb="simple";
		run.transport_opts.vfsesp="simple";

	//Receptores y vias de exposición.
	r=new RECEPTOR();
		r.pathways.gw_ingestion=true;
		r.type="residential"

	//COCs
	coc=new COC();
		//c.set("contaminante"); //si "contaminante" existe ya està, sino hay que especificarle todos los parametros.


	//Fuente: 
	s=new FUENTE();
		s.gw.C=1.3e-2	//concentracion de COC en la fuente.


	//Medio:
	m=new MEDIO();		//(site-specific parameters)


	//Calc. coefs de difussion y conveccion
	calc_diff_coefs(m,r,coc)

	//Calcular factores de transferencia:
	run.vfss=vfss(run,s,m,r,coc);
	run.pef=pef(run,s,m,r,coc);
	run.vfsamb=vfsamb(run,s,m,r,coc);
	run.vfsesp=vfsesp(run,s,m,r,coc);
	run.lf=lf(run,s,m,r,coc);
}

