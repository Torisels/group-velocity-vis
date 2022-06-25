"use strict";

// constants
const xMin = 0;
const xMax = 2 * Math.PI;
const amplitude = 1;
const yPadding = 0.5
const yMin = -(amplitude + yPadding);
const yMax = -yMin;

let resolution = 1000;
let resolutionMaxRatio;
const circleSize = 4;

// wave constants
let speedMultiplier = 1;
const dt_c = 0.25;
let dt = speedMultiplier * dt_c;
const k = 20;
const dk = 0.05 * k;
const k1 = k + dk;
const k2 = k - dk;
const freq = 1;
const basedf = 0.07;
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
let colors;

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

    resolutionMaxRatio = xMax / resolution;
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
            color: colors.firstWave,
            shadowSize: 0,
            label: "y\u2081"
        },
        {
            data: [firstUpperPoint], color: colors.dot, points: {
                radius: circleSize, show: true, fill: true, fillColor: colors.dot, shadowSize: 0
            },
            shadowSize: 0
        }
    ];
    let dataSecond = [
        {
            data: second,
            color: colors.secondWave,
            shadowSize: 0,
            label: "y\u2082"
        },
        {
            data: [secondUpperPoint],
            color: colors.dot,
            points: {
                radius: circleSize, show: true, fill: true, fillColor: colors.dot
            }
        }];
    let dataSum = [
        {
            data: sum, color: colors.sumWave, shadowSize: 0, label: "y\u2081 + y\u2082"
        },
        {
            data: lowerEnvelope, color: colors.envelope, shadowSize: 0
        },
        {
            data: upperEnvelope, color: colors.envelope, shadowSize: 0
        },
        {
            data: [sumPoint], color: colors.dot, shadowSize: 0, lines: {show: true}, points: {
                radius: circleSize, show: true, symbol: "circle", fill: true, fillColor: colors.dot
            }
        }];

    plotToCanvas(dataFirst, dataSecond, dataSum);
    requestAnimationFrame(plot);
    t = t + dt;
}

function plotToCanvas(d1, d2, d3) {
    $.plot(document.getElementById("firstWave"), d1, {
        yaxis: {min: yMin, max: yMax}, xaxis: {min: xMin, max: xMax}, legend: {
            show: true,
            backgroundOpacity: 0,
            position: "ne",
        }
    });
    $.plot(document.getElementById("secondWave"), d2, {
        yaxis: {min: yMin, max: yMax}, xaxis: {min: xMin, max: xMax}, legend: {
            show: true,
            backgroundOpacity: 0,
            position: "ne",

        }
    });
    $.plot(document.getElementById("sumWave"), d3, {
        yaxis: {min: -2.5, max: 2.5}, xaxis: {min: xMin, max: xMax}, legend: {
            show: true,
            backgroundOpacity: 0,
            position: "ne",
        }
    });
}

window.onload = function () {
    t = 0;
    init();
    choosePreset("below0");
    requestAnimationFrame(plot);
};

