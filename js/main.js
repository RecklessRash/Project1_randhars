let {data, blankData, list, filteringData} = newFunction();
let planets = newFunction_1();
d3.csv('data/data.csv').then(_data => {
    let = starData = {};
    let = starDataArray = [];
    let = planetData = {};
    let = planetDataArray = [];
    let startOrbitData = {};
    let startOrbitDataArray = [];
    let = discoverData = {};
    let = discoverDataArray = [];
    let habitableDataArray = [];
    let Adata = {};
    let Fdata = {};
    let Gdata = {};
    let Kdata = {};
    let Mdata = {};
    data = _data;
    data.forEach(d => {
        d.st_mass = +d.st_mass;
        d.st_rad = +d.st_rad;
        d.disc_year = +d.disc_year;
        d.pl_bmasse = +d.pl_bmasse;
        d.pl_rade = +d.pl_rade;
        d.sy_dist = +d.sy_dist;
        d.sy_snum = +d.sy_snum;
        d.sy_pnum = +d.sy_pnum;
        if (d.pl_rade > 0 && d.pl_bmasse > 0) {
            d.solar_system = 'no';
            d.label = '', d.labelYOffset = 0, d.labelXOffset = 0, blankData.push(d);
        }
        if (starData[d.sy_snum] == undefined) {
            starData[d.sy_snum] = 1;
        } else {
            starData[d.sy_snum] += 1;
        }
        if (planetData[d.sy_pnum] == undefined) {
            planetData[d.sy_pnum] = 1;
        } else {
            planetData[d.sy_pnum] += 1;
        }
        if (startOrbitData[d.st_spectype.charAt(0)] == undefined) {
            startOrbitData[d.st_spectype.charAt(0)] = 1;
        } else {
            startOrbitData[d.st_spectype.charAt(0)] += 1;
        }
        if (discoverData[d.discoverymethod] == undefined) {
            discoverData[d.discoverymethod] = 1;
        } else {
            discoverData[d.discoverymethod] += 1;
        }
        starType = d.st_spectype.charAt(0);
        if (starType == 'A') {
            if (d.pl_orbsmax >= 8.5 && d.pl_orbsmax <= 12.5) {
                if (Adata['habitable'] == undefined) {
                    Adata['habitable'] = 1;
                } else {
                    Adata['habitable'] += 1;
                }
            } else {
                if (Adata['notHabitable'] == undefined) {
                    Adata['notHabitable'] = 1;
                } else {
                    Adata['notHabitable'] += 1;
                }
            }
        } else if (starType == 'F') {
            if (d.pl_orbsmax >= 1.5 && d.pl_orbsmax <= 2.2) {
                if (Fdata['habitable'] == undefined) {
                    Fdata['habitable'] = 1;
                } else {
                    Fdata['habitable'] += 1;
                }
            } else {
                if (Fdata['notHabitable'] == undefined) {
                    Fdata['notHabitable'] = 1;
                } else {
                    Fdata['notHabitable'] += 1;
                }
            }
        } else if (starType == 'G') {
            if (d.pl_orbsmax >= 0.95 && d.pl_orbsmax <= 1.4) {
                if (Gdata['habitable'] == undefined) {
                    Gdata['habitable'] = 1;
                } else {
                    Gdata['habitable'] += 1;
                }
            } else {
                if (Gdata['notHabitable'] == undefined) {
                    Gdata['notHabitable'] = 1;
                } else {
                    Gdata['notHabitable'] += 1;
                }
            }
        } else if (starType == 'K') {
            if (d.pl_orbsmax >= 0.38 && d.pl_orbsmax <= 0.56) {
                if (Kdata['habitable'] == undefined) {
                    Kdata['habitable'] = 1;
                } else {
                    Kdata['habitable'] += 1;
                }
            } else {
                if (Kdata['notHabitable'] == undefined) {
                    Kdata['notHabitable'] = 1;
                } else {
                    Kdata['notHabitable'] += 1;
                }
            }
        } else if (starType == 'M') {
            if (d.pl_orbsmax >= 0.08 && d.pl_orbsmax <= 0.12) {
                if (Mdata['habitable'] == undefined) {
                    Mdata['habitable'] = 1;
                } else {
                    Mdata['habitable'] += 1;
                }
            } else {
                if (Mdata['notHabitable'] == undefined) {
                    Mdata['notHabitable'] = 1;
                } else {
                    Mdata['notHabitable'] += 1;
                }
            }
        }
    });
    for (let i = 0; i < Object.keys(starData).length; i++) {
        temp = Object();
        temp.star_num = i + 1;
        temp.frequency = starData[i + 1];
        starDataArray.push(temp);
    }
    for (let i = 0; i < Object.keys(planetData).length; i++) {
        temp = Object();
        temp.star_num = i + 1;
        temp.frequency = planetData[i + 1];
        planetDataArray.push(temp);
    }
    for (const property in startOrbitData) {
        temp = Object();
        if (property == '') {
            temp.star_num = 'Blank';
        } else {
            temp.star_num = property;
        }
        temp.frequency = startOrbitData[property];
        if (temp.frequency >= 20) {
            startOrbitDataArray.push(temp);
        }
    }
    for (const property in startOrbitDataArray) {
        if (startOrbitDataArray[property].star_num != 'Blank') {
            temp = Object();
            starType = startOrbitDataArray[property].star_num;
            temp.group = starType;
            if (starType == 'A') {
                temp.habitable = Adata['habitable'];
                temp.notHabitable = Adata['notHabitable'];
            } else if (starType == 'F') {
                temp.habitable = Fdata['habitable'];
                temp.notHabitable = Fdata['notHabitable'];
            } else if (starType == 'G') {
                temp.habitable = Gdata['habitable'];
                temp.notHabitable = Gdata['notHabitable'];
            } else if (starType == 'K') {
                temp.habitable = Kdata['habitable'];
                temp.notHabitable = Kdata['notHabitable'];
            } else if (starType == 'M') {
                temp.habitable = Mdata['habitable'];
                temp.notHabitable = Mdata['notHabitable'];
            }
            habitableDataArray.push(temp);
        }
    }
    let other_count = 0;
    for (const property in discoverData) {
        temp = Object();
        temp.star_num = property;
        temp.frequency = discoverData[property];
        if (temp.frequency > 30) {
            discoverDataArray.push(temp);
        } else {
            other_count += temp.frequency;
        }
    }
    let other_object = {
        star_num: 'Other',
        frequency: other_count
    };
    discoverDataArray.push(other_object);
    barChart = new Barchart({ parentElement: '#barChart' }, data, 'sy_snum', 'Amount of Stars', '# of Planets', 'Exoplanets (Amount of Stars)');
    barChart.updateApp();
    list.push(barChart);
    barChartPlanets = new Barchart({ parentElement: '#barChartPlanets' }, data, 'sy_pnum', 'Amount of Planets', '# of Planets', 'Exoplanets (Amount of Planets)');
    barChartPlanets.updateApp();
    list.push(barChartPlanets);
    barChartStarType = new Barchart({ parentElement: '#barChartStarType' }, data, 'st_spectype', 'Star Type', '# of Planets', 'Exoplanets (Star Type)');
    barChartStarType.updateApp();
    list.push(barChartStarType);
    barChartDiscovery = new Barchart({ parentElement: '#barChartDiscovery' }, data, 'discoverymethod', 'Dicovery Method', '# of Planets', 'Exoplanets (Discovery Method)');
    barChartDiscovery.updateApp();
    list.push(barChartDiscovery);
    DualBarchart = new comparativeBarChart({ parentElement: '#comparativeBarChart' }, habitableDataArray, [
        'notHabitable',
        'habitable'
    ], 'Star Type', '# of Planets', 'Exoplanets (Habitable Zone vs Outside Habitable Zone)');
    DualBarchart.updateApp();
    histogram = new Histogram({ parentElement: '#histogram' }, data, 'Distance', '# of Planets', 'Exoplanets (Distance from Earth)');
    histogram.updateApp();
    list.push(histogram);
    lineChart = new LineChart({ parentElement: '#linechart' }, data, 'Discovery Year', '', 'Exoplanets (Discoveries over Time)');
    lineChart.updateApp();
    list.push(lineChart);
    planets.forEach(d => {
        blankData.push(d);
    });
    scatterplot = new Scatterplot({ parentElement: '#scatterplot' }, blankData, 'Radius', 'Mass', 'Exoplanets (Mass vs Radius)');
    scatterplot.updateApp();
}).catch(() => {
    console.error(console.error());
});
function newFunction_1() {
    return [
        {
            pl_name: 'Mercury',
            label: '',
            pl_bmasse: 0.0553,
            pl_rade: 0.192,
            solar_system: 'yes',
            labelYOffset: 5,
            labelXOffset: 0
        },
        {
            pl_name: 'Venus',
            label: '',
            pl_bmasse: 0.815,
            pl_rade: 0.475,
            solar_system: 'yes',
            labelYOffset: -5,
            labelXOffset: -10
        },
        {
            pl_name: 'Earth',
            label: '',
            pl_bmasse: 1,
            pl_rade: 1,
            solar_system: 'yes',
            labelYOffset: 0,
            labelXOffset: 0
        },
        {
            pl_name: 'Mars',
            label: '',
            pl_bmasse: 0.107,
            pl_rade: 0.267,
            solar_system: 'yes',
            labelYOffset: 0,
            labelXOffset: 0
        },
        {
            pl_name: 'Jupiter',
            label: '',
            pl_bmasse: 317.8,
            pl_rade: 5.61,
            solar_system: 'yes',
            labelYOffset: 0,
            labelXOffset: 0
        },
        {
            pl_name: 'Saturn',
            label: '',
            pl_bmasse: 95.2,
            pl_rade: 4.73,
            solar_system: 'yes',
            labelYOffset: 10,
            labelXOffset: 0
        },
        {
            pl_name: 'Uranus',
            label: '',
            pl_bmasse: 14.5,
            pl_rade: 2.01,
            solar_system: 'yes',
            labelYOffset: 10,
            labelXOffset: 2
        },
        {
            pl_name: 'Neptune',
            label: '',
            pl_bmasse: 17.1,
            pl_rade: 1.94,
            solar_system: 'yes',
            labelYOffset: -5,
            labelXOffset: -40
        }
    ];
}
function newFunction() {
    let data;
    let filteringData = [];
    let list = [];
    let blankData = [];
    return {
        data,
        blankData,
        list,
        filteringData
    };
}