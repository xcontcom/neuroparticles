var sizex=200;
var sizey=200;
var size=3;

var hpstart=10000;
var hp0=-2;
var hp1=1;
var hp2=-8;

/*
hp0=-5;
hp1=5;
hp2=-10;
*/




hp0=-20;
hp1=19;
hp2=-20;




var populationsize=1000;

var population=[];




var firstlayersize=49;
firstlayersize=81;
firstlayersize=121;
var secondlayersize=25;
//secondlayersize=49;
var movesize=9;


var neurosize=firstlayersize*secondlayersize+secondlayersize*movesize+secondlayersize;
var baisfrom=neurosize-secondlayersize;
var secondlayerfrom=firstlayersize*secondlayersize;


/*
/// local storage functions ///
var PopulationInStorage;
function supportsLocalStorage(){
	return ('localStorage' in window) && window['localStorage'] !== null;
}

function savePopulation(){
	if (!supportsLocalStorage()) { return false; }
	localStorage["neuro.in.Storage"] = PopulationInStorage;
	localStorage["neuro.population"] = JSON.stringify(population);
	return true;
}

function resumePopulation(){
	if (!supportsLocalStorage()) { return false; }
	PopulationInStorage = (localStorage["neuro.in.Storage"] == "true");
	if (!PopulationInStorage) { return false; }
	population=JSON.parse(localStorage["neuro.population"]);
	return true;
}
function newPopulation(){
	population=[];
	localStorage.clear();
	for(var n=0;n<populationsize;n++){
		population[n]=[];
		for(var i=0;i<neurosize;i++){
			//population[n][i]=Math.floor(Math.random()*128)-64;
			population[n][i]=Math.random()*128-64;
		}
	}
	PopulationInStorage = true;
	savePopulation();
}
/// local storage functions ///
*/


/// fuck storage ///
function savePopulation(){
	return true;
}
function resumePopulation(){
	return false;
}
function newPopulation(){
	population=[];
	for(var n=0;n<populationsize;n++){
		population[n]=[];
		for(var i=0;i<neurosize;i++){
			//population[n][i]=Math.floor(Math.random()*128)-64;
			population[n][i]=Math.random()*1024-512;
		}
	}
	savePopulation();
}
/// fuck storage ///



function recreate(){
	newPopulation();
}


function sortf(c, d) {
	if (c[1] < d[1]) return 1;
	else if (c[1] > d[1]) return -1;
	else return 0;
}

var mutation;
var mutategen;


var field=[];
var a=[];

function init(){
	
	mutation=document.getElementById("mutatepercent").value*1;
	mutategen=document.getElementById("mutategen").value*1;
	
	if (!resumePopulation()){
		newPopulation();
	}
	
	var canv=document.getElementById('canv');
	var canvas1=document.createElement('canvas');
	var canvasId="c0";
	canvas1.setAttribute("id", canvasId);
	var div1=document.createElement('div');
	div1.setAttribute("class", "canv0");
	var div2=document.createElement('div');
	div2.appendChild(canvas1);
	div1.appendChild(div2);
	canv.appendChild(div1);

	
	for(var i=0;i<population.length;i++){
		a[i]=[];
		a[i][0]=hpstart;							//hp
		a[i][1]=Math.floor(Math.random()*sizex);	//x
		a[i][2]=Math.floor(Math.random()*sizey);	//y
		a[i][3]=0;									//lifetime
	}
	

	
	fillfield();
	draw();
	
}

function fillfield(){
	field=[];
	for(var x=0;x<sizex;x++){
		field[x]=new Int8Array(sizey);
		window.crypto.getRandomValues(field[x]);
		for(var y=0;y<sizey;y++){
			field[x][y]=0;//&=1;
		}
	}
	
/*
	for(var y=0;y<60;y++){
		//field[25][y+70]=100;
		field[75][y+70]=100;
		field[125][y+70]=100;
		//field[175][y+70]=100;
	}
*/
	
	for(var i=0;i<a.length;i++){
		field[a[i][1]][a[i][2]]++;
	}
}

function draw(){
	
	var canvas, context, rand;

	canvas=document.getElementById('c0');
	context=canvas.getContext('2d');
	canvas.width=sizex*size, canvas.height=sizey*size;
	context.fillStyle = 'rgb(0,0,0)';
	context.fillRect (0, 0, sizex*size, sizey*size);
	context.fillStyle = 'rgb(255,255,255)';
	
	for(var x=0;x<sizex;x++){
		for(var y=0;y<sizey;y++){
			if(field[x][y]) context.fillRect (x*size, y*size, size, size);
		}
	}
	
}


function onestep(){
	countpoints();
}
var timerId;
function start(){
	if(!timerId){
		timerId = setInterval(function() {
			countpoints();
		}, 1);
	}
	
};
function stop(){
	if(timerId){
		clearInterval(timerId);
		timerId=false;
	}
};

var c=0;
function countpoints(){
	c++;
	var hello0=document.getElementById('console-log0');
	hello0.innerHTML=c;
	
	var xm, xp, ym, yp, x, y;
	for(var i=0;i<a.length;i++){ // count hp
		
		x=a[i][1];
		y=a[i][2];
		
		xm=x-1;
		if(xm<0) xm=sizex+xm;
		xp=x+1;
		if(xp>=sizex) xp=xp-sizex;
		
		ym=y-1;
		if(ym<0) ym=sizey+ym;
		yp=y+1;
		if(yp>=sizey) yp=yp-sizey;
		
		a[i][0]+=hp0;
		//var sum=field[xm][ym]+field[x][ym]+field[xp][ym]+field[xm][y]+field[xp][y]+field[xm][yp]+field[x][yp]+field[xp][yp];
		//if(sum>0) a[i][0]+=sum;
		if(field[xm][ym]+field[x][ym]+field[xp][ym]+field[xm][y]+field[xp][y]+field[xm][yp]+field[x][yp]+field[xp][yp]>0) a[i][0]+=hp1;
		if(field[x][y]>1) a[i][0]+=hp2;
		
		a[i][3]++;
		
	}
	
	
	var j=0;
	for(var i=0;i<a.length;i++){ // delete deads
		if(a[j][0]<=0){
			
			a.splice(j, 1);
			population.splice(j, 1);
			
		}else{
			j++;
		}
	}
	
	//console.log(a.length, population.length, 'before');
	
	// add new
	
	
	var hello2=document.getElementById('console-log2');
	
	if(a.length<(populationsize-1)){
		
		var templength=a.length;
		
		//console.log(c, a.length, 'inside');
		
		var addcount=Math.floor((populationsize-a.length)/2);
		var arrayt=[];
		for(var i=0; i<a.length; i++){
			arrayt[i]=[];
			arrayt[i][0]=population[i];
			arrayt[i][1]=a[i][3];
		}
		arrayt.sort(sortf);
		arrayt.length=addcount*2;
		
		hello2.innerHTML=arrayt[0][1];
		
		for(var i=0;i<addcount;i++){
			var removed1=Math.floor(Math.random()*(arrayt.length));
			var parent1f = arrayt.splice(removed1,1);
			var parent1=parent1f[0][0]; //take first parent from temp array
			var removed2=Math.floor(Math.random()*(arrayt.length));
			var parent2f = arrayt.splice(removed2,1);
			var parent2=parent2f[0][0]; //take second parent from temp array
			var child1=[];
			var child2=[];
			for(var j=0; j<neurosize; j++){
				var gen=Math.round(Math.random());
				if(gen==1){
					child1[j]=parent1[j];
					child2[j]=parent2[j];
				}else{
					child1[j]=parent2[j];
					child2[j]=parent1[j];
				}
			}
			
			population.push(child1, child2);
			
			var at1=[];
			var at2=[];
			
			at1[0]=hpstart;							//hp
			at1[1]=Math.floor(Math.random()*sizex);	//x
			at1[2]=Math.floor(Math.random()*sizey);	//y
			at1[3]=0;								//lifetime
			
			at2[0]=hpstart;							//hp
			at2[1]=Math.floor(Math.random()*sizex);	//x
			at2[2]=Math.floor(Math.random()*sizey);	//y
			at2[3]=0;								//lifetime
			
			a.push(at1, at2);
		}
		
		
		// mutation //
		var m=100/mutation;
		var m2=mutategen;//0
		for(var i=templength; i<population.length; i++){
			var rnd=Math.floor(Math.random()*(m))+1;
			if(rnd==1){
				var rnd2=Math.floor(Math.random()*(m2))+1;
				for(var j=0;j<rnd2;j++){
					var gen=Math.floor(Math.random()*(neurosize));
					//var genvalue=Math.floor(Math.random()*128)-64;
					var genvalue=Math.random()*1024-512;
					population[i][gen]=genvalue;
				}
			}
		}
		// mutation //
	
		savePopulation();
		
	}
	
	
	var moves, firstlayer;
	var max, indmax;
	for(var i=0;i<a.length;i++){ // count new coords

		
		moves=[];
		firstlayer=[];
		
		var x=a[i][1];
		var y=a[i][2];
		

	
		xm0=x-1;
		xm1=x-2;
		xm2=x-3;
		xm3=x-4;
		xm4=x-5;
		if(xm0<0) xm0=sizex+xm0;
		if(xm1<0) xm1=sizex+xm1;
		if(xm2<0) xm2=sizex+xm2;
		if(xm3<0) xm3=sizex+xm3;
		if(xm4<0) xm4=sizex+xm4;
		xp0=x+1;
		xp1=x+2;
		xp2=x+3;
		xp3=x+4;
		xp4=x+5;
		if(xp0>=sizex) xp0=xp0-sizex;
		if(xp1>=sizex) xp1=xp1-sizex;
		if(xp2>=sizex) xp2=xp2-sizex;
		if(xp3>=sizex) xp3=xp3-sizex;
		if(xp4>=sizex) xp4=xp4-sizex;

		ym0=y-1;
		ym1=y-2;
		ym2=y-3;
		ym3=y-4;
		ym4=y-5;
		if(ym0<0) ym0=sizey+ym0;
		if(ym1<0) ym1=sizey+ym1;
		if(ym2<0) ym2=sizey+ym2;
		if(ym3<0) ym3=sizey+ym3;
		if(ym4<0) ym4=sizey+ym4;
		yp0=y+1;
		yp1=y+2;
		yp2=y+3;
		yp3=y+4;
		yp4=y+5;
		if(yp0>=sizey) yp0=yp0-sizey;
		if(yp1>=sizey) yp1=yp1-sizey;
		if(yp2>=sizey) yp2=yp2-sizey;
		if(yp3>=sizey) yp3=yp3-sizey;
		if(yp4>=sizey) yp4=yp4-sizey;
		
		

		var arrf=[
			field[xm4][ym4],	field[xm3][ym4],	field[xm2][ym4],	field[xm1][ym4],	field[xm0][ym4],	field[x][ym4],	field[xp0][ym4],	field[xp1][ym4],	field[xp2][ym4],	field[xp3][ym4],	field[xp4][ym4],
			field[xm4][ym3],	field[xm3][ym3],	field[xm2][ym3],	field[xm1][ym3],	field[xm0][ym3],	field[x][ym3],	field[xp0][ym3],	field[xp1][ym3],	field[xp2][ym3],	field[xp3][ym3],	field[xp4][ym3],
			field[xm4][ym2],	field[xm3][ym2],	field[xm2][ym2],	field[xm1][ym2],	field[xm0][ym2],	field[x][ym2],	field[xp0][ym2],	field[xp1][ym2],	field[xp2][ym2],	field[xp3][ym2],	field[xp4][ym2],
			field[xm4][ym1],	field[xm3][ym1],	field[xm2][ym1],	field[xm1][ym1],	field[xm0][ym1],	field[x][ym1],	field[xp0][ym1],	field[xp1][ym1],	field[xp2][ym1],	field[xp3][ym1],	field[xp4][ym1],
			field[xm4][ym0],	field[xm3][ym0],	field[xm2][ym0],	field[xm1][ym0],	field[xm0][ym0],	field[x][ym0],	field[xp0][ym0],	field[xp1][ym0],	field[xp2][ym0],	field[xp3][ym0],	field[xp4][ym0],
			field[xm4][y],		field[xm3][y],		field[xm2][y],		field[xm1][y],		field[xm0][y],		field[x][y],	field[xp0][y],		field[xp1][y],		field[xp2][y],		field[xp3][y],		field[xp4][y],
			field[xm4][yp0],	field[xm3][yp0],	field[xm2][yp0],	field[xm1][yp0],	field[xm0][yp0],	field[x][yp0],	field[xp0][yp0],	field[xp1][yp0],	field[xp2][yp0],	field[xp3][yp0],	field[xp4][yp0],
			field[xm4][yp1],	field[xm3][yp1],	field[xm2][yp1],	field[xm1][yp1],	field[xm0][yp1],	field[x][yp1],	field[xp0][yp1],	field[xp1][yp1],	field[xp2][yp1],	field[xp3][yp1],	field[xp4][yp1],
			field[xm4][yp2],	field[xm3][yp2],	field[xm2][yp2],	field[xm1][yp2],	field[xm0][yp2],	field[x][yp2],	field[xp0][yp2],	field[xp1][yp2],	field[xp2][yp2],	field[xp3][yp2],	field[xp4][yp2],
			field[xm4][yp3],	field[xm3][yp3],	field[xm2][yp3],	field[xm1][yp3],	field[xm0][yp3],	field[x][yp3],	field[xp0][yp3],	field[xp1][yp3],	field[xp2][yp3],	field[xp3][yp3],	field[xp4][yp3],
			field[xm4][yp4],	field[xm3][yp4],	field[xm2][yp4],	field[xm1][yp4],	field[xm0][yp4],	field[x][yp4],	field[xp0][yp4],	field[xp1][yp4],	field[xp2][yp4],	field[xp3][yp4],	field[xp4][yp4],
		]
	
	
			
		for(var j=0;j<secondlayersize;j++){
			firstlayer[j]=0;
			for(var k=0;k<firstlayersize;k++){
				firstlayer[j]+=arrf[k]*population[i][j*firstlayersize+k];
			}
			firstlayer[j]+=population[i][j+baisfrom];
			firstlayer[j]=(1/(1+Math.exp(firstlayer[j]*-1)));
		}
	
		for(var j=0;j<movesize;j++){
			moves[j]=0;
			for(var k=0;k<secondlayersize;k++){
				moves[j]+=firstlayer[k]*population[i][j*secondlayersize+k+secondlayerfrom];
			}
		}
		
		
		
		
		
		max=moves[0];
		indmax=0;
		
		for(var j=0;j<movesize;j++){
			if(moves[j]>max){
				max=moves[j];
				indmax=j;
			}
		}
		
		
		switch (indmax) {
			case 0:
				a[i][1]--;
				a[i][2]--;
				break;
			case 1:
				a[i][1];
				a[i][2]--;
				break;
			case 2:
				a[i][1]++;
				a[i][2]--;
				break;
			case 3:
				a[i][1]--;
				a[i][2];
				break;
			case 4:
				a[i][1];
				a[i][2];
				break;
			case 5:
				a[i][1]++;
				a[i][2];
				break;
			case 6:
				a[i][1]--;
				a[i][2]++;
				break;
			case 7:
				a[i][1];
				a[i][2]++;
				break;
			case 8:
				a[i][1]++;
				a[i][2]++;
				break;
			default:
		}
		
		if(a[i][1]<0) a[i][1]=sizex+a[i][1];
		if(a[i][1]>=sizex) a[i][1]=a[i][1]-sizex;
		
		if(a[i][2]<0) a[i][2]=sizey+a[i][2];
		if(a[i][2]>=sizey) a[i][2]=a[i][2]-sizey;
		
	}
	
	fillfield();
	draw();
	
	var hello1=document.getElementById('console-log1');
	hello1.innerHTML=a.length;
	
}