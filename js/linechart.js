class LineChart {
    constructor(_config, _data, _xAxisLabel, _yAxisLabel, _title) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 400,
            containerHeight: _config.containerHeight || 190,
            margin: _config.margin || {
                top: 25,
                right: 50,
                bottom: 50,
                left: 80
            }
        };
        this.data = _data;
        this.xAxisLabel = _xAxisLabel;
        this.yAxisLabel = _yAxisLabel;
        this.title = _title;
        this.initApp();
    }
    initApp() {
        let app = this;
        app.width = app.config.containerWidth - app.config.margin.left - app.config.margin.right;
        app.height = app.config.containerHeight - app.config.margin.top - app.config.margin.bottom;
        app.xScale = d3.scaleLinear().range([
            0,
            app.width - 10
        ]);
        app.yScale = d3.scaleLinear().range([
            app.height,
            0
        ]);
        app.xAxis = d3.axisBottom(app.xScale).ticks(8).tickSizeOuter(0).tickPadding(10).tickFormat(d => d);
        app.yAxis = d3.axisLeft(app.yScale).ticks(8).tickSizeOuter(0).tickPadding(10);
        app.svg = d3.select(app.config.parentElement).attr('width', app.config.containerWidth).attr('height', app.config.containerHeight);
        app.chart = app.svg.append('g').attr('transform', `translate(${ app.config.margin.left },${ app.config.margin.top })`);
        app.xAxisG = app.chart.append('g').attr('class', 'axis x-axis').attr('transform', `translate(0,${ app.height })`);
        app.yAxisG = app.chart.append('g').attr('class', 'axis y-axis');
        app.marks = app.chart.append('g');
        app.trackingArea = app.chart.append('rect').attr('width', app.width).attr('height', app.height).attr('fill', 'none').attr('pointer-events', 'all');
        app.tooltip = app.chart.append('g').attr('class', 'tooltip').style('display', 'none');
        app.tooltip.append('circle').attr('r', 4);
        app.tooltip.append('text');
    }
    formatData() {
        let app = this;
        app.disc_year_dict = {};
        app.disc_year_arr = [];
        app.data.forEach(d => {
            if (app.disc_year_dict[d.disc_year] == undefined) {
                app.disc_year_dict[d.disc_year] = 1;
            } else {
                app.disc_year_dict[d.disc_year] += 1;
            }
        });
        for (const property in app.disc_year_dict) {
            temp = Object();
            temp.year = +property;
            temp.count = app.disc_year_dict[property];
            app.disc_year_arr.push(temp);
        }
        return app.disc_year_arr;
    }
    updateApp() {
        let app = this;
        app.data = app.formatData();
        app.xValue = d => d.year;
        app.yValue = d => d.count;
        app.line = d3.line().x(d => app.xScale(app.xValue(d))).y(d => app.yScale(app.yValue(d)));
        app.xScale.domain(d3.extent(app.data, app.xValue)).nice();
        app.yScale.domain(d3.extent(app.data, app.yValue)).nice();
        app.bisectDate = d3.bisector(app.xValue).left;
        app.renderApp();
    }
    renderApp() {
        let app = this;
        app.marks.selectAll('.chart-line').data([app.data]).join('path').attr('class', 'chart-line').attr('d', app.line);
        app.trackingArea.on('mouseenter', () => {
            app.tooltip.style('display', 'block');
        }).on('mouseleave', () => {
            app.tooltip.style('display', 'none');
        }).on('mousemove', function (event) {
            const xPos = d3.pointer(event, this)[0];
            // First array element is x, second is y
            const date = app.xScale.invert(xPos);
            const index = app.bisectDate(app.data, date, 1);
            const a = app.data[index - 1];
            const b = app.data[index];
            const d = b && date - a.date > b.date - date ? b : a;
            app.tooltip.select('circle').attr('transform', `translate(${ app.xScale(d.year) },${ app.yScale(d.count) })`);
            app.tooltip.select('text').attr('class', 'solar_system').attr('transform', `translate(${ app.xScale(d.year) },${ app.yScale(d.count) - 15 })`).text(d.count + ' planets');
        });
        app.xAxisG.transition().duration(1000).call(app.xAxis);
        app.yAxisG.transition().duration(1000).call(app.yAxis);
        app.chart.append('text').attr('class', 'axis-title').attr('y', app.height + app.config.margin.bottom - 5).attr('x', app.width / 2).style('text-anchor', 'middle').text(app.xAxisLabel);
        app.chart.append('text').attr('class', 'axis-title').attr('transform', 'rotate(-90)').attr('y', 0 - app.config.margin.left).attr('x', 0 - app.height / 2).attr('dy', '1em').style('text-anchor', 'middle').text(app.yAxisLabel);
        app.chart.append('text').attr('x', app.width / 2).attr('y', 0 - app.config.margin.top / 2).attr('text-anchor', 'middle').style('font-size', '15px').text(app.title);
    }
}