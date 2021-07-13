function dropDownMenu() {
    var menu = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sampleName = data.names;
        sampleName.forEach((name) => {
            menu
            .append("option")
            .text(name)
            .property("value", name);                
        });

        //set default
        const defaultSample = sampleName[0];
        demoTable(defaultSample);
        charting(defaultSample);
    });
}

function optionChanged(sampleName) {
    demoTable(sampleName)
    charting(sampleName);
}

function demoTable(sampleName) {
    d3.json("samples.json").then((data) => {
        var tabInfo = data.metadata;
        console.log(tabInfo)
        var filtered = tabInfo.filter(x => x.id == sampleName)[0];
        console.log(filtered)
        var tablegraphic = d3.select("#sample-metadata");
        tablegraphic.html("")
       
        Object.entries(filtered).forEach(([key,value]) => {
            var row = tablegraphic.append('tr');
            var cell = tablegraphic.append('td');
            cell.text(key.toUpperCase() + `: ${value}`)
            var cell = row.append('td');
            
        });
    });
}

function charting(sampleName) {
    d3.json("samples.json").then((data) => {
        var tabInfo = data.samples;
        var filtered = tabInfo.filter(x => x.id.toString() === sampleName)[0];
        console.log(filtered)
        var otu_ids = filtered.otu_ids;
        var otu_labels = filtered.otu_labels
        var sample_values = filtered.sample_values;
        
        //BAR CHART
        var trace1 = {
            type: "bar",
            orientation: "h",
            x: sample_values.slice(1,10),
            y: otu_ids.slice(1,10).map(x => `OTU ${x}`),
        };

        var data1 = [trace1];

        var layout1 = {
            title: "Top 10 OTUs",
            xaxis: { title: "OTU Labels" },
            yaxis: { title: "OTU IDs" }
        };

        Plotly.newPlot("bar", data1, layout1);
        
        // BUBBLE CHART
        var size = sample_values

        var trace2 = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            text: otu_labels,
            markers: {              
                color: otu_ids,

                size: size
                }
        };

        var data2 = [trace2];

        var layout2 = {
            margin: { t: 50 },
            title: 'Bubble Chart For Each Sample',
            xaxis: {title:"OTU ID "},
            yaxis: {title: 'Number of Samples Collected'},
            showlegend: false,
            hovermode: "closest",
            height: 800,
            width: 1800
        };

        Plotly.newPlot("bubble", data2, layout2);
    });
}


dropDownMenu();