var global = { // object for global scope
	words:new WordCount()
}

var fr = new FileReader();

fr.onload = function(evt) {
	global.words.loadString(evt.target.result);
	make_bar_chart(global.words.getHistogram());
}

var make_bar_chart = function(data) {
	
	var width = 500, barHeight = 20;
	
	var count = function(d){return d.count};
	var word = function(d){return d.word};
	
	global.chart = d3.select('body').append('svg')
	.attr('id','chart')
	 .attr("width", width)
    .attr("height", barHeight * data.length);
	
	var x_scale = d3.scale.linear()
	.domain([0,d3.max(data,count)])
	.range([0,width]);
	
	var bars = global.chart.selectAll('g')
	.data(data).enter().append('g')
	.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
	
	bars.append('rect')
	.attr('width',function(d){return x_scale(count(d))})
	.attr('height',barHeight-1);
	
	//add word
	bars.append('text')
	.attr('x',function(d){return x_scale(count(d))-3;})
	.attr('y',barHeight/2)
	.attr("dy", ".35em")
    .text(word);
	
	//add count 
	bars.append('text')
	.attr('x',function(d){return x_scale(count(d))+25;})
	.attr('y',barHeight/2)
	.attr("dy", ".35em")
	.attr("style","fill:black")
	.text(count);
}


$(function(){
	$('input').change(function(evt){
		console.log('change');
		fr.readAsText($('input')[0].files[0]);
	});
});
