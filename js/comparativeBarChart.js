class comparativeBarChart {
    constructor(_config, _data, sub_groups, xAxisLabel, yAxisLabel, _title) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 400,
            containerHeight: _config.containerHeight || 200,
            margin: _config.margin || {
                top: 25,
                right: 5,
                bottom: 45,
                left: 40
            },
            reverseOrder: _config.reverseOrder || false,
            tooltipPadding: _config.tooltipPadding || 15
        };
        this.data = _data;
        this.xAxisLabel = xAxisLabel;
        this.yAxisLabel = yAxisLabel;
        this.sub_groups = sub_groups;
        this.title = _title;
        this.initApp();
    }
    initApp() {
        let app = this;
        app.width = app.config.containerWidth - app.config.margin.left - app.config.margin.right;
        app.height = app.config.containerHeight - app.config.margin.top - app.config.margin.bottom;
        app.groups = d3.map(app.data, d => d.group);
        app.yScale = d3.scaleLinear().range([
            app.height,
            0
        ]);
        app.xScale = d3.scaleBand().range([
            0,
            app.width
        ]).paddingInner([0.2]);
        app.xAxis = d3.axisBottom(app.xScale).tickSizeOuter(0);
        app.yAxis = d3.axisLeft(app.yScale).tickSizeOuter(0).ticks(6);
        app.svg = d3.select(app.config.parentElement).attr('width', app.config.containerWidth).attr('height', app.config.containerHeight);
        app.chart = app.svg.append('g').attr('transform', `translate(${ app.config.margin.left },${ app.config.margin.top })`);
        app.xAxisG = app.chart.append('g').attr('class', 'axis x-axis').attr('transform', `translate(0,${ app.height })`);
        app.yAxisG = app.chart.append('g').attr('class', 'axis y-axis');
        app.color = d3.scaleOrdinal().domain(app.sub_groups).range([
            '#b30000',
            '#5ad45a'
        ]);
        app.updateApp();
    }
    updateApp() {
        let app = this;
        console.log(app.data);
        app.xScale.domain(app.groups);
        app.yScale.domain(d3.extent(app.data, function (d) {
            return d.notHabitable;
        })).nice();
        app.xSubgroup = d3.scaleBand().domain(app.sub_groups).range([
            0,
            app.xScale.bandwidth()
        ]).padding([0.05]);
        app.renderApp();
    }
    renderApp() {
        let app = this;
        let bars = app.chart.append('g').selectAll('g').data(app.data).enter().append('g').attr('transform', function (d) {
            return 'translate(' + app.xScale(d.group) + ',0)';
        }).selectAll('rect').data(function (d) {
            return app.sub_groups.map(function (key) {
                return {
                    key: key,
                    value: d[key]
                };
            });
        }).enter().append('rect').attr('class', 'comparativeBar').attr('x', function (d) {
            return app.xSubgroup(d.key);
        }).attr('y', function (d) {
            return app.yScale(d.value);
        }).attr('width', app.xSubgroup.bandwidth()).attr('height', function (d) {
            return app.height - app.yScale(d.value);
        }).attr('fill', function (d) {
            return app.color(d.key);
        });
        bars.on('mouseover', (event, d) => {
            d3.select('#tooltip').style('opacity', 1).html(`<div class="tooltip-label">Amount of Planets</div>${ d3.format(',')(d.value) }`);
        }).on('mousemove', event => {
            d3.select('#tooltip').style('left', event.pageX + app.config.tooltipPadding + 'px').style('top', event.pageY + app.config.tooltipPadding + 'px');
        }).on('mouseleave', () => {
            d3.select('#tooltip').style('opacity', 0);
        });
        app.xAxisG.transition().duration(1000).call(app.xAxis);
        app.yAxisG.transition().duration(1000).call(app.yAxis);
        app.chart.append('text').attr('class', 'axis-title').attr('y', app.height + app.config.margin.bottom - 5).attr('x', app.width / 2).style('text-anchor', 'middle').text(app.xAxisLabel);
        app.chart.append('text').attr('class', 'axis-title').attr('y', 0 - app.config.margin.left - 5).attr('x', 0 - app.height / 2).attr('dy', '1em').style('text-anchor', 'middle').text(app.yAxisLabel);
        app.chart.append('text').attr('x', app.width / 2).attr('y', 0 - app.config.margin.top / 2).attr('text-anchor', 'middle').style('font-size', '15px').text(app.title);
    }
}