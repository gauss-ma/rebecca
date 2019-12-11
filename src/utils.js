//
//Constantes
const pi=Math.PI
const rho_a=1.225	//densidad aire [kg/m3]
const rho_w=1.0e3	//densidad agua [kg/m3]
const eta_a=1.81e-7	//viscosidad aire [Pa s]
const eta_w=8.90e-4 	//viscosidad agua [Pa s]
const g=9.81		//accel. gravedad [m/s2]
	
//
//Funciones útiles:

function factorial(n){
	if ( n==0 ){ return 1; }
	else {return n * factorial(n-1); }
};

function sum(array){
	return array.reduce(function(valorAnterior, valorActual, indice, vector){
  	return valorAnterior + valorActual;});
};

function erf(z){
	N=25
	serie=[]
	for (n=0; n<N; n++) {
	serie.push(Math.pow(-1,n)*Math.pow(z,(2*n+1))/(factorial(n)*(2*n+1)));
	};	
	return 2/Math.sqrt(Math.PI) * sum(serie);
};

