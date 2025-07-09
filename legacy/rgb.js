var sizex=200;
var sizey=200;
var size=3;

var hpstartR=1000;
var hpstartG=1000;
var hpstartB=1000;





var populationsizeR=200;
var populationsizeG=200;
var populationsizeB=200;

var populationR=[];
var populationG=[];
var populationB=[];




var firstlayersize=11*11*3;
var secondlayersize=25;
//secondlayersize=121;
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
	populationR=[];
	for(var n=0;n<populationsizeR;n++){
		populationR[n]=[];
		for(var i=0;i<neurosize;i++){
			//populationR[n][i]=Math.floor(Math.random()*128)-64;
			populationR[n][i]=2-Math.random()*4;
		}
	}
	populationG=[];
	for(var n=0;n<populationsizeG;n++){
		populationG[n]=[];
		for(var i=0;i<neurosize;i++){
			populationG[n][i]=2-Math.random()*4;
		}
	}
	populationB=[];
	for(var n=0;n<populationsizeB;n++){
		populationB[n]=[];
		for(var i=0;i<neurosize;i++){
			populationB[n][i]=2-Math.random()*4;
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


var fieldR=[];
var fieldG=[];
var fieldB=[];
var aR=[];
var aG=[];
var aB=[];

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

	
	for(var i=0;i<populationR.length;i++){
		aR[i]=[];
		aR[i][0]=hpstartR;							//hp
		aR[i][1]=Math.floor(Math.random()*sizex);	//x
//		aR[i][2]=Math.floor(Math.random()*sizey);	//y
//		aR[i][1]=Math.floor(0*sizex/3)+Math.floor(Math.random()*sizex/3);	//x
		aR[i][2]=Math.floor(0*sizey/3)+Math.floor(Math.random()*sizey/3);	//y
		aR[i][3]=0;									//killcount
	}
	for(var i=0;i<populationG.length;i++){
		aG[i]=[];
		aG[i][0]=hpstartG;							//hp
		aG[i][1]=Math.floor(Math.random()*sizex);	//x
//		aG[i][2]=Math.floor(Math.random()*sizey);	//y
//		aG[i][1]=Math.floor(1*sizex/3)+Math.floor(Math.random()*sizex/3);	//x
		aG[i][2]=Math.floor(1*sizey/3)+Math.floor(Math.random()*sizey/3);	//y
		aG[i][3]=0;									//killcount
	}
	for(var i=0;i<populationB.length;i++){
		aB[i]=[];
		aB[i][0]=hpstartB;							//hp
		aB[i][1]=Math.floor(Math.random()*sizex);	//x
//		aB[i][2]=Math.floor(Math.random()*sizey);	//y
//		aB[i][1]=Math.floor(2*sizex/3)+Math.floor(Math.random()*sizex/3);	//x
		aB[i][2]=Math.floor(2*sizey/3)+Math.floor(Math.random()*sizey/3);	//y
		aB[i][3]=0;									//killcount
	}

	
	fillfield();
	draw();
	
}

function fillfield(){
	fieldR=[];
	fieldG=[];
	fieldB=[];
	for(var x=0;x<sizex;x++){
		fieldR[x]=new Int8Array(sizey);
		window.crypto.getRandomValues(fieldR[x]);
		fieldG[x]=new Int8Array(sizey);
		window.crypto.getRandomValues(fieldG[x]);
		fieldB[x]=new Int8Array(sizey);
		window.crypto.getRandomValues(fieldB[x]);
		for(var y=0;y<sizey;y++){
			fieldR[x][y]=0;
			fieldG[x][y]=0;
			fieldB[x][y]=0;
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
	
	for(var i=0;i<aR.length;i++){
		fieldR[aR[i][1]][aR[i][2]]++;
	}
	for(var i=0;i<aG.length;i++){
		fieldG[aG[i][1]][aG[i][2]]++;
	}
	for(var i=0;i<aB.length;i++){
		fieldB[aB[i][1]][aB[i][2]]++;
	}
}

function draw(){
	
	var canvas, context, rand;

	canvas=document.getElementById('c0');
	context=canvas.getContext('2d');
	canvas.width=sizex*size, canvas.height=sizey*size;
	//context.fillStyle = 'rgb(127,127,127)';
	context.fillStyle = 'rgb(0,0,0)';
	context.fillRect (0, 0, sizex*size, sizey*size);
	//context.fillStyle = 'rgb(255,255,255)';
	
	/*	
	for(var x=0;x<sizex;x++){
		for(var y=0;y<sizey;y++){
			if(field[x][y]) context.fillRect (x*size, y*size, size, size);
		}
	}
	*/	
	
	/*
	context.fillStyle = 'rgb(0,255,0)';
	for(var i=0;i<aG.length;i++){
		context.fillRect (aG[i][1]*size, aG[i][2]*size, size, size);
	}
	context.fillStyle = 'rgb(0,0,255)';
	for(var i=0;i<aB.length;i++){
		context.fillRect (aB[i][1]*size, aB[i][2]*size, size, size);
	}

	
	
	context.fillStyle = 'rgb(255,0,0)';
	for(var i=0;i<aR.length;i++){
		context.fillRect (aR[i][1]*size, aR[i][2]*size, size, size);
	}
	*/
	
	var c1, c2, c3;
	for(var x=0;x<sizex;x++){
		for(var y=0;y<sizey;y++){
			if(fieldR[x][y]>0)
				c1=255;
			else
				c1=0;
			if(fieldG[x][y]>0)
				c2=255;
			else
				c2=0;
			if(fieldB[x][y]>0)
				c3=255;
			else
				c3=0;
			context.fillStyle = 'rgb('+c1+','+c2+','+c3+')';
			context.fillRect (x*size, y*size, size, size);
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
var killcount=[0,0,0];
function countpoints(){
	c++;
	var hello0=document.getElementById('console-log0');
	hello0.innerHTML=c;
	var hello2=document.getElementById('console-log2');
	
	var xm, xp, ym, yp, x, y;
	
	for(var i=0;i<aR.length;i++){ // count hp
		x=aR[i][1];
		y=aR[i][2];
		
		xm=x-1;
		if(xm<0) xm=sizex+xm;
		xp=x+1;
		if(xp>=sizex) xp=xp-sizex;
		ym=y-1;
		if(ym<0) ym=sizey+ym;
		yp=y+1;
		if(yp>=sizey) yp=yp-sizey;
		
		if(fieldR[x][y]>1 || fieldB[x][y]>0) aR[i][0]-=100;
		if(fieldG[x][y]>0){
		//	aR[i][3]+=fieldG[x][y];
			aR[i][0]+=100;
		}
		aR[i][0]--;
		aR[i][3]++;
	}
	
	
	for(var i=0;i<aG.length;i++){ // count hp
		x=aG[i][1];
		y=aG[i][2];
		
		xm=x-1;
		if(xm<0) xm=sizex+xm;
		xp=x+1;
		if(xp>=sizex) xp=xp-sizex;
		ym=y-1;
		if(ym<0) ym=sizey+ym;
		yp=y+1;
		if(yp>=sizey) yp=yp-sizey;
		
		if(fieldG[x][y]>1 || fieldR[x][y]>0) aG[i][0]-=100;
		if(fieldB[x][y]>0){
		//	aG[i][3]+=fieldB[x][y];
			aG[i][0]+=100;
		}
		aG[i][0]--;
		aG[i][3]++;
	}
	
	
	for(var i=0;i<aB.length;i++){ // count hp
		x=aB[i][1];
		y=aB[i][2];
		
		xm=x-1;
		if(xm<0) xm=sizex+xm;
		xp=x+1;
		if(xp>=sizex) xp=xp-sizex;
		ym=y-1;
		if(ym<0) ym=sizey+ym;
		yp=y+1;
		if(yp>=sizey) yp=yp-sizey;
		
		if(fieldB[x][y]>1 || fieldG[x][y]>0) aB[i][0]-=100;
		if(fieldR[x][y]>0){
		//	aB[i][3]+=fieldR[x][y];
			aB[i][0]+=100;
		}
		aB[i][0]--;
		aB[i][3]++;
	}
	
	
	var j=0;
	for(var i=0;i<aR.length;i++){ // delete deads
		if(aR[j][0]<=0){
			aR.splice(j, 1);
			populationR.splice(j, 1);
		}else{
			j++;
		}
	}
	j=0;
	for(var i=0;i<aG.length;i++){ // delete deads
		if(aG[j][0]<=0){
			aG.splice(j, 1);
			populationG.splice(j, 1);
		}else{
			j++;
		}
	}
	j=0;
	for(var i=0;i<aB.length;i++){ // delete deads
		if(aB[j][0]<=0){
			aB.splice(j, 1);
			populationB.splice(j, 1);
		}else{
			j++;
		}
	}
	
	//console.log(a.length, population.length, 'before');
	
	// add new
	
	
	
	
	

	
	if(aR.length<(populationsizeR-1)){
		
		var templength=aR.length;
		
		//console.log(c, a.length, 'inside');
		
		var addcount=Math.floor((populationsizeR-aR.length)/2);
		var arrayt=[];
		for(var i=0; i<aR.length; i++){
			arrayt[i]=[];
			arrayt[i][0]=populationR[i];
			arrayt[i][1]=aR[i][3];
		}
		arrayt.sort(sortf);
		arrayt.length=addcount*2;
		
		//hello2.innerHTML=arrayt[0][1];
		killcount[0]=arrayt[0][1];
		
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
			
			populationR.push(child1, child2);
			
			var at1=[];
			var at2=[];
			
			at1[0]=hpstartR;						//hp
			at1[1]=Math.floor(Math.random()*sizex);	//x
			//at1[2]=Math.floor(Math.random()*sizey);	//y
			//at1[1]=Math.floor(0*sizex/3)+Math.floor(Math.random()*sizex/3);	//x
			at1[2]=Math.floor(0*sizey/3)+Math.floor(Math.random()*sizey/3);	//y
			at1[3]=0;								//killcount
			
			at2[0]=hpstartR;						//hp
			at2[1]=Math.floor(Math.random()*sizex);	//x
			//at2[2]=Math.floor(Math.random()*sizey);	//y
			//at2[1]=Math.floor(0*sizex/3)+Math.floor(Math.random()*sizex/3);	//x
			at2[2]=Math.floor(0*sizey/3)+Math.floor(Math.random()*sizey/3);	//y
			at2[3]=0;								//killcount
			
			aR.push(at1, at2);
		}
		
		
		// mutation //
		var m=100/mutation;
		var m2=mutategen;//0
		for(var i=templength; i<populationR.length; i++){
			var rnd=Math.floor(Math.random()*(m))+1;
			if(rnd==1){
				var rnd2=Math.floor(Math.random()*(m2))+1;
				for(var j=0;j<rnd2;j++){
					var gen=Math.floor(Math.random()*(neurosize));
					//var genvalue=Math.floor(Math.random()*128)-64;
					var genvalue=2-Math.random()*4;
					populationR[i][gen]=genvalue;
				}
			}
		}
		// mutation //
	
		savePopulation();
		
	}
	
	
	
	if(aG.length<(populationsizeG-1)){
		
		var templength=aG.length;
		
		//console.log(c, a.length, 'inside');
		
		var addcount=Math.floor((populationsizeG-aG.length)/2);
		var arrayt=[];
		for(var i=0; i<aG.length; i++){
			arrayt[i]=[];
			arrayt[i][0]=populationG[i];
			arrayt[i][1]=aG[i][3];
		}
		arrayt.sort(sortf);
		arrayt.length=addcount*2;
		
		//hello2.innerHTML=arrayt[0][1];
		killcount[1]=arrayt[0][1];
		
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
			
			populationG.push(child1, child2);
			
			var at1=[];
			var at2=[];
			
			at1[0]=hpstartG;						//hp
			at1[1]=Math.floor(Math.random()*sizex);	//x
			//at1[2]=Math.floor(Math.random()*sizey);	//y
			//at1[1]=Math.floor(1*sizex/3)+Math.floor(Math.random()*sizex/3);	//x
			at1[2]=Math.floor(1*sizey/3)+Math.floor(Math.random()*sizey/3);	//y
			at1[3]=0;								//killcount
			
			at2[0]=hpstartG;						//hp
			at2[1]=Math.floor(Math.random()*sizex);	//x
			//at2[2]=Math.floor(Math.random()*sizey);	//y
			//at2[1]=Math.floor(1*sizex/3)+Math.floor(Math.random()*sizex/3);	//x
			at2[2]=Math.floor(1*sizey/3)+Math.floor(Math.random()*sizey/3);	//y
			at2[3]=0;								//killcount
			
			aG.push(at1, at2);
		}
		
		
		// mutation //
		var m=100/mutation;
		var m2=mutategen;//0
		for(var i=templength; i<populationG.length; i++){
			var rnd=Math.floor(Math.random()*(m))+1;
			if(rnd==1){
				var rnd2=Math.floor(Math.random()*(m2))+1;
				for(var j=0;j<rnd2;j++){
					var gen=Math.floor(Math.random()*(neurosize));
					//var genvalue=Math.floor(Math.random()*128)-64;
					var genvalue=1-Math.random()*2;
					populationG[i][gen]=genvalue;
				}
			}
		}
		// mutation //
	
		savePopulation();
		
	}
	
	
	
	if(aB.length<(populationsizeB-1)){
		
		var templength=aB.length;
		
		//console.log(c, a.length, 'inside');
		
		var addcount=Math.floor((populationsizeB-aB.length)/2);
		var arrayt=[];
		for(var i=0; i<aB.length; i++){
			arrayt[i]=[];
			arrayt[i][0]=populationB[i];
			arrayt[i][1]=aB[i][3];
		}
		arrayt.sort(sortf);
		arrayt.length=addcount*2;
		
		//hello2.innerHTML=arrayt[0][1];
		killcount[2]=arrayt[0][1];
		
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
			
			populationB.push(child1, child2);
			
			var at1=[];
			var at2=[];
			
			at1[0]=hpstartB;						//hp
			at1[1]=Math.floor(Math.random()*sizex);	//x
			//at1[2]=Math.floor(Math.random()*sizey);	//y
			//at1[1]=Math.floor(2*sizex/3)+Math.floor(Math.random()*sizex/3);	//x
			at1[2]=Math.floor(2*sizey/3)+Math.floor(Math.random()*sizey/3);	//y
			at1[3]=0;								//killcount
			
			at2[0]=hpstartB;						//hp
			at2[1]=Math.floor(Math.random()*sizex);	//x
			//at2[2]=Math.floor(Math.random()*sizey);	//y
			//at2[1]=Math.floor(2*sizex/3)+Math.floor(Math.random()*sizex/3);	//x
			at2[2]=Math.floor(2*sizey/3)+Math.floor(Math.random()*sizey/3);	//y
			at2[3]=0;								//killcount
			
			aB.push(at1, at2);
		}
		
		
		// mutation //
		var m=100/mutation;
		var m2=mutategen;//0
		for(var i=templength; i<populationB.length; i++){
			var rnd=Math.floor(Math.random()*(m))+1;
			if(rnd==1){
				var rnd2=Math.floor(Math.random()*(m2))+1;
				for(var j=0;j<rnd2;j++){
					var gen=Math.floor(Math.random()*(neurosize));
					//var genvalue=Math.floor(Math.random()*128)-64;
					var genvalue=1-Math.random()*2;
					populationB[i][gen]=genvalue;
				}
			}
		}
		// mutation //
	
		savePopulation();
		
	}
	
	hello2.innerHTML=killcount.join(', ');
	

	
	var moves, firstlayer;
	var max, indmax;
	
	
	

	for(var i=0;i<aR.length;i++){ // count new coords

		moves=[];
		firstlayer=[];
		
		var x=aR[i][1];
		var y=aR[i][2];
		

	
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
			fieldR[xm4][ym4],	fieldR[xm3][ym4],	fieldR[xm2][ym4],	fieldR[xm1][ym4],	fieldR[xm0][ym4],	fieldR[x][ym4],	fieldR[xp0][ym4],	fieldR[xp1][ym4],	fieldR[xp2][ym4],	fieldR[xp3][ym4],	fieldR[xp4][ym4],
			fieldR[xm4][ym3],	fieldR[xm3][ym3],	fieldR[xm2][ym3],	fieldR[xm1][ym3],	fieldR[xm0][ym3],	fieldR[x][ym3],	fieldR[xp0][ym3],	fieldR[xp1][ym3],	fieldR[xp2][ym3],	fieldR[xp3][ym3],	fieldR[xp4][ym3],
			fieldR[xm4][ym2],	fieldR[xm3][ym2],	fieldR[xm2][ym2],	fieldR[xm1][ym2],	fieldR[xm0][ym2],	fieldR[x][ym2],	fieldR[xp0][ym2],	fieldR[xp1][ym2],	fieldR[xp2][ym2],	fieldR[xp3][ym2],	fieldR[xp4][ym2],
			fieldR[xm4][ym1],	fieldR[xm3][ym1],	fieldR[xm2][ym1],	fieldR[xm1][ym1],	fieldR[xm0][ym1],	fieldR[x][ym1],	fieldR[xp0][ym1],	fieldR[xp1][ym1],	fieldR[xp2][ym1],	fieldR[xp3][ym1],	fieldR[xp4][ym1],
			fieldR[xm4][ym0],	fieldR[xm3][ym0],	fieldR[xm2][ym0],	fieldR[xm1][ym0],	fieldR[xm0][ym0],	fieldR[x][ym0],	fieldR[xp0][ym0],	fieldR[xp1][ym0],	fieldR[xp2][ym0],	fieldR[xp3][ym0],	fieldR[xp4][ym0],
			fieldR[xm4][y],		fieldR[xm3][y],		fieldR[xm2][y],		fieldR[xm1][y],		fieldR[xm0][y],		fieldR[x][y],	fieldR[xp0][y],		fieldR[xp1][y],		fieldR[xp2][y],		fieldR[xp3][y],		fieldR[xp4][y],
			fieldR[xm4][yp0],	fieldR[xm3][yp0],	fieldR[xm2][yp0],	fieldR[xm1][yp0],	fieldR[xm0][yp0],	fieldR[x][yp0],	fieldR[xp0][yp0],	fieldR[xp1][yp0],	fieldR[xp2][yp0],	fieldR[xp3][yp0],	fieldR[xp4][yp0],
			fieldR[xm4][yp1],	fieldR[xm3][yp1],	fieldR[xm2][yp1],	fieldR[xm1][yp1],	fieldR[xm0][yp1],	fieldR[x][yp1],	fieldR[xp0][yp1],	fieldR[xp1][yp1],	fieldR[xp2][yp1],	fieldR[xp3][yp1],	fieldR[xp4][yp1],
			fieldR[xm4][yp2],	fieldR[xm3][yp2],	fieldR[xm2][yp2],	fieldR[xm1][yp2],	fieldR[xm0][yp2],	fieldR[x][yp2],	fieldR[xp0][yp2],	fieldR[xp1][yp2],	fieldR[xp2][yp2],	fieldR[xp3][yp2],	fieldR[xp4][yp2],
			fieldR[xm4][yp3],	fieldR[xm3][yp3],	fieldR[xm2][yp3],	fieldR[xm1][yp3],	fieldR[xm0][yp3],	fieldR[x][yp3],	fieldR[xp0][yp3],	fieldR[xp1][yp3],	fieldR[xp2][yp3],	fieldR[xp3][yp3],	fieldR[xp4][yp3],
			fieldR[xm4][yp4],	fieldR[xm3][yp4],	fieldR[xm2][yp4],	fieldR[xm1][yp4],	fieldR[xm0][yp4],	fieldR[x][yp4],	fieldR[xp0][yp4],	fieldR[xp1][yp4],	fieldR[xp2][yp4],	fieldR[xp3][yp4],	fieldR[xp4][yp4],
			
			fieldG[xm4][ym4],	fieldG[xm3][ym4],	fieldG[xm2][ym4],	fieldG[xm1][ym4],	fieldG[xm0][ym4],	fieldG[x][ym4],	fieldG[xp0][ym4],	fieldG[xp1][ym4],	fieldG[xp2][ym4],	fieldG[xp3][ym4],	fieldG[xp4][ym4],
			fieldG[xm4][ym3],	fieldG[xm3][ym3],	fieldG[xm2][ym3],	fieldG[xm1][ym3],	fieldG[xm0][ym3],	fieldG[x][ym3],	fieldG[xp0][ym3],	fieldG[xp1][ym3],	fieldG[xp2][ym3],	fieldG[xp3][ym3],	fieldG[xp4][ym3],
			fieldG[xm4][ym2],	fieldG[xm3][ym2],	fieldG[xm2][ym2],	fieldG[xm1][ym2],	fieldG[xm0][ym2],	fieldG[x][ym2],	fieldG[xp0][ym2],	fieldG[xp1][ym2],	fieldG[xp2][ym2],	fieldG[xp3][ym2],	fieldG[xp4][ym2],
			fieldG[xm4][ym1],	fieldG[xm3][ym1],	fieldG[xm2][ym1],	fieldG[xm1][ym1],	fieldG[xm0][ym1],	fieldG[x][ym1],	fieldG[xp0][ym1],	fieldG[xp1][ym1],	fieldG[xp2][ym1],	fieldG[xp3][ym1],	fieldG[xp4][ym1],
			fieldG[xm4][ym0],	fieldG[xm3][ym0],	fieldG[xm2][ym0],	fieldG[xm1][ym0],	fieldG[xm0][ym0],	fieldG[x][ym0],	fieldG[xp0][ym0],	fieldG[xp1][ym0],	fieldG[xp2][ym0],	fieldG[xp3][ym0],	fieldG[xp4][ym0],
			fieldG[xm4][y],		fieldG[xm3][y],		fieldG[xm2][y],		fieldG[xm1][y],		fieldG[xm0][y],		fieldG[x][y],	fieldG[xp0][y],		fieldG[xp1][y],		fieldG[xp2][y],		fieldG[xp3][y],		fieldG[xp4][y],
			fieldG[xm4][yp0],	fieldG[xm3][yp0],	fieldG[xm2][yp0],	fieldG[xm1][yp0],	fieldG[xm0][yp0],	fieldG[x][yp0],	fieldG[xp0][yp0],	fieldG[xp1][yp0],	fieldG[xp2][yp0],	fieldG[xp3][yp0],	fieldG[xp4][yp0],
			fieldG[xm4][yp1],	fieldG[xm3][yp1],	fieldG[xm2][yp1],	fieldG[xm1][yp1],	fieldG[xm0][yp1],	fieldG[x][yp1],	fieldG[xp0][yp1],	fieldG[xp1][yp1],	fieldG[xp2][yp1],	fieldG[xp3][yp1],	fieldG[xp4][yp1],
			fieldG[xm4][yp2],	fieldG[xm3][yp2],	fieldG[xm2][yp2],	fieldG[xm1][yp2],	fieldG[xm0][yp2],	fieldG[x][yp2],	fieldG[xp0][yp2],	fieldG[xp1][yp2],	fieldG[xp2][yp2],	fieldG[xp3][yp2],	fieldG[xp4][yp2],
			fieldG[xm4][yp3],	fieldG[xm3][yp3],	fieldG[xm2][yp3],	fieldG[xm1][yp3],	fieldG[xm0][yp3],	fieldG[x][yp3],	fieldG[xp0][yp3],	fieldG[xp1][yp3],	fieldG[xp2][yp3],	fieldG[xp3][yp3],	fieldG[xp4][yp3],
			fieldG[xm4][yp4],	fieldG[xm3][yp4],	fieldG[xm2][yp4],	fieldG[xm1][yp4],	fieldG[xm0][yp4],	fieldG[x][yp4],	fieldG[xp0][yp4],	fieldG[xp1][yp4],	fieldG[xp2][yp4],	fieldG[xp3][yp4],	fieldG[xp4][yp4],
			
			fieldB[xm4][ym4],	fieldB[xm3][ym4],	fieldB[xm2][ym4],	fieldB[xm1][ym4],	fieldB[xm0][ym4],	fieldB[x][ym4],	fieldB[xp0][ym4],	fieldB[xp1][ym4],	fieldB[xp2][ym4],	fieldB[xp3][ym4],	fieldB[xp4][ym4],
			fieldB[xm4][ym3],	fieldB[xm3][ym3],	fieldB[xm2][ym3],	fieldB[xm1][ym3],	fieldB[xm0][ym3],	fieldB[x][ym3],	fieldB[xp0][ym3],	fieldB[xp1][ym3],	fieldB[xp2][ym3],	fieldB[xp3][ym3],	fieldB[xp4][ym3],
			fieldB[xm4][ym2],	fieldB[xm3][ym2],	fieldB[xm2][ym2],	fieldB[xm1][ym2],	fieldB[xm0][ym2],	fieldB[x][ym2],	fieldB[xp0][ym2],	fieldB[xp1][ym2],	fieldB[xp2][ym2],	fieldB[xp3][ym2],	fieldB[xp4][ym2],
			fieldB[xm4][ym1],	fieldB[xm3][ym1],	fieldB[xm2][ym1],	fieldB[xm1][ym1],	fieldB[xm0][ym1],	fieldB[x][ym1],	fieldB[xp0][ym1],	fieldB[xp1][ym1],	fieldB[xp2][ym1],	fieldB[xp3][ym1],	fieldB[xp4][ym1],
			fieldB[xm4][ym0],	fieldB[xm3][ym0],	fieldB[xm2][ym0],	fieldB[xm1][ym0],	fieldB[xm0][ym0],	fieldB[x][ym0],	fieldB[xp0][ym0],	fieldB[xp1][ym0],	fieldB[xp2][ym0],	fieldB[xp3][ym0],	fieldB[xp4][ym0],
			fieldB[xm4][y],		fieldB[xm3][y],		fieldB[xm2][y],		fieldB[xm1][y],		fieldB[xm0][y],		fieldB[x][y],	fieldB[xp0][y],		fieldB[xp1][y],		fieldB[xp2][y],		fieldB[xp3][y],		fieldB[xp4][y],
			fieldB[xm4][yp0],	fieldB[xm3][yp0],	fieldB[xm2][yp0],	fieldB[xm1][yp0],	fieldB[xm0][yp0],	fieldB[x][yp0],	fieldB[xp0][yp0],	fieldB[xp1][yp0],	fieldB[xp2][yp0],	fieldB[xp3][yp0],	fieldB[xp4][yp0],
			fieldB[xm4][yp1],	fieldB[xm3][yp1],	fieldB[xm2][yp1],	fieldB[xm1][yp1],	fieldB[xm0][yp1],	fieldB[x][yp1],	fieldB[xp0][yp1],	fieldB[xp1][yp1],	fieldB[xp2][yp1],	fieldB[xp3][yp1],	fieldB[xp4][yp1],
			fieldB[xm4][yp2],	fieldB[xm3][yp2],	fieldB[xm2][yp2],	fieldB[xm1][yp2],	fieldB[xm0][yp2],	fieldB[x][yp2],	fieldB[xp0][yp2],	fieldB[xp1][yp2],	fieldB[xp2][yp2],	fieldB[xp3][yp2],	fieldB[xp4][yp2],
			fieldB[xm4][yp3],	fieldB[xm3][yp3],	fieldB[xm2][yp3],	fieldB[xm1][yp3],	fieldB[xm0][yp3],	fieldB[x][yp3],	fieldB[xp0][yp3],	fieldB[xp1][yp3],	fieldB[xp2][yp3],	fieldB[xp3][yp3],	fieldB[xp4][yp3],
			fieldB[xm4][yp4],	fieldB[xm3][yp4],	fieldB[xm2][yp4],	fieldB[xm1][yp4],	fieldB[xm0][yp4],	fieldB[x][yp4],	fieldB[xp0][yp4],	fieldB[xp1][yp4],	fieldB[xp2][yp4],	fieldB[xp3][yp4],	fieldB[xp4][yp4],
		];
	
	
			
		for(var j=0;j<secondlayersize;j++){
			firstlayer[j]=0;
			for(var k=0;k<firstlayersize;k++){
				firstlayer[j]+=arrf[k]*populationR[i][j*firstlayersize+k];
			}
			firstlayer[j]+=populationR[i][j+baisfrom];
			firstlayer[j]=(1/(1+Math.exp(firstlayer[j]*-1)));
		}
	
		for(var j=0;j<movesize;j++){
			moves[j]=0;
			for(var k=0;k<secondlayersize;k++){
				moves[j]+=firstlayer[k]*populationR[i][j*secondlayersize+k+secondlayerfrom];
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
				aR[i][1]--;
				aR[i][2]--;
				break;
			case 1:
				aR[i][1];
				aR[i][2]--;
				break;
			case 2:
				aR[i][1]++;
				aR[i][2]--;
				break;
			case 3:
				aR[i][1]--;
				aR[i][2];
				break;
			case 4:
				aR[i][1];
				aR[i][2];
				break;
			case 5:
				aR[i][1]++;
				aR[i][2];
				break;
			case 6:
				aR[i][1]--;
				aR[i][2]++;
				break;
			case 7:
				aR[i][1];
				aR[i][2]++;
				break;
			case 8:
				aR[i][1]++;
				aR[i][2]++;
				break;
			default:
		}


		
		if(aR[i][1]<0) aR[i][1]=sizex+aR[i][1];
		if(aR[i][1]>=sizex) aR[i][1]=aR[i][1]-sizex;
		
		if(aR[i][2]<0) aR[i][2]=sizey+aR[i][2];
		if(aR[i][2]>=sizey) aR[i][2]=aR[i][2]-sizey;
	

	}
	
	
	
	
	
	fillfield();
	draw();
	
	var hello1=document.getElementById('console-log1');
	hello1.innerHTML=aR.length+','+aG.length+','+aB.length;
	
}