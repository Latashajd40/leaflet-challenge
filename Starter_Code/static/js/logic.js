
// Assigns a color based the input
function getColor(d) {
    return d > 90 ? '#FF0000' :
        d > 70 ? '#fca35d' :
        d > 50 ? '#FFA500' :
        d > 30 ? '#FFEA00' :
        d > 10 ? '#c4ff4d' :
        '#88cc00';
}


function createMap(earthquakeInfo) {

    // Create the tile layer that will be the background of the map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer
    let baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object hold the earthquake data
    let overlayMaps = {
      "Earthquake Magnitude": earthquakeInfo
    };
  
    // Create the map object with options
        let map = L.map("map", {
            center: [38.5, -98],
            zoom: 5,
            layers: [streetmap, earthquakeInfo]
        });
 
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    //Create the legend variable
    let legend = L.control({ position: "bottomright" });
    
    legend.onAdd = function (map) {
     
        
        let div = L.DomUtil.create('div', 'legend'),
            grades = [10,30,50,70,80,90],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {

               div.innerHTML +='<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            
        }
    
        return div;
    };
    
    //add the legend to the map
    legend.addTo(map);

};
  
function createMarkers(response) {
        
    // save the earthquake response to a variable
    let info = response.features;
  
    // Initialize an array to hold earthquake markers
    let earthquakeInfo = [];
       
    // Loop through the earthquake array.
    for (let i = 0; i < info.length; i++) {
     
        let location = info[i].geometry.coordinates;
        let magnitude = info[i].properties.mag;      
        let markerSize = (magnitude) *10000;
          
        // For each earthquake, create a marker, and bind a popup with the location name, magnitude, and depth
        let earthquakeMarker = L.circle([location[1], location[0]], {
            fillColor: getColor(info[i].geometry.coordinates[2]),
            fillOpacity: 1,
            weight: 0.5,
            radius: markerSize
        }).bindPopup("<h3>Location: " + info[i].properties.place + "</h3>" + "<hr>" + "<h3>Magnitude: "
            + info[i].properties.mag + "</h3>" + "<h3>Depth: " + info[i].geometry.coordinates[2] + "</h3>")
        

        // Add the marker to the earthquake array.
        earthquakeInfo.push(earthquakeMarker);
    }
      
    // Create a layer group from the earthquake markers array.
    let earthquakeLayer = L.layerGroup(earthquakeInfo);

    // Pass the earthquake layer to the createMap function.
    createMap(earthquakeLayer);
  
}
  
  // Perform an API call to the geojson API to get the station information. Call createMarkers when it completes.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
  
