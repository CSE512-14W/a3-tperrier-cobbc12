var G = { // object for G scope
	words:new WordCount(),
	timer:new Timer(),
	dims:{
		chart:new Dimension({width:1000,height:500,top:10,right:20,bottom:10,left:20}),
		timeline:new Dimension({width:1000,height:100,top:10,right:20,bottom:10,left:20}),
	}
}

var CF = function(){ // namespace for Chart Functions
	
	var pub = {}; //object for public variables
	
	//success callback for json load
	pub.success = function(data){
		
		//get chart svg object
		G.svg = d3.select('#chart')
		.attr("width", G.dims.chart.total_width())
		.attr("height", G.dims.chart.total_height());
		
		//get g elements for both charts
		G.static = G.svg.select('#static')
		.attr('transform','translate('+G.dims.chart.left+','+G.dims.chart.top+')');
		G.dynamic = G.svg.select('#dynamic')
		.attr('transform','translate('+G.dims.chart.left+','+G.dims.chart.top+')');
		
		//get svg element for timeline
		G.timeline = d3.select('#timeline')
		.attr("width", G.dims.timeline.total_width())
		.attr("height", G.dims.timeline.total_height())
		.append('g')
		.attr('transform','translate('+G.dims.timeline.left+','+G.dims.timeline.top+')');;
		
		G.timer.start_log("Load JSON...");
		console.log(data);
		G.words.loadJSON(data);
		G.timer.log("End Load");
		
		G.timer.start_log("Calculating Histogram Data...")
		histData = G.words.getHistogram();
		G.timer.log("End Calculating");
		
		G.timer.start_log("Making Histogram...");
		CF.make_bar_chart(histData);
		G.timer.log("End Histogram");
		
		G.timer.start_log("Calculating Timeline....")
		timeData = G.words.getTweetTimeline();
		broncos = G.words.getTweetTimeline("broncos");
		seahawks = G.words.getTweetTimeline("seahawks");
		G.timer.log("End Calculating");
		
		G.timer.start_log("Making Timeline...");
		CF.make_timeline(timeData,broncos,seahawks);
		G.timer.log("End Timeline");
	}
	
	// mouseover histogram rect 
	pub.showStats = function(){
		if(G.last) G.last.style('fill','steelblue');
		var that = this;
		//if background mouseover find next sibling
		if ($(this).attr('class') == 'background'){
			that = d3.select($(this).next('rect'))[0][0][0];
		}else if ($(this).attr('class') == 'dynamic') {
			var index = $(G.dynamic[0][0]).children().index($(this).parent());
			that = d3.select($($(G.static[0][0]).children()[index]).children('rect')[1])[0][0];
		}
		$('#stats #word').text(that.__data__.word);
		$('#stats #count').text(that.__data__.count);
		$('#stats #position').text(that.__data__.position);
		G.last = d3.select(that);
		G.last.style('fill','yellow');
	} 
	
	//helper function to get count and word
	pub.count =function(d){return d.count}
	pub.word = function(d){return d.word}
	pub.time = function(d){return d.time}
	
	pub.make_bar_chart = function(data) {
		//set dimensions that require data
		G.dims.chart.barWidth = G.dims.chart.width/data.length;
		G.dims.chart.y = d3.scale.linear()
		.domain([0,d3.max(data,CF.count)])
		.range([G.dims.chart.height,0]); //0,0 is top left corner
		
		//make static bars
			var static_bars = G.static.selectAll('g').data(data).enter().append('g')
			.attr("transform", function(d, i) { return "translate(" + i * G.dims.chart.barWidth + ")"; });
			// quarter background for mouseover on small bars
			static_bars.append('rect')
			.attr('width', G.dims.chart.barWidth-1)
			.attr('height',G.dims.chart.height*0.25)
			.attr('y',G.dims.chart.height*0.75)
			.attr('class', 'background')
			.on('mouseover',CF.showStats);
			
			//main bars
			static_bars.append('rect')
			.attr('width',G.dims.chart.barWidth-1)
			.attr('height',function(d){return G.dims.chart.height-G.dims.chart.y(CF.count(d))})
			.attr('y',function(d){return G.dims.chart.y(CF.count(d))})
			.attr('class', 'bars')
			.on('mouseover',CF.showStats);
		
		//make dynamic bars
			var dynamic_bars = G.dynamic.selectAll('g').data(data).enter().append('g')
			.attr("transform", function(d, i) { return "translate(" + i * G.dims.chart.barWidth + ")"; });
			
			//main dynamic bars
			dynamic_bars.append('rect')
			.attr('width',G.dims.chart.barWidth-1)
			.attr('height',function(d){return G.dims.chart.height-G.dims.chart.y(CF.count(d)*.5)})
			.attr('y',function(d){return G.dims.chart.y(CF.count(d)*.5)})
			.attr('class', 'dynamic')
			.on('mouseover',CF.showStats);
			
	}
	
	pub.make_timeline = function(data,broncos,seahawks) {
		//set dimensions that require data
		G.dims.timeline.x = d3.time.scale()
		.domain([CF.time(data[0]),CF.time(data[data.length-1])])
		.range([0, G.dims.timeline.width]);
	
		G.dims.timeline.y = d3.scale.linear()
		.domain([0,d3.max(data,CF.count)])
		.range([G.dims.timeline.height,0]); 
		
		//set up axis
		G.dims.timeline.xAxis = d3.svg.axis().scale(G.dims.timeline.x).orient("bottom"); 
		G.dims.timeline.xAxis = d3.svg.axis().scale(G.dims.timeline.y).orient("left"); 
		
		//create line
		var line = d3.svg.line()
		.x(function(d){return G.dims.timeline.x(CF.time(d))})
		.y(function(d){return G.dims.timeline.y(CF.count(d))});
		
		G.timeline.append("path").datum(data)
		.attr("class", "line")
		.attr("d", line);
		
		G.timeline.append("path").datum(broncos)
		.attr("class", "line")
		.attr("d", line);
		
		G.timeline.append("path").datum(seahawks)
		.attr("class", "line")
		.attr("d", line);
		
	}
	
	pub.change_dynamic = function(data){
		var bars = G.dynamic.selectAll('rect')
		.data(data)
		.transition()
		.duration(1000)
		.attr('height',function(d){return G.dims.chart.height-CF.G.dims.chart.y(CF.count(d))})
		.attr('y',function(d){return CF.G.dims.chart.y(CF.count(d))})
		.on('mouseover',CF.showStats);
	}
	
	return pub;//return public variables
}();


$(function(){
	//ajax load of json file
	$.ajax({
		dataType: 'json', 
		url: 'data/all_seconds2.json',
		success:CF.success
	});
});


