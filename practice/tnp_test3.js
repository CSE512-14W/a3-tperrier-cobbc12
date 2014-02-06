var global = { // object for global scope
	words:new WordCount()
}

var fr = new FileReader();

fr.onload = function(evt) {
	global.words.loadString(evt.target.result);
	make_bar_chart(global.words.getHistogram());
}

var make_bar_chart = function(data) {
	
	var width = 1000, height = 500, barWidth = width/data.length;
	
	var count = function(d){return d.count};
	var word = function(d){return d.word};
	
	global.chart = d3.select('body').append('svg')
	.attr('id','chart').attr("width", width).attr("height", height);
	
	var y_scale = d3.scale.linear()
	.domain([0,d3.max(data,count)])
	.range([height,0]); //0,0 is top left corner
	
	var bars = global.chart.selectAll('g')
	.data(data).enter().append('g')
	.attr("transform", function(d, i) { return "translate(" + i * barWidth + ")"; });
	
	bars.append('rect')
	.attr('width',barWidth-1)
	.attr('height',function(d){return height-y_scale(count(d))})
	.attr('y',function(d){return y_scale(count(d))});
	
	//add word
	bars.append('text')
	.attr('x',barWidth/2)
	.attr('y',function(d){return y_scale(d.count)+3})
	.attr("dy", ".75em")
    .text(word);
	/*
	//add count 
	bars.append('text')
	.attr('x',function(d){return x_scale(count(d))+25;})
	.attr('y',barHeight/2)
	.attr("dy", ".35em")
	.attr("style","fill:black")
	.text(count);*/
}


$(function(){
	$('input').change(function(evt){
		console.log('change');
		fr.readAsText($('input')[0].files[0]);
	});
});
