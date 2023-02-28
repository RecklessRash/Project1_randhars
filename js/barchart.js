class Barchart {
    constructor(config, data, property, xAxisLabel, yAxisLabel, title) {
      this.config = {
        parentElement: config.parentElement,
        containerWidth: config.containerWidth ?? 425,
        containerHeight: config.containerHeight ?? 410,
        margin: config.margin ?? {
          top: 50,
          right: 50,
          bottom: 85,
          left: 80
        },
        reverseOrder: config.reverseOrder ?? false,
        tooltipPadding: config.tooltipPadding ?? 15
      };
      this.data = data;
      this.xAxisLabel = xAxisLabel;
      this.yAxisLabel = yAxisLabel;
      this.title = title;
      this.property = property;
      this.initApp();
    }
    initApp() {
        this.width = this.config.containerWidth - this.config.margin.left - this.config.margin.right;
        this.height = this.config.containerHeight - this.config.margin.top - this.config.margin.bottom;
    
        // Use destructuring to simplify and make code more readable
        [this.yScale, this.xScale] = [
          d3.scaleLinear().range([this.height, 0]),
          d3.scaleBand().range([0, this.width]).paddingInner(0.2)
        ];
    
        this.xAxis = d3.axisBottom(this.xScale).tickSizeOuter(0);
        this.yAxis = d3.axisLeft(this.yScale).tickSizeOuter(0).ticks(6);
    
        this.svg = d3.select(this.config.parentElement)
          .attr('width', this.config.containerWidth)
          .attr('height', this.config.containerHeight);
    
        this.chart = this.svg.append('g')
          .attr('transform', `translate(${ this.config.margin.left },${ this.config.margin.top })`);
    
        this.xAxisG = this.chart.append('g')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0,${ this.height })`);
    
        this.yAxisG = this.chart.append('g')
          .attr('class', 'axis y-axis');
      }
    updateApp() {
        let app = this;
        if (app.property == 'st_spectype') {
            app.data.forEach(d => {
                d[app.property] = d[app.property].charAt(0);
                if (d[app.property] == '' || d[app.property] == 'U') {
                    d[app.property] = 'Blank';
                }
            });
        }
        app.gfg = d3.rollups(app.data, g => g.length, d => d[app.property]);
        app.aggregatedData = Array.from(app.gfg, ([key, count]) => ({
            key,
            count
        }));
        app.temp_arr = [];
        app.temp_other_count = 0;
        app.aggregatedData.forEach(d => {
            if (app.property == 'st_spectype') {
                if (d.key == 'A' || d.key == 'F' || d.key == 'G' || d.key == 'K' || d.key == 'M' || d.key == 'Blank') {
                    app.temp_arr.push(d);
                }
                app.aggregatedData = app.temp_arr;
            }
            if (app.property == 'discoverymethod') {
                if (d.count >= 30) {
                    app.temp_arr.push(d);
                } else {
                    app.temp_other_count += d.count;
                }
                app.aggregatedData = app.temp_arr;
            }
        });
        if (app.property == 'discoverymethod') {
            app.aggregatedData.push({
                key: 'Other',
                count: app.temp_other_count
            });
        }
        app.aggregatedData.sort((a, b) => b.count - a.count);
        app.xValue = d => d.key;
        app.yValue = d => d.count;
        app.xScale.domain(app.aggregatedData.map(app.xValue));
        app.yScale.domain([
            0,
            d3.max(app.aggregatedData, app.yValue)
        ]).nice();
        app.renderApp();
    }
    renderApp() {
        let app = this;
        let bars = app.chart.selectAll('.bar').data(app.aggregatedData, app.xValue).join('rect');
        bars.style('opacity', 0.5).transition().duration(1000).style('opacity', 1).attr('class', 'bar').attr('x', d => app.xScale(app.xValue(d))).attr('width', app.xScale.bandwidth()).attr('height', d => app.height - app.yScale(app.yValue(d))).attr('y', d => app.yScale(app.yValue(d)));
        bars.on('click', function (_event, d) {
            const isActive = dataFilter.includes(d.key);
            if (isActive) {
                dataFilter = dataFilter.filter(f => f !== d.key);
            } else {
                dataFilter.push(d.key);
                d3.select(this).classed('active', !isActive);    // Add class to style active filters with CSS
            }
            filterData(app.property);
        });
        bars.on('mouseover', (event, d) => {
            d3.select('#tooltip').style('opacity', 1)    // Format number with million and thousand separator
.html(`<div class="tooltip-label">Amount of Planets</div>${ d3.format(',')(d.count) }`);
        }).on('mousemove', event => {
            d3.select('#tooltip').style('left', event.pageX + app.config.tooltipPadding + 'px').style('top', event.pageY + app.config.tooltipPadding + 'px');
        }).on('mouseleave', () => {
            d3.select('#tooltip').style('opacity', 0);
        });
        app.xAxisG.transition().duration(1000).call(app.xAxis).selectAll('text').style('text-anchor', 'start');
        app.yAxisG.transition().duration(500).call(app.yAxis);
        app.chart.append('text').attr('class', 'axis-title').attr('y', app.height + app.config.margin.bottom - 5).attr('x', app.width / 2).style('text-anchor', 'middle').text(app.xAxisLabel);
        app.chart.append('text').attr('class', 'axis-title').attr('transform', 'rotate(-90)').attr('y', 0 - app.config.margin.left).attr('x', 0 - app.height / 2).attr('dy', '1em').style('text-anchor', 'middle').text(app.yAxisLabel);
        app.chart.append('text').attr('x', app.width / 2).attr('y', 0 - app.config.margin.top / 2).attr('text-anchor', 'middle').style('font-size', '15px').style('text-decoration', 'bolder').text(app.title);
    }
}