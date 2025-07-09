const sizex=200;
const sizey=200;
const size=3;

const hpstart=10000;

const hp0=-20;
const hp1=19;
const hp2=-20;


const stayBias = 100;
//The best strategy for the whole system is to keep a constant distance between all particles.
//This is easy to achieve if everyone is moving in the same direction.
//So by providing the bias, we will force the particles to be a bit lazy bastards.

const populationsize=2000;

let population=[];

const firstlayersize=121;
const secondlayersize=25;
const movesize=9;


let mutation;
let mutategen;


let field=[];
let a=[];

const neurosize=firstlayersize*secondlayersize+secondlayersize*movesize+secondlayersize;
const baisfrom=neurosize-secondlayersize;
const secondlayerfrom=firstlayersize*secondlayersize;

function downloadPopulation(sampleRatio = 0.25) {
	const count = Math.max(1, Math.floor(population.length * sampleRatio));
	const selected = [];

	// Randomly sample without duplicates
	const used = new Set();
	while (selected.length < count) {
		const i = Math.floor(Math.random() * population.length);
		if (!used.has(i)) {
			selected.push(population[i]);
			used.add(i);
		}
	}

	const blob = new Blob([JSON.stringify(selected)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);

	const aTag = document.createElement('a');
	aTag.href = url;
	aTag.download = 'genome_pool.json';
	aTag.click();

	URL.revokeObjectURL(url);
}

function triggerLoad() {
	document.getElementById('loadFile').click();
}

function loadPopulation(evt) {
	const file = evt.target.files[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = function(e) {
		try {
			const baseGenomes = JSON.parse(e.target.result);
			if (!Array.isArray(baseGenomes) || baseGenomes.length === 0) {
				alert("Invalid genome file.");
				return;
			}

			population = [];
			a = [];
			while (population.length < populationsize) {
				const genome = baseGenomes[Math.floor(Math.random() * baseGenomes.length)];
				population.push([...genome]); // clone
				a.push([
					hpstart,
					Math.floor(Math.random() * sizex),
					Math.floor(Math.random() * sizey),
					0
				]);
			}

			console.log("Loaded & replicated:", baseGenomes.length, "→", population.length);
			fillfield();
			draw();
		} catch (err) {
			alert("Load error: " + err.message);
		}
	};

	reader.readAsText(file);
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
}



function recreate(){
	newPopulation();
}


function sortf(c, d) {
	if (c[1] < d[1]) return 1;
	else if (c[1] > d[1]) return -1;
	else return 0;
}

function init(){
	
	mutation=document.getElementById("mutatepercent").value*1;
	mutategen=document.getElementById("mutategen").value*1;
	
	newPopulation();
	
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
		for(var y=0;y<sizey;y++){
			field[x][y]=0;//&=1;
		}
	}
	
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

function updateHealthAndLifetime() {
	for (let i = 0; i < a.length; i++) {
		const x = a[i][1];
		const y = a[i][2];

		const xm = (x - 1 + sizex) % sizex;
		const xp = (x + 1) % sizex;
		const ym = (y - 1 + sizey) % sizey;
		const yp = (y + 1) % sizey;

		a[i][0] += hp0; // base decay

		const neighborSum =
			field[xm][ym] + field[x][ym] + field[xp][ym] +
			field[xm][y]              + field[xp][y] +
			field[xm][yp] + field[x][yp] + field[xp][yp];

		if (neighborSum > 0) a[i][0] += hp1;
		if (field[x][y] > 1) a[i][0] += hp2;

		a[i][3]++; // lifetime++
	}
}

function removeDeadAgents() {
	let j = 0;
	for (let i = 0; i < a.length; i++) {
		if (a[j][0] <= 0) {
			a.splice(j, 1);
			population.splice(j, 1);
		} else {
			j++;
		}
	}
}

function performEvolution() {
	const hello2 = document.getElementById('console-log2');

	if (a.length >= populationsize - 1) return;

	const templength = a.length;
	const addcount = Math.floor((populationsize - a.length) / 2);
	const arrayt = [];

	for (let i = 0; i < a.length; i++) {
		arrayt.push([population[i], a[i][3]]); // [genome, lifetime]
	}
	arrayt.sort(sortf);
	arrayt.length = addcount * 2;

	hello2.innerHTML = arrayt[0][1];

	for (let i = 0; i < addcount; i++) {
		const parent1 = arrayt.splice(Math.floor(Math.random() * arrayt.length), 1)[0][0];
		const parent2 = arrayt.splice(Math.floor(Math.random() * arrayt.length), 1)[0][0];
		const child1 = [], child2 = [];

		for (let j = 0; j < neurosize; j++) {
			if (Math.random() < 0.5) {
				child1[j] = parent1[j];
				child2[j] = parent2[j];
			} else {
				child1[j] = parent2[j];
				child2[j] = parent1[j];
			}
		}

		population.push(child1, child2);

		const at1 = [hpstart, Math.floor(Math.random() * sizex), Math.floor(Math.random() * sizey), 0];
		const at2 = [hpstart, Math.floor(Math.random() * sizex), Math.floor(Math.random() * sizey), 0];
		a.push(at1, at2);
	}

	// Mutation
	const m = 100 / mutation;
	const m2 = mutategen;
	for (let i = templength; i < population.length; i++) {
		if (Math.floor(Math.random() * m) === 0) {
			const numMut = Math.floor(Math.random() * m2) + 1;
			for (let j = 0; j < numMut; j++) {
				const genIndex = Math.floor(Math.random() * neurosize);
				population[i][genIndex] = Math.random() * 1024 - 512;
			}
		}
	}
}

function evaluateNetwork(input, weights) {
	const hiddenLayer = new Array(secondlayersize).fill(0);
	const output = new Array(movesize).fill(0);

	// Input → Hidden
	for (let j = 0; j < secondlayersize; j++) {
		let sum = 0;
		for (let k = 0; k < firstlayersize; k++) {
			sum += input[k] * weights[j * firstlayersize + k];
		}
		sum += weights[baisfrom + j]; // bias
		hiddenLayer[j] = 1 / (1 + Math.exp(-sum)); // sigmoid
	}

	// Hidden → Output
	for (let j = 0; j < movesize; j++) {
		for (let k = 0; k < secondlayersize; k++) {
			output[j] += hiddenLayer[k] * weights[secondlayerfrom + j * secondlayersize + k];
		}
	}

	return output;
}

function decideAndMoveAgents() {
	for (let i = 0; i < a.length; i++) {
		let moves = new Array(movesize).fill(0);
		let firstlayer = new Array(secondlayersize).fill(0);

		const x = a[i][1];
		const y = a[i][2];

		// Toroidal x/y indices
		const xm = [], xp = [], ym = [], yp = [];
		for (let d = 1; d <= 5; d++) {
			xm[d] = (x - d + sizex) % sizex;
			xp[d] = (x + d) % sizex;
			ym[d] = (y - d + sizey) % sizey;
			yp[d] = (y + d) % sizey;
		}

		// Fill 11×11 array (flattened) around agent
		const arrf = [];
		for (let dy = -5; dy <= 5; dy++) {
			const yIndex = dy < 0 ? ym[-dy] : dy > 0 ? yp[dy] : y;
			for (let dx = -5; dx <= 5; dx++) {
				const xIndex = dx < 0 ? xm[-dx] : dx > 0 ? xp[dx] : x;
				arrf.push(field[xIndex][yIndex]);
			}
		}

		const output = evaluateNetwork(arrf, population[i]);
		
		output[4] += stayBias;

		let indmax = 0;
		let max = output[0];
		for (let j = 1; j < output.length; j++) {
			if (output[j] > max) {
				max = output[j];
				indmax = j;
			}
		}

		// Apply movement based on index
		switch (indmax) {
			case 0: a[i][1]--; a[i][2]--; break; // NW
			case 1:           a[i][2]--; break; // N
			case 2: a[i][1]++; a[i][2]--; break; // NE
			case 3: a[i][1]--;            break; // W
			case 4: /* stay */           break; // C
			case 5: a[i][1]++;            break; // E
			case 6: a[i][1]--; a[i][2]++; break; // SW
			case 7:           a[i][2]++; break; // S
			case 8: a[i][1]++; a[i][2]++; break; // SE
		}

		// Wrap around if out of bounds (toroidal)
		a[i][1] = (a[i][1] + sizex) % sizex;
		a[i][2] = (a[i][2] + sizey) % sizey;
	}
}

let c=0;
function countpoints(){
	let hello0=document.getElementById('console-log0').innerHTML=c++;
	
	updateHealthAndLifetime();
	removeDeadAgents();
	performEvolution();
	
	
	decideAndMoveAgents();
	
	fillfield();
	draw();
	
	var hello1=document.getElementById('console-log1');
	hello1.innerHTML=a.length;
	
}
