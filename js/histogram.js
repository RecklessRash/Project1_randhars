class Histogram {
    constructor(config, data, xAxisLabel, yAxisLabel, title) {
        this.config = {
            parentElement: config.parentElement,
            containerWidth: config.containerWidth || 450,
            containerHeight: config.containerHeight || 200,
            margin: config.margin || {
                top: 25,
                right: 50,
                bottom: 55,
                left: 80
            },
            reverseOrder: config.reverseOrder || false,
            tooltipPadding: config.tooltipPadding || 15
        };
        this.data = data;
        this.xAxisLabel = xAxisLabel;
        this.yAxisLabel = yAxisLabel;
        this.title = title;
        this.initApp();
    }
    initApp() {
        const app = this;
        app.width = app.config.containerWidth - app.config.margin.left - app.config.margin.right;
        app.height = app.config.containerHeight - app.config.margin.top - app.config.margin.bottom;
        app.yScale = d3.scaleLinear()
            .range([app.height, 0]);
        app.xScale = d3.scaleLinear()
            .range([0, app.width]);
        app.xAxis = d3.axisBottom(app.xScale)
            .tickSizeOuter(0);
        app.yAxis = d3.axisLeft(app.yScale)
            .tickSizeOuter(0)
            .ticks(6);
        app.svg = d3.select(app.config.parentElement)
            .attr('width', app.config.containerWidth)
            .attr('height', app.config.containerHeight);
        app.chart = app.svg.append('g')
            .attr('transform', `translate(${app.config.margin.left},${app.config.margin.top})`);
        app.xAxisG = app.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${app.height})`);
        app.yAxisG = app.chart.append('g')
            .attr('class', 'axis y-axis');
    }
    updateApp() {
        const app = this;
        app.xScale.domain([0, 2400])
            .nice();
        app.histogram = d3.histogram()
            .value(d => d.sy_dist)
            .domain(app.xScale.domain())
            .thresholds(app.xScale.ticks(10));
        app.bins = app.histogram(app.data);
        app.yScale.domain([0, d3.max(app.bins, d => d.length)])
            .nice();
        app.renderApp();
    }
    renderApp() {
        let app = this;
        let bars = app.chart.selectAll('rect').data(app.bins).enter().append('rect').attr('x', 1).attr('transform', function (d) {
            return 'translate(' + app.xScale(d.x0) + ',' + app.yScale(d.length) + ')';
        }).attr('width', function (d) {
            return app.xScale(d.x1) - app.xScale(d.x0) - 1;
        }).attr('height', function (d) {
            return app.height - app.yScale(d.length);
        }).style('fill', 'steelblue');
        bars.on('mouseover', (_event, d) => {
            d3.select('#tooltip').style('opacity', 1).html(`<div class="tooltip-label">Distance</div>${ d.x0 + ' - ' + d.x1 + ' ' } `);
        }).on('mousemove', event => {
            d3.select('#tooltip').style('left', event.pageX + app.config.tooltipPadding + 'px').style('top', event.pageY + app.config.tooltipPadding + 'px');
        }).on('mouseleave', () => {
            d3.select('#tooltip').style('opacity', 0);
        });
        app.xAxisG.call(app.xAxis).selectAll('text').style('text-anchor', 'start').attr('transform', 'rotate(89)');
        app.yAxisG.transition().duration(1000).call(app.yAxis);
        app.chart.append('text').attr('class', 'axis-title').attr('y', app.height + app.config.margin.bottom - 5).attr('x', app.width / 2).style('text-anchor', 'middle').text(app.xAxisLabel);
        app.chart.append('text').attr('class', 'axis-title').attr('transform', 'rotate(-90)').attr('y', 0 - app.config.margin.left).attr('x', 0 - app.height / 2).attr('dy', '2em').style('text-anchor', 'middle').text(app.yAxisLabel);
        app.chart.append('text').attr('x', app.width / 2).attr('y', 0 - app.config.margin.top / 2).attr('text-anchor', 'middle').style('font-size', '15px').text(app.title);
    }
}