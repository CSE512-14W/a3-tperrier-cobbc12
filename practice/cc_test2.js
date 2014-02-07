var global = { // object for global scope
	words:new WordCount()
}

var make_timeline = function(data) {
	
	var width = 1000, height = 500, barWidth = width/data.length;
	
	var count = function(d){return d.count};
	var time = function(d){console.log(d.time); return new Date(d.time * 1000)};
	
	global.chart = d3.select('#chart')
	.attr("width", width).attr("height", height);
	
	var line = d3.svg.line()
    	.x(time)
    	.y(count);

	var svg = d3.select("#chart")
  		.append("path")
  			.datum(data)
  			.attr("class", "line")
  			.attr("d", line);
}


$(function(){
	console.log('start');
	$.ajax({
		dataType: 'json', 
		url: 'small.json',
		success: function(data){
			console.log('got json', data);
			global.words.loadJSON(data);
			make_timeline(global.words.getTweetTimeline());
		}	
	});
});
