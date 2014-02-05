var global = { // object for global scope
	words:new WordCount()
}

var showStats = function(){
	var that = this;
	var bool = $(this).attr('class') == 'background';
	if (bool){
		that = d3.select($(this).next('rect'))[0][0][0];
	}
	$('#stats #word').text(that.__data__.word);
	$('#stats #count').text(that.__data__.count);
}

var clearStats = function(){
	var that = this;
	var bool = $(this).attr('class') == 'background';
	if (bool){
		that = d3.select($(this).next('rect'))[0][0][0];
	}
}


var make_bar_chart = function(data) {
	
	var width = 1000, height = 500, barWidth = width/data.length;
	
	var count = function(d){return d.count};
	var word = function(d){return d.word};
	
	global.chart = d3.select('#chart')
	.attr("width", width).attr("height", height);
	
	var y_scale = d3.scale.linear()
	.domain([0,d3.max(data,count)])
	.range([height,0]); //0,0 is top left corner
	
	var bars = global.chart.selectAll('g')
	.data(data).enter().append('g')
	.attr("transform", function(d, i) { return "translate(" + i * barWidth + ")"; });
	
	// quarter background for mouseover
	bars.append('rect')
	.attr('width', barWidth-1)
	.attr('height',height*0.25)
	.attr('y',height*0.75)
	.attr('class', 'background')
	.on('mouseover',showStats)
	.on('mouseout',clearStats);
	
	bars.append('rect')
	.attr('width',barWidth-1)
	.attr('height',function(d){return height-y_scale(count(d))})
	.attr('y',function(d){return y_scale(count(d))})
	.attr('class', 'bars')
	.on('mouseover',showStats)
	.on('mouseout',clearStats);
	
	//add word
	/*
	bars.append('text')
	.attr('x',barWidth/2)
	.attr('y',function(d){return y_scale(d.count)+3})
	.attr("dy", ".75em")
    .text(word);
	*/
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
	console.log('start');
	$.ajax({
		dataType: 'json', 
		url: 'small.json',
		success: function(data){
			console.log('got json', data);
			global.words.loadJSON(data);
			make_bar_chart(global.words.getHistogram());
		}	
	});
});
