//=================================================================================================
//	Project 4
//	George Gannon
//=================================================================================================
/*
	Part 1 Objs: Computer was mesh object, monitor, bed, table were composite
	Part 2: Extruded Shape is bookshelf although I covered sides with cube
			to make it enclosed and also added 'books', extruded shape is the doorknob and clay pot on bookshelf,
			other object is the Fan which is also animated when pressing a.
			Added rgb to keyboard and ram modules on computer
			Addeed working clock on wall that animates to the real system time
			Tinkered with lighting to make it seem less plasticy
			Added pillow on bed for comfort
	Part 3 Textures:
			Table and wood sections could use some wood textures
			Coke can on table?
			Lightning mcqueen bedsheets?
			WElcome home floormat
			Poster on wall of Thundercat
			
			Other Objects:
				AKAI Mini
				Rokit5 Speakers
				Banjo
			More animation:
				tough, not sure. Maybe pot falling off the shelf and breaking
*/
//	WebGL variables
var program;
var canvas;
var gl;
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 0.4,
    translateX : 0,
    translateY : -1,

    // Camera rotate control variables.
    phi : 60,
	
    theta : 15,
    Radius : 2,
    dr : 2.0 * Math.PI/180.0,

    // Mouse control variables
    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0
};

/* var zoomFactor = 0.4;
var translateFactorX = -0;
var translateFactorY = -1;
var phi=60;  // camera rotating angles
var theta=15;
var Radius=2;  // radius of the camera
 */
var N;
var N_Circle;
// 	GL Arrays for drawing objects
var pointsArray = [];
var normalsArray = [];
var colorsArray = [];
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0),
];
//	Orthographics projection variables
var left = -5;
var right = 5;
var ytop = 5;
var bottom = -5;
var near = -15;
var far = 15;
var deg=5;
var eye=[1, 1, 1];
var at=[0, 0, 0];
var up=[0, 1, 0];

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

var lightPosition = vec4(0, 9, -6, 0.0 );
var lightAmbient = vec4(0.7, 0.7, 0.7, 1.0 );
var lightDiffuse = vec4( 0.7, 0.7, 0.7, 1.0 );
var lightSpecular = vec4( 1, 1, 1, 1.0 );

var materialAmbient = vec4( 0, 0, 0, 1.0 );
var materialDiffuse = vec4( 0.5, 0.5, 0.5, 1.0);
var materialSpecular = vec4( 1, 0.8, 0.5, 1.0 );
var materialShininess = 250;


var textureCoordsArray = []
var ambientColor, diffuseColor, specularColor;
var vertices = [
		// Cube 
		vec4( -0.5, -0.5,  0.5, 1 ), //A 0
        vec4( -0.5,  0.5,  0.5, 1 ),//b 1
        vec4(  0.5,  0.5,  0.5, 1 ),//c 2
        vec4(  0.5, -0.5,  0.5, 1 ),//d 3
        vec4( -0.5, -0.5, -0.5, 1 ),//e 4
        vec4( -0.5,  0.5, -0.5, 1 ),//f 5
        vec4(  0.5,  0.5, -0.5, 1 ),//g 6
        vec4(  0.5, -0.5, -0.5, 1 ),//h 7
		
		// the slope down part
        vec4(  0.5,  0.5, -0.1, 1 ),//gslope 8
        vec4(  0.5, -0.5, -0.1, 1 ), //hslope 9
		
		// Computer Tower // 10 vertices * 6 points = 60
		vec4( 0, 0,  0.0, 1 ), //A 10
        vec4( 0.5,  0,  0.0, 1 ),//b 11
        vec4(  0.5,  0.1,  0, 1 ),//c 12
        vec4(  0, 0.1,  0, 1 ),//d 13
		
        vec4( 0.5, 0,  -0.25, 1 ),// 14
        vec4( 0.5,  0.5,  -0.25, 1 ),// 15
        vec4(  0.5,  0.5,  0, 1 ),// 16
        
		vec4(  0, 0,  -0.25, 1 ),// 17
		vec4(  0, 0.35,  0, 1 ),// 18
		vec4(  0, 0.35,  -0.25, 1 ),// 19
		
		vec4(  0, 0.1,  -0.25, 1 ),// 20
		vec4(  0.5,  0.1,  -0.25, 1 ), // 21
		
		vec4(0.01, 0.1,  0, 1), //22, 13 relative
		vec4(0.01, 0.5,  0, 1), //23, 18 relative
		vec4( 0.01, 0.5,  -0.24, 1 ), //24, 19 relative
		vec4( 0.01, 0.1,  -0.24, 1 ), //25, 20 relative
		
		vec4( 0.49,  0.1,  -0.24, 1 ), //26, 21 relative
		vec4(0.49,  0.5,  -0.24, 1), // 27, 15 rel
		
		vec4(0.38, 0.1,0 ),// 28
		vec4(0.4375,0.1,0),// 29
		
		vec4(0.38,0.15,0),// 30
		vec4(0.4375,0.15,0),// 31
		
		vec4(0.38,0.15,-0.23),// 32
		vec4(0.4375,0.15,-0.23),// 33 
		vec4(0.38,0.375,-0.23),// 34 
		vec4(0.4375,0.375,-0.23),// 35
 		vec4(0.38,0.4,-0.2),// 36
		vec4(0.4375,0.4,-0.2),// 37
		 vec4(0.38,0.5,-0.2),// 36
		vec4(0.4375,0.5,-0.2),// 37
		vec4(  0, 0.5,  0, 1 ),// 38
		vec4(  0, 0.5,  -0.25, 1 ),// 39
] 
var cylvertices;
var ANIMATEFLAG=false
var PLAYED = false
function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}
var sound;
var vTexCoord;
window.onload = function init() {
	console.log("start verts",vertices)
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // generate the points/normals
	Cube();
	Monitor(); // Mesh Object
	Cone(0.5, 1);
	Cylinder(0.5);
	ComputerTower();
	SurfaceRevPoints()
	bookshelf();
	// TODO: Generate Objects
	
    // pass data onto GPU
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
	// Textures
	var textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoordsArray), gl.STATIC_DRAW);
	vTexCoord = gl.getAttribLocation(program, "vTexCoord");
	gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
	//gl.enableVertexAttribArray(vTexCoord);
 

	letThereBeLight(materialAmbient, materialDiffuse, materialSpecular)

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
 
    // support user interface
    document.getElementById("phiPlus").onclick=function(){AllInfo.phi += deg;};
    document.getElementById("phiMinus").onclick=function(){AllInfo.phi-= deg;};
    document.getElementById("thetaPlus").onclick=function(){AllInfo.theta+= deg;};
    document.getElementById("thetaMinus").onclick=function(){AllInfo.theta-= deg;};	
    document.getElementById("zoomIn").onclick=function(){AllInfo.zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){AllInfo.zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){AllInfo.translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){AllInfo.translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){AllInfo.translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){AllInfo.translateFactorY -= 0.1;}; 

/*     // keyboard handle
    window.onkeydown = HandleKeyboard; */
	window.addEventListener("keydown", function(){ //
		if(event.key=='a'){
			console.log('pressed A')
			ANIMATEFLAG= !ANIMATEFLAG
		}
	});
	/*
		Borrows from my tetra.js file [the seinfeld pyramid)
	*/
	document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            AllInfo.mouseDownLeft = true;
            AllInfo.mouseDownRight = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            AllInfo.mouseDownRight = true;
            AllInfo.mouseDownLeft = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        }
    });
	
	document.addEventListener("mouseup", function(e) {
        AllInfo.mouseDownLeft = false;
        AllInfo.mouseDownRight = false;
    });

    document.addEventListener("mousemove", function(e) {
        if (AllInfo.mouseDownRight) {
            AllInfo.translateX += (e.x - AllInfo.mousePosOnClickX)/30;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.translateY -= (e.y - AllInfo.mousePosOnClickY)/30;
            AllInfo.mousePosOnClickY = e.y;
        } else if (AllInfo.mouseDownLeft) {
            AllInfo.phi += (e.x - AllInfo.mousePosOnClickX)/10;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.theta += (e.y - AllInfo.mousePosOnClickY)/10;
            AllInfo.mousePosOnClickY = e.y;
        }
    });
	document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            AllInfo.zoomFactor = Math.max(0.1, AllInfo.zoomFactor - 0.1);
        } else {
            AllInfo.zoomFactor += 0.1;
        }
    });
	
	window.addEventListener("keydown", function(){ // p listenrr
		// looked up how to do this because I figured our final project would need it
		console.log(event.key)
		if(event.key=='a' && !PLAYED  && fooled){

			PLAYED = true // should prevent the song from playing more than once/overlapping
			sound = new Audio("secret.mp3")
			sound.play()		
		}
	});
	window.addEventListener("keydown", function(){ // p listenrr
		// looked up how to do this because I figured our final project would need it
		console.log(event.key)
		if(event.key=='b'){
			ANIMATEFLAG = false;
			animationStep=0;	
			AllInfo.zoomFactor = 0.4;
			AllInfo.translateX = 0;
			AllInfo.translateY = -1;

			// Camera rotate control variables.
			AllInfo.phi = 60;
			
			AllInfo.theta = 15;
			AllInfo.Radius = 2;
			AllInfo.dr = 2.0 * Math.PI/180.0;
			// Mouse control variables
			AllInfo.mouseDownRight = false;
			AllInfo.mouseDownLeft = false;

			AllInfo.mousePosOnClickX =0;
			AllInfo.mousePosOnClickY =0;
			if(PLAYED){
				played = false
				fooled = false
				sound.pause()
			}else{
				played=true
				fooled = true
				sound.play()
			}
		}
		
	});
    render();
}

function letThereBeLight(materialAmbi, materialDiff, materialSpec, shin){
	ambientProduct = mult(lightAmbient, materialAmbi);
    diffuseProduct = mult(lightDiffuse, materialDiff);
    specularProduct = mult(lightSpecular, materialSpec);
	materialShininess = shin
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
       flatten(specularProduct) );  
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), 
       flatten(lightPosition) );
    gl.uniform1f(gl.getUniformLocation(program, 
       "shininess"),materialShininess);
}
function Cube(){
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
	//console.log(pointsArray)
	return 36
}

function Monitor(){
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 9, 8 );
    quad( 3, 0, 4, 9 );
    quad( 8, 5, 1, 2 );
    quad( 4, 5, 8, 9 );
    quad( 5, 4, 0, 1 );
	//console.log(pointsArray)
	return 36
}
// TODO: figure out what vertices we will use for each shape3
var caseverts, innerverts;
function ComputerTower(){
	caseverts = 0; // TODO Put this in a namespace
/*
		vec4(  0, 0.5,  0, 1 ),// 18
		vec4(  0, 0.5,  -0.25, 1 ),// 19
*/
    caseverts +=quad( 11, 10, 13, 12 );
	caseverts +=quad( 14, 11, 16, 15);
	caseverts +=quad(10,17,19,18);
	caseverts +=quad(16,23,24,15);
	caseverts +=quad(11,10,17,14);
	caseverts +=quad(14,17,24,15);
	caseverts +=quad(29,28,30,31);
	caseverts +=quad(31,30,32,33);
	caseverts +=quad(33,32,34,35);
	caseverts +=quad(35,34,36,37);
	caseverts +=quad(37,36,38,39);
	//console.log("vert count:", caseverts, vertices)	
	
	innerverts=0
	innerverts +=quad(12,13,20,21); // bottom liner
	innerverts +=quad(25,22,23,24); // left liner
	innerverts +=quad(26,25,24,27); // back liner
	
}

var stacks = 8;
var slices = 12;
function Cone(radius, height)
{
    var hypotenuse=Math.sqrt(height*height + radius*radius);

    // starting out with a single line in xy-plane
	var line=[];
        var segmentX = radius/stacks;
        var segmentY = height/stacks;
	for (var p=0; p<=stacks; p++)  {
	    line.push(vec4(p*segmentX, p*segmentY, 0, 1));
    }

    prev = line;
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=1; i<=slices; i++) {
        var curr=[]

        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }

        // triangle bottom of the cone
        triangle(prev[1], prev[0], curr[1]);

        // create the triangles for this slice
        for (var j=1; j<stacks; j++) {
            prev1 = prev[j];
            prev2 = prev[j+1];

            curr1 = curr[j];
            curr2 = curr[j+1];

            //quad(prev1, curr1, curr2, prev2);
            vecquad(prev2, prev1, curr1, curr2);
        }

        prev = curr;
    }
}

function Frustrum(){
	quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2);
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
	//console.log(pointsArray)
}
function drawHalfFrustrum(scalex=1, scaley=1, scalez = 1){
	var s= scale4(scalex, scaley, scalez);
	modelViewMatrix = mult(modelViewMatrix, s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES,36,36)
	
}
// Going to give us some optional arguments. None are supplied, simple cube
// designed so that you could pass in "i want this twice as long but everything else the same"
function drawCube(scalex=1, scaley=1, scalez = 1, pos = vec3(0,0,0), rot=vec4(0,0,0,1)){ 
	var sc= scale4(scalex, scaley, scalez);
	var tr = translate(pos[0],pos[1],pos[2])
	var ro = rotate(rot[0],rot[1],rot[2],rot[3])
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix,mult(tr,mult(ro,sc)))
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	modelViewMatrix = mvMatrixStack.pop();
}
function drawCone(scalex=1, scaley=1, scalez = 1, pos = vec3(0,0,0)){
	var s= scale4(scalex, 0.5*scaley, scalez);
	var r = rotate(180,0,0,1)
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(mult(modelViewMatrix, r),s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 72, 540);
	modelViewMatrix = mvMatrixStack.pop()
}
function drawCylinder(scalex=1, scaley=1, scalez = 1, pos = vec3(0,0,0)){
	var s= scale4(scalex, 0.5*scaley, scalez);
	var t = translate(pos[0],pos[1],pos[2])
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(mult(modelViewMatrix, t),s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays( gl.TRIANGLES, 612,   252); // 252 Points
	modelViewMatrix = mvMatrixStack.pop()
}


/*
 Slightly altered quad that takes an optional fifth argument.
 Goal is for it to be able to create Frustrums
 basically say: I want this quad to actually be a 1/4 of the size
 so when I go to draw a 'cube' *see similarity of Frustrum() to Cube()* one of the sides will be 1/4 the size,
 and the other sides should angle in towards that smaller side because that 1/4 size quad will be used

*/
// Verts controls what vertices array I am pulling from
function quad(a, b, c, d, verts =vertices) {
			var t1 = subtract(verts[b], verts[a]);
			var t2 = subtract(verts[c], verts[b]);
			var normal = cross(t1, t2);
			var normal = vec3(normal);
			normal = normalize(normal);
			
			pointsArray.push(verts[a]);
			textureCoordsArray.push(texCoord[0]);
			normalsArray.push(normal);
			
			pointsArray.push(verts[b]);
			normalsArray.push(normal);
			textureCoordsArray.push(texCoord[1]); 
			 
			pointsArray.push(verts[c]);
			normalsArray.push(normal);
			textureCoordsArray.push(texCoord[2]); 
			
			pointsArray.push(verts[a]);
			normalsArray.push(normal);
			textureCoordsArray.push(texCoord[0]); 
			
			pointsArray.push(verts[c]);
			normalsArray.push(normal);
			textureCoordsArray.push(texCoord[2]);
			
			pointsArray.push(verts[d]);
			normalsArray.push(normal);
			textureCoordsArray.push(texCoord[3]); 
		return 6
}
function vecquad(a,b,c,d){
	var points=[a, b, c, d];
     	var t1 = subtract(b, a);
     	var t2 = subtract(c, b);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

        // triangle abc
   	pointsArray.push(a);
   	normalsArray.push(normal);
   	pointsArray.push(b);
   	normalsArray.push(normal);
   	pointsArray.push(c);
   	normalsArray.push(normal);

        // triangle acd
   	pointsArray.push(a);
   	normalsArray.push(normal);
   	pointsArray.push(c);
   	normalsArray.push(normal);
   	pointsArray.push(d);
   	normalsArray.push(normal);
}
// a, b, c, and d are all vec4 type
// regular texture
function triangle(a, b, c) 
{
    var t1 = subtract(b, a);
   	var t2 = subtract(c, b);
   	var normal = cross(t1, t2);
   	var normal = vec4(normal);
   	normal = normalize(normal);
	//console.log("normal: ",normal)
    // triangle abc
   	pointsArray.push(a);
   	normalsArray.push(normal);
    textureCoordsArray.push(texCoord[0]);

   	pointsArray.push(b);
   	normalsArray.push(normal);
    textureCoordsArray.push(texCoord[1]);

   	pointsArray.push(c);
   	normalsArray.push(normal);
    textureCoordsArray.push(texCoord[2]);
}
function Cylinder(radius)
{
    var height=2;
    var num=10;
    var alpha=Math.PI/num;

    cylvertices = [vec4(0, 0, 0, 1)];
    for (var i=num*2; i>=0; i--)
    {
        cylvertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
    }

    N=N_Circle=cylvertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        cylvertices.push(vec4(cylvertices[i][0], cylvertices[i][1]+height, cylvertices[i][2], 1));
    }

    ExtrudedShape(cylvertices);
}
function bookshelf(){
	ExtrudedBookshelf()
}
// 21 vertices
var bookvertices=
	[vec4(0.5,0,0,1),vec4(0,0,0,1), // 2, 1
	 vec4(0,0.4,0,1),vec4(0,0.5,0,1), // 34			
	 vec4(0.45,0.5,0,1), // 5
	 vec4(0.45,0.9,0,1), // 7
	 vec4(0,0.9,0,1),// 6			
	 vec4(0,1,0,1),	vec4(0.45,1,0,1),//9
	 vec4(0.45,1.4,0,1),vec4(0,1.4,0,1),//11 10
	 vec4(0,1.5,0,1),vec4(0.45,1.5,0,1),//13
	 vec4(0.45,1.9,0,1),vec4(0,1.9,0,1), // 15 14
	 vec4(0,2,0,1), vec4(0.45,2,0,1), // 17
	 vec4(0.45,2.4,0,1),vec4(0,2.4,0,1), // 19 18
	 vec4(0,2.5,0,1),vec4(0.5,2.5,0,1)]
function ExtrudedBookshelf(){
	// for a different extruded object, 
    // only change these two variables: vertices and height

    var height=2;

    N= bookvertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        bookvertices.push(vec4(bookvertices[i][0], bookvertices[i][1], bookvertices[i][2]+height, 1));
    }

    ExtrudedShape(bookvertices);
}

function ExtrudedShape(source=vertices)
{
    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad(j, j+N, (j+1)%N+N, (j+1)%N,source);   
    }

    // the first N vertices come from the base 
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints, source);

    // the next N vertices come from the top 
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(topPoints, source);
}
function polygon(indices, verts=vertices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
	var normal=Newell(indices, verts);

    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
	for (var i=0; i<M-2; i++)
	{
		pointsArray.push(verts[indices[0]]);
		normalsArray.push(normal);

		pointsArray.push(verts[indices[prev]]);
		normalsArray.push(normal);

		pointsArray.push(verts[indices[next]]);
		normalsArray.push(normal);

		prev=next;
		next=next+1;
	}
	
}
// TODO: define table namespace to store vars. Atm it is fine because we use the same cube points
function DrawTable(){
	// Our table routine
	drawCube(4,0.125,2, vec3(0,0.25,0)) // da table top
	drawCube(0.125,1.5,0.125, vec3(-2,-0.25,-1)) // 1    1 2 
	drawCube(0.125,1.5,0.125, vec3(2,-0.25,-1))  // 2    3 4
	drawCube(0.125,1.5,0.125, vec3(-2,-0.25,1))  // 3
	drawCube(0.125,1.5,0.125, vec3(2,-0.25,1))   // 4 
	mvMatrixStack.push(modelViewMatrix)
	//console.log('mv stack', mvMatrixStack)
	modelViewMatrix = mult(modelViewMatrix, rotate(0,90,90,1))
	modelViewMatrix = mvMatrixStack.pop()
}
var fanverts=0;
function DrawBoxFan(){
	materialAmbient = vec4( 255/255, 251/255, 1, 1.0);
    materialDiffuse = vec4( 255/2/255, 251/2/255, 1/2, 1.0);
    materialSpecular = vec4( 0.0, 0.0, 0.0, 1.0 );
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,150.0);
	drawCube(0.25,0.5,0.125)
	drawCube(0.25,1,0.125/2, vec3(0,0.25+0.125/4,-0.375-0.125/2),vec4(90,1,0,0))
	drawCube(0.25,0.5,0.125,vec3(0,0,-1+0.125))
	drawCube(0.25,1,0.125/2, vec3(0,-(0.25+0.125/4),-0.375-0.125/2),vec4(90,1,0,0))
	
	mvMatrixStack.push(modelViewMatrix)
	modelViewMatrix = mult(modelViewMatrix, rotate(90,0,0,1))
	drawCylinder(0.125,0.125,0.125*2, vec3(0,-(0.25+0.125/4)/4,-0.375-0.125/2)) // cylinder
	modelViewMatrix = mvMatrixStack.pop()
	console.log("animation step inside of box fan", animationStep)
	drawCube(0.125/2,0.6,0.065, vec3(0,-(0+0.125/4)/4,-0.375-0.125/2), vec4(animationStep*6%360,1,0,0)) // blade
	drawCube(0.125/2,0.6,0.065, vec3(0,-(0+0.125/4)/4,-0.375-0.125/2), vec4(animationStep*6%360+90,1,0,0)) // blade
	for(var i=0; i< 10; i++){
		drawCube(0.0175,0.5,0.0175, vec3(0.125,0,-0.1*i))
		drawCube(0.0175,0.5,0.0175, vec3(-0.125,0,-0.1*i))
	}


}
function DrawBed(){
/* 	materialAmbient = vec4( 102/255, 51/255, 0, 1.0);
    materialDiffuse = vec4( 0.2, 0.2, 0.2, 1.0); */
	materialDiffuse = vec4( 102/255, 51/255, 0, 1.0);
    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 0, 0, 0, 1.0 );
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
	// Our table routine
	mvMatrixStack.push(modelViewMatrix)
	//console.log('mv stack', mvMatrixStack)
	modelViewMatrix = mult(modelViewMatrix, rotate(0,90,90,1))
	drawCube(4,0.125,2, vec3(0,-.145,0)) // da bed frame
	drawCylinder(.125,1,0.125, vec3(-2,-0.5,-1) )
	drawCylinder(.125,1,0.125, vec3(2,-0.5,-1) )
	drawCylinder(.125,1,0.125, vec3(-2,-0.5,1) )
	drawCylinder(.125,1,0.125, vec3(2,-0.5,1) )

	materialDiffuse = vec4( 0,0,0.5, 1.0);
    materialAmbient = vec4( 0, 0, 0, 1.0);
    materialSpecular = vec4( 0, 0, 0, 1.0 );
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
	drawCube(4,0.5,2, vec3(0,0.145,0)) // mattress
	modelViewMatrix = mvMatrixStack.pop()
	
	materialDiffuse= vec4( 160/255, 160/255, 160/255, 1.0);
    materialAmbient = vec4( 160/255, 160/255, 160/255, 1.0);
    materialSpecular = vec4( 0.1, 0.1, 0.8, 1.0 );
	letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,255.0);
	mvMatrixStack.push(modelViewMatrix)
	//console.log('mv stack', mvMatrixStack)
	modelViewMatrix = mult(modelViewMatrix, rotate(90,1,0,0))
	drawCylinder(1,1,0.5, vec3(1.5,-0.5,-0.5)) // pillow
	modelViewMatrix = mvMatrixStack.pop()
}
	/*
		  Y
		  |
		Z/ \X
	    
	*/
function DrawRoom(mode){
	mvMatrixStack.push(modelViewMatrix)
	if(mode==0){ // floor
		materialAmbient = vec4( 255/255, 251/255, 208/255, 1.0);
		materialDiffuse = vec4(  0.0, 0.0, 0.0, 1.0);
		materialSpecular = vec4( 0.0, 0.0, 0.0, 1.0 );
		letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
		drawCube(8,0.025,8, vec3(0,-1,0))
	}else if(mode==1){ // left
			materialAmbient = vec4( 0.6, 0.6, 0.6, 1.0);
			materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0);
			materialSpecular = vec4( 0.6, 0.6, 0.6, 1.0 );
			letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,5.0);		
		drawCube(2.50,0.125,1.5, vec3(-4,0.25,0),vec4(90,0,0,1)) // door
			materialAmbient = vec4(  104/255, 76/255, 75/255, 1.0);
			materialDiffuse = vec4( 0, 0, 0, 1.0);
			materialSpecular = vec4( 0.0, 0.0, 0.0, 1.0 );
			materialShininess = 60.0;
			letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,60.0);
		drawCube(4,0.025,8, vec3(-4,1,0),vec4(90,0,0,1)) // wall
		materialAmbient = vec4(0.8314, 0.6863, 0.2157, 1.0); // door knob
		materialDiffuse = vec4( 0.8314, 0.6863, 0.2157, 1.0);
		materialSpecular = vec4( 0.9314, 0.7863, 0.3157, 1.0 );
		letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,1.0);
		modelViewMatrix = mult(modelViewMatrix,rotate(-90,0,0,1))
		drawLavaLamp(0.5,0.5/2,0.5,vec3(0,-3.975,-0.5))
		modelViewMatrix = mult(modelViewMatrix,rotate(180,0,0,1))
		drawLavaLamp(0.5,0.5/2,0.5,vec3(0,3.975,-0.5))
	}else if(mode==2){ // right
		//modelViewMatrix= mult(modelViewMatrix, rotate(90,180,0,1))
		drawCube(8,0.025,4, vec3(0,1,-4),vec4(90,1,0,0))
	}else
		drawCube(8,0.025,8, vec3(1,0,1), vec3(0,0,90))		
	modelViewMatrix = mvMatrixStack.pop()
}

function DrawMonitor(screen){
	if(!screen){
		mvMatrixStack.push(modelViewMatrix)
		modelViewMatrix= mult(modelViewMatrix, rotate(90,0,90,1))
		modelViewMatrix= mult(modelViewMatrix, rotate(90,1,0,0))
		drawHalfFrustrum(0.75,0.75,0.4)
		modelViewMatrix = mvMatrixStack.pop()
		mvMatrixStack.push(modelViewMatrix)
		modelViewMatrix = mult(modelViewMatrix, translate(0,-0.1,0))
		drawCone(0.75,0.5,0.75)	
		modelViewMatrix = mvMatrixStack.pop()
	}else{
		mvMatrixStack.push(modelViewMatrix)
		modelViewMatrix= mult(modelViewMatrix, rotate(180,0,0,1))
		modelViewMatrix = mult(modelViewMatrix, translate(0,0.025,0.28))
		drawCube(0.8,0.43,0.05)
		modelViewMatrix = mvMatrixStack.pop()
	}
}
function DrawKeyboard(){
	mvMatrixStack.push(modelViewMatrix)
	modelViewMatrix= mult(modelViewMatrix, rotate(270,0,1,0))
	modelViewMatrix= mult(modelViewMatrix, rotate(90,1,0,0))
	drawHalfFrustrum(0.45,.75,0.051)

	switch(blue){
		case 0:
			materialDiffuse= vec4( 255/255, 0/255, 0/255, 1.0);
			break
		case 1:
			materialDiffuse= vec4( 0/255, 255/255, 0/255, 1.0);
			break
		case 2:
			materialDiffuse= vec4( 0/255,  0/255, 255/255, 1.0);
			break
	}

    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );
		letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
	
	modelViewMatrix = mvMatrixStack.pop()
	mvMatrixStack.push(modelViewMatrix)
	for(var j =0; j<3;j++){
		for(var i =0; i< 10;i++){
			var shift =0.05
			if(j==1 && i==0 || (j>0&& i==9)) // adds in some wider keys to make it seem like it has backspace and enter
				shift=0.1
			drawCube(shift,0.05,0.05, vec3(-0.30+i/15,0.025,0.05-j*0.1))
		}
	}
	drawCube(0.30,0.08,0.05, vec3(0,0,0.15)) // spacebar
	drawCube(0.05,0.05,0.05, vec3(-0.3+9/15,0.025, 0.15))
	drawCube(0.05,0.05,0.05, vec3(-0.3+9.5/15,0.025, 0.20))
	drawCube(0.05,0.05,0.05, vec3(-0.375+9.5/15,0.025, 0.20))
	
	drawCube(0.09,0.05,0.05, vec3(0.4-9.5/15,0.025, 0.15))// ctr;
	drawCube(0.05,0.05,0.05, vec3(-0.3+9/15,0.025, 0.20))
	modelViewMatrix = mvMatrixStack.pop()
}

function drawTower(scalex=1.3, scaley=1.1, scalez = 1.1, pos = vec3(0,0,0)){
	var s= scale4(scalex, 1*scaley, scalez);
	var t = translate(pos[0],pos[1],pos[2])
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(mult(modelViewMatrix, t),s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	materialAmbient = vec4( 255/255, 255/255, 255/255, 1.0);
    materialDiffuse = vec4( 0.2, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 0.8, 0.8, 0.8, 1.0 );
    materialShininess = 50.0;
		letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
    gl.drawArrays( gl.TRIANGLES, 864, caseverts);

	materialDiffuse= vec4( 0/255, 0/255, 0/255, 1.0);
    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 0.8, 0.8, 0.8, 1.0 );
		letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
	gl.drawArrays(gl.TRIANGLES, 864+caseverts, innerverts)
	modelViewMatrix = mvMatrixStack.pop()
	var s= scale4(0.125, 0.30, 0.25);
	var t = translate(0,0.45,0-0.25/8)
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(mult(modelViewMatrix, t),s);
	DrawBoxFan()
	modelViewMatrix=mvMatrixStack.pop()
	
	mvMatrixStack.push(modelViewMatrix)
	t = translate(0.50/2,0.44-0.435/4,-0.2)
	modelViewMatrix = mult(modelViewMatrix, t)
	drawmobo()
	modelViewMatrix = mvMatrixStack.pop()
}
var blue=0
function drawmobo(){
	materialDiffuse= vec4( 135/255, 0/255, 0/255, 1.0);
    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 0.8, 0.8, 0.8, 1.0 );
		letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
	drawCube(0.45,0.425,0.0225) // mobo
	materialDiffuse= vec4( 0/255, 0/255, 0/255, 1.0);
    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 0.0, 0.0, 0.0, 1.0 );
	letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
		
	drawCube(0.29,0.05,0.2, vec3(0,-0.1,0.1)) // gpu
	materialDiffuse= vec4( 0/255, 0/255, 0/255, 1.0);
    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
		letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
	mvMatrixStack.push(modelViewMatrix)
	//console.log('mv stack', mvMatrixStack)
	modelViewMatrix = mult(modelViewMatrix, rotate(90,1,0,0))
	drawCylinder(0.11,0.05,0.11) // cpu cooler
	modelViewMatrix = mvMatrixStack.pop()
	blue = Math.floor(animationStep/360)
	switch(blue){
		case 0:
			materialDiffuse= vec4( 255/255, 0/255, 0/255, 1.0);
			break
		case 1:
			materialDiffuse= vec4( 0/255, 255/255, 0/255, 1.0);
			break
		case 2:
			materialDiffuse= vec4( 0/255,  0/255, 255/255, 1.0);
			break
	}

    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 0.8, 0.8, 0.8, 1.0 );
		letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
	drawCube(0.0425,0.15,0.0725, vec3(0.1,0.0725/2))
	drawCube(0.0425,0.25,0.0725, vec3(0.15,0.0725/2))
}


function drawLavaLamp(scalex=1.3, scaley=1.1, scalez = 1.1, pos = vec3(0,0,0)){
	var s= scale4(scalex, 1*scaley, scalez);
	var t = translate(pos[0],pos[1],pos[2])
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(mult(modelViewMatrix, t),s);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays( gl.TRIANGLES, 864+caseverts+innerverts,7*7*6); // yikes
	modelViewMatrix = mvMatrixStack.pop()
}

function drawBookshelf(scalex=1.0, scaley=1.0, scalez = 1.0){
	materialDiffuse = vec4( 102/255, 51/255, 0, 1.0);
    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 0, 0, 0, 1.0 );
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,1.0);
	var s= scale4(scalex, scaley, scalez);
	r = rotate(90, 0, 1, 0)
	mvMatrixStack.push(modelViewMatrix);

	modelViewMatrix = mult(mult(modelViewMatrix, s),r);
	drawCube(0.5*scalex,2.5*scaley,0.125*scalez, vec3(0+0.5/2,1.25,2+((0.125*scalez)/2)))	
	drawCube(0.5,2.5,0.125, vec3(0+0.5/2,1.25,0-((0.125*scalez)/2) ))	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, 864+caseverts+innerverts+(7*7*6),21*6); // yikes
	
	materialDiffuse = vec4( 0/255, 0/255, 0, 1.0);
    materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0);
    materialSpecular = vec4( 0.95, 0.95, 0.95, 1.0 );
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,189.0);
	setTexture("textures/books.jpg", gl.TEXTURE3,3)
	drawCube(2,0.37,0.1, vec3(0.3,0.65,1), vec4(90,0,1,0))
	drawCube(2,0.37,0.1, vec3(0.3,1.15,1), vec4(90,0,1,0))

	// shelf with da lava lamp	

		
	drawCube(1.5,0.37,0.1, vec3(0.3,1.65,0.75), vec4(90,0,1,0))
	
	drawCube(2,0.37,0.1, vec3(0.3,2.15,1), vec4(90,0,1,0))
		
	materialDiffuse = vec4( 190/255, 95/255, 63/255, 1.0);
    materialAmbient = vec4(160/255, 95/255, 63/255, 1.0);
    materialSpecular = vec4( 0.95, 0.95, 0.95, 1.0 );
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,230.0);
	mvMatrixStack.push(modelViewMatrix)
	modelViewMatrix = mult(modelViewMatrix, rotate(180,0,0,1))
	drawLavaLamp(0.75,0.4,0.8, vec3(-0.1,-1.85,1.75))	
	modelViewMatrix = mvMatrixStack.pop()	
/* 	for(var i =0; i<10;i++){
		drawCube(0.25,0.37,2/20, vec3(0.3,0.65,0.1+i/5))
	}
	materialDiffuse = vec4( 153/255, 0/255, 153/255, 1.0);
    materialAmbient = vec4( 0.0, 0.0, 0.0, 1.0);
    materialSpecular = vec4( 0.49, 0.95, 0.95, 1.0 );
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,128.0);
	
	for(var i =0; i<10;i++){
		drawCube(0.25,0.37,2/20, vec3(0.3,1.15,0.1+i/6))
	}
	materialDiffuse = vec4( 0/255, 153/255, 0, 1.0);
    materialAmbient = vec4( 0.0, 0.1, 0.0, 1.0);
    materialSpecular = vec4( 0.0, 0.19, 0.0, 1.0 );
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,60.0);	
	for(var i =0; i<8;i++){
		drawCube(0.25,0.37,2/20, vec3(0.3,1.65,0.1+i/4))
	}
	materialDiffuse = vec4( 153/255, 153/255, 153/255, 1.0);
    materialAmbient = vec4( 0.0, 0.0, 0.0, 1.0);
    materialSpecular = vec4( 0.95, 0.95, 0.95, 1.0 );
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,230.0);	
	for(var i=0; i<8;i++){
		drawCube(0.25,0.37,2/15, vec3(0.3,2.15,0.1+i/4))
	}
	modelViewMatrix = mvMatrixStack.pop()
	mvMatrixStack.push(modelViewMatrix)
	modelViewMatrix = mult(modelViewMatrix, rotate(180,0,0,1))
	
	materialDiffuse = vec4( 190/255, 95/255, 63/255, 1.0);
    materialAmbient = vec4(160/255, 95/255, 63/255, 1.0);
    materialSpecular = vec4( 0.95, 0.95, 0.95, 1.0 );
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,230.0);	 */
	

	modelViewMatrix = mvMatrixStack.pop()
}
function drawRug(){
	drawCylinder(5,0.05,4, vec3(1,-1,0))
}
function drawClockHand(scalex=1, scaley=1, scalez = 1, rot=vec4(0,0,0,1)){ 
	var sc= scale4(scalex, scaley, scalez);
	var tr = translate(0,scaley,0)
	var ro = rotate(rot[0],rot[1],rot[2],rot[3])
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix,ro)
	modelViewMatrix = mult(modelViewMatrix, sc)//ik this can be shorter but i need it verbose for now
	modelViewMatrix = mult(modelViewMatrix, tr)
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	modelViewMatrix = mvMatrixStack.pop();
}
function drawClock(){
	materialAmbient = vec4( 255/255, 251/255, 1, 1.0);
    materialDiffuse = vec4( 255/2/255, 251/2/255, 1/2, 1.0);
    materialSpecular = vec4( 0.0, 0.0, 0.0, 1.0 );
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,150.0);
	mvMatrixStack.push(modelViewMatrix)
	modelViewMatrix = mult(modelViewMatrix, rotate(90,1,0,0))
	drawCylinder(1,-0.05,1)
	materialAmbient = vec4( 0/255, 0/255, 0/255, 1.0);
	materialDiffuse = vec4( 0.6, 0.6, 0.6, 1.0);
	materialSpecular = vec4( 0.0, 0.0, 0.0, 1.0 );

	letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
	drawCylinder(1.1,-0.05,1.1, vec3(0,-0.05,0))
	modelViewMatrix = mvMatrixStack.pop()
	

	drawClockHand(0.05,0.3,0.1, vec4(-hourRot, 0,0,1))// treat as hour hand
	drawClockHand(0.05,0.45,0.1, vec4(-minRot, 0,0,1))// treat as min hand
	materialDiffuse= vec4( 135/255, 0/255, 0/255, 1.0);
    materialAmbient = vec4( 0.5, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 0.8, 0.8, 0.8, 1.0 );
		letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
	drawClockHand(0.04,0.45,0.1, vec4(-secRot, 0,0,1))// treat as sec hand

}
// acts as a poster on the wall, just a thin rectangle
function drawPicture(){
		mvMatrixStack.push(modelViewMatrix)
		modelViewMatrix = mult(modelViewMatrix, rotate(-90,0,1,0))
		drawCube(1.2,2.2,0.05)
		modelViewMatrix = mvMatrixStack.pop()
}

// basically draws a Rokit 5 speaker
function drawSpeaker(left = true){
		setTexture("textures/plastic.jpg", gl.TEXTURE5,5)
	mvMatrixStack.push(modelViewMatrix)
	materialDiffuse= vec4( 0/255, 0/255, 0/255, 1.0);
    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 0.0, 0.0, 0.0, 1.0 );
	letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);

	drawCube(0.35,0.5,0.45)	
	mvMatrixStack.push(modelViewMatrix)
	setTexture("textures/blank.jpg", gl.TEXTURE2,2)		
	materialDiffuse= vec4( 135/255, 135/255, 0/255, 1.0); // yellow
    materialAmbient = vec4( 135/255, 135/255, 0/255, 1.0);
    materialSpecular = vec4( 0.5, 0.5, 0.5, 1.0 );	
	letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0)
	modelViewMatrix = mult(modelViewMatrix, rotate(90,1,0,0))
	drawCylinder(0.2,0.3,0.2 , vec3(0,-0.05,0.1)) // bottom part	
	drawCylinder(.1,.2,.1, vec3(0,.05,-0.125))
	modelViewMatrix = mvMatrixStack.pop()
	modelViewMatrix = mvMatrixStack.pop()
}
function drawChair(){
	materialDiffuse= vec4( 0/255, 0/255, 0/255, 1.0);
    materialAmbient = vec4( 0.4, 0.4, 0.4, 1.0);
    materialSpecular = vec4( 0.5, 0.5, 0.5, 1.0 );
	letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
	drawCylinder(0.125,0.45,0.125) // the shaft? ig thats the word
	// The x part at the bottom
	drawCube(0.125,0.125,1)
	drawCube(0.125,0.125,1, vec3(0,0,0), vec4(90,0,1,0))
	// wheels
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, rotate(90,1,0,0))
	drawCylinder(0.2,0.1 ,0.2, vec3(0,0.4,0.15))
	modelViewMatrix = mult(modelViewMatrix, rotate(90,0,0,1))
	drawCylinder(0.2,0.1 ,0.2, vec3(0,0.4,0.15))
	modelViewMatrix = mult(modelViewMatrix, rotate(90,0,0,1))
	drawCylinder(0.2,0.1 ,0.2, vec3(0,0.4,0.15))	
	modelViewMatrix = mult(modelViewMatrix, rotate(90,0,0,1))
	drawCylinder(0.2,0.1 ,0.2, vec3(0,0.4,0.15))
	// end wheels
	modelViewMatrix = mvMatrixStack.pop()
	// butt cushion
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, rotate(90,0,0,1))
	drawCylinder(0.25,0.75,0.75, vec3(0.5,-0.375,0))
	modelViewMatrix = mvMatrixStack.pop()	
	// end butt cushion
	mvMatrixStack.push(modelViewMatrix);
	drawCube(0.125,0.75,0.125, vec3(0,0.75,.35))	
	drawCylinder(0.75,0.45,0.25, vec3(0,0.75,.35))
	modelViewMatrix = mvMatrixStack.pop()	
}


var hourRot// degrees clockwise for hour hand
var minRot // degrees clockwise for minute hand
var secRot// degrees clockwise for second hand
function getTime(){
	var rightNow = new Date()
	var hour = rightNow.getHours()%12
	var minutes = rightNow.getMinutes()
	var sec = rightNow.getSeconds()
	// reminder, these are all clockwise because we are working with a clock hahaha
	hourRot = (360/12)*hour + (360/720)*minutes //i.e. we subdivide the clock into 12 sections and multiply the hours
	minRot = 6*minutes
	secRot = (360/60)*sec
}

// a 4x4 matrix multiple by a vec4
function multiply(m, v)
{
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
}
var animationStep =0;
var fooled = false;
function render(){

	var s, t, r;

     	// set up view and projection
    projectionMatrix = ortho(
		(left*AllInfo.zoomFactor-AllInfo.translateX), 
		(right*AllInfo.zoomFactor-AllInfo.translateX), 
		(bottom*AllInfo.zoomFactor-AllInfo.translateY)*(16/16), 
		(ytop*AllInfo.zoomFactor-AllInfo.translateY)*(16/16), near, far);

    eye=vec3(
            AllInfo.Radius*Math.cos(AllInfo.theta*Math.PI/180.0)*Math.cos(AllInfo.phi*Math.PI/180.0),
            AllInfo.Radius*Math.sin(AllInfo.theta*Math.PI/180.0),
            AllInfo.Radius*Math.cos(AllInfo.theta*Math.PI/180.0)*Math.sin(AllInfo.phi*Math.PI/180.0) 
            );
    modelViewMatrix=lookAt(eye, at, up);
	mvMatrixStack.push(modelViewMatrix)
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	/*
		  Y
		  |
		Z/ \X
	    
	*/

	setTexture("textures/carpet.jpg", gl.TEXTURE0,0)
	DrawRoom(0)	
	setTexture("textures/wood.jpg", gl.TEXTURE1,1)
	DrawRoom(1)
	materialAmbient = vec4(   104/255, 76/255, 75/255, 1.0);
    materialDiffuse = vec4( 0., 0., 0., 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,100.0);
	DrawRoom(2)	
	setTexture("textures/blank.jpg", gl.TEXTURE2,2)	
	materialAmbient = vec4( 102/255, 51/255, 0, 1.0);
    materialDiffuse = vec4( 0.1, 0.1, 0.05, 1.0);
    materialSpecular = vec4(  102/255, 51/255, 0, 1.0 );
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
	
	// BEGIN DESK SECTION
	mvMatrixStack.push(modelViewMatrix)
	s = scale4(1,0.8,1)
	modelViewMatrix = mult(mult(modelViewMatrix,s), translate(1,-0.25,-2.75))
	DrawTable()
	modelViewMatrix = mvMatrixStack.pop()

	materialAmbient = vec4( 169/255, 169/255, 169/255, 1.0);
    materialDiffuse = vec4( 169/255, 169/255, 169/255, 1.0);
    materialSpecular = vec4( 169/255, 169/255, 169/255, 1.0 );
    materialShininess = 100.0;
    letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,materialShininess);
	mvMatrixStack.push(modelViewMatrix)
	modelViewMatrix = mult(modelViewMatrix, translate(1,0.35,-2.75))

	DrawMonitor();
	modelViewMatrix = mult(modelViewMatrix, translate(0,-0.27,.75))
	
	DrawKeyboard();
	modelViewMatrix = mvMatrixStack.pop()
	
	mvMatrixStack.push(modelViewMatrix)
	modelViewMatrix = mult(modelViewMatrix, translate(1,-0.75,-1.75))	
	setTexture("textures/plastic.jpg", gl.TEXTURE5,5)
	drawChair()
	setTexture("textures/blank.jpg", gl.TEXTURE2,2)		
	modelViewMatrix = mvMatrixStack.pop()
	
	// Creates the screen
	mvMatrixStack.push(modelViewMatrix)
	s = scale4(0.8,0.8,0.8)
	t = translate(1.25,0.45,-3.25)
	modelViewMatrix = mult(mult(modelViewMatrix, s), t);
	if(!ANIMATEFLAG){
		materialAmbient = vec4( 0/255, 0/255, 0/255, 1.0);
		materialDiffuse = vec4( 0.6, 0.6, 0.6, 1.0);
		materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
	}else{ // if animation is on and the user has been sufficiently fooled
		materialAmbient = vec4( 1/255, 1/255, 1/255, 1.0);
		materialDiffuse = vec4( 1, 1, 1, 1.0);
		materialSpecular = vec4( 0.9, 0.5, 0.6, 1.0 );
		letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);		
		if(fooled){
			var temp = Math.floor((animationStep/4))%33
			if(temp==0)
				temp=1
			console.log(temp)
			console.log("textures/supersecret/secret ("+temp+").jpg")
			setTexture("textures/supersecret/secret ("+temp+").jpg", gl.TEXTURE10,10)
		}else{
			setTexture("textures/zoom.jpg", gl.TEXTURE9,9)	// zoom from the first day of class
		}
	}
	

	DrawMonitor(true); // this is the screen
	modelViewMatrix = mvMatrixStack.pop()
	setTexture("textures/blank.jpg", gl.TEXTURE2,2)		
	
	mvMatrixStack.push(modelViewMatrix)
 	t = translate(-.5,-0.,-2.95)
	r = rotate(45,0,1,0) 
	modelViewMatrix =mult(mult(modelViewMatrix, t), r);
	drawTower()
	modelViewMatrix = mvMatrixStack.pop()	
	

	mvMatrixStack.push(modelViewMatrix)	
 	t = translate(0,0.3,-2.5)
	r = rotate(15,0,1,0) 	
	modelViewMatrix =mult(mult(modelViewMatrix, t), r);	
	drawSpeaker(true)
	modelViewMatrix = mvMatrixStack.pop()
	
	mvMatrixStack.push(modelViewMatrix)		
 	t = translate(2.05,0.3,-2.5)	
	r = rotate(-15,0,1,0) 	
	modelViewMatrix =mult(mult(modelViewMatrix, t), r);	
	drawSpeaker(true)
	modelViewMatrix = mvMatrixStack.pop()		
	// END DESK SECTION

	
	
	mvMatrixStack.push(modelViewMatrix)
	r = rotate(0,0,90,0)
	t = translate(1.75,-0.5,2.75)
	modelViewMatrix = mult(mult(modelViewMatrix, r), t);
	DrawBed()
	modelViewMatrix = mvMatrixStack.pop()	
	
	mvMatrixStack.push(modelViewMatrix)
	r= rotate(135, 0,1,0)
	t = translate(-2.75,-0.69,-2.75)
	modelViewMatrix = mult(mult(modelViewMatrix,t),r);

	DrawBoxFan()
	modelViewMatrix = mvMatrixStack.pop()

	t = translate(-3.5,-1,-3.5)
	
	mvMatrixStack.push(modelViewMatrix)
	modelViewMatrix = mult(modelViewMatrix,t)
	drawBookshelf(1,1,1)
	modelViewMatrix = mvMatrixStack.pop()
	
	materialDiffuse= vec4( 135/255, 0/255, 0/255, 1.0);
    materialAmbient = vec4( 0.8, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 0.8, 0.8, 0.8, 1.0 );
	letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,50.0);
	setTexture("textures/carpet.jpg", gl.TEXTURE0,0)
	drawRug()
	
	materialDiffuse= vec4( 255/255, 255/255, 255/255, 1.0);
    materialAmbient = vec4( 1, 1, 1, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
	letThereBeLight(materialAmbient,materialDiffuse,materialSpecular,1000.0);
	setTexture("textures/thundercat.jpg", gl.TEXTURE4, 4);
	t = translate(-3.95,1.1,1.6)
	
	mvMatrixStack.push(modelViewMatrix)
	modelViewMatrix = mult(modelViewMatrix,t)
	drawPicture()
	modelViewMatrix = mvMatrixStack.pop()
	setTexture("textures/blank.jpg", gl.TEXTURE2,2)	
	// ANIMATION STEP
	if(animationStep==1080)
		animationStep=0;
	//console.log(ANIMATEFLAG)
	if(ANIMATEFLAG)
		animationStep+=1
	if(animationStep > 360){ // this step makes the user think that nothing is happening with the screen
		fooled = true // you have been fooled for the rick roll
		if(!PLAYED){
			console.log("actually went here")
			PLAYED = true // should prevent the song from playing more than once/overlapping
			sound = new Audio("secret.mp3")
			sound.play()		
		}
	}
	modelViewMatrix=mvMatrixStack.pop()
	getTime() // get system time and prepare to animate clock
	mvMatrixStack.push(modelViewMatrix)
	s = scale4(0.8,0.8,0.8)
	t = translate(1.25,2,-4.90)
	modelViewMatrix = mult(mult(modelViewMatrix, s), t);
	drawClock() // the drawing of the clock is independent of animation
	modelViewMatrix = mvMatrixStack.pop()
	requestAnimFrame(render)

}
function setTexture(img,texture,u)
{
	if(img!=""){
	gl.enableVertexAttribArray(vTexCoord);

    // --------create texture object 1----------
    var texture2 = gl.createTexture();

    // create the image object
    texture2.image = new Image();

    // Tell the broswer to load an image
    texture2.image.src=img;

    // register the event handler to be called on loading an image
    texture2.image.onload = function() {  loadTexture(texture2, texture); }

    gl.uniform1i(gl.getUniformLocation(program, "texture"), u);
    // modelViewMatrix=mvMatrixStack.pop();
	}
}
function disableTexture(textureUnit){
	gl.disable(textureUnit)
}
function loadTexture(texture,texIndex)
{
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	gl.activeTexture(texIndex);
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}
function Newell(indices, vert = "glob")
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;
   if(vert=="glob"){
	   for (var i=0; i<L; i++)
	   {
		   index=indices[i];
		   nextIndex = indices[(i+1)%L];
		   
		   x += (vertices[index][1] - vertices[nextIndex][1])*
				(vertices[index][2] + vertices[nextIndex][2]);
		   y += (vertices[index][2] - vertices[nextIndex][2])*
				(vertices[index][0] + vertices[nextIndex][0]);
		   z += (vertices[index][0] - vertices[nextIndex][0])*
				(vertices[index][1] + vertices[nextIndex][1]);
	   }
   }else{
	   for (var i=0; i<L; i++)
	   {
		   index=indices[i];
		   nextIndex = indices[(i+1)%L];
		   
		   x += (cylvertices[index][1] - cylvertices[nextIndex][1])*
				(cylvertices[index][2] + cylvertices[nextIndex][2]);
		   y += (cylvertices[index][2] - cylvertices[nextIndex][2])*
				(cylvertices[index][0] + cylvertices[nextIndex][0]);
		   z += (cylvertices[index][0] - cylvertices[nextIndex][0])*
				(cylvertices[index][1] + cylvertices[nextIndex][1]);
	   }
   }
   return (normalize(vec3(x, y, z)));
}
var lavalampverts = [
	[0,0,0],
	[0.2,0,0],
	[0.1,0.1,0],
	[0.2,0.2,0],
	[0,0.2,0],
	[0.2,0.2,0],
	[0.09,0.8,0],
	[0,0.8,0]
]

function SurfaceRevPoints(verticesArray = []){// provide a vertices array to revolve

	var verticesarr=[]
	var length = lavalampverts.length
	//Setup initial points matrix
	for (var i = 0; i<length; i++)
	{
		verticesarr.push(vec4(lavalampverts[i][0], lavalampverts[i][1], 
                                   lavalampverts[i][2], 1));
	}

	var r;
        var t=Math.PI/3;

        // sweep the original curve another "angle" degree
	for (var j = 0; j < length-1; j++)
	{
                var angle = (j+1)*t; 

		for(var i = 0; i < length ; i++ )
		{	
		        r = verticesarr[i][0];
                verticesarr.push(vec4(r*Math.cos(angle), verticesarr[i][1], -r*Math.sin(angle), 1));
		}    	
	}

       var N=length; 
       // quad strips are formed slice by slice (not layer by layer)
       //          ith slice      (i+1)th slice
       //            i*N+(j+1)-----(i+1)*N+(j+1)
       //               |              |
       //               |              |
       //            i*N+j --------(i+1)*N+j
       // define each quad in counter-clockwise rotation of the vertices
       for (var i=0; i<length-1; i++) // slices
       {
           for (var j=0; j<length-1; j++)  // layers
           {
				quad( (i*N+j), ((i+1)*N+j), ((i+1)*N+(j+1)), (i*N+(j+1)),verticesarr); 
           }
       }    
}