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
	
	getTweetTimeline:function(){
		var per_sec = [];
		for (var t = 0, c=0, s=Math.floor(this.tweets[0].time); t < this.tweets.length; t++){
			if (Math.floor(this.tweets[t].time) == s){
				c += 1; 
			}
			else{
				per_sec.push({'time':s, 'count':c});
				s = Math.floor(this.tweets[t].time);
				c = 1;
			}
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
