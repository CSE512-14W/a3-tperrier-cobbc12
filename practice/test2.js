//var data = [4, 8, 15, 16, 23, 25];
var global = new Object(); //empty object for global scope

var fr = new FileReader();

fr.onload = function(evt) {
	global.data = parse_data(evt.target.result);
	make_bar_chart();
}


var parse_data = function(data) {
	console.log(JSON.parse(data));
	return JSON.parse(data);
}


var make_bar_chart = function() {
	data = global.data;
	
	var width = 500, barHeight = 20;
	
	global.chart = d3.select('body').append('svg')
	.attr('id','chart')
	 .attr("width", width)
    .attr("height", barHeight * data.length);
	
	var x_scale = d3.scale.linear()
	.domain([0,d3.max(data)])
	.range([0,width]);
	
	var bars = global.chart.selectAll('g')
	.data(data).enter().append('g')
	.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
	
	bars.append('rect')
	.attr('width',x_scale)
	.attr('height',barHeight-1);
	
	bars.append('text')
	.attr('x',function(x){return x_scale(x)-3;})
	.attr('y',barHeight/2)
	.attr("dy", ".35em")
    .text(function(d) { return d; });
}


$(function(){
	$('input').change(function(evt){
		console.log('change');
		fr.readAsText($('input')[0].files[0]);
	});
});
