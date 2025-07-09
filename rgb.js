const sizex = 200;
const sizey = 200;
const size = 3;

const firstlayersize = 11 * 11 * 3;
const secondlayersize = 25;
const movesize = 9;

const stayBias = 1;

const neurosize = firstlayersize * secondlayersize + secondlayersize * movesize + secondlayersize;
const baisfrom = neurosize - secondlayersize;
const secondlayerfrom = firstlayersize * secondlayersize;

let mutation, mutategen;

const populationsize = 200;
const hpPenaltyFromSelfOrEnemy = 100;
const hpRewardFromFriend = 100;
const baseDecayPerStep = 1;
const crossoverRate = 0.5;
const mutationRange = 4; // genes are random in [-2, 2]

let timerId = false, c = 0;

const agents = [
	{ id: 'R', color: [255, 0, 0], pop: [], a: [], field: [], startHp: 1000, zone: 0 },
	{ id: 'G', color: [0, 255, 0], pop: [], a: [], field: [], startHp: 1000, zone: 1 },
	{ id: 'B', color: [0, 0, 255], pop: [], a: [], field: [], startHp: 1000, zone: 2 },
];

function recreate() {
	agents.forEach(agent => {
		agent.pop = [];
		for (let n = 0; n < populationsize; n++) {
			agent.pop[n] = [];
			for (let i = 0; i < neurosize; i++) agent.pop[n][i] = Math.random() * 4 - 2;
		}
	});
}

function init() {
	mutation = +document.getElementById("mutatepercent").value;
	mutategen = +document.getElementById("mutategen").value;
	recreate();

	const canv = document.getElementById('canv');
	const canvas1 = document.createElement('canvas');
	canvas1.id = "c0";
	canvas1.width = sizex * size;
	canvas1.height = sizey * size;
	canv.appendChild(canvas1);

	agents.forEach(agent => {
		agent.a = [];
		for (let i = 0; i < populationsize; i++) {
			const zoneY = Math.floor(agent.zone * sizey / 3);
			agent.a[i] = [agent.startHp, Math.floor(Math.random() * sizex), zoneY + Math.floor(Math.random() * sizey / 3), 0];
		}
	});

	fillfield();
	draw();
}

function fillfield() {
	agents.forEach(agent => {
		agent.field = Array.from({ length: sizex }, () => new Int8Array(sizey));
		agent.a.forEach(([_, x, y]) => {
			agent.field[x][y]++;
		});
	});
}

function draw() {
	const ctx = document.getElementById('c0').getContext('2d');
	ctx.fillStyle = 'rgb(0,0,0)';
	ctx.fillRect(0, 0, sizex * size, sizey * size);

	for (let x = 0; x < sizex; x++) {
		for (let y = 0; y < sizey; y++) {
			let r = agents[0].field[x][y] > 0 ? 255 : 0;
			let g = agents[1].field[x][y] > 0 ? 255 : 0;
			let b = agents[2].field[x][y] > 0 ? 255 : 0;
			if (r || g || b) {
				ctx.fillStyle = `rgb(${r},${g},${b})`;
				ctx.fillRect(x * size, y * size, size, size);
			}
		}
	}
}

function evaluateNetwork(input, weights) {
	const hiddenLayer = new Array(secondlayersize).fill(0);
	const output = new Array(movesize).fill(0);
	for (let j = 0; j < secondlayersize; j++) {
		let sum = 0;
		for (let k = 0; k < firstlayersize; k++) {
			sum += input[k] * weights[j * firstlayersize + k];
		}
		sum += weights[baisfrom + j];
		hiddenLayer[j] = 1 / (1 + Math.exp(-sum));
	}
	for (let j = 0; j < movesize; j++) {
		for (let k = 0; k < secondlayersize; k++) {
			output[j] += hiddenLayer[k] * weights[secondlayerfrom + j * secondlayersize + k];
		}
	}
	return output;
}

function getInputs(x, y) {
	const input = [];
	for (let dy = -5; dy <= 5; dy++) {
		const yy = (y + dy + sizey) % sizey;
		for (let dx = -5; dx <= 5; dx++) {
			const xx = (x + dx + sizex) % sizex;
			for (let k = 0; k < 3; k++) {
				input.push(agents[k].field[xx][yy]);
			}
		}
	}
	return input;
}

function moveByIndex(agent, index) {
	switch (index) {
		case 0: agent[1]--; agent[2]--; break;
		case 1: agent[2]--; break;
		case 2: agent[1]++; agent[2]--; break;
		case 3: agent[1]--; break;
		case 5: agent[1]++; break;
		case 6: agent[1]--; agent[2]++; break;
		case 7: agent[2]++; break;
		case 8: agent[1]++; agent[2]++; break;
	}
	agent[1] = (agent[1] + sizex) % sizex;
	agent[2] = (agent[2] + sizey) % sizey;
}

function evolveAgent(agentIndex) {
	const agent = agents[agentIndex];
	const enemies = agents[(agentIndex + 2) % 3];
	const friends = agents[(agentIndex + 1) % 3];
	const survivors = [];

	agent.a.forEach((a, i) => {
		const [hp, x, y] = a;

		if (agent.field[x][y] > 1 || enemies.field[x][y] > 0)
			a[0] -= hpPenaltyFromSelfOrEnemy;

		if (friends.field[x][y] > 0)
			a[0] += hpRewardFromFriend;

		a[0] -= baseDecayPerStep;
		a[3]++;

		if (a[0] > 0) survivors.push([agent.pop[i], a]);
	});

	agent.pop = survivors.map(x => x[0]);
	agent.a = survivors.map(x => x[1]);

	if (agent.a.length >= populationsize - 1) return;

	survivors.sort((a, b) => b[1][3] - a[1][3]);
	const addcount = Math.floor((populationsize - agent.a.length) / 2);
	const pool = survivors.slice(0, addcount * 2).map(x => x[0]);

	for (let i = 0; i < addcount; i++) {
		const parent1 = pool[Math.floor(Math.random() * pool.length)];
		const parent2 = pool[Math.floor(Math.random() * pool.length)];

		const child1 = [], child2 = [];

		for (let j = 0; j < neurosize; j++) {
			if (Math.random() < crossoverRate) {
				child1[j] = parent1[j];
				child2[j] = parent2[j];
			} else {
				child1[j] = parent2[j];
				child2[j] = parent1[j];
			}
		}

		[child1, child2].forEach(child => {
			if (Math.random() < mutation / 100) {
				for (let m = 0; m < mutategen; m++) {
					child[Math.floor(Math.random() * neurosize)] = Math.random() * mutationRange - mutationRange / 2;
				}
			}
		});

		const zoneY = Math.floor(agent.zone * sizey / 3);
		agent.pop.push(child1, child2);
		agent.a.push(
			[agent.startHp, Math.floor(Math.random() * sizex), zoneY + Math.floor(Math.random() * sizey / 3), 0],
			[agent.startHp, Math.floor(Math.random() * sizex), zoneY + Math.floor(Math.random() * sizey / 3), 0]
		);
	}
}

function decideAndMove(agentIndex) {
	const agent = agents[agentIndex];
	for (let i = 0; i < agent.a.length; i++) {
		const [_, x, y] = agent.a[i];
		const input = getInputs(x, y);
		const output = evaluateNetwork(input, agent.pop[i]);
		output[4] += stayBias;
		let max = output[0], maxI = 0;
		for (let j = 1; j < output.length; j++) {
			if (output[j] > max) {
				max = output[j];
				maxI = j;
			}
		}
		moveByIndex(agent.a[i], maxI);
	}
}

function countpoints() {
	c++;
	document.getElementById('console-log0').innerHTML = c;

	agents.forEach((_, i) => evolveAgent(i));
	document.getElementById('console-log2').innerHTML =
		agents.map(agent => Math.max(0, ...agent.a.map(a => a[3]))).join(', ');
	agents.forEach((_, i) => decideAndMove(i));
	fillfield();
	draw();

	const hello1 = document.getElementById('console-log1');
	hello1.innerHTML = agents.map(a => a.a.length).join(',');
}

function onestep() { countpoints(); }

function start() {
	if (!timerId) timerId = setInterval(countpoints, 1);
}

function stop() {
	if (timerId) {
		clearInterval(timerId);
		timerId = false;
	}
}
