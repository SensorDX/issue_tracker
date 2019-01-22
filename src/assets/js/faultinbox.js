var sensorS;
var count = 0;
var graphList = [];
var oldAnnotations = [];
var sync;
var rawMeasurements;
var faultMeasurements;
var changedStation = 0;

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

function addnewGraph(){

  stationID = document.getElementById("StationID");
  selectedStationId = stationID.options[stationID.selectedIndex].text;
  console.log(selectedStationId);

  dateID = document.getElementsByClassName("form-control")
  console.log($('#start_date')[0].value);
  console.log($('#end_date')[0].value);


  console.log(changedStation);

  $.ajax({
          url: "/test",
          type: 'POST',
          dataType: 'text',
          data:
          {
            dataInfo : selectedStationId,
            startDateInfo : $('#start_date')[0].value,
            endDateInfo : $('#end_date')[0].value
          }, // added data type
  });


  var checkboxes = document.getElementsByName("sensor");
  console.log(checkboxes);
  var checkboxesChecked = [];
  console.log(rawMeasurements);
  console.log(faultMeasurements);

  for (var i=0; i<checkboxes.length; i++) {

     if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i].value);
     }
  }
  sessionStorage.setItem('sensor', JSON.stringify(checkboxesChecked));
  console.log(JSON.parse(sessionStorage.getItem("sensor")));
  for(var i = 0; i < JSON.parse(sessionStorage.getItem("sensor")).length; i++){
    addnew(JSON.parse(sessionStorage.getItem("sensor"))[i])
  }

}

function addnew(sensor){
    var found = 0;
    console.log(sensor);
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
      if(rawMeasurements && faultMeasurements && changedStation == 0){
        processData(rawMeasurements, faultMeasurements, sensor, divName);
        container.removeChild(loader);
        newGraph.appendChild(close);
        document.getElementById("StationID").disabled = false;
        document.getElementById("validate").disabled = false;
      }
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
 //console.log(data.timeseries.windgusts);

 for(i = 0; i < data.length; i++){
   //console.log(data[i].type);
   if(data[i].type == sensor){
       //console.log(data[i]);
       qualityDate.push(data[i].date);
       if(data[i].quality == 4){
         //testErr.push(data[i]);
         erroneousDate.push(data[i].date);
         var max = 0;
         var maxKey;
         for (var key in data[i].qc) {
            if (data[i].qc.hasOwnProperty(key) && data[i].qc[key] > max) {
                max = data[i].qc[key];
                maxKey = key;
                // console.log(key + " -> " + data[i].qc[key]);
            }
         }
         erroneousTest.push(maxKey);
         //console.log(erroneousDate);
         //erroneousTest.push(Object.keys(data[i].qc).reduce(function(a, b){ return data[i][a] > data[i][b] ? a : b }));
       }
       else if (data[i].quality == 3){
         doubtfulDate.push(data[i].date);
         var max = 0;
         var maxKey;
         for (var key in data[i].qc) {
            if (data[i].qc.hasOwnProperty(key) && data[i].qc[key] > max) {
                max = data[i].qc[key];
                maxKey = key;
                // console.log(key + " -> " + data[i].qc[key]);
            }
         }
         console.log(maxKey);
         doubtfulTest.push(maxKey);
         //doubtfulTest.push(Object.keys(data[i].qc).reduce(function(a, b){ return data[i][a] > data[i][b] ? a : b }));
         //console.log(doubtfulTest);
       }
   }
 }

 console.log(erroneousTest);

 //testErr.push(data[5]);
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

 //console.log(doubtfulDate);
 //console.log(erroneousDate);
 //console.log(date);

 for(i = 0; i < date.length; i++){
   for(j = 0; j < doubtfulDate.length; j++){
     if(doubtfulDate[j] == date[i]){
       doubtfulstartDate.push(i);
     }
   }
 }

//console.log(doubtfulstartDate);

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

  result = [];
  for(var i = 0; i < rawdata.length; i++){
    result.push([ new Date(date[i]), rawdata[i] ]);
  }



  console.log(date.length);
  console.log(rawdata.length);
  console.log(result.length);

  console.log(result);
  console.log(divName);
  console.log(document.getElementById(divName));


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
        width: 700,
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
