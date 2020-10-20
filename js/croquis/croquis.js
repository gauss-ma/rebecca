//DAT.GUI Parameters
run={} 
run.src={surf:false,soil:false,gw:false}

    run.pathways={
          veg_ingestion:false,
    gw_ingestion:false,
        sw_swimming:false,
        sw_fishing:false,
    volatilizacion:false,
    lixiviacion:false,
    }
    s={
       surf:{
            z:0.0 ,
            DX:12. , //[m]largo
            DY:12. , //[m]ancho
            DZ:1. , //[m]espesor
            C: 0.   //[mg/m3]concentración
       },
       soil:{
            z: 3. , //[m]profundidad (desde la superficie)
            DX:12. , //[m]largo
            DY:12. , //[m]ancho
            DZ:2. , //[m]espesor
            C: 0.   //[mg/m3]
       },
       gw:{
            z :8. , //[m]profundidad (desde la superficie)
            DX:12. , //[m]largo
            DY:12. , //[m]ancho
            DZ:3. , //[m]espesor
            C: 0.   //[mg/m3]
       }
    };

m={}            //(site-specific parameters)
        m.soil={
            h:5.0,             //   [m]     grosor total
            h_zc: 0.05,        //   [m]     grossor de zona capilar
            theta:0.38,        //   [-]     porosidad
            theta_w:0.15,      //   [-]     contenido de agua volumetrico
            theta_a:0.23,      //   [-]     contenido de aire volumetrico
            theta_a_zc:0.342,  //   [-]     contenido de aire volumetrico en zona capilar
            theta_w_zc:0.038,  //   [-]     contenido de agua volumetrico en zona capilar
            rho_s:1700,         //  [kg/m3]  densidad 
            k_s:864,           //   [cm/d]  conductividad hidraulica vertical 
            k_v:1e-12,         //   [m2]    permeabilidad de vapor 
            I:30.0,            //   [cm/yr] Infiltracion neta 
            fOC:0.01,          //   [-]     frac organica todo el perfil
            fOC_zc:0.02,       //   [-]     frac organica zona capilar
            pH:6.8             //   [-]     pH
            };
        m.gw={
            h:8.0,             //  [m]     grosor del acuifero
            k_s:2.5*1e-6,      //  [m/s]  cond hidraulica saturada
            i:1e-2,            //  [-]     gradiente hidraulico
            theta:0.38,        //  [-]     porosidad effectiva
            v:0.2,             //  [m/d]  velocidad de Darcy
            v_s:0.66,          //  [m/-]  velocidad especifica (v/theta)
            fOC:1e-3,          //  [-]     fracc organica
            pH:6.2,            //  [-]     pH
            sigma_x:40,        //   [m]     dispersividad.x
            sigma_y:10,        //  [m]     dispersividad.y
            sigma_z:0.01,      //  [m]     dispersividad.z
            Y:240,             //[m] ancho de acuifero
            Z:6,               //[m] grosor de acuifero
            };
        m.air={
            h_mix:2.0,         //   [m]     altura de zona de mezcla
            u:2.25,            //   [m/s]    velocidad del viento
            sigma_y:1.0,       //   [  ]    dispersividad
            sigma_z:1.0
            }
        m.sw={
            Q:20,           //   [m3/s]  Caudal río 
            A:10,
}



// ESCENA
var scene = new THREE.Scene();
    
var canvasWidth=$("#miCanvas").innerWidth();
var canvasHeight=$("#miCanvas").innerHeight();
    // CAMARA
    var camera = new THREE.PerspectiveCamera(25, window.innerWidth/window.innerHeight, .1, 500) //params: zoom, ratioW/H, near, far
    //var camera = new THREE.PerspectiveCamera(50, canvasWidth/canvasHeight, .1, 500) //params: zoom, ratioW/H, near, far
    camera.position.set(50,20,50);
scene.position.y=m.soil.h+3;
    camera.lookAt(scene.position);
    
    // RENDERER
    var renderer = new THREE.WebGLRenderer({canvas:miCanvas});
    renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.9);
    //renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0xf7f7f7);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//CONTROL
var controls = new THREE.OrbitControls( camera, renderer.domElement );


    // EJES VECTORES
    var axis = new THREE.AxesHelper(1);
    scene.add(axis);

    
////// Grilla
    //var grid = new THREE.GridHelper(10,1);
    //scene.add(grid);
    

//meter texto:
    //var spritey = makeTextSprite( " Churros ", 
//		{ fontsize: 20, textColor: {r:20,g:20,b:20,a:0.8}} );
//spritey.position.set(5,5,5);
//scene.add( spritey );
    
    
    











//Materiales:

  var soilMaterial = new THREE.MeshLambertMaterial({color:0xf6ecd8,opacity:0.8,transparent:true});
  var gwMaterial = new THREE.MeshLambertMaterial({color:0xbbd9e3, opacity:0.8, transparent:true});
//var soilMaterial = new THREE.MeshStandardMaterial({
    //			color: 0xf6ecd8,
    //			opacity: 0.8, 
    //			transparent: true, 
    //			// Quedan feos... pero para un mat "realista", se deberían usar varios mapas.
    //			map: new THREE.TextureLoader().load('texture/Dirt_005_COLOR.jpeg'),
    //			normalMap: new THREE.TextureLoader().load('texture/Dirt_005_NORM.jpg'),
    //			roughnessMap: new THREE.TextureLoader().load('texture/Ground_Dirt_005_ROUGH.jpg'),
    //			displacementMap: new THREE.TextureLoader().load('texture/Ground_Dirt_005_DISP.png'),
    //			aoMap: new THREE.TextureLoader().load('texture/Ground_Dirt_005_OCC.jpg'),
    //		});
    //var gwMaterial = new THREE.MeshPhongMaterial({ color: 0xbbd9e3, 
    //	specular: 0xfffffff, 
    //	opacity: 0.8, 
    //	transparent: true, 
    //	map: new THREE.TextureLoader().load('texture/Draw_water.png'),
    //	// normalMap: new THREE.TextureLoader().load('texture/Water-normal.jpg'),
    //
    //
    //});
 var arrowMaterial = new THREE.MeshPhongMaterial({ color: 0xbbd9e3,                       
     specular: 0xfffffff, 
     opacity: 0.8, 
     transparent: true, 
     map: new THREE.TextureLoader().load('js/croquis/texture/arrow_down.png'),
     normalMap: new THREE.TextureLoader().load('js/croquis/texture/arrow_down.png'),
 
 
 });
    var srcMaterial = new THREE.MeshLambertMaterial({ color: 0xff3300 });

    var pozo1Material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var pozo2Material = new THREE.MeshLambertMaterial({ color: 0xbbd9e3 });
    var edifMaterial = new THREE.MeshLambertMaterial({ color: 0xf7d6a1 });

var linea = new THREE.LineBasicMaterial( { color: 0x202020 } ) 
var cultivoMaterial = new THREE.MeshPhongMaterial({ color: 0xbbd9e3, 
        specular: 0xfffffff, 
        opacity: 0.8, 
        transparent: true, 
        map: new THREE.TextureLoader().load('js/croquis/texture/cultivo.png'),
        // normalMap: new THREE.TextureLoader().load('texture/Water-normal.jpg'),
    
    
    });







//Objetos:
    //Piso
    var planeGeo = new THREE.PlaneGeometry(20,30,10);
    var planeMaterial = new THREE.MeshLambertMaterial({color:0xded9c6});
    var piso = new THREE.Mesh(planeGeo,planeMaterial);
    piso.receiveShadow = true;
    scene.add(piso);
    piso.rotation.x = -.5*Math.PI;
                                                                         
    // Esfera
    //var geometry = new THREE.SphereGeometry( 10, 32, 32 );
    //var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    //var sphere = new THREE.Mesh( geometry, material );
    //sphere.position.x=6;
    //sphere.position.y=-3;
    //sphere.position.z=7;
    //scene.add( sphere );

  //SUELO
  var sueloGeo = new THREE.BoxGeometry(20,m.soil.h,30);
  var suelo = new THREE.Mesh(sueloGeo, soilMaterial);
var sueloEdges = new THREE.EdgesGeometry( sueloGeo );
var sueloLine = new THREE.LineSegments( sueloEdges, linea);
var SUELO = new THREE.Group();
SUELO.add( suelo );
SUELO.add( sueloLine );
scene.add( SUELO );
  SUELO.position.set(0,-suelo.geometry.parameters.height*0.5- 0.01,0);


//GROUNDWATER
  var groundwaterGeo = new THREE.BoxGeometry(20,m.gw.h,30);
  var groundwater = new THREE.Mesh(groundwaterGeo,gwMaterial);
var groundwaterEdges = new THREE.EdgesGeometry( groundwaterGeo );
    var groundwaterLine = new THREE.LineSegments( groundwaterEdges, linea);
    var GROUNDWATER = new THREE.Group();
    GROUNDWATER.add( groundwater );
    GROUNDWATER.add( groundwaterLine );
    scene.add( GROUNDWATER );
  GROUNDWATER.position.set(0,-groundwater.geometry.parameters.height-groundwater.geometry.parameters.height*0.5,0);

// SRC ss
    var surfGeo = new THREE.BoxGeometry(1,1,1);
    var surf = new THREE.Mesh(surfGeo,srcMaterial);
    surf.position.set(0,-s.surf.DZ*0.5,0);
    scene.add(surf);

// SRC soil
    var soilGeo = new THREE.BoxGeometry(1,1,1);
    var soil = new THREE.Mesh(soilGeo,srcMaterial);
    soil.position.set(0,-s.soil.z - s.soil.DZ*0.5,0);
    scene.add(soil);

// SRC gw
    var gwGeo = new THREE.BoxGeometry(1,1,1);
    var gw = new THREE.Mesh(gwGeo,srcMaterial);
    gw.position.set(0, - s.gw.z - s.gw.DZ *0.5,0);
    scene.add(gw);


//POZO
    var pozoGeo0 = new THREE.BoxGeometry(0.6,0.4,0.6);
    var pozoGeo1 = new THREE.CylinderGeometry( .12, .12, m.soil.h*1.1, 10 );
    var pozoGeo2 = new THREE.CylinderGeometry( .12, .12, m.soil.h*0.5, 10 );
    var pozo0 = new THREE.Mesh( pozoGeo0, pozo1Material );
    var pozo1 = new THREE.Mesh( pozoGeo1, pozo1Material );
    var pozo2 = new THREE.Mesh( pozoGeo2, pozo2Material );
    pozo0.position.set(-3,0,suelo.geometry.parameters.depth*0.5);
    pozo1.position.set(pozo0.position.x,-pozo1.geometry.parameters.height*0.4,pozo0.position.z);
    pozo2.position.set(pozo1.position.x,pozo1.position.y-pozo1.geometry.parameters.height*0.5-pozo2.geometry.parameters.height*0.5,pozo0.position.z);
    scene.add( pozo0 );
    scene.add( pozo1 );
    scene.add( pozo2 );
    //pozoLabel
    var pozoLabel = makeTextSprite( "Pozo", { fontsize: 20, textColor: {r:20,g:20,b:20,a:0.8}, borderColor: {r:50,g:0,b:0,a:1} } );
    pozoLabel.position.set(pozo0.position.x, pozo0.position.y, pozo0.position.z);
    scene.add( pozoLabel );

//Edificio

    var edifGeo = new THREE.BoxGeometry(.8,0.6,1.);
    var edificio = new THREE.Mesh( edifGeo, edifMaterial );
    scene.add( edificio );
    edificio.castShadow = true;
    edificio.position.y=edificio.geometry.parameters.height*0.5
    //edificioLabel
    var edificioLabel = makeTextSprite( "Edificio", { fontsize: 20, textColor: {r:20,g:20,b:20,a:0.8}} );
            edificioLabel.position.set(edificio.position.x, edificio.position.y, edificio.position.z);
            scene.add( edificioLabel );
//rio
    //Curva de Bezier
    var curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(  1, 0,  10 ),
        new THREE.Vector3( -6, 0, 2.8 ),
        new THREE.Vector3(  9, 0,   9 ),
        new THREE.Vector3( -1, 0, -10 )
    );
    var points = curve.getPoints(101 );
//var geometry = new THREE.BufferGeometry().setFromPoints( points );
//var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
//var curveObject = new THREE.Line( geometry, material );
//scene.add(curveObject);
    //Plano:
    var wd = .3, hg = .1, width_segments =1, height_segments = 100;
    var plane = new THREE.PlaneGeometry(wd, hg, width_segments, height_segments);
    //le doy coordenadas x z al plano siguiendo la curva
    for (var i=0; i<plane.vertices.length*0.5; i++) {
        pos=2*i
        plane.vertices[pos+1].x = points[i].x  
        plane.vertices[pos].x = points[i].x+1.1-i*0.005
    
        plane.vertices[pos].y =0.01 ;
        plane.vertices[pos+1].y =0.01;

        plane.vertices[pos].z = points[i].z     
        plane.vertices[pos+1].z = points[i].z
    }

var rio = new THREE.Mesh(plane, new THREE.MeshLambertMaterial({color: 0x0088ff}));
scene.add(rio);

// Cultivo
var cultivoGeo = new THREE.PlaneGeometry(4,5,10);
//var cultivoMaterial = new THREE.MeshLambertMaterial({color:0x00ff00});
var cultivo = new THREE.Mesh(cultivoGeo,cultivoMaterial);
cultivo.rotation.x = -.5*Math.PI;
cultivo.position.y=0.01
scene.add(cultivo);
//flecha lixiviacion
var planeGeo = new THREE.PlaneGeometry(1,2,1);
//var arrowMaterial = new THREE.MeshLambertMaterial({color:0x00ff00});
var LixiviacionFlecha = new THREE.Mesh(planeGeo,arrowMaterial);
scene.add(LixiviacionFlecha);
LixiviacionFlecha.position.y=-m.soil.h;
LixiviacionFlecha.position.x=suelo.geometry.parameters.width*0.5;
LixiviacionFlecha.position.z=0;suelo.geometry.parameters.depth*0.5;


    // Luces
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-15,30,50);
    spotLight.castShadow = true;
    scene.add(spotLight);
var light = new THREE.AmbientLight( 0x606060 ); // soft white light
scene.add( light );



    // Agregar a canvas
    //document.body.appendChild( renderer.domElement );
    // Renderizar
    renderer.render(scene,camera);
                    

function animate() {

    //visualizacion de pathways:
            pozo0.visible=run.pathways.gw_ingestion;
            pozo1.visible=run.pathways.gw_ingestion;
            pozo2.visible=run.pathways.gw_ingestion;
            rio.visible=run.pathways.sw_swimming;
            cultivo.visible=run.pathways.veg_ingestion;

//flecha lixiviacion
            LixiviacionFlecha.visible=run.pathways.lixiviacion;
  LixiviacionFlecha.rotation.y=camera.rotation.y       
  LixiviacionFlecha.position.y=(soil.position.y + gw.position.y)*0.5
  LixiviacionFlecha.scale.y=(soil.position.y - gw.position.y) / LixiviacionFlecha.geometry.parameters.height


    surf.visible= run.src.surf;
    soil.visible= run.src.soil;
      gw.visible= run.src.gw;
//x
surf.scale.x=s.surf.DY/surf.geometry.parameters.depth
soil.scale.x=s.soil.DY/soil.geometry.parameters.depth
gw.scale.x=s.gw.DY/  gw.geometry.parameters.depth
//y
surf.scale.y=s.surf.DZ/surf.geometry.parameters.height
soil.scale.y=s.soil.DZ/soil.geometry.parameters.height
gw.scale.y=s.gw.DZ/  gw.geometry.parameters.height

pozo1.scale.y=m.soil.h/suelo.geometry.parameters.height
pozo1.position.y=-m.soil.h*0.5
pozo2.position.y=-m.soil.h-pozo2.geometry.parameters.height*0.5

SUELO.scale.y=m.soil.h/suelo.geometry.parameters.height -0.01
GROUNDWATER.scale.y=m.gw.h/groundwater.geometry.parameters.height


//z
surf.scale.z=s.surf.DX/surf.geometry.parameters.width
soil.scale.z=s.soil.DX/soil.geometry.parameters.width
gw.scale.z=s.gw.DX/  gw.geometry.parameters.width


//z-position
surf.position.y=0-surf.geometry.parameters.height*s.surf.DZ/surf.geometry.parameters.height*0.5
soil.position.y=-s.soil.z - s.soil.DZ/soil.geometry.parameters.height*0.5
gw.position.y=-s.gw.z - s.gw.DZ/gw.geometry.parameters.height*0.5

SUELO.position.y=0-suelo.geometry.parameters.height*m.soil.h/suelo.geometry.parameters.height*0.5
GROUNDWATER.position.y=-m.soil.h-groundwater.geometry.parameters.height*m.gw.h/groundwater.geometry.parameters.height*0.5

requestAnimationFrame( animate );
     // required if controls.enableDamping or controls.autoRotate are set to true
     controls.update();
     renderer.render( scene, camera );

      
          
    }


// DAT.GUI Related Stuff
   
   




//Medio:
gui= new dat.GUI();
gui.domElement.id = "gui";
$("#CanvasContainer").append(gui.domElement);


var gui_profile = gui.addFolder('Perfil');
gui_profile.add(m.soil,"h",  0, 10).name("h<sub>suelo</sub>");//.listen();
gui_profile.add(m.soil,"h_zc",  0, 10).name("h<sub>cap</sub>");//.listen();
gui_profile.add(m.gw,"h",  0, 10).name("h<sub>gw</sub>");//.listen();


//Fuentes:
var gui_src = gui.addFolder('Fuentes');


gui_src.add(run.src,"surf").name("Superficial");
   gui_src.add(s.surf,"DX", 0, 100);
   gui_src.add(s.surf,"DY", 0, 100);
   gui_src.add(s.surf,"DZ", 0, 10) ;

gui_src.add(run.src,"soil").name("Suelo");
   gui_src.add(s.soil,"z", 0, m.soil.h - s.soil.DZ).listen();
   gui_src.add(s.soil,"DX",0, 100);
   gui_src.add(s.soil,"DY",0, 100);
   gui_src.add(s.soil,"DZ", 0, 10);

gui_src.add(run.src,"gw").name("Aguas subterraneas");
   gui_src.add(s.gw,"z",m.soil.h , m.soil.h + m.gw.h - s.gw.DZ).listen();
   gui_src.add(s.gw,"DX",0, 100);
   gui_src.add(s.gw,"DY",0, 100);
   gui_src.add(s.gw,"DZ",0, 10) ;

//// Definición de pathways:
var gui_pathways = gui.addFolder('Vías de exposición');

gui_pathways.add(run.pathways,"veg_ingestion").name("Cultivo");
gui_pathways.add(run.pathways,"gw_ingestion").name("Pozo de agua");
gui_pathways.add(run.pathways,"sw_swimming").name("Río");
gui_pathways.add(run.pathways,"sw_fishing").name("Pesca");

gui_pathways.add(run.pathways,"volatilizacion").name("Volatilización");
gui_pathways.add(run.pathways,"lixiviacion").name("Lixiviación");


animate();




window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize( window.innerWidth*0.9, window.innerHeight*0.9 );

}