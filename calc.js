      var salary = {},
          yearlyWages = {},
          increase = {};

      
      $(document).ready(function() {
        
        // hide organizer inputs and results
        
        $("#organizer-panel, #results, #learnmore").next().hide();
        
        // slide toggle for organizer and results panels
        $("#organizer-panel, #results, #learnmore").click( function() {
          $(this).next().slideToggle();
        });
        
        // run calculation on input
        
        $("#hourlyRate, #avgWeeklyHours, #yearOne, #yearTwo, #yearThree, #yearFour, #yearFive").change(function(){
          
          dues = [],
          myTable = [],
          xaxis = [],
          yaxis = [],
          data = [];
          
          var rate = $("#hourlyRate").val(),
              hours =$("#avgWeeklyHours").val();
              
          salary.current = rate * hours * 52;
          
          // change in yearly wages based on organizer inputs
          
          yearlyWages.yearOne = rate * (1 + Number($("#yearOne").val()));
          yearlyWages.yearTwo = yearlyWages.yearOne * (1 + Number($("#yearTwo").val()));
          yearlyWages.yearThree = yearlyWages.yearTwo * (1 + Number($("#yearThree").val()));
          yearlyWages.yearFour = yearlyWages.yearThree * (1 + Number($("#yearFour").val()));
          yearlyWages.yearFive = yearlyWages.yearFour * (1 + Number($("#yearFive").val()));
          
          // predicted salaries based on change in wages
          
          salary.yearOne = yearlyWages.yearOne * hours * 52;
          salary.yearTwo = yearlyWages.yearTwo * hours * 52;
          salary.yearThree = yearlyWages.yearThree * hours * 52;
          salary.yearFour = yearlyWages.yearFour * hours * 52;
          salary.yearFive = yearlyWages.yearFive * hours * 52;
          
          // calculating monthly dues
          
          for (var i in salary) {
            
            if(!salary.hasOwnProperty(i)) continue;
            
            if ((salary[i] * 0.02)/12 < 33.5) {
              dues.push(33.5);
            } else if ((salary[i] * 0.02)/12 > 144) {
              dues.push(144);
            } else { dues.push((salary[i] * 0.02)/12); }
          }
          
          // subtract monthly dues from salary
          salary.actualCurrent = salary.current - (dues[0] * 12);
          salary.actualOne = salary.yearOne - (dues[1] * 12);
          salary.actualTwo = salary.yearTwo - (dues[2] * 12);
          salary.actualThree = salary.yearThree - (dues[3] * 12);
          salary.actualFour = salary.yearFour - (dues[4] * 12);
          salary.actualFive = salary.yearFive - (dues[5] * 12);
          
          // increases by year
          increase.one = (Number($("#yearOne").val()) === 0 ? 0 : salary.actualOne - salary.actualCurrent);
          increase.two = (Number($("#yearTwo").val()) === 0 ? 0 : salary.actualTwo - salary.actualCurrent);
          increase.three = (Number($("#yearThree").val()) === 0 ? 0 : salary.actualThree - salary.actualCurrent);
          increase.four = (Number($("#yearFour").val()) === 0 ? 0 : salary.actualFour - salary.actualCurrent);
          increase.five = (Number($("#yearFive").val()) === 0 ? 0 : salary.actualFive - salary.actualCurrent);
          
          // populate results in table
          $("#increaseOne").html("$" + increase.one.toFixed(2));
          $("#increaseTwo").html("$" + increase.two.toFixed(2));
          $("#increaseThree").html("$" + increase.three.toFixed(2));

          // hide years four and five in table if no value is given
          if (Number($("#yearFour").val()) === 0) { $(".yearFour").hide(); }
          else { $(".yearFour").show(); $("#increaseFour").html("$" + increase.four.toFixed(2)); }
  
          if (Number($("#yearFive").val()) === 0) { $(".yearFive").hide(); }
          else { $(".yearFive").show(); $("#increaseFive").html("$" + increase.five.toFixed(2)); }
          
          $("#totalIncrease").html("<strong>$" + (increase.one + increase.two + increase.three + increase.four + increase.five).toFixed(2) + "</strong>");

          // convert table contents to array

          $("#resultsTable tr").each(function(){
            var rowArray = [];
            var tableData = $(this).find('td');
            if(tableData.length > 0) {
              tableData.each(function(){ rowArray.push($(this).text()); });
              myTable.push(rowArray);
            }
          });
          
          for (var key in myTable) {
            if (myTable[key][0] != "Total Increase") {
              if(myTable[key][1] !== "") {
              xaxis.push(myTable[key][0].substring(0,6));
              yaxis.push(Number(myTable[key][1].substring(1,myTable[key][1].length)));
              }
            }
          }
          

          // plot results
          var data = [
            {
              x: xaxis,
              y: yaxis,
              type: 'bar',
              marker: {
                color: 'rgba(0,255,0,1)'
              }
            }
          ];
          
          layout = {
            title: "Year-Over-Year Increases",
            yaxis: {
              title: "Dollars",
              titlefont: { size: 12 }
            },
            bargap: 0.5
          };
          
          Plotly.newPlot('myDiv', data, layout, {displayModeBar: false});
          
        });
        
      });