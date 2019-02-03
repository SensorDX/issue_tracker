var sensorS;
var count = 0;
var graphList = [];
var oldAnnotations = [];
var sync;
var rawMeasurements;
var faultMeasurements;
var changedStation = 0;
var mlGraphList = [];

//Get the raw data
function ajax1(){
        return $.ajax({
                url: "/api/raw_data",
                type: 'GET',
                dataType: 'json', // added data type
        });
}


//Get the fault data
function ajax2(){
      return $.ajax({
                  url: "/api/fault_data",
                  type: 'GET',
                  dataType: 'json', // added data type
      });
}

function ajax3(){
      return $.ajax({
                  url: "/api/ml",
                  type: 'GET',
                  dataType: 'json', // added data type
      });
}

function MLAnalysis(){
  var dateTime = [];
  var flag = [];
  var flagStrings = [];
  var scoreStrings = [];
  var score = [];
  var mlName;
  var mlTitle;

  $.when(ajax3()).done(function(a3){
    console.log(a3.results[0].series[0].values);
    for(var i = 0; i < a3.results[0].series[0].values.length; i++){
      dateTime.push(a3.results[0].series[0].values[i][0]);
      flagStrings.push(a3.results[0].series[0].values[i][1]);
      scoreStrings.push(a3.results[0].series[0].values[i][3]);
      mlName = a3.results[0].series[0].values[i][5];
      mlTitle = a3.results[0].series[0].values[i][4];
    }
    score = scoreStrings.map(Number);
    flag = flagStrings.map(Number);

    var resultArray = [];
    for(var i = 0; i < dateTime.length; i++){
      resultArray.push([ new Date(dateTime[i]), score[i] ]);
    }
    console.log(resultArray);

    var mlGraph = document.createElement("div");
    mlGraph.setAttribute("id", mlName);
    mlGraph.setAttribute("class", "mlGraphClass");
    var container = document.getElementById("graphdiv");
    container.appendChild(mlGraph);
    var loader = document.createElement("div");
    var close = document.createElement("button");
    close.setAttribute("class", "close-thik");
    close.setAttribute("title", "Remove Graph");
    loader.setAttribute("class", "loader");
    container.appendChild(loader);
    close.addEventListener("click", function(){
      var graph = document.getElementById(mlName);
      var graphSet = document.getElementsByClassName("mlGraphClass");
        for(var i = 0; i < graphSet.length; i++){
          if(mlName == graphSet[i].id){
            mlGraphList.splice(i, 1);
          }
        }
        graph.remove();
    })

    mlGraphList.push(
      new Dygraph(

        // containing div
        document.getElementById(mlName),

        // CSV or path to a CSV file.
        resultArray,
        {
          legend: 'always',
          title: "RainQC Analysis for " + mlName.charAt(0).toUpperCase() + mlName.slice(1) + " (" + mlTitle + ")",
          showRangeSelector: true,
          labels: ["Date", "Score"],
          ylabel: 'Score',
          xlabel: 'Date',
          height: 500,
          width: 700,
          interactionModel : {
          'mousedown' : downV3,
          'mousemove' : moveV3,
          'mouseup' : upV3,
          'click' : clickV3,
          'dblclick' : dblClickV4,
          'mousewheel' : scrollV3
          } ,
            plugins: [
            new Dygraph.Plugins.Crosshair({
              direction: "vertical"
            })
            ]
        }
      )
    );

    var annotations = [];
    var value = 0;
    var test;
    var img;
    for(var i = 0; i < flag.length; i++){
      if(flag[i] == 1){
        annotations.push({
          series: "Score",
          x: Date.parse(dateTime[i]),
          width: 10,
          height: 20,
          text: "Flag = 1"
        });
      }
    }
    console.log(annotations);
    mlGraphList[0].setAnnotations(annotations);
    mlGraph.appendChild(close);
    container.removeChild(loader);

  });
}

function addnewGraph(){


  /*
    Creating success alerts that displays a brief message about the query information
  */

  if(document.getElementById("success")){
    document.getElementById("success").parentNode.removeChild(document.getElementById("success"));
  }

  var alert = document.createElement("div");
  alert.setAttribute("class", "alert alert-success alert-dismissible fade in");
  alert.setAttribute("id", "success");

  var closeButton = document.createElement("a");
  closeButton.setAttribute("href", "#");
  closeButton.setAttribute("class", "close");
  closeButton.setAttribute("data-dismiss", "alert");
  closeButton.setAttribute("aria-labal", "close");
  closeButton.innerHTML = "&times;";

  var strongText = document.createElement("strong");
  strongText.innerHTML = "Success! ";

  var parText = document.createElement("p");
  parText.innerHTML = "Retrieved data successfully for station " +  document.getElementById("StationID").value + " from " + $('#start_date')[0].value + " to " + $('#end_date')[0].value;

  alert.appendChild(strongText);
  alert.appendChild(closeButton);
  alert.appendChild(parText);

  var alertContainer = document.getElementById("alertContainer");
  alertContainer.appendChild(alert);

  document.getElementById("success").style.display = "none";

  /*
    Get stationID from the form in order to send to the server for query
  */

  stationID = document.getElementById("StationID");
  selectedStationId = stationID.options[stationID.selectedIndex].text;
  console.log(selectedStationId);

  /*
    Get timeframe from start date to end date from the form for query
  */

  dateID = document.getElementsByClassName("form-control")
  console.log($('#start_date')[0].value);
  console.log($('#end_date')[0].value);


  /*
    Post request to server to change query parameters from the form
  */

  $.ajax({
          url: "/test",
          type: 'POST',
          dataType: 'text',
          data:
          {
            dataInfo : selectedStationId,
            startDateInfo : $('#start_date')[0].value,
            endDateInfo : $('#end_date')[0].value
          },
  });


  /*
    Get selected sensors from checkbox in the form
  */

  var checkboxes = document.getElementsByName("sensor");
  var checkboxesChecked = [];


  console.log(rawMeasurements);
  console.log(faultMeasurements);

  for (var i=0; i<checkboxes.length; i++) {

     if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i].value);
     }
  }
  sessionStorage.setItem('sensor', JSON.stringify(checkboxesChecked));

  /*
    Send selected sensors to display graphs
  */

  for(var i = 0; i < JSON.parse(sessionStorage.getItem("sensor")).length; i++){
    addnew(JSON.parse(sessionStorage.getItem("sensor"))[i])
  }

}

function addnew(sensor){

  /*
    Create graphs for each sensor selected in the form
  */

    var found = 0;
    console.log(sensor);
    console.log(document.getElementById("success"));
    var container = document.getElementById("graphdiv");
    var divName = "div"+sensor;
    if(!document.getElementById(divName)){
      var newGraph = document.createElement("div");
      var loader = document.createElement("div");
      var close = document.createElement("button");
      close.setAttribute("class", "close-thik");
      close.setAttribute("title", "Remove Graph");
      close.addEventListener("click", function(){
      var graph = document.getElementById(divName);
      var graphSet = document.getElementsByClassName("graph");
        for(var i = 0; i < graphSet.length; i++){
          if(divName == graphSet[i].id){
            graphList.splice(i, 1);
          }
        }
        graph.remove();
        count --;
      })
      newGraph.setAttribute("id", divName);
      newGraph.setAttribute("class", "graph");
      loader.setAttribute("class", "loader");
      document.getElementById("StationID").disabled = true;
      document.getElementById("validate").disabled = true;
      container.appendChild(newGraph);
      container.appendChild(loader);

      /*
        If the form didn't change then we use the already stored data to create graphs
      */

      if(rawMeasurements && faultMeasurements && changedStation == 0){
        processData(rawMeasurements, faultMeasurements, sensor, divName);
        container.removeChild(loader);
        newGraph.appendChild(close);
        document.getElementById("StationID").disabled = false;
        document.getElementById("validate").disabled = false;
        document.getElementById("success").style.display = "block";
      }

      /*
        Query for data and process data to create a graph
      */

      else{
        $.when(ajax1(), ajax2()).done(function(a1, a2){
            processData(a1[0], a2[0], sensor, divName);
            rawMeasurements = a1[0];
            faultMeasurements = a2[0];
            container.removeChild(loader);
            newGraph.appendChild(close);
            changedStation = 0;
            document.getElementById("StationID").disabled = false;
            document.getElementById("validate").disabled = false;
            document.getElementById("success").style.display = "block";

        });
      }
    }
}

function processData(data, faultData, sensor, divName){
    var date = [];
    var rawdata  = [];
    var titleName;
    console.log(data);
    console.log(faultData);

    /*
      Depending on the sensor parse the JSON results for the date and rawdata
    */

    if(data.status == "success"){
      if(sensor == "wg"){
        Object.keys(data.timeseries.windgusts).forEach(function(key){
            date.push(key);
            rawdata.push(data.timeseries.windgusts[key]);
            titleName = "Wind Gust";
        });
      }
      else if(sensor == "wd"){
        Object.keys(data.timeseries.winddirection).forEach(function(key){
            date.push(key);
            rawdata.push(data.timeseries.winddirection[key]);
            titleName = "Wind Direction";
        });
      }
      else if(sensor == "ws"){
        Object.keys(data.timeseries.windspeed).forEach(function(key){
            date.push(key);
            rawdata.push(data.timeseries.windspeed[key]);
            titleName = "Wind Speed";
        });
      }
      else if(sensor == "te"){
        Object.keys(data.timeseries.temperature).forEach(function(key){
            date.push(key);
            rawdata.push(data.timeseries.temperature[key]);
            titleName = "Temperature";
        });
      }
      else if(sensor == "rh"){
        Object.keys(data.timeseries.relativehumidity).forEach(function(key){
            date.push(key);
            rawdata.push(data.timeseries.relativehumidity[key]);
            titleName = "Relative Humidity";
        });
      }
      else if(sensor == "ra"){
        Object.keys(data.timeseries.radiation).forEach(function(key){
            date.push(key);
            rawdata.push(data.timeseries.radiation[key]);
            titleName = "Radiation";
        });
      }
      else if(sensor == "ap"){
        Object.keys(data.timeseries.atmosphericpressure).forEach(function(key){
            date.push(key);
            rawdata.push(data.timeseries.atmosphericpressure[key]);
            titleName = "Atmospheric Pressure";
        });
      }
      else if(sensor == "ec"){
        Object.keys(data.timeseries.electricalconductivity).forEach(function(key){
            date.push(key);
            rawdata.push(data.timeseries.electricalconductivity[key]);
            titleName = "Electrical Conductivity";
        });
      }
      else if(sensor == "vp"){
        Object.keys(data.timeseries.vaporpressure).forEach(function(key){
            date.push(key);
            rawdata.push(data.timeseries.vaporpressure[key]);
            titleName = "Vapor Pressure";
        });
      }
      else if(sensor == "pr"){
        Object.keys(data.timeseries.precipitation).forEach(function(key){
            date.push(key);
            rawdata.push(data.timeseries.precipitation[key]);
            titleName = "Precipitation";
        });
      }
      createChart(date, rawdata, faultData, sensor, divName, titleName);
    }

}

function getMax(obj) {
  return Math.max.apply(null,Object.keys(obj));
}


function createChart(date, rawdata, data, sensor, divName, titleName){
 var qualityDate = [];
 var erroneousDate = [];
 var testErr = [];
 var erroneousTest = [];
 var doubtfulTest = [];
 var doubtfulDate = [];
 var doubtfulstartDate = [];
 var findDoubt = [];
 var endDoubt = [];
 var findErr = [];
 var startDate = [];
 var endDate = [];

 console.log(sensor);

 /*
  Get the quality tests for erroneous and doubtful tests
 */

 for(i = 0; i < data.length; i++){
   if(data[i].type == sensor){
       qualityDate.push(data[i].date);
       if(data[i].quality == 4){
         erroneousDate.push(data[i].date);
         var max = 0;
         var maxKey;
         for (var key in data[i].qc) {
            if (data[i].qc.hasOwnProperty(key) && data[i].qc[key] > max) {
                max = data[i].qc[key];
                maxKey = key;
            }
         }
         erroneousTest.push(maxKey);
       }
       else if (data[i].quality == 3){
         doubtfulDate.push(data[i].date);
         var max = 0;
         var maxKey;
         for (var key in data[i].qc) {
            if (data[i].qc.hasOwnProperty(key) && data[i].qc[key] > max) {
                max = data[i].qc[key];
                maxKey = key;
            }
         }
         console.log(maxKey);
         doubtfulTest.push(maxKey);
       }
   }
 }

 console.log(erroneousTest);

 /*
  Adjust timeframe and eliminate extra time information
 */

 var test = 0;
 for(i = 0; i < qualityDate.length; i++){
   qualityDate[i] = qualityDate[i].replace(":00.000Z", "");
 }
 for(i = 0; i < erroneousDate.length; i++){
   erroneousDate[i] = erroneousDate[i].replace(":00.000Z", "");
 }
 for(i = 0; i < doubtfulDate.length; i++){
   doubtfulDate[i] = doubtfulDate[i].replace(":00.000Z", "");
 }


/*
  Get the doubtful time frame for dates
*/

 for(i = 0; i < date.length; i++){
   for(j = 0; j < doubtfulDate.length; j++){
     if(doubtfulDate[j] == date[i]){
       doubtfulstartDate.push(i);
     }
   }
 }


 var sum = doubtfulstartDate[0];
 if(doubtfulstartDate.length != 0){
   findDoubt.push(doubtfulstartDate[0]);
 }
 for(i = 0; i < doubtfulstartDate.length; i++){
   if(sum != doubtfulstartDate[doubtfulstartDate.length-1]){
     if(sum + 1 == doubtfulstartDate[i+1]){
       sum = doubtfulstartDate[i+1];
     }
     else{
       endDoubt.push(doubtfulstartDate[i]);
       findDoubt.push(doubtfulstartDate[i+1])
       sum = doubtfulstartDate[i+1];
     }
   }
   if(sum == doubtfulstartDate[doubtfulstartDate.length-1]){
     if(typeof doubtfulstartDate[i+1] != 'undefined'){
         endDoubt.push(doubtfulstartDate[i+1]);
     }
   }
 }

 /*
  Get the erroneous time frame for dates
 */

  console.log(date);
  console.log(erroneousDate);
  for(i = 0; i < date.length; i++){
    for(j = 0; j < erroneousDate.length; j++){
      if(erroneousDate[j] == date[i]){
        startDate.push(i);
      }
    }
  }

  console.log(startDate);

  var sum = startDate[0];
  if(startDate.length != 0){
    findErr.push(startDate[0]);
  }
  for(i = 0; i < startDate.length; i++){
    console.log(startDate[i]);
    if(sum != startDate[startDate.length-1]){
      if(sum + 1 == startDate[i+1]){
        sum = startDate[i+1];
      }
      else{
        endDate.push(startDate[i]);
        findErr.push(startDate[i+1])
        sum = startDate[i+1];
      }
    }
    if(sum == startDate[startDate.length-1]){
      if(typeof startDate[i+1] != 'undefined'){
          endDate.push(startDate[i+1]);
      }
    }
  }
  console.log(findDoubt);
  console.log(endDoubt);

  /*
   Get the second max value in order to scale graph correctly
  */

  function secondMax(){
      biggest = -Infinity,
      next_biggest = -Infinity;

      for (var i = 0, n = rawdata.length; i < n; ++i) {
          var nr = +rawdata[i]; // convert to number first

          if (nr > biggest) {
              next_biggest = biggest; // save previous biggest value
              biggest = nr;
          } else if (nr < biggest && nr > next_biggest) {
              next_biggest = nr; // new second biggest value
          }
      }
      console.log(next_biggest);
      if(next_biggest == 0){
        return .04;
      }
      return next_biggest;
  }


  /*
    Turn date and rawdata into a 2D array for Dygraphs
  */

  var result = [];
  for(var i = 0; i < rawdata.length; i++){
    result.push([ new Date(date[i]), rawdata[i] ]);
  }



  console.log(date.length);
  console.log(rawdata.length);
  console.log(result.length);

  console.log(result);
  console.log(divName);
  console.log(document.getElementById(divName));




  /*
    Create Dygraph for sensors
  */

  graphList.push(
    new Dygraph(

      // containing div
      document.getElementById(divName),

      // CSV or path to a CSV file.
      result,
      {
        legend: 'always',
        title: titleName + " (" + document.getElementById("StationID").value + ")" + " - " + $('#start_date')[0].value + " to " + $('#end_date')[0].value,
        showRangeSelector: true,
        labels: ["Date", "Value"],
        ylabel: 'Value',
        xlabel: 'Date',
        height: 500,
        width: 800,
        interactionModel : {
        'mousedown' : downV3,
        'mousemove' : moveV3,
        'mouseup' : upV3,
        'click' : clickV3,
        'dblclick' : dblClickV4,
        'mousewheel' : scrollV3
        } ,
        underlayCallback: function(canvas, area, g) {
            for(var i = 0; i < findErr.length; i++){
              var min_data_x = g.getValue(findErr[i], 0);
              var max_data_x = g.getValue(endDate[i],0);
              //console.log(new Date(min_data_x));
              var canvas_left_x = g.toDomXCoord(new Date(min_data_x));
              var canvas_right_x = g.toDomXCoord(new Date(max_data_x));
              var canvas_width = canvas_right_x - canvas_left_x;
              canvas.fillStyle = "rgba(236, 100, 75, 1)";
              canvas.fillRect(canvas_left_x, area.y, canvas_width, area.h)
            }
            for(var i = 0; i < findDoubt.length; i++){
              var min_data_x = g.getValue(findDoubt[i], 0);
              var max_data_x = g.getValue(endDoubt[i],0);
              //console.log(new Date(min_data_x));
              var canvas_left_x = g.toDomXCoord(new Date(min_data_x));
              var canvas_right_x = g.toDomXCoord(new Date(max_data_x));
              var canvas_width = canvas_right_x - canvas_left_x;
              canvas.fillStyle = "rgba(240, 255, 0, 1)";
              canvas.fillRect(canvas_left_x, area.y, canvas_width, area.h)
            }
          },
          plugins: [
          new Dygraph.Plugins.Crosshair({
            direction: "vertical"
          })
          ]
      }
    )
  );


  /*
    Animate buttons for Day, Week and Month
  */

  var desired_range = null, animate;
      function approach_range() {
        if (!desired_range) return;
        // go halfway there
        var range = graphList[0].xAxisRange();
        if (Math.abs(desired_range[0] - range[0]) < 60 &&
            Math.abs(desired_range[1] - range[1]) < 60) {
          graphList[0].updateOptions({dateWindow: desired_range});
          // (do not set another timeout.)
        } else {
          var new_range;
          new_range = [0.5 * (desired_range[0] + range[0]),
                       0.5 * (desired_range[1] + range[1])];
          graphList[0].updateOptions({dateWindow: new_range});
          animate();
        }
      }
      animate = function() {
        setTimeout(approach_range, 50);
      };

      var zoom = function(res) {
        var w = graphList[0].xAxisRange();
        desired_range = [ w[0], w[0] + res * 1000 ];
        animate();
      };

      document.getElementById('hour').onclick = function() { zoom(3600); };
      document.getElementById('day').onclick = function() { zoom(86400); };
      document.getElementById('week').onclick = function() { zoom(604800); };
      document.getElementById('month').onclick = function() { zoom(30 * 86400); };

  console.log(findErr);
  console.log(endDate);

  /*
   Create annotations for errneous values
  */

  var annotations = [];
  var value = 0;
  var test;
  var img;
  for(var i = 0; i < findErr.length; i++){
    for(var j = findErr[i]; j < endDate[i]+1; j++){
      if(erroneousTest[value] == "rs"){
          test = "Sensor Range";
          img = "assets/img/icons/red.jpg";
      }
      else if(erroneousTest[value] == "rc"){
          test = "Climate Change";
          img = "assets/img/icons/purple.jpg";
      }
      else if(erroneousTest[value] == "ts"){
          test = "Step";
          img= "assets/img/icons/lightBlue.jpg";
      }
      else if(erroneousTest[value] == "td"){
          test = "Delta";
          img = "assets/img/icons/blue.png";
      }
      else if(erroneousTest[value] == "ti"){
          test = "Sigma";
          img = "assets/img/icons/pink.jpg";
      }
      annotations.push({
        series: "Value",
        x: Date.parse(date[j]),
        icon: img,
        width: 10,
        height: 20,
        cssClass: erroneousTest[value],
        text: test + " Test (E): " + rawdata[j]
      });
      value++;
    }
  }

value = 0;


/*
  Create annotations for doubtful values
*/


for(var i = 0 ; i < findDoubt.length; i++){
  for(var k = findDoubt[i]; k < endDoubt[i]+1; k++){
    if(doubtfulTest[value] == "rs"){
        test = "Sensor Range";
        img = "assets/img/icons/red.jpg";
    }
    else if(doubtfulTest[value] == "rc"){
        test = "Climate Change";
        img = "assets/img/icons/purple.jpg";
    }
    else if(doubtfulTest[value] == "ts"){
        test = "Step";
        img= "assets/img/icons/lightBlue.jpg";
    }
    else if(doubtfulTest[value] == "td"){
        test = "Delta";
        img = "assets/img/icons/blue.png";
    }
    else if(doubtfulTest[value] == "ti"){
        test = "Sigma";
        img = "assets/img/icons/pink.jpg";
    }
    annotations.push({
      series: "Value",
      x: Date.parse(date[k]),
      icon: img,
      width: 10,
      height: 20,
      cssClass: doubtfulTest[value],
      text: test + " Test (D): " + rawdata[j]
    });
  }
}

console.log(count);
graphList[graphList.length-1].setAnnotations(annotations);
console.log(graphList);


/*
  Creating a dropdown for erroneous timeframes for zooming
*/

var container = document.getElementById(divName);
var dropDownError = document.createElement("select");
dropDownError.setAttribute("id", "dropdownError" + divName);
dropDownError.setAttribute("class", "dropdownError");
container.appendChild(dropDownError);

if(findErr.length > 0){
  console.log(graphList[count]);
  var option = document.createElement("option");
  option.value = "Erroneous";
  option.text = "Erroneous";
  dropDownError.appendChild(option);
  for(var i = 0; i < findErr.length; i++){
    var option = document.createElement("option");
    option.value = i;
    option.text = date[findErr[i]] + " - " + date[endDate[i]];
    dropDownError.appendChild(option);
  }
  dropDownError.addEventListener("mouseup", function(){
    var open = $(this).data("isopen");

    if(open) {
        var selected = document.getElementById("dropdownError"  + divName).value;
        console.log(graphList);
        console.log(document.getElementsByClassName("graph"));
        var graph = document.getElementsByClassName("graph");
        for(var i = 0; i < graph.length; i++){
          if(divName == graph[i].id){
            var graphLoc = i;
          }
        }
        if(selected != "Erroneous"){
          var min_data_x = graphList[graphLoc].getValue(findErr[selected]-2,0);
          var max_data_x = graphList[graphLoc].getValue(endDate[selected]+2,0);
          console.log(graphList[graphLoc].toDomXCoord(new Date(min_data_x)));
          console.log(graphList[graphLoc].toDomXCoord(new Date(max_data_x)));
          graphList[graphLoc].updateOptions({
              dateWindow: [min_data_x, max_data_x],
              valueRange: [0, rawdata[findErr[selected]] + (rawdata[findErr[selected]]/2)]
          });
        }
        else{
          graphList[graphLoc].updateOptions({
              dateWindow: null,
              valueRange: null
          });
        }
    }

    $(this).data("isopen", !open);
  });
}
else{
  var option = document.createElement("option");
  option.value = "N/A";
  option.text = "N/A";
  dropDownError.appendChild(option);
}


/*
  Creating a dropdown for doubtful timeframes for zooming
*/

var container = document.getElementById(divName);
var dropDownDoubt = document.createElement("select");
dropDownDoubt.setAttribute("id", "dropdownDoubt"  + divName);
dropDownDoubt.setAttribute("class", "dropdownDoubt");
container.appendChild(dropDownDoubt);

if(findDoubt.length > 0){
  var option = document.createElement("option");
  option.value = "Doubtful";
  option.text = "Doubtful";
  dropDownDoubt.appendChild(option);
  for(var i = 0; i < findDoubt.length; i++){
    var option = document.createElement("option");
    option.value = i;
    option.text = date[findDoubt[i]] + " - " + date[endDoubt[i]];
    dropDownDoubt.appendChild(option);
  }

  var graph = document.getElementsByClassName("graph");
  for(var i = 0; i < graph.length; i++){
    if(divName == graph[i].id){
      var graphLoc = i;
    }
  }
  dropDownDoubt.addEventListener("mouseup", function(){
    var open = $(this).data("isopen");
    console.log("in it ");

    if(open) {
      var selected = document.getElementById("dropdownDoubt"  + divName).value;
      console.log(selected);
      if(selected != "Doubtful"){
        var min_data_x = graphList[graphLoc].getValue(findDoubt[selected]-2,0);
        var max_data_x = graphList[graphLoc].getValue(endDoubt[selected]+2,0);
        console.log(graphList[graphLoc].toDomXCoord(new Date(min_data_x)));
        console.log(graphList[graphLoc].toDomXCoord(new Date(max_data_x)));
        console.log(rawdata[findDoubt[selected]] + (rawdata[findDoubt[selected]]/2));
        graphList[graphLoc].updateOptions({
            dateWindow: [min_data_x, max_data_x],
            valueRange: [0, rawdata[findDoubt[selected]] + (rawdata[findDoubt[selected]]/2)]
        });
      }
      else{
        graphList[graphLoc].updateOptions({
            dateWindow: null,
            valueRange: null
        });
      }
    }

    $(this).data("isopen", !open);
  });
}

else{
  var option = document.createElement("option");
  option.value = "N/A";
  option.text = "N/A";
  dropDownDoubt.appendChild(option);
}


/*
  Allow annotations to be toggled on and off
*/


$('.annotations').unbind("change").change(
  function(){
      if (!this.checked) {
        for(var i = 0; i < graphList.length; i++){
          oldAnnotations[i] = graphList[i].annotations();
          graphList[i].setAnnotations([]);
        }
        console.log(oldAnnotations);
      }
      else{
        console.log(oldAnnotations[0])
        for(var i = 0; i < graphList.length; i++){
          graphList[i].setAnnotations(oldAnnotations[i]);
        }
      }
  });


/*
  Synchronize graphs so easier viewing for user
*/

count ++;
if(count > 1){

  $('.sync').unbind("change").change(
    function(){
        if (this.checked) {
            sync = Dygraph.synchronize(graphList);
            console.log(sync);
        }
        else{
          sync.detach();
        }
    });
}

}
