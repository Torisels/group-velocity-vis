"use strict";
// constants
const xMin = 0;
const xMax = 2 * Math.PI;
const amplitude = 1;
const yPadding = 0.5
const yMin = -(amplitude + yPadding);
const yMax = -yMin;

const resolution = 2000;
const resolutionMaxRatio = xMax / resolution;
const circleSize = 4;

// wave constants
const dt = 0.25;
const k = 15;
const dk = 0.05 * k;
const k1 = k + dk;
const k2 = k - dk;
const freq = 1;
const basedf = 0.05;
// global variables for waves
let df;
let f1;
let f2;

let v1;
let v2;
let vg;

let l1;
let l2;

let mod1;
let mod2;

let lsum;
let modsum;

let wave1;
let wave2;
let envelope;

// global variables for plotting
let t = 0;
let first = Array(resolution + 1);
let second = Array(resolution + 1);
let sum = Array(resolution + 1);
let lowerEnvelope = Array(resolution + 1);
let upperEnvelope = Array(resolution + 1);

let sumPoint;
let firstUpperPoint;
let secondUpperPoint;
let currentPreset;

function choosePreset(newPreset) {
    if (newPreset == currentPreset) {
        return;
    }
    currentPreset = newPreset;
    switch (newPreset) {
        case "below0":
            df = -1 * basedf;
            clearAndCalculate();
            break;
        case "equal0":
            df = 0.0;
            clearAndCalculate();
            break;
        case "above0":
            df = basedf;
            clearAndCalculate();
            break;
        default:
            console.warn("This preset does not exist")
            break;
    }
}

function clearAndCalculate() {
    t = 0;
    first = Array(resolution + 1);
    second = Array(resolution + 1);
    sum = Array(resolution + 1);
    lowerEnvelope = Array(resolution + 1);
    upperEnvelope = Array(resolution + 1);

    f1 = freq + df;
    f2 = freq - df;

    v1 = f1 / k1;
    v2 = f2 / k2;
    vg = df / dk;

    l1 = 2 * Math.PI / k1;
    l2 = 2 * Math.PI / k2;

    mod1 = Math.ceil(xMax / l1) * l1;
    mod2 = Math.ceil(xMax / l2) * l2;

    lsum = 2 * Math.PI / dk;
    modsum = Math.ceil(xMax / lsum) * lsum;

    wave1 = new Wave(amplitude, k1, f1, 0);
    wave2 = new Wave(amplitude, k2, f2, 0);
    envelope = new Wave(2 * amplitude, dk, df, 0);
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function plot() {
    // let endTime = new Date();
    // t = endTime - startTime; //in ms
    for (let i = 0; i < resolution; i++) {
        const x = i * resolutionMaxRatio;
        const w1 = wave1.getY(x, t);
        const w2 = wave2.getY(x, t);

        first[i] = [x, w1];
        firstUpperPoint = [(t * v1) % mod1, amplitude];

        second[i] = [x, w2];
        secondUpperPoint = [(t * v2) % mod2, amplitude];

        sum[i] = [x, w1 + w2];

        const upper = envelope.getY(x, t);
        upperEnvelope[i] = [x, upper];
        lowerEnvelope[i] = [x, -1 * upper];
        sumPoint = [mod((t * vg + (0.5 * Math.PI / dk)), modsum), 0];
    }
    let dataFirst = [
        {
            data: first,
            color: "green",
            shadowSize: 0
        },
        {
            data: [firstUpperPoint], color: "red", points: {
                radius: circleSize, show: true, fill: true, fillColor: "red"
            }
        }
    ];
    let dataSecond = [
        {
            data: second,
            color: "blue",
            shadowSize: 0
        },
        {
            data: [secondUpperPoint],
            color: "red",
            points: {
                radius: circleSize, show: true, fill: true, fillColor: "red"
            }
        }];
    let dataSum = [
        {
            data: sum, color: "rgb(0, 255, 0)", shadowSize: 0
        },
        {
            data: lowerEnvelope, color: "orange", shadowSize: 0
        },
        {
            data: upperEnvelope, color: "orange", shadowSize: 0
        },
        {
            data: [sumPoint], color: "red", shadowSize: 0, lines: {show: true}, points: {
                radius: circleSize, show: true, symbol: "circle", fill: true, fillColor: "red"
            }
        }];

    plotToCanvas(dataFirst, dataSecond, dataSum);
    requestAnimationFrame(plot);
    t = t + dt;
}

function plotToCanvas(d1, d2, d3) {
    $.plot(document.getElementById("firstWave"), d1, {yaxis: {min: yMin, max: yMax}, xaxis: {min: xMin, max: xMax}});
    $.plot(document.getElementById("secondWave"), d2, {yaxis: {min: yMin, max: yMax}, xaxis: {min: xMin, max: xMax}});
    $.plot(document.getElementById("sumWave"), d3, {
        yaxis: {min: 2 * yMin, max: 2 * yMax}, xaxis: {min: xMin, max: xMax}
    });
}

window.onload = function () {
    t = 0;
    requestAnimationFrame(plot);
    init();
    choosePreset("below0");
};