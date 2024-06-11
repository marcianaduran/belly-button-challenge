// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    // console.log(metadata);

  // Filter the metadata for the object with the desired sample number
    let sampleMetadata = metadata.filter(results => results.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select(`#sample-metadata`);

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (k in sampleMetadata){
      panel.append("h5").text(`${k.toUpperCase()}: ${sampleMetadata[k]}`);
    }

    console.log(sampleMetadata);
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // // Get the samples field
    let dataSamples = data.samples;

    // // Filter the samples for the object with the desired sample number
    let resultsArray = dataSamples.filter(results => results.id == sample)[0];

    // // Get the otu_ids, otu_labels, and sample_values
    let otu_id = resultsArray.otu_ids;
    let otu_label = resultsArray.otu_labels;
    let sample_vals = resultsArray.sample_values;

    // // Build a Bubble Chart
    let trace1 = { 
          x: otu_id, 
          y: sample_vals,
          text: otu_label,
          mode: 'markers',
          marker: {
            color: otu_id,
            colorscale: "Earth",
            size: sample_vals
          }
    };

    let layout1 = {
        title: 'Bacteria Cultures Per Sample',
        height: 600,
        width: 1200
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', [trace1], layout1);

    let resultsArraySorted = [{
      otu_id,
      otu_label,
      sample_vals
    }];

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let sortedVals = resultsArraySorted.sort((a, b) => b.sample_vals - a.sample_vals)[0];

    let slicedDataY = sortedVals.otu_id.slice(0,10).reverse();
    let slicedDataX = sortedVals.sample_vals.slice(0,10).reverse();
    let slicedDataText = sortedVals.otu_label.slice(0,10).reverse();
    let otu_id_bar_labels = slicedDataY.map(otuID => `OTU ${otuID}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace2 = { 
      y: otu_id_bar_labels, 
      x: slicedDataX,
      text: slicedDataText,
      type: 'bar',
      orientation: 'h'
    };

    let layout2 = {
      title: 'Top 10 Bacteria Cultures Found',
      height: 600,
      width: 800
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [trace2], layout2);
    console.log(sortedVals);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;  

    // Use d3 to select the dropdown with id of `#selDataset`
    selector = d3.select("#selDataset");//.on("change", updatePlotly);

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++){
      selector.append("option").text(names[i]).property("value", names[i]);
    }

    // Get the first sample from the list
    let sample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(sample);
    buildMetadata(sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  d3.selectAll("#selDataset").on("change", buildCharts(newSample));
  d3.selectAll("#selDataset").on("change", buildMetadata(newSample));
}

// Initialize the dashboard
init();
