var G = { // object for G scope
	words:new WordCount(),
	timer:new Timer(),
	dims:{
		chart:new Dimension({width:1076,height:500,top:3,right:3,bottom:20,left:50}),
		timeline:new Dimension({width:1076,height:75,top:5,right:5,bottom:20,left:30}),
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
		G.chart = G.svg.append('g')
		.attr('transform','translate('+G.dims.chart.left+','+G.dims.chart.top+')');
		
		//get svg element for timeline
		G.timeline = d3.select('svg#timeline')
		.attr("width", G.dims.timeline.total_width())
		.attr("height", G.dims.timeline.total_height())
		.append('g')
		.attr('transform','translate('+G.dims.timeline.left+','+G.dims.timeline.top+')');;
		
		//load data
		G.timer.start_log("Load JSON...");
		console.log(data);
		G.words.loadJSON(data);
		G.timer.log("End Load");
		
		//make timeline
		G.timer.start_log("Calculating Timeline....")
		timeData = G.words.getTweetTimeline();
		broncos = G.words.getTweetTimeline("broncos");
		seahawks = G.words.getTweetTimeline("seahawks");
		G.timer.log("End Calculating");
		
		G.timer.start_log("Making Timeline...");
		CF.make_timeline(timeData,broncos,seahawks);
		G.timer.log("End Timeline");
		
		//add brush to timeline
			G.timeline.brush = d3.svg.brush().x(G.dims.timeline.x)
				.extent([timeData[600].time,timeData[720].time])
				.on("brushend",CF.brushed)
			
			d3.select('svg#timeline').append('g')
			.attr('class','brush')
			.attr('transform','translate('+G.dims.timeline.left+','+(G.dims.timeline.top-1)+')')
			.call(G.timeline.brush)
			.selectAll("rect")
			.attr('height',G.dims.timeline.height);
		
		//make histogram.
		G.timer.start_log("Calculating Histogram Data...")
		histData = G.words.getHistogram(G.timeline.brush.extent()[0],G.timeline.brush.extent()[1]);
		G.timer.log("End Calculating");
		
		G.timer.start_log("Making Histogram...");
		CF.make_bar_chart(histData);
		CF.make_word_list(histData);
		G.timer.log("End Histogram");
	}
	
	// mouseover histogram rect 
	pub.histHover = function(){
		if(G.last)G.last.style('fill-opacity',0);
		var hover = d3.select($(this).parent().children('.hover')[0])[0][0];
		if($(this).prop('tagName')=='TR'){
			hover = G.chart.selectAll('g').selectAll('rect')[$(this).index()][2];
		}
		
		var total = d3.select($(hover).parent().children('.total')[0])[0][0];
	
		$('#stats dd').each(function(i){
			$(this).text(total.__data__[$(this).attr('id')]);
		});
		G.last = d3.select(hover);
		G.last.style('fill-opacity',.4);
	} 
	
	//click histogram rect
	pub.histClick = function() {
		var hover = d3.select($(this).parent().children('.hover')[0])[0][0];
		if($(this).prop('tagName')=='TR'){
			hover = G.chart.selectAll('g').selectAll('rect')[$(this).index()][2];
		}
		G.words.word = hover.__data__.word;
		var extent = G.timeline.brush.extent();
		CF.change_bars(G.words.getHistogram(extent[0],extent[1]));
	}
	
	//brush function
	pub.brushed = function() {
		console.log(d3.event);
		var extent = G.timeline.brush.extent();
		CF.change_bars(G.words.getHistogram(extent[0],extent[1]));
	}
	
	//toggle word and timeline view
	pub.toggleChart = function(evt) {
		G.words.stack_time = $(evt.target).attr('id')=='timeline';
		var extent = G.timeline.brush.extent();
		CF.change_bars(G.words.getHistogram(extent[0],extent[1]));
	}
	
	//helper function to get count and word
	pub.count = function(d){return d.count}
	pub.total = function(d){return d.total}
	pub.stack = function(d){return d.stack}
	pub.word = function(d){return d.word}
	pub.time = function(d){return d.time}
	
	//add axis to G.dims
	G.dims.chart.y = d3.scale.linear().range([G.dims.chart.height,0]); //0,0 is top left corner
	G.dims.chart.axis = {
		y:d3.svg.axis().scale(G.dims.chart.y).orient('left'),
	}
	
	G.dims.timeline.x = d3.time.scale()
	.range([0, G.dims.timeline.width]);
	
	G.dims.timeline.y =  d3.scale.linear()
	.range([G.dims.timeline.height,0]);

	G.dims.timeline.axis = {
		y:d3.svg.axis().scale(G.dims.timeline.y).orient("left").ticks(5),
		x:d3.svg.axis().scale(G.dims.timeline.x).orient("bottom")
	}
	
	pub.make_bar_chart = function(data) {
		//set dimensions that require data
		G.dims.chart.barWidth = G.dims.chart.width/data.length;
		G.dims.chart.y.domain([0,d3.max(data,CF.total)]);
		
		//append axis
		G.svg.append('g')
		.attr('class','axis')
		.attr('transform','translate(48,'+G.dims.chart.top+')')
		.call(G.dims.chart.axis.y);
		
		//make static bars
		var bars = G.chart.selectAll('g').data(data).enter().append('g')
		.attr("transform", function(d, i) { return "translate(" + i * G.dims.chart.barWidth + ")"; });
		
		// total slice
		bars.append('rect')
		.attr('width',G.dims.chart.barWidth-1)
		.attr('height',function(d){return G.dims.chart.height-G.dims.chart.y(d.total-d.stack)})
		.attr('y',function(d){return G.dims.chart.y(d.total)})
		.attr('class', 'total')
		
		//stacked slice
		bars.append('rect')
		.attr('width',G.dims.chart.barWidth-1)
		.attr('height',function(d){return G.dims.chart.height-G.dims.chart.y(d.stack)})
		.attr('y',function(d){return G.dims.chart.y(d.stack)})
		.attr('class', 'stack')
		
		//place word
		bars.append('text')
		.on('mouseover',CF.histHover)
		.on('click',CF.histClick)
		.text(CF.word)
		.style({'writing-mode':'tb','font-size':G.dims.chart.barWidth,'cursor':'default'})
		.attr({
			'fill':function(d,i){return (i<3)?'white':'black'},
			'y':function(d,i){
				if(i<3) // first three
					return G.dims.chart.y(d.total)+3;
				return G.dims.chart.y(d.total)-this.getBBox().height-3;
			},
			'x':G.dims.chart.barWidth/2,
			})
		;
			
		//place number
		bars.append('text')
		.text(function(d,i){if((i+1)%5==0)return d.position})
		.style({'writing-mode':'tb','font-size':G.dims.chart.barWidth})
		.attr({
			'y':G.dims.chart.height+3,
			'x':G.dims.chart.barWidth/2,
			});
		
		//mouse over slice
		bars.append('rect')
		.attr('width',G.dims.chart.barWidth-1)
		.attr('height',function(d){return G.dims.chart.height-G.dims.chart.y(d.total)})
		.attr('y',function(d){return G.dims.chart.y(d.total)})
		.attr('class', 'hover')
		.on('mouseover',CF.histHover)
		.on('click',CF.histClick);
	}
	
	pub.change_bars = function(data){
		var total_bars = G.chart.selectAll('rect.total')
		.data(data).transition().duration(1000)
		.attr('height',function(d){return G.dims.chart.height-G.dims.chart.y(d.total-d.stack)});
		
		var stack_bars = G.chart.selectAll('rect.stack')
		.data(data).transition().duration(1000)
		.attr('height',function(d){return G.dims.chart.height-G.dims.chart.y(d.stack)})
		.attr('y',function(d){return G.dims.chart.y(d.stack)})
		
	}
	
	pub.make_timeline = function(data,broncos,seahawks) {
		//set dimensions that require data
		G.dims.timeline.x
		.domain([CF.time(data[0]),CF.time(data[data.length-1])])
		G.dims.timeline.y
		.domain([0,d3.max(data,CF.count)])
		
		//append axis
		d3.select('svg#timeline').append('g').attr("class", "y axis")
		.attr('transform','translate(25,'+G.dims.timeline.top+')')
		.call(G.dims.timeline.axis.y);
		
		d3.select('svg#timeline').append('g').attr("class", "x axis")
		.attr('transform','translate('+G.dims.timeline.left+','+(G.dims.timeline.height+G.dims.timeline.top)+')')
		.call(G.dims.timeline.axis.x);
		
		//create line
		var line = d3.svg.line()
		.x(function(d){return G.dims.timeline.x(CF.time(d))})
		.y(function(d){return G.dims.timeline.y(CF.count(d))});
		
		G.timeline.append("path").datum(data)
		.attr("class", "line")
		.attr("d", line);
		
		/*
		G.timeline.append("path").datum(broncos)
		.attr("class", "line")
		.attr("d", line);
		
		G.timeline.append("path").datum(seahawks)
		.attr("class", "line")
		.attr("d", line);
		*/
	}
	
	pub.make_word_list = function(data){
		var box = d3.select('#left-col').append('table').selectAll('tr').data(data).enter()
		.append('tr')
		.style('background-color',function(d,i){if (i%2==0) return '#deebf7'});
		
		box.append('td').text(function(d){return d.position});
		box.append('td').text(function(d){return d.word});
		box.append('td').text(function(d){return d.total});
		
		box.on('mouseover',CF.histHover).on('click',CF.histClick);
	}

	return pub;//return public variables
}();


$(function(){
	
	Tabs.make();
	$('div.tabs>ul>li').click(CF.toggleChart);
	
	//ajax load of json file
	$.ajax({
		dataType: 'json', 
		url: '../csv/new_all.json',
		success:CF.success
	});
});


