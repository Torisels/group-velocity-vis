"use strict";
requestAnimationFrame(plot);

var d1 = [];
var d11;
var d2 = [];
var d3 = [];
var d4 = [];
var d5 = [];
var d7;
let t = 0;

const dt = 0.05;
const resolution = 2000;
const numWP = 2;
const lambda = 0.5;

const k = (2 * numWP * Math.PI) / lambda;
const dk = 0.05 * k;
const k1 = k + dk;
const k2 = k - dk;
const freq = 1;
const df = -0.5;
const f1 = freq + df;
const f2 = freq - df;


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

const amplitude = 1;

let wave1 = new Wave(amplitude, k1, f1, 0);
let wave2 = new Wave(amplitude, k2, f2, 0);
let envelope = new Wave(2 * amplitude, dk, df, 0);

function plot() {
  const max = 4 * Math.PI;
  for (let i = 0; i < resolution + 1; i++) {
    const x = i * max / resolution;
    const w1 = wave1.getY(x, t);
    const w2 = wave2.getY(x, t);
    d1[i] = [x, w1];
    d11 = [t * f1 / k1, 1];
    d2[i] = [x, w2];
    d3[i] = [x, w1 + w2];
    const upper = envelope.getY(x, t);
    d5[i] = [x, upper];
    d4[i] = [x, -1 * upper];
    d7 = [t * df / dk + (1.5 * Math.PI / dk), 0];
  }
  var data1 = [{
    data: [d11], color: "red", shadowSize: 0, lines: {show: true}, points: {
      radius: 3,
      show: true,
      symbol: "circle",
      fill: true
    }
  }, {data: d1, color: "green", shadowSize: 0, lines: {show: true}}];
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
    {
      data: [d7], color: "red", shadowSize: 0, lines: {show: true}, points: {
        radius: 5,
        show: true,
        symbol: "circle",
        fill: true
      }
    }];
  $.plot(document.getElementById("placeholder1"), data1, {yaxis: {min: -1.5, max: 1.5}, xaxis: {min: 0, max: 6}});
  $.plot(document.getElementById("placeholder2"), data2, {yaxis: {min: -1.5, max: 1.5}, xaxis: {min: 0, max: 6}});
  $.plot(document.getElementById("placeholder3"), data4, {yaxis: {min: -3.5, max: 3.5}, xaxis: {min: 0, max: 6}});

  requestAnimationFrame(plot);
  t = t + dt;
}
