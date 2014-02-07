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
		this.tweets = json;	
		return this;
	},
	
	loadString:function(str){
		return this.loadJSON(JSON.parse(str));
	},
	
	getHistogram:function(){
		var counts = new Counter();
		this.tweets.forEach(function(ele){
			counts.addDict(ele.counts);
		});
		return counts.getDataArray();
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


var Counter = function(){
	this.counts = {};
}

$.extend(Counter.prototype,{
	
	add:function(item,count){
		count = count || 1;
		if(this.counts.hasOwnProperty(item))
			this.counts[item]+=1;
		else
			this.counts[item]=1;
	},
	
	addDict:function(dict){
		$.each(dict,function(word,count){
			this.add(word,count);
		}.bind(this));
	},
	
	getDataArray:function(){
		return this.sortedIndex();
	},
	
	sortedIndex:function(order){
		order = order || 1;
		this.index = [];
		for(var word in this.counts){
			if(this.counts.hasOwnProperty(word))
				this.index.push({'word':word,'count':this.counts[word]});
			else
				console.log("No Prop: "+word);
		}
		return this.index.sort(function(a,b){
			//console.log(a.count+' '+b.count);
			if(a.count < b.count)
				return 1*order
			else if(a.count > b.count)
				return -1*order
			else
				return 0
		});
	}
});
