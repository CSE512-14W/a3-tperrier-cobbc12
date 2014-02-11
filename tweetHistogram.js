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
		this.relative = json.t;
		this.order = 1;
		this.stack_time = true;
		this.word = 'win';
		return this;
	},
	
	loadString:function(str){
		return this.loadJSON(JSON.parse(str));
	},
	
	cumulativeSecond:function(seconds){
		return this.counts[this.range.e-seconds]
	},
	
	getDateIndex:function(date){
		if(!date) return date;
		if(date.constructor==Date){
			return Math.floor(date.valueOf()/1000)-this.range.s;
		}else{
			return date%this.counts.length;
		}
	},
	
	getWordIndex:function(word){
		if (!word) return word;
		return (word.constructor==String)?this.words.indexOf(word):word;
	},
	
	getRelativeHistogram:function(word,ws,we){
		var ws = ws || 2, we = we || this.words.length;
		return this.relative[this.getWordIndex(word)].slice(ws,we);
	},
	
	getTimeHistogram:function(s,e,ws,we){
		var s =  this.getDateIndex(s) || 0, e = this.getDateIndex(e) || this.counts.length-1;
		var ws = ws || 2, we = we || this.words.length;
		var start = this.counts[s].slice(ws+1,we+1);
		return this.counts[e].slice(ws+1,we+1).map(function(ele,idx){
			return ele-start[idx]
		});
	},
	
	getHistogram:function(s,e,ws,we){
		var ws = ws || 2, we = we || this.words.length;
		var total = this.getTimeHistogram(0,this.counts.length,ws,we);
		var stack = this.stack_time?this.getTimeHistogram(s,e,ws,we):this.getRelativeHistogram(this.word,ws,we);
		
		return this.words.slice(ws,we).map(function(word,idx){
			return {'word':word,'total':total[idx],'stack':stack[idx],'position':idx+1}
		});
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
		var word = this.getWordIndex(word)+1 || 0, win = win || 60;
		var timeline = [];
		for(var i=0; i<this.counts.length-win; i+=win){
			timeline.push( {'time':new Date((this.range.s+i)*1000),
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

var Tabs = {
	make:function(){
		ele = $('div.tabs');
		ele.each(function(i){
			Tabs.init(this);
		});
	},
	init:function(ele){
		ele = $(ele);
		//show active tab
		var active_id = '#'+ele.find('ul>li.active').attr('id');
		console.log(ele.find('.content '+active_id));
		ele.find('.content '+active_id).css('display','block');
		
		//switch tabs on click
		ele.find('ul>li').click(function(evt){
			Tabs.show(this);
		});
	},
	
	show:function(ele){
		var active_id = '#'+$(ele).attr('id');
		
		var tabs = $(ele).closest('div.tabs');
		//hide last tab
		tabs.find('.content>div').css('display','none');
		//show this tab
		tabs.find('.content '+active_id).css('display','block');
	}
}
