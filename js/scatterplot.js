// Define class Scatterplot
class Scatterplot {
  // Constructor
  constructor(_configure, _data, _xAxisLabel, _yAxisLabel, _title) {
    // Set up configuration options
    this.configure = {
      parentElement: _configure.parentElement,
      containerWidth: _configure.containerWidth || 400,
      containerHeight: _configure.containerHeight || 190,
      margin: _configure.margin || {
        top: 50,
        right: 50,
        bottom: 40,
        left: 80,
      },
      tooltipPadding: _configure.tooltipPadding || 15,
    };
    // Set up data and axis labels
    this.data = _data;
    this.xAxisLabel = _xAxisLabel;
    this.yAxisLabel = _yAxisLabel;
    this.title = _title;
    // Initialize app
    this.initApp();
  }

  // Initialize app
  initApp() {
    let app = this;
    // Set up width and height based on container and margins
    app.width =
      app.configure.containerWidth -
      app.configure.margin.left -
      app.configure.margin.right;
    app.height =
      app.configure.containerHeight -
      app.configure.margin.top -
      app.configure.margin.bottom;
    // Set up x and y scales
    app.xScale = d3.scaleLog().range([0, app.width]);
    app.yScale = d3.scaleLog().range([app.height, 0]);
    // Set up x and y axes
    app.xAxis = d3
      .axisBottom(app.xScale)
      .ticks(6)
      .tickSizeOuter(0);
    app.yAxis = d3.axisLeft(app.yScale).ticks(6).tickSizeOuter(0);
    // Set up SVG container and position it according to the given margin configuration
    app.svg = d3
      .select(app.configure.parentElement)
      .attr('width', app.configure.containerWidth)
      .attr('height', app.configure.containerHeight);
    app.chart = app.svg
      .append('g')
      .attr(
        'transform',
        `translate(${app.configure.margin.left},${app.configure.margin.top})`
      );
    // Set up x and y axis groups
    app.xAxisG = app.chart
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${app.height})`);
    app.yAxisG = app.chart.append('g').attr('class', 'axis y-axis');
  }

  // Update app
  updateApp() {
    let app = this;
    // Set up x and y value functions
    app.xValue = (d) => d.pl_rade;
    app.yValue = (d) => d.pl_bmasse;
    // Set up x and y domains based on data
    app.xScale.domain(
      d3.extent(app.data, function (d) {
        return d.pl_rade;
      })
    );
    app.yScale.domain(
      d3.extent(app.data, function (d) {
        return d.pl_bmasse;
      })
    );
    // Set up color scale
    app.colorScale = d3
      .scaleOrdinal()
      .range(['#ef9b20', '#87bc45'])
      .domain(['0', '1']);
        app.renderApp();
    }
    renderApp() {
        let app = this;
        const circles = app.chart.selectAll('.point').data(app.data, d => d.trail).join('circle').attr('class', 'point').attr('r', 4).attr('cx', function (d) {
            return app.xScale(d.pl_rade);
        }).attr('cy', function (d) {
            return app.yScale(d.pl_bmasse);
        }).attr('fill', d => app.colorScale(d.solar_system));
        app.chart.selectAll('text').data(app.data).join('text').attr('class', 'solar_system').text(function (d) {
            return `${ d.label }`;
        }).attr('x', function (d) {
            return d.labelXOffset + app.xScale(d.pl_rade);
        }).attr('y', function (d) {
            return d.labelYOffset + app.yScale(d.pl_bmasse);
        });
        circles.on('mouseover', (event, d) => {
            d3.select('#tooltip').style('opacity', 1).style('display', 'block').style('left', event.pageX + app.configure.tooltipPadding + 'px').style('top', event.pageY + app.configure.tooltipPadding + 'px').html(`
        <div class="tooltip-title">${ d.pl_name }</div>
          <p>${ d.pl_rade } ER : ${ d.pl_bmasse } EM</p>
      `);
        }).on('mouseleave', () => {
            d3.select('#tooltip').style('opacity', 0);
        });
        // We use the second .call() to remove the axis and just show gridlines
        app.xAxisG.transition().duration(1000).call(app.xAxis);
        app.yAxisG.transition().duration(1000).call(app.yAxis);
        app.chart.append('text').attr('class', 'axis-title').attr('y', app.height + app.configure.margin.bottom).attr('x', app.width / 2).style('text-anchor', 'middle').text(app.xAxisLabel);
        app.chart.append('text').attr('class', 'axis-title').attr('transform', 'rotate(-90)').attr('y', 0 - app.configure.margin.left).attr('x', 0 - app.height / 2).attr('dy', '2.1em').style('text-anchor', 'middle').text(app.yAxisLabel);
        app.chart.append('text').attr('x', app.width / 2).attr('y', 0 - app.configure.margin.top / 2 - 5).attr('text-anchor', 'middle').style('font-size', '15px').text(app.title);
    }
}