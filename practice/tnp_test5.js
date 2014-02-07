var G = { // object for G scope
	words:new WordCount(),
	timer:new Timer(),
	dims:{//chart dimensions
		width:1000,
		height:500
	},
}

var CF = function(){ // namespace for Chart Functions
	
	var pub = {}; //object for public variables
	
	//success callback for json load
	pub.success = function(data){
		
		//get chart svg object
		G.svg = d3.select('#chart')
		.attr("width", G.dims.width).attr("height", G.dims.height);
		
		//get g elements for both charts
		G.static = G.svg.select('#static');
		G.dynamic = G.svg.select('#dynamic');
		
		G.timer.start_log("Load JSON...");
		console.log(data);
		G.words.loadJSON(data);
		G.timer.log("End Load");
		
		G.timer.start_log("Making Histogram...")
		histData = G.words.getHistogram();
		G.timer.log("End Histogram");
		
		CF.setup_bar_chart(histData);
		
		G.timer.start_log("Making Static...");
		CF.make_static(histData);
		G.timer.log("End Static");
		
		G.timer.start_log("Making Dynamic...");
		CF.make_dynamic(histData);
		G.timer.log("End Dynamic");
	}
	
	// mouseover histogram rect 
	pub.showStats = function(){
		var that = this;
		//if background mouseover find next sibling
		if ($(this).attr('class') == 'background'){
			that = d3.select($(this).next('rect'))[0][0][0];
		}
		$('#stats #word').text(that.__data__.word);
		$('#stats #count').text(that.__data__.count);
	} 
	
	//mouse out
	pub.clearStats = function(){
		var that = this;
		if ($(this).attr('class') == 'background'){
			that = d3.select($(this).next('rect'))[0][0][0];
		}
	} 
	
	//helper function to get count and word
	pub.count =function(d){return d.count}
	pub.word = function(d){return d.word}
	
	pub.setup_bar_chart = function(data){
		//set dimensions
		G.dims.barWidth = G.dims.width/data.length;
		this.y_scale = d3.scale.linear()
		.domain([0,d3.max(data,CF.count)])
		.range([G.dims.height,0]); //0,0 is top left corner
		
	}
	
	pub.get_bars = function(ele,data) {
		return ele.selectAll('g').data(data).enter().append('g')
		.attr("transform", function(d, i) { return "translate(" + i * G.dims.barWidth + ")"; });
	},
	
	pub.make_static = function(data){
		var bars = pub.get_bars(G.static,data);
		// quarter background for mouseover
		bars.append('rect')
		.attr('width', G.dims.barWidth-1)
		.attr('height',G.dims.height*0.25)
		.attr('y',G.dims.height*0.75)
		.attr('class', 'background')
		.on('mouseover',CF.showStats)
		.on('mouseout',CF.clearStats);
		
		//main bars
		bars.append('rect')
		.attr('width',G.dims.barWidth-1)
		.attr('height',function(d){return G.dims.height-CF.y_scale(CF.count(d))})
		.attr('y',function(d){return CF.y_scale(CF.count(d))})
		.attr('class', 'bars')
		.on('mouseover',CF.showStats)
		.on('mouseout',CF.clearStats);
	}
	
	pub.make_dynamic = function(data){
		var bars = pub.get_bars(G.dynamic,data);
		
		//main dynamic bars
		bars.append('rect')
		.attr('width',G.dims.barWidth-1)
		.attr('height',function(d){return G.dims.height-CF.y_scale(CF.count(d)*0)})
		.attr('y',function(d){return CF.y_scale(CF.count(d)*0)})
		.attr('class', 'dynamic');
	},
	
	pub.change_dynamic = function(data){
		var bars = G.dynamic.selectAll('rect')
		.data(data)
		.transition()
		.duration(1000)
		.attr('height',function(d){return G.dims.height-CF.y_scale(CF.count(d))})
		.attr('y',function(d){return CF.y_scale(CF.count(d))})
	}
	
	return pub;//return public variables
}();


$(function(){
	//ajax load of json file
	$.ajax({
		dataType: 'json', 
		url: 'data/1000_seconds.json',
		success:CF.success
	});
});


