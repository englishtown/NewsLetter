$(function(){
	var srcData = {};
	var ColorUp = "rgba(138, 202 , 1, 1)";
	var ColorNormal = "rgba(158, 182, 182, 1)";
	var ColorDown = "rgba(198, 70, 23, 1)";
	var started = false;
	var happiness = 60;

	var TIME_FORMAT = {};
	TIME_FORMAT.MIN = "MIN";
	TIME_FORMAT.HOUR = "HOUR";
	TIME_FORMAT.DAY = "DAY";
	TIME_FORMAT.DATE = "DATE";
	TIME_FORMAT.MONTH = "MONTH";

	//var srcData = {"__type":"WebApplication.Model.TVScreenStatistics","Past5Minutes":{"StudentsOnline":4334,"Statistics":[{"Name":"Page Views","DisplayNumber":{"Key":1395356530300,"Value":10127},"Numbers":[{"Key":1395355030300,"Value":10786},{"Key":1395355330300,"Value":10350},{"Key":1395355630300,"Value":10463},{"Key":1395355930300,"Value":10139},{"Key":1395356230300,"Value":11822}],"Trend":1,"Opposite":false},{"Name":"Exceptions thrown","DisplayNumber":{"Key":1395356530300,"Value":32},"Numbers":[{"Key":1395355030300,"Value":51},{"Key":1395355330300,"Value":41},{"Key":1395355630300,"Value":39},{"Key":1395355930300,"Value":5},{"Key":1395356230300,"Value":58}],"Trend":1,"Opposite":true},{"Name":"Activities completed","DisplayNumber":{"Key":1395356530300,"Value":1810},"Numbers":[{"Key":1395355030300,"Value":2021},{"Key":1395355330300,"Value":2024},{"Key":1395355630300,"Value":1967},{"Key":1395355930300,"Value":1996},{"Key":1395356230300,"Value":1906}],"Trend":-1,"Opposite":false}]},"PastHour":{"NewMembers":169,"Statistics":[{"Name":"Writings submitted","DisplayNumber":{"Key":1395352800000,"Value":285},"Numbers":[{"Key":1395334800000,"Value":222},{"Key":1395338400000,"Value":206},{"Key":1395342000000,"Value":252},{"Key":1395345600000,"Value":299},{"Key":1395349200000,"Value":341}],"Trend":1,"Opposite":false},{"Name":"Students in class","DisplayNumber":{"Key":1395352800000,"Value":413},"Numbers":[{"Key":1395334800000,"Value":274},{"Key":1395338400000,"Value":323},{"Key":1395342000000,"Value":394},{"Key":1395345600000,"Value":417},{"Key":1395349200000,"Value":433}],"Trend":1,"Opposite":false},{"Name":"Leads","DisplayNumber":{"Key":1395352800000,"Value":965},"Numbers":[{"Key":1395334800000,"Value":371},{"Key":1395338400000,"Value":467},{"Key":1395342000000,"Value":694},{"Key":1395345600000,"Value":946},{"Key":1395349200000,"Value":1025}],"Trend":1,"Opposite":false}]},"Yesterday":{"NewPaidStudents":2595,"Statistics":[{"Name":"Logins","DisplayNumber":{"Key":1395187200000,"Value":107841},"Numbers":[{"Key":1394755200000,"Value":93831},{"Key":1394841600000,"Value":83406},{"Key":1394928000000,"Value":90409},{"Key":1395014400000,"Value":112222},{"Key":1395100800000,"Value":111512}],"Trend":-1,"Opposite":false},{"Name":"Students with access to classes","DisplayNumber":{"Key":1395187200000,"Value":321232},"Numbers":[{"Key":1394755200000,"Value":319107},{"Key":1394841600000,"Value":319425},{"Key":1394928000000,"Value":319408},{"Key":1395014400000,"Value":320109},{"Key":1395100800000,"Value":320644}],"Trend":1,"Opposite":false},{"Name":"Levels completed","DisplayNumber":{"Key":1395187200000,"Value":408},"Numbers":[{"Key":1394755200000,"Value":338},{"Key":1394841600000,"Value":316},{"Key":1394928000000,"Value":419},{"Key":1395014400000,"Value":471},{"Key":1395100800000,"Value":447}],"Trend":-1,"Opposite":false}]},"Past30Days":{"AverageLogins":5.3,"Statistics":[{"Name":"Avg # Logins","DisplayNumber":{"Key":1392681600000,"Value":5.3},"Numbers":[{"Key":1380585600000,"Value":4.99},{"Key":1383264000000,"Value":5.18},{"Key":1385856000000,"Value":5.3},{"Key":1388534400000,"Value":4.99},{"Key":1391212800000,"Value":4.9}],"Trend":0,"Opposite":false},{"Name":"OS Tenure","DisplayNumber":{"Key":1392681600000,"Value":3.76},"Numbers":[{"Key":1380585600000,"Value":3.23},{"Key":1383264000000,"Value":3.46},{"Key":1385856000000,"Value":3.61},{"Key":1388534400000,"Value":3.62},{"Key":1391212800000,"Value":3.7}],"Trend":0,"Opposite":false},{"Name":"Time on site per student (HRS)","DisplayNumber":{"Key":1392681600000,"Value":6.2},"Numbers":[{"Key":1380585600000,"Value":5.7},{"Key":1383264000000,"Value":5.95},{"Key":1385856000000,"Value":6.12},{"Key":1388534400000,"Value":5.58},{"Key":1391212800000,"Value":7.22}],"Trend":0,"Opposite":false}]}} ;

	var fetchData = function(){
		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "http://10.43.41.11/TVScreenStatisticsSvc.asmx/GetStatisticsData",
			contentType: "application/json; charset=utf-8",
			data: {},
			dataType: "json",
			success: function(data) {
				srcData = data.d;
				if (!started) {
					start();
				}
			}
		});
	}

	var fetchWeather = function(){
		$.getJSON("http://query.yahooapis.com/v1/public/yql", {
			q: "select * from json where url=\"http://api.map.baidu.com/telematics/v3/weather?location=%E4%B8%8A%E6%B5%B7&output=json&ak=BmPwCHSKRtpF2Wq6XcDdayRZ\"",
			format: "json"
		}, function(data) {
			if (data.query.results && data.query.results.json) {
				weatherData = data.query.results.json;
				showWeather();
			}
		});
	}

	var fetchHappiness = function(){
		var requestData = {
				"size": 0, 
				"query": {"filtered": {
					"query": {"match_all": {}},
					"filter": {"range": {
						"post_date": {
							"from": "now-16h/h",
							"to": "now+8h/h"
						}
					}}
				}}, 
				"aggs": {
					"average_happyindex":
					{
						"avg": {
							"field": "value"
						}
					}
				}
			}

		$.ajax({
			type: "POST",
			url: "http://10.43.41.11:9200/labcast/happyindex/_search?pretty",
			data: JSON.stringify(requestData),
			dataType: "json",
			contentType: "application/json",
			success: function(data) {
				if (data.aggregations && data.aggregations.average_happyindex && data.aggregations.average_happyindex.value) {
					happiness = data.aggregations.average_happyindex.value;
					updateHappiness(happiness);
				} else {
					happiness = 60;
					updateHappiness(happiness);
				}
			}
		});
	}

	var fetchAQI = function(){
		$.getJSON("http://li600-131.members.linode.com/mapi/?term=shanghai&jsoncallback=?", function(data){
			aqiData = data;
			showAQI();
		});
	}

	fetchData();
	fetchWeather();
	fetchAQI();
	fetchHappiness();

	var isInt = function(n) { return parseInt(n) === n };

	setInterval(function(){
		var now = new Date();
		var min = moment(now).minute();
		if (isInt(min / 5)) {
			$(".background").toggleClass("none");
			fetchData();
			fetchWeather();
			fetchAQI();
			fetchHappiness();
		}
	}, 15000);


	function showWeather(){
		if (weatherData.results && weatherData.results.weather_data && weatherData.results.weather_data[0]) {
			var str = _.first(_.last(weatherData.results.weather_data[0].dayPictureUrl.split("/")).split("."));
			$(".weather-icon i").removeClass().addClass("wi-" + str);
			$(".weather-temp").text(weatherData.results.weather_data[0].temperature);
			$(".weather").removeClass("none");
		} else {
			$(".weather").addClass("none");
		}
	}

	function showAQI(){
		if (aqiData && aqiData[0]) {
			var aqi = parseInt(aqiData[0].aqi);
			if (aqi && aqi > 0) {
				$("#aqi-value em").text(aqi);
				if (aqi >= 0 && aqi <=50 ) {
					$("#aqi-health").removeClass().addClass("aqi-green").text("Good");
				} else if (aqi >=51 && aqi <=100) {
					$("#aqi-health").removeClass().addClass("aqi-yellow").text("Moderate");
				} else if (aqi >=101 && aqi <=150) {
					$("#aqi-health").removeClass().addClass("aqi-orange").text("Unhealthy for Sensitive Groups");
				} else if (aqi >=151 && aqi <=200) {
					$("#aqi-health").removeClass().addClass("aqi-red").text("Unhealthy");
				} else if (aqi >=201 && aqi <=300) {
					$("#aqi-health").removeClass().addClass("aqi-purple").text("Very Unhealthy");
				} else if (aqi >300) {
					$("#aqi-health").removeClass().addClass("aqi-maroon").text("Hazardous");
				}

				$(".aqi").removeClass("none");
			}
			
		} else {
			$(".aqi").addClass("none");
		}
	}

	function updateTimeLabel(){
		var dateToday = moment().format("MMMM D");
		var dateYesterday = moment().subtract(1, "d").format("MMMM D");
		var date30DaysBefore = moment().subtract(29, "d").format("MMMM D");
		var timeNow = moment().format("H:mm");
		var timePastHour = moment().subtract(60, "minutes").format("H:mm");
		var timePast5Min = moment().subtract(5, "minutes").format("H:mm");
		var dayToday = moment().format("dddd");
		var dateTodayShort = moment().format("MMM D");

		$(".time-label.30-days h4").text(date30DaysBefore + " - " + dateToday);
		$(".time-label.yesterday h4").text(dateYesterday);
		$(".time-label.past-hour h4").text(timePastHour + " - " + timeNow);
		$(".time-label.5-min h4").text(timePast5Min + " - " + timeNow);

		$(".today .day-today").text(dayToday);
		$(".today .date-today").text(dateTodayShort);
	}

	updateTimeLabel();

	setInterval(function(){
		updateTimeLabel();
	}, 5000);


	function numberWithCommas(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	function isInt(n) {
		 return typeof n === 'number' && n % 1 == 0;
	}

	function generateChart(data, i, timeFormat){
		var $section = $($(".index-main .index-section")[i]);

		var title = data.Name;
		var figure = data.DisplayNumber.Value;
		var trend = data.Trend;
		var trendColor = "";
		var xData = [];
		var yData = [];
		var trendClass = "";

		_.each(data.Numbers, function(obj){
			xData.push(obj.Key);
			yData.push(obj.Value);
		});

		for (var i = 0; i < xData.length; i++) {
			switch (timeFormat) {
				case TIME_FORMAT.MONTH:
					xData[i] = moment(xData[i]).format("MMM");
					break;
				case TIME_FORMAT.DAY:
					xData[i] = moment(xData[i]).format("ddd");
					break;
				case TIME_FORMAT.HOUR:
					xData[i] = moment(xData[i]).format("hh:mm");
					break;
				case TIME_FORMAT.MIN:
					xData[i] = moment(xData[i]).format("hh:mm");
					break;
			}
			
		}

		if (trend < 0) {
			trendClass = "trend-down";
			trendColor = data.Opposite ? ColorUp : ColorDown;
		} else if (trend > 0) {
			trendClass = "trend-up";
			trendColor = data.Opposite ? ColorDown : ColorUp;
		} else {
			trendClass = "trend-none";
			trendColor = ColorNormal;
		}

		if (figure >= 1000) {
			figure = numberWithCommas(parseInt(figure));
		} else if (!isInt(figure)) {
			figure = figure.toFixed(2).toString();
		}

		var ctx = $section.find(".chart-canvas").get(0).getContext("2d");

		//ctx.clearRect ( 0 , 0, 0, 0 );

		var options = {
			//Boolean - If we show the scale above the chart data			
			scaleOverlay : false,
			//Boolean - If we want to override with a hard coded scale
			scaleOverride : false,
			//** Required if scaleOverride is true **
			//Number - The number of steps in a hard coded scale
			scaleSteps : null,
			//Number - The value jump in the hard coded scale
			scaleStepWidth : null,
			//Number - The scale starting value
			scaleStartValue : null,
			//String - Colour of the scale line	
			scaleLineColor : "rgba(0,0,0,.1)",
			//Number - Pixel width of the scale line	
			scaleLineWidth : 1,
			//Boolean - Whether to show labels on the scale	
			scaleShowLabels : false,
			//Interpolated JS string - can access value
			scaleLabel : "<%=value%>",
			//String - Scale label font declaration for the scale label
			scaleFontFamily : "'Arial'",
			//Number - Scale label font size in pixels	
			scaleFontSize : 13,
			//String - Scale label font weight style	
			scaleFontStyle : "normal",
			//String - Scale label font colour	
			scaleFontColor : "#666",	
			///Boolean - Whether grid lines are shown across the chart
			scaleShowGridLines : true,
			//String - Colour of the grid lines
			scaleGridLineColor : "rgba(0,0,0,.05)",
			//Number - Width of the grid lines
			scaleGridLineWidth : 1,	
			//Boolean - Whether the line is curved between points
			bezierCurve : true,
			//Boolean - Whether to show a dot for each point
			pointDot : true,
			//Number - Radius of each point dot in pixels
			pointDotRadius : 3,
			//Number - Pixel width of point dot stroke
			pointDotStrokeWidth : 1,
			//Boolean - Whether to show a stroke for datasets
			datasetStroke : true,
			//Number - Pixel width of dataset stroke
			datasetStrokeWidth : 2,
			//Boolean - Whether to fill the dataset with a colour
			datasetFill : true,
			//Boolean - Whether to animate the chart
			animation : false,
			//Number - Number of animation steps
			animationSteps : 60,
			//String - Animation easing effect
			animationEasing : "easeOutQuart",
			//Function - Fires when the animation is complete
			onAnimationComplete : null
		}

		var lineChartData = {
			labels : xData,
			datasets : [
				{
					fillColor : trendColor,
					strokeColor : trendColor,
					pointColor : trendColor,
					pointStrokeColor : "#fff",
					data : yData
				}
			]
		}

		var chart = new Chart(ctx).Line(lineChartData, options);

		$section.find(".figure > h3").text(title);
		$section.find(".figure > .number > h2").text(figure);
		$section.removeClass("trend-up trend-down trend-none").addClass(trendClass);

		if (data.Opposite) {
			$section.addClass("opposite");
		} else {
			$section.removeClass("opposite");
		}
	}

	function updateCircle(data){
		$(".index-side .index-section").removeClass("none");
		$(".happiness-index").addClass("none");

		var $figure = $(".index-side .index-section h2");
		var $label = $(".index-side .index-section h3");

		if (data.figure >= 1000) {
			data.figure = numberWithCommas(parseInt(data.figure));
		} else if (!isInt(data.figure)) {
			data.figure = data.figure.toFixed(2).toString();
		} else {
			data.figure = data.figure.toString();
		}

		if (data.figure.length <= 2) {
			$figure.removeClass().addClass("larger");
		} else if (data.figure.length == 3) {
			$figure.removeClass().addClass("large");
		} else if (data.figure.length == 4)	{
			$figure.removeClass();
		} else if (data.figure.length == 5)	{
			$figure.removeClass().addClass("small");
		} else {
			$figure.removeClass().addClass("smaller");
		}

		$figure.text(data.figure);
		$label.text(data.name);
	}

	function showHappiness() {
		$(".index-side .index-section").addClass("none");
		$(".happiness-index").removeClass("none");
	}

	function show30Days(){
		
		//Update timeline
		$(".time .time-label, .time .dot").removeClass("active");
		$(".time .time-label.30-days, .time .dot.30-days").addClass("active");
		
		//Show new charts
		for (var i = 0; i < srcData.Past30Days.Statistics.length; i++){
			generateChart(srcData.Past30Days.Statistics[i], i, TIME_FORMAT.MONTH);
		}

		//Update circle
		// var circleData = {};
		// circleData.name = "Average Logins";
		// circleData.figure = srcData.Past30Days.AverageLogins;
		// updateCircle(circleData);

		showHappiness();
	}

	function showYesterday(){
		//Update timeline
		$(".time .time-label, .time .dot").removeClass("active");
		$(".time .time-label.yesterday, .time .dot.yesterday").addClass("active");

		//Show new charts
		for (var i = 0; i < srcData.Yesterday.Statistics.length; i++){
			generateChart(srcData.Yesterday.Statistics[i], i, TIME_FORMAT.DAY);
		}

		//Update circle
		var circleData = {};
		circleData.name = "New Students";
		circleData.figure = srcData.Yesterday.NewPaidStudents;
		updateCircle(circleData);

	}

	function showPastHour(){
		//Update timeline
		$(".time .time-label, .time .dot").removeClass("active");
		$(".time .time-label.past-hour, .time .dot.past-hour").addClass("active");

		//Show new charts
		for (var i = 0; i < srcData.PastHour.Statistics.length; i++){
			generateChart(srcData.PastHour.Statistics[i], i, TIME_FORMAT.HOUR);
		}

		//Update circle
		var circleData = {};
		circleData.name = "New Members";
		circleData.figure = srcData.PastHour.NewMembers;
		updateCircle(circleData);
	}

	function show5Min(){
		//Update timeline
		$(".time .time-label, .time .dot").removeClass("active");
		$(".time .time-label.5-min, .time .dot.5-min").addClass("active");

		//Show new charts
		for (var i = 0; i < srcData.Past5Minutes.Statistics.length; i++){
			generateChart(srcData.Past5Minutes.Statistics[i], i, TIME_FORMAT.MIN);
		}

		//Update circle
		var circleData = {};
		circleData.name = "Students Online";
		circleData.figure = srcData.Past5Minutes.StudentsOnline;
		updateCircle(circleData);
	}

	function start() {
		started = true;
		$(".bottom").removeClass("loading");

		show30Days();

		var i = 1;
		setInterval(function(){
			switch (i) {
				case 0:
					show30Days();
					break;
				case 1:
					showYesterday();
					break;
				case 2:
					showPastHour();
					break;
				case 3:
					show5Min();
					break;
			}
			i++;
			if (i > 3) {
				i = 0;
			}
		}, 6000);

	}

	//Refresh document to force release memory, in case it crashes browser on tv.
	setInterval(function(){
		window.location.reload(true);
	}, 3600000 * (2 + Math.random()));


	var elem = document.getElementById('lips');
	var params = { width: 240, height: 150, autostart: true };
	var two = new Two(params).appendTo(elem);
	var offset = 25;
	var curve = two.makeCurve(20, 50+offset, 120, 50+offset, 220, 50+offset, true);
		curve.linewidth = 24;
		curve.scale = 1;
		curve.cap = 'round';
		curve.noFill();

	function updateHappiness(happiness){
		two.clear();
		var c = parseInt(happiness) + offset;
		var curve = two.makeCurve(20, 50+offset, 120, c , 220, 50+offset, true);
		curve.linewidth = 24;
		curve.scale = 1;
		curve.cap = 'round';
		curve.noFill();
	}

	updateHappiness(happiness);
	
});