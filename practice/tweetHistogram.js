/*
Array.prototype.sum = function(f){
	f = f || function(d){return d}
	return this.reduce(function(a, b) { return [f(a) + f(b)]; }, 0);
	}
	
	
var getWindowAvgArray = function(array, win){
	ret_arr = []
	for (var i = 0; i < array.length; i++){
		beg = i - win
		end = i + win
		if (beg < 0){
			beg = 0
		}
		if (end > array.length -1){
			end = array.length -1
		}
		ret_arr.push(array.slice(beg,end).sum(function(d){
			return d[0];
		})/(1.0*(end-beg));			
	}
return ret_arr;
}	*/
	

/*************
Word Count Class
- reads a json array of tweets
{
	id:
	text:
	time: #seconds since epoch
	counts: {freq of key words}
}
*************/

var WordCount = function() {
}

$.extend(WordCount.prototype,{

	//set this.tweets from json or str
	loadJSON:function(json){
		this.words = json.w;	
		this.counts = json.s;	
		this.range = json.r;
		this.order = 1;
		return this;
	},
	
	loadString:function(str){
		return this.loadJSON(JSON.parse(str));
	},
	
	cumulativeSecond:function(seconds){
		return this.counts[this.range.e-seconds]
	},
	
	getIndex:function(date){
		console.log(date,date.valueOf(),this.range.s,this.range.e,date.valueOf()/100-this.range.s);
		return Math.floor(date.valueOf()/1000)-this.range.s;
	},
	
	getHistogram:function(s,e,ws,we){
		var s =  s || 0, e = e || this.counts.length, counts = [];
		if(s instanceof Date) {
			s = this.getIndex(s);
		}
		if(e instanceof Date) {
			e = this.getIndex(e);
		}
		console.log(s,e);
		var ws = ws || 3, we = we || 90;
		var start = this.counts[s],end = this.counts[e-1];
		for(var i=ws; i<we; i++){
			counts.push({'word':this.words[i],'count':end[i]-start[i],'position':i-ws}); 
		}
		return counts;
	},
	
	/*
	getTweetTimeline:function(word_pos, win){
		var word_pos = word_pos || 0; 
		var win = win || 0; 
		var per_sec = [];
		for (var t = this.range.s+1; t <= this.range.e; t++){
			per_sec.push({'time': new Date(t*1000), 
				'count':this.counts[t-this.range.s][word_pos] - this.counts[t-this.range.s-1][word_pos]})
		}
		return per_sec;
	}*/
	
	//gives average tweets per second binned by window
	getTweetTimeline:function(word,win){
		var word = this.words.indexOf(word)+1 || 0, win = win || 60;
		var timeline = [], t_start = this.range.s*1000;
		for(var i=0; i<this.counts.length-win; i+=win){
			timeline.push( {'time':new Date(t_start+(i*1000)),
				'count':(this.counts[i+win][word]-this.counts[i][word])/win});
		}
		return timeline;
	}
});


/*************
Helper Class: Timer
*************/
var Timer = function() {
	this.times = [];
};

$.extend(Timer.prototype,{
	start:function(){
		this.times = [Date.now()];
		return this;
	},
	start_log:function(str){
		str = str || '';
		this.start();
		console.log("Started "+str);
	},
	split:function(){
		this.times.push(Date.now());
		return this;
	},
	delta:function(){
		this.split();
		return (this.times[this.times.length-1]-this.times[0])/1000
	},
	log:function(str){
		str  = str || '';
		console.log(str+" -- Time Delta: "+this.delta());
	}
});

/*************
Helper Class: Dimensions
*************/
var Dimension = function(prop){
	prop = prop || {}
	var defaults = {
		top:10,
		right:10,
		bottom:10,
		left:10,
		width:1000,
		height:500
	}
	$.extend(true,defaults,prop);
	$.extend(this,defaults);
	this.width = this.width-this.left-this.right;
	this.height = this.height-this.top-this.bottom;
}

$.extend(Dimension.prototype,{
	total_width:function(){
		return this.width+this.left+this.right;
	},
	total_height:function(){
		return this.height+this.top+this.bottom;
	}
});
