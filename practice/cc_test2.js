var global = { // object for global scope
	words:new WordCount()
}

var make_timeline = function(data) {
	
	var width = 1000, height = 100, barWidth = width/data.length;
	
	var count = function(d){return d.count};
	var time = function(d){return d.time};
	
	var x_scale = d3.time.scale()
		.domain([time(data[0]),time(data[data.length-1])])
		.range([0, width]);
	
	var y_scale = d3.scale.linear()
		.domain([0,d3.max(data,count)])
		.range([height,0]); 
		
	var xAxis = d3.svg.axis().scale(x_scale).orient("bottom"); 
	
	var yAxis = d3.svg.axis().scale(y_scale).orient("left");
	
	var line = d3.svg.line()
    	.x(function(d){return x_scale(time(d))})
    	.y(function(d){return y_scale(count(d))});
    	
    var brush = d3.svg.brush()
		.x(x_scale)
		.on("brush", brushed);
	
	global.chart = d3.select('#chart')
		.attr("width", width).attr("height", height)
		.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);
			
	global.chart = d3.select('#chart')
		.append("g")
			.attr("class", "x brush")
			.call(brush)
			.selectAll("rect")
			.attr("y",-6)
			.attr("height", height + 7);
			
	global.chart = d3.select('#chart')
		.append("g")
			.attr("class", "x axis")
			.call(xAxis);
	
	global.chart = d3.select('#chart')
		.append("g")
	  		.attr("class", "y axis")
	  		.call(yAxis);
	
	function brushed() {
		return 0; 
	  /*x.domain(brush.empty() ? x2.domain() : brush.extent());
	  focus.select(".area").attr("d", area);
	  focus.select(".x.axis").call(xAxis);*/
	  }
			
}


$(function(){
	console.log('start');
	$.ajax({
		dataType: 'json', 
		url: 'all_seconds.json',
		success: function(data){
			console.log('got json', data);
			global.words.loadJSON(data);
			make_timeline(global.words.getTweetTimeline());
		}	
	});
});
