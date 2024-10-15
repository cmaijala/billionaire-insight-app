// Load the CSV data
function loadData(callback) {
  d3.csv("Resources/data_clean.csv").then(data => {
    callback(data);
  });
}

// Build the demographic info panel
function buildMetadata(category, data) {
  const result = data.find(obj => obj.category === category);

  const panel = d3.select("#billionaire-metadata");
  panel.html("");

  // Set a more appropriate title
  panel.append("h5").text("Billionaire Profile");

  // Include only selected fields
  const fieldsToDisplay = ['personName', 'finalWorth', 'age', 'country', 'gender'];
  fieldsToDisplay.forEach(field => {
    panel.append("h6").text(`${field}: ${result[field]}`);
  });
}

// Function to build the bar chart
function buildCharts(category, data) {
  const filteredData = data.filter(obj => obj.category === category);

  // Sort by finalWorth in descending order and take the top 10
  const topTen = filteredData.sort((a, b) => b.finalWorth - a.finalWorth).slice(0, 10);

  // Prepare data for the bar chart
  const personNames = topTen.map(obj => obj.personName); // Extract person names
  const netWorths = topTen.map(obj => +obj.finalWorth); // Convert to numbers

  // For the Bar Chart (personName on x-axis and netWorth on y-axis)
  const barData = [{
    type: 'bar',
    x: personNames.reverse(),  // Person names on the x-axis
    y: netWorths,               // Net worths on the y-axis
    text: personNames,
    orientation: 'v'            // Vertical bars
  }];

  const barLayout = {
    title: 'Top 10 Billionaires by Net Worth',
    xaxis: { title: 'Person Name' },
    yaxis: { title: 'Net Worth (in billions)' },
  };

  // Render the Bar Chart
  Plotly.newPlot('bar', barData, barLayout);
}

// Function to run on page load
function init() {
  loadData(data => {
    const categories = [...new Set(data.map(obj => obj.category))]; // Unique categories
    const sortedCategories = categories.sort(); // Sort categories alphabetically
    const dropdown = d3.select("#selDataset");

    sortedCategories.forEach((category) => {
      dropdown.append("option").text(category).property("value", category);
    });

    const firstCategory = sortedCategories[0];
    buildCharts(firstCategory, data);
    buildMetadata(firstCategory, data);
  });
}

// Function for event listener
function optionChanged(newCategory) {
  loadData(data => {
    buildCharts(newCategory, data);
    buildMetadata(newCategory, data);
  });
}

// Initialize the dashboard
init();
