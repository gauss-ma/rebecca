// =============================
//  R   E   B   E   C   C   A	
// -----------------------------
// sample run.
//
//Objetivo: evaluar riesgos de base.
//

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


	//Receptores y vias de exposición.
	//
	r=new RECEPTOR();
		r.pathways.gw_ingestion=true;
		r.type="residential"

	//COCs
	//
	c=new COC();
		//c.set("contaminante"); //si "contaminante" existe ya està, sino hay que especificarle todos los parametros.


	//Fuente: 
	//
	s=new FUENTE();
		s.gw.C=1.3e-2	//concentracion de COC en la fuente.


	//Medio:
	//
	m=new MEDIO();		//(site-specific parameters)




	//Compounds Of Concern (COCs)
	//
	//COC_list = new COCs();
	//	COC_list.addCOC("","","","","",) ....

}

