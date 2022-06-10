var d1 = [];
var d3= [];
var pi= 3.14159265;
var t=0;
var timer=0;
requestAnimationFrame(plot);
dt = 0.05;


function plot(){

  A = 1;
  k = 2;
  w = 1;
  phi = 0;

  // document.getElementById('Atext').innerHTML=A.toPrecision(3);
  // document.getElementById('ktext').innerHTML=k.toPrecision(3);
  // document.getElementById('omgtext').innerHTML=w.toPrecision(3);
  // document.getElementById('phitext').innerHTML=phi.toPrecision(3);


  max = 4*pi;
  for (i=0; i<301; i++) {
    x = i*max/300;
    d1[i]=[x,A*Math.cos(k*x-w*t+phi)];
    d3[i]=[x,2*A*Math.cos(k*x-w*t+phi)];
  }
//plot the data
  var data1 = [{ data: d1, color: "rgb(255, 0, 0)", shadowSize:0, lines: {show:true}}];
  var data3 = [{ data: d3, color: "rgb(255, 0, 0)", shadowSize:0, lines: {show:true}}];
  $.plot(document.getElementById("placeholder1"), data1, { yaxis:{ min: -1.5, max: 1.5}, xaxis:{ min: 0, max: 4*pi}});
  $.plot(document.getElementById("placeholder2"), data1, { yaxis:{ min: -1.5, max: 1.5}, xaxis:{ min: 0, max: 4*pi}});
  $.plot(document.getElementById("placeholder3"), data3, { yaxis:{ min: -3.5, max: 3.5}, xaxis:{ min: 0, max: 4*pi}});

  requestAnimationFrame(plot);
  t = t + dt;
  timer = timer +dt;
}
