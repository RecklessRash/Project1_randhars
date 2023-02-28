function filterData(propertyName, dataFilter) {
    // filter app_list by propertyName
    let filteredApps = app_list.filter(v => v[propertyName] === propertyName);
    
    // filter data by dataFilter if provided, otherwise use full data set
    let filteredData = dataFilter.length === 0 ? data : data.filter(d => dataFilter.includes(d.sy_snum));
    
    // update data property and call updateApp() method for each app in filteredApps
    filteredApps.forEach(app => {
      app.data = filteredData;
      app.updateApp();
    });
    
    // update scatterplot data property and call updateApp() method
    scatterplot.data = dataFilter.length === 0 ? data_w_no_blank_radius : data_w_no_blank_radius.filter(d => dataFilter.includes(d.sy_snum));
    scatterplot.updateApp();
  }
  