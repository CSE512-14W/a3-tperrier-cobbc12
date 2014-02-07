var global = { // object for global scope
	words:new WordCount()
}

var make_timeline = function(data) {
	
	var width = 1000, height = 500, barWidth = width/data.length;
	
	var count = function(d){return d.count};
	var time = function(d){return d.time};
	
	var x_scale = d3.time.scale()
		.domain([time(data[0]),time(data[data.length-1])])
		.range([0, width]);
	
	var y_scale = d3.scale.linear()
		.domain([0,d3.max(data,count)])
		.range([height,0]); 
	
	var line = d3.svg.line()
    	.x(function(d){return x_scale(time(d))})
    	.y(function(d){return y_scale(count(d))});
	
	global.chart = d3.select('#chart')
		.attr("width", width).attr("height", height)
		.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);
}


$(function(){
	console.log('start');
	$.ajax({
		dataType: 'json', 
		url: '1000_seconds.json',
		success: function(data){
			console.log('got json', data);
			global.words.loadJSON(data);
			make_timeline(global.words.getTweetTimeline());
		}	
	});
});
