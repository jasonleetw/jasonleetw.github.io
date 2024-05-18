var timeSerie = [];
var randomness = [];
var currentSeasonLength = 4;
var currentSeasonOrderOfMagnitude = 8;
var currentTrend = 1.4;
var shouldDetrend = false;

var fftComponents = [];
var rebuildTimeSerie = [];

var WITH_TRANSITION = true;
var WITHOUT_TRANSITION = false;
var duration = 500;
var NEW_RANDOMNESS = true;
var PRESERVE_RANDOMNESS = false;

//begin: layout conf.
var timelineVizDimension = { width: 960, height: 340 },
  fftVizDimension = { width: 960, height: 160 },
  vizMargin = 5,
  flowWidth = 20;
(legendHeight = 20),
  (xAxisLabelHeight = 10),
  (yAxisLabelWidth = 10),
  (margin = { top: 20, right: 20, bottom: 20, left: 20 }),
  (timelineSvgWidth = timelineVizDimension.width - 2 * vizMargin),
  (timelineSvgHeight =
    timelineVizDimension.height - 2 * vizMargin - flowWidth / 2),
  (fftSvgWidth = fftVizDimension.width - 2 * vizMargin),
  (fftSvgHeight = fftVizDimension.height - 2 * vizMargin - flowWidth / 2),
  (timelineWidth =
    timelineSvgWidth - margin.left - margin.right - yAxisLabelWidth),
  (timelineHeight =
    timelineSvgHeight -
    margin.top -
    margin.bottom -
    xAxisLabelHeight -
    1.5 * legendHeight),
  (fftWidth = fftSvgWidth - margin.left - margin.right - yAxisLabelWidth),
  (fftHeight = fftSvgHeight - margin.top - margin.bottom);
//end: layout conf.

var drag = d3
  .drag()
  .subject(function (d) {
    return d;
  })
  .on("start", dragStarted)
  .on("drag", dragged1)
  .on("end", dragEnded);

var x = d3.scaleLinear().domain([0, 16]).range([0, timelineWidth]);
var y = d3.scaleLinear().domain([0, 50]).range([0, -timelineHeight]);

var xFft = d3.scaleLinear().domain([0, 16]).range([0, fftWidth]);
var yFft = d3.scaleLinear().domain([0, 1]).range([0, -fftHeight]);

var xAxisDef = d3.axisBottom().scale(x).ticks(16);
var yAxisDef = d3.axisLeft().scale(y);

var xAxisFftDef = d3.axisBottom().scale(xFft).tickValues(d3.range(0, 16));
var yAxisFftDef = d3.axisLeft().scale(yFft).ticks(3).tickFormat("");

//being: build layout
var svg = d3
  .select("#timelines")
  .append("svg")
  .attr("width", timelineSvgWidth)
  .attr("height", timelineSvgHeight)
  .append("g")
  .attr("transform", "translate(" + [margin.left, margin.top] + ")");

var container = svg
  .append("g")
  .attr("class", "graph")
  .attr("transform", "translate(" + [yAxisLabelWidth, timelineHeight] + ")");

var grid = container.append("g").attr("class", "grid");
var intersects = [];
d3.range(1, x.invert(timelineWidth) + 1, 1).forEach(function (a) {
  d3.range(5, y.invert(-timelineHeight) + 5, 5).forEach(function (b) {
    intersects.push([a, b]);
  });
});
grid
  .selectAll(".intersect")
  .data(intersects)
  .enter()
  .append("path")
  .classed("intersect", true)
  .attr("d", function (d) {
    return "M" + [x(d[0]) - 1, y(d[1])] + "h3M" + [x(d[0]), y(d[1]) - 1] + "v3";
  });

container
  .append("text")
  .attr("transform", "translate(" + [timelineWidth / 2, -timelineHeight] + ")")
  .attr("text-anchor", "middle")
  .text("Timeline");

container
  .append("g")
  .attr("class", "axis x")
  .call(xAxisDef)
  .append("text")
  .attr("x", timelineWidth)
  .attr("y", -6)
  .style("text-anchor", "end")
  .text("Time");

container
  .append("g")
  .attr("class", "axis y")
  .call(yAxisDef)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", timelineHeight)
  .attr("y", 16)
  .style("text-anchor", "end")
  .text("Amount");

var rebuildTimeline = container
  .append("path")
  .classed("timeline rebuild", true)
  .attr("d", line);

var rebuildDotContainer = container.append("g").classed("dots rebuild", true);

var timeline = container
  .append("path")
  .classed("timeline", true)
  .attr("d", line);

var dotContainer = container.append("g").classed("dots", true);

svg = d3
  .select("#fft")
  .append("svg")
  .attr("width", fftSvgWidth)
  .attr("height", fftSvgHeight)
  .append("g")
  .attr("transform", "translate(" + [margin.left, margin.top] + ")");

container = svg
  .append("g")
  .attr("class", "graph")
  .attr("id", "fft")
  .attr("transform", "translate(" + [yAxisLabelWidth, fftHeight] + ")");

var fftTitle = container
  .append("text")
  .attr("transform", "translate(" + [fftWidth / 2, -fftHeight] + ")")
  .attr("text-anchor", "middle")
  .text("Power spectrum");

grid = container.append("g").attr("class", "grid");
intersects = [];
d3.range(1, xFft.invert(fftWidth), 1).forEach(function (a) {
   d3.range(-1, yFft.invert(-fftHeight) + 0.5, 0.5).forEach(function (b) {
    intersects.push([a, b]);
  });
});
grid
  .selectAll(".intersect")
  .data(intersects)
  .enter()
  .append("path")
  .classed("intersect", true)
  .attr("d", function (d) {
    return (
      "M" +
      [xFft(d[0]) - 1, yFft(d[1])] +
      "h3M" +
      [xFft(d[0]), yFft(d[1]) - 1] +
      "v3"
    );
  });

container
  .append("g")
  .attr("class", "axis x")
  .call(xAxisFftDef)
  .append("text")
  .attr("x", fftWidth)
  .attr("y", -6)
  .style("text-anchor", "end")
  .text("Freqency");

container
  .append("g")
  .attr("class", "axis y")
  .call(yAxisFftDef)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", fftHeight)
  .attr("y", -10)
  .style("text-anchor", "end")
  .text("Apk");

var barContainer = container.append("g").attr("id", "bar-container");
//end: build layout

d3.csv("timeserie.csv", dottype, function (error, dots) {
  computeTimeSerie(PRESERVE_RANDOMNESS);
  computeFftComponents();

  redrawDots(WITHOUT_TRANSITION);
  redrawTimelines(WITHOUT_TRANSITION);
  redrawFftComponents(WITHOUT_TRANSITION);
});

function dottype(d) {
  d.x = +d.x;
  d.y = +d.y + +d.random;
  if (timeSerie.length < 16) {
    //FFT aplies only on ^2 length data
    timeSerie.push(d);
    randomness.push(+d.random);
  }
  return d;
}

var line = d3
  .line()
  .x(function (d) {
    return x(d.x);
  })
  .y(function (d) {
    return y(d.y);
  });

function computeTimeSerie(withRandom) {
  var trend = shouldDetrend ? 0 : currentTrend;
  var intercept = 10;

  var expected;
  timeSerie.forEach(function (d, i) {
    expected = trend * d.x + intercept;
    switch (i % currentSeasonLength) {
      case 0:
        expected -= currentSeasonOrderOfMagnitude;
        break;
      case currentSeasonLength - 1:
        expected += currentSeasonOrderOfMagnitude;
        break;
    }

    if (withRandom) {
      randomness[i] = 3 * (Math.random() - 0.5);
    }
    d.y = expected + randomness[i];
  });
}

function redrawDots(withTransition) {
  var dots = dotContainer.selectAll(".dot").data(timeSerie);
  dots = dots
    .enter()
    .append("circle")
    .classed("dot draggable", true)
    .attr("r", 5)
    .attr("cx", function (d) {
      return x(d.x);
    })
    .call(drag)
    .merge(dots);
  dots
    .transition()
    .duration(withTransition ? duration : 0)
    .attr("cy", function (d) {
      return y(d.y);
    });
}

function redrawTimelines(withTransition) {
  timeline
    .transition()
    .duration(withTransition ? duration : 0)
    .attr("d", line(timeSerie));
}

function computeFftComponents() {
  var complexTimeSerie = timeSerie.map(function (d) {
    return new Complex(d.x, d.y);
  });
  var dataForFft = icfft(complexTimeSerie);
  fftComponents = [];
  dataForFft.forEach(function (d, i) {
    fftComponents.push({
      compIndex: i,
      compCoef: Math.sqrt(Math.pow(d.re, 2) + Math.pow(d.im, 2)),
    });
  });
}

function redrawFftComponents(withTransition) {
  computeFftComponents();
  var maxCoef = fftComponents.reduce(function (acc, component) {
    return Math.max(acc, component.compCoef);
  }, -Infinity);
  yFft.domain([0, maxCoef]);

  bars = barContainer.selectAll(".fft-bar").data(fftComponents);

  bars
    .enter()
    .append("path")
    .classed("fft-bar", true)
    .attr("d", function (d) {
      return (
        "M" +
        [xFft(d.compIndex) - 2, yFft(0)] +
        "h5V" +
        yFft(d.compCoef) +
        "h-5z"
      );
    });
  bars
    .transition()
    .duration(withTransition ? duration : 0)
    .attr("d", function (d) {
      return (
        "M" +
        [xFft(d.compIndex) - 2, yFft(0)] +
        "h5V" +
        yFft(d.compCoef) +
        "h-5z"
      );
    });
}
//begin: handle behaviours (drag, available controls)
function dragStarted(d) {
  d3.select(this).classed("dragging", true);
}

function dragged1(d) {
  d.y += y.invert(d3.event.dy);

  computeFftComponents();

  redrawDots(WITHOUT_TRANSITION);
  redrawTimelines(WITHOUT_TRANSITION);
  redrawFftComponents(WITHOUT_TRANSITION);
}

function dragEnded(d) {
  d3.select(this).classed("dragging", false);
}

function updateSeasonalityPeriod(newSeasonLength) {
  currentSeasonLength = newSeasonLength;
  computeTimeSerie(NEW_RANDOMNESS);
  computeFftComponents();

  redrawDots(WITH_TRANSITION);
  redrawTimelines(WITH_TRANSITION);
  redrawFftComponents(WITH_TRANSITION);
}

function increaseTrend() {
  currentTrend *= 1.6;
  computeTimeSerie(PRESERVE_RANDOMNESS);
  computeFftComponents();

  redrawDots(WITH_TRANSITION);
  redrawTimelines(WITH_TRANSITION);
  redrawFftComponents(WITH_TRANSITION);
}

function decreaseTrend() {
  currentTrend *= 0.625;
  computeTimeSerie(PRESERVE_RANDOMNESS);
  computeFftComponents();

  redrawDots(WITH_TRANSITION);
  redrawTimelines(WITH_TRANSITION);
  redrawFftComponents(WITH_TRANSITION);
}

function increaseSeasonOrderOfMagnitude() {
  currentSeasonOrderOfMagnitude *= 1.6;
  computeTimeSerie(PRESERVE_RANDOMNESS);
  computeFftComponents();

  redrawDots(WITH_TRANSITION);
  redrawTimelines(WITH_TRANSITION);
  redrawFftComponents(WITH_TRANSITION);
}

function decreaseSeasonOrderOfMagnitude() {
  currentSeasonOrderOfMagnitude *= 0.625;
  computeTimeSerie(PRESERVE_RANDOMNESS);
  computeFftComponents();

  redrawDots(WITH_TRANSITION);
  redrawTimelines(WITH_TRANSITION);
  redrawFftComponents(WITH_TRANSITION);
}

function trend() {
  shouldDetrend = false;
  computeTimeSerie(PRESERVE_RANDOMNESS);
  computeFftComponents();

  redrawDots(WITH_TRANSITION);
  redrawTimelines(WITH_TRANSITION);
  redrawFftComponents(WITH_TRANSITION);
}

function detrend() {
  shouldDetrend = true;
  computeTimeSerie(PRESERVE_RANDOMNESS);
  computeFftComponents();

  redrawDots(WITH_TRANSITION);
  redrawTimelines(WITH_TRANSITION);
  redrawFftComponents(WITH_TRANSITION);
}

function handleDetrend(cb) {
  shouldDetrend = cb.checked;
  computeTimeSerie(PRESERVE_RANDOMNESS);
  computeFftComponents();

  redrawDots(WITH_TRANSITION);
  redrawTimelines(WITH_TRANSITION);
  redrawFftComponents(WITH_TRANSITION);
}
//end: handle behaviours (drag, available controls)

/******************************************************************/
/* complex fast fourier transform and inverse from                */
/* https://rosettacode.org/wiki/Fast_Fourier_transform#JavaScript */
/******************************************************************/
function icfft(amplitudes) {
  var N = amplitudes.length;
  var iN = 1 / N;

  //conjugate if imaginary part is not 0
  for (var i = 0; i < N; ++i)
    if (amplitudes[i] instanceof Complex) amplitudes[i].im = -amplitudes[i].im;

  //apply fourier transform
  amplitudes = cfft(amplitudes);

  for (var i = 0; i < N; ++i) {
    //conjugate again
    amplitudes[i].im = -amplitudes[i].im;
    //scale
    amplitudes[i].re *= iN;
    amplitudes[i].im *= iN;
  }
  return amplitudes;
}

function cfft(amplitudes) {
  var N = amplitudes.length;
  if (N <= 1) return amplitudes;

  var hN = N / 2;
  var even = [];
  var odd = [];
  even.length = hN;
  odd.length = hN;
  for (var i = 0; i < hN; ++i) {
    even[i] = amplitudes[i * 2];
    odd[i] = amplitudes[i * 2 + 1];
  }
  even = cfft(even);
  odd = cfft(odd);

  var a = -2 * Math.PI;
  for (var k = 0; k < hN; ++k) {
    if (!(even[k] instanceof Complex)) even[k] = new Complex(even[k], 0);
    if (!(odd[k] instanceof Complex)) odd[k] = new Complex(odd[k], 0);
    var p = k / N;
    var t = new Complex(0, a * p);
    t.cexp(t).mul(odd[k], t);
    amplitudes[k] = even[k].add(t, odd[k]);
    amplitudes[k + hN] = even[k].sub(t, even[k]);
  }
  return amplitudes;
}

/*
basic complex number arithmetic from 
http://rosettacode.org/wiki/Fast_Fourier_transform#Scala
*/
function Complex(re, im) {
  this.re = re;
  this.im = im || 0.0;
}
Complex.prototype.add = function (other, dst) {
  dst.re = this.re + other.re;
  dst.im = this.im + other.im;
  return dst;
};
Complex.prototype.sub = function (other, dst) {
  dst.re = this.re - other.re;
  dst.im = this.im - other.im;
  return dst;
};
Complex.prototype.mul = function (other, dst) {
  //cache re in case dst === this
  var r = this.re * other.re - this.im * other.im;
  dst.im = this.re * other.im + this.im * other.re;
  dst.re = r;
  return dst;
};
Complex.prototype.cexp = function (dst) {
  var er = Math.exp(this.re);
  dst.re = er * Math.cos(this.im);
  dst.im = er * Math.sin(this.im);
  return dst;
};
Complex.prototype.log = function () {
  /*
    although 'It's just a matter of separating out the real and imaginary parts of jw.' is not a helpful quote
    the actual formula I found here and the rest was just fiddling / testing and comparing with correct results.
    http://cboard.cprogramming.com/c-programming/89116-how-implement-complex-exponential-functions-c.html#post637921
    */
  if (!this.re) console.log(this.im.toString() + "j");
  else if (this.im < 0)
    console.log(this.re.toString() + this.im.toString() + "j");
  else console.log(this.re.toString() + "+" + this.im.toString() + "j");
};
