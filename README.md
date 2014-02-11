### [Demo of final code:](http://homes.cs.washington.edu/~tperrier/a3/) 
Be patient! It might take up to around 30 seconds to load, and there's no "loading" icon while you wait. 
Also, be sure you're viewing it on a big screen (or minimize the view until you can see everything at once on a smaller screen). 

### Instructions for running our code: 


### Example of something cool you can find in our viz: 

One interesting example is looking at how retweets fall off. Most of the @ mentions that appear in our dataset as "popular words" are coming from someone being frequently retweeted. You can see a pretty cool fall-off pattern if you look at the timeline of these and how they get popular for a very isolated time period. 

### Data Domain Description: 

We decided to create a visualization of Twitter data from the Super Bowl. Although we chose to collect football-related Tweets, we believe that the final visualization also has potential to help people explore data from other events. With slightly more complex data collection methods and by implementing scripts for real-time data processing (both of which we decided were beyond the scope of what we hoped to accomplish for this project), the visualization could even be generated with live streaming data during an event. 

This has potential implications for several important domains. One project partner’s research is in the crisis domain, exploring how social media data (especially Twitter) could be useful during crisis events such as natural disasters. 

Because the Super Bowl tends to have a similar volume of Tweets to fast-moving crisis events, and because of the timeliness of the event, this seemed like an appropriate substitute for crisis-related tweets. In fact, we have learned in previous user studies that emergency managers who monitor social media during crises have used the Super Bowl as a training event. 

An important goal during the process of finding and curating Twitter data for crisis response is understanding how an event is evolving, which often involves understanding which how various terms become popular or fade out of popularity during certain phases of the event (ex. preparation for a hurricane, the actual impact of the hurricane, and several stages of recovery after impact). Currently, the best/most widely-used method for gaining this kind of awareness is simply monitoring streams of tweets and trying to gain situational awareness through memory or through marking relevant tweets in some way (ex. by copying and pasting them into spreadsheets). Exploring visualizations that convey similar situational awareness information seems worthwhile, and a visualization that explores words within a large set of relevant tweets, allowing users to compare how the popularity of various words has changed over time, seems appropriate.

### Storyboard: 

![image of storyboard](https://raw.github.com/CSE512-14W/a3-tperrier-cobbc12/master/storyboard.png)

### Changes between storyboard and final:

Unfortunately, our Twitter collection failed during (actually, before) the big game. This was due to an unforeseen issue with MongoDB only being able to handle a certain amount of data and because we did a test collection the night before which was larger than we realized. This test collection became our actual dataset. This means that we were unable to annotate real-world events during the game to see how word usage and volume may have changed at these times. While this may make for a slightly less “exciting” visualization final product, it is much more portable to other datasets and would require less changes to make it work on live data. 

There were a few other small changes we made. For example, we chose to allow users to either see co-occurrence of words or the histogram for words within a certain time frame. The computation required to see both at once was slower than we were willing to keep for the final visualization. In keeping with our hopes that it could be easily ported to live data, we eventually decided to ensure that our final visualization relied on data that could be generated on the fly. 

Our initial storyboard also showed a slightly different layout, fewer bars, and brush-select and new timelines appearing in the same graph. Many of these differences are a result of the large number of interesting words we wanted to be able to display, needing to switch between "by word" and "by time" modes (for speed), and the fact that having too many line graphs in the same figure was visually too much information. 

### Brief Description of Final Viz: 

Our final visualization allows you to explore popular words within tweets leading up to the Superbowl, either based on their co-occurrence with other popular words or by selecting a specified time range.

![image of final viz](https://raw.github.com/CSE512-14W/a3-tperrier-cobbc12/master/finalviz_a3.png)

### Full Descrption of Final Viz: 

We collected tweets between 02/01/2014 at 19:12:53 and 02/02/2014 at 10:35:54 using the search terms “Seahawks” and “Broncos.” We collected a total of 578,646 tweets. We preprocessed the data to calculate word occurrence across all of these tweets. In total, 254 words occurred in more than 3000 tweets. We eliminated “stop” words (and other common Twitter “words” like “RT”) and were left with 114 words to include in our dataset. Since every tweet contains one or both of the two search terms (“Seahawks” and “Broncos”), we also exclude these two words since their tweets/second timelines look almost exactly the same as the overall timeline. We prominently display a histogram (bar graph) of all 112 remaining words. In blue, we show the histogram for the entire collection period. 

When our visualization is initially loaded, users see a description of the data that is similar to what is reported in the previous paragraph. We also give instructions on how to use the interactive features of the visualization (though we hope that these interactions are intuitive enough that they need no explanation). At any time, users can review the description by clicking the “description” tab. 

A vertical scrollable column on the left side of the screen shows all 112 words, their position in the histogram, and the total number of tweets containing that word. As you scroll over these words, their corresponding bar in the histogram is highlighted and details are shown in the top right corner of the histogram area. Likewise, the bar is highlighted and details displayed as you scroll over bars on the histogram.

By selecting the “by word” tab, users can click bars on the bar graph or rows of the list of words in the lefthand column to see co-occurrence of that word and other word in tweets. This is shown by creating a stacked histogram where the co-occurring tweets are highlighted with a shorter overlapping green bar whose height represents the number of tweets with each word and the selected word (and the selected word is fully highlighted in orange). 

By selecting the “by time” tab, users are shown a timeline of tweets per second for the entire collection period. They can brush an area of this timeline to see the histogram for this period highlighted with green bars overlaid on top of the blue bars. 

As users click words, either in the bar graph or the list of words, the timeline for this word over the entire collection period is shown below the histogram. Up to six words can be shown on the same timeline. When a word is added to the timeline, it is automatically assigned a color, and the word is displayed along the top of the timeline. A small mark of the corresponding color is also added below the appropriate (clicked) bar in the histogram. By clicking the word in the timeline view, it can be removed from the timeline (and the mark on the histogram is also removed). 

Colors were chosen using color brewer (http://colorbrewer2.org). We chose colors to represent qualitative data. Blue and green were chosen as the main colors because they are the team colors of the game-winning Seahawks. In general, we tried to keep very few colors in the main part of the visualization (sticking with the colors that color brewer recommends for smaller datasets) and only use more colors when necessary for showing multiple timelines in the bottommost view. 

### Development Process:

* <b>Collecting data - </b>Trevor set up several virtual machines so that we could have multiple tweet collections going at the same time (as an attempt to avoid twitter’s 50 tweet/second rate limit). Camille installed the necessary libraries and wrote scripts to collect tweets and put them in a MongoDB. ~8 hours 

* <b>Processing Data - </b>Trevor did most of this. Camille did some very basic initial exploration on her own as well, but the processed data that went into the final product was Trevor’s. ~5 hours (a lot of this was dealing with twitter emojis grr). 

* <b>D3 and Javascript - </b>We spent a lot of time working collocated. Camille was/is new to Javascript, so she was much less productive and spent a lot of exploratory time learning without actually accomplishing much. Camille did figure out brush selection, making the small bars be select-able over a larger area, and creating line graphs. She also chose colors that would be printer- and colorblind- friendly. Trevor did the rest. Total ~25 hours. 

* <b>Writeup - </b>Camille mostly did the writeup. ~3 hours 

### Tools

* http://d3js.org
* http://colorbrewer2.org
* http://jquery.com
