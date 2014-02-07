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
}	
	

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
	
	getHistogram:function(s,e,ws,we){
		var s =  s || 0, e = e || this.counts.length, counts = [];
		var ws = ws || 2, we = we || 124;
		var start = this.counts[s],end = this.counts[e-1];
		for(var i=ws; i<we; i++){
			//add one because first index is total tweets
			counts.push({'word':this.words[i],'count':end[i+1]-start[i+1]}); 
		}
		return counts.sort(this.sortCounts.bind(this));
	},
	

	sortCounts:function(a,b){
		if(a.count < b.count)
			return 1*this.order;
		else if(a.count > b.count)
			return -1*this.order;
		else
			return 0;
	},
	
	
	getTweetTimeline:function(word_pos, win){
		var word_pos = word_pos || 0; 
		var win = win || 0; 
		var per_sec = [];
		var new_counts = getWindowAvgArray(this.counts, win); 
		for (var t = this.range.s+1; t <= this.range.e; t++){
			per_sec.push({'time': new Date(t*1000), 
				'count':
 this.counts[t-this.range.s][word_pos] - this.counts[t-this.range.s-1][word_pos]})
		}
		return per_sec;
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
