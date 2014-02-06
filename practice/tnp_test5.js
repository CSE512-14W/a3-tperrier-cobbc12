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
		G.chart = d3.select('#chart')
		.attr("width", G.dims.width).attr("height", G.dims.height);
		
		G.timer.start_log("Load JSON...");
		G.words.loadJSON(data);
		G.timer.log("End Load");
		
		histData = G.words.getHistogram();
		CF.setup_bar_chart(histData);
		G.timer.start_log("Bar Chart");
		CF.make_bar_chart(histData);
		G.timer.log("End Bar Chart");
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
	
	pub.make_bar_chart = function(data){
		console.log(G.dims);
		var bars = G.chart.selectAll('g')
		.data(data).enter().append('g')
		.attr("transform", function(d, i) { return "translate(" + i * G.dims.barWidth + ")"; });
		
		// quarter background for mouseover
		bars.append('rect')
		.attr('width', G.dims.barWidth-1)
		.attr('height',G.dims.height*0.25)
		.attr('y',G.dims.height*0.75)
		.attr('class', 'background')
		.on('mouseover',CF.showStats)out
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
	
	return pub;//return public variables
}();


$(function(){
	//ajax load of json file
	$.ajax({
		dataType: 'json', 
		url: 'small.json',
		success:CF.success
	});
});


