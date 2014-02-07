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
	
	getHistogram:function(s,e){
		var s =  s || 0, e = e || this.counts.length, counts = [];
		var start = this.counts[s],end = this.counts[e-1];
		this.words.forEach(function(word,i){
			counts.push({'word':word,'count':end[i+1]-start[i+1]}); //add one because first index is total tweets
		});
		return counts.sort(this.sortCounts.bind(this));
	},
	sortCounts:function(a,b){
		if(a.count < b.count)
			return 1*this.order
		else if(a.count > b.count)
			return -1*this.order
		else
			return 0
	},
	

	getTweetTimeline:function(counts,range){
		var per_sec = [];
		console.log(this);
		for (var t = this.range.s; t <= this.range.e; t++){
			per_sec.push({'time': new Date(t*1000), 
				'count': this.counts[t-this.range.s][0]})
		}
		return per_sec;
	},

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
