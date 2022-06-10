var d1 = [];
var d11;
var d2 = [];
var d3 = [];
var d4 = [];
var d5 = [];
var d7;
var pi = 3.14159265;
var t = 0;
var timer = 0;
requestAnimationFrame(plot);
dt = 0.05;
const resolution = 1000;
const  numWP = 2;
const lambda = 0.5;
k = (2 * numWP * Math.PI) / lambda;
dk = 0.05 * k;
k1 = k + dk;
k2 = k - dk;
freq = 1;
df = 0.1;
f1 = freq + df;
f2 = freq - df;
class Wave {
  constructor(A, k, freq, phase) {
    this.A = A;
    this.k = k;
    this.omega = freq;
    this.phase = phase;
  }

  getY(x, t) {
    return this.A * Math.cos(this.k * x - this.omega * t + this.phase)
  }
}

let wave1 = new Wave(1, k1, f1, 0);
let wave2 = new Wave(1, k2, f2, 0);


const k_m = 0.2;
const omega_m = 0;

function plot() {

  A = 1;
  k = 2;
  w = 1;
  phi = 0;


  max = 4 * pi;
  for (i = 0; i < resolution + 1; i++) {
    x = i * max / resolution;
    w1 = wave1.getY(x, t);
    w2 = wave2.getY(x, t);
    d1[i] = [x, w1];
    d11 = [t*f1/k1, 1];
    d2[i] = [x, w2];
    d3[i] = [x, w1 + w2];
    const a = -2 * 1 * Math.cos(df * t - dk * x );
    const b = -1*a;
    d5[i] = [x,a];
    d4[i] = [x,b];

    d7 = [t*df/dk +  (0.5*pi *(df/dk)/(df)) , 0];
    // if((2 * 1 * Math.cos(df * t - dk * x ) )===0)
    // {

    // }
  }
//plot the data
  var data1 = [{data: [d11], color: "red", shadowSize: 0, lines: {show: true},  points: {
      radius: 3,
      show: true,
      symbol: "circle",
      fill:true
    }}, {data: d1, color: "green", shadowSize: 0, lines: {show: true}}];
  var data2 = [{data: d2, color: "blue", shadowSize: 0, lines: {show: true}}];
  var data4 = [{data: d3, color: "rgb(0, 255, 0)", shadowSize: 0, lines: {show: true}}, {
    data: d4,
    color: "orange",
    shadowSize: 0,
    lines: {show: true}
  },
    {
      data: d5,
      color: "orange",
      shadowSize: 0,
      lines: {show: true}
    },
    {data: [d7], color: "red", shadowSize: 0, lines: {show: true},  points: {
        radius: 5,
        show: true,
        symbol: "circle",
        fill:true
      }}];
  $.plot(document.getElementById("placeholder1"), data1, {yaxis: {min: -1.5, max: 1.5}, xaxis: {min: 0, max:6}});
  $.plot(document.getElementById("placeholder2"), data2, {yaxis: {min: -1.5, max: 1.5}, xaxis: {min: 0, max: 6}});
  $.plot(document.getElementById("placeholder3"), data4, {yaxis: {min: -3.5, max: 3.5}, xaxis: {min: 0, max: 6}});

  requestAnimationFrame(plot);
  t = t + dt;
  timer = timer + dt;
}
