import csv, sys,json,datetime
from collections import Counter

def tweet_escape(s):
	s = s.lower()
	s = s.replace("&lt;", "<")
	s = s.replace("&gt;", ">")
	# this has to be last:
	s = s.replace("&amp;", "&")
	return s
	
def word_escape(w):
	return w.strip('.,!?"\':()[];')

def get_time(row):
	return int(float(row[3]))

def get_second_data(t):
	return [t] + [cnt[word] for word in word_list]
	
def loop_step(row,s,t):
	_s = get_time(row)
	if _s > s: #new second
		if s != 0: #not first time
			data['s'].append(get_second_data(t))
			for j in range(s+1,_s): #insert empty seconds
				data['s'].append(get_second_data(t))
		else: #first time
			data['r']={'s':_s}
	words = set([word_escape(w) for w in tweet_escape(row[1]).split() if word_escape(w) in word_list])
	for word in words:
		cnt[word] += 1 #this seems to be much faster than cnt + Counter([])
		for w in words:
			data['t'][word_list.index(word)][word_list.index(w)] += 1
	return (_s,t+1,cnt)
		

#number of tweets to 
n = int(sys.argv[1]) if len(sys.argv)>1 else 100

word_list = []
#get word list
with open('words.csv') as csvfile:
	rd = csv.reader(csvfile,skipinitialspace=True,delimiter=',')
	rd.next() #read header
	word_list = [row[0] for row in rd if row[2]=='1']
#word_list = word_list[:4]

data = {
	'w':word_list,
	's':[[0 for i in range(len(word_list)+1)]], #first row all 0's
	't':[[0 for w in word_list] for w in word_list] # n x n matrix of 0s
}
with open('all.csv') as csvfile:
	rd = csv.reader(csvfile,skipinitialspace=True)
	rd.next() #read header
	s,t,cnt = 0,0,Counter() #vars for seconds and number of tweets and counter
	if n>0:
		for i in range(n):
			row = rd.next()
			(s,t,cnt) = loop_step(row,s,t)
	else: #do all
		for row in rd:
			(s,t,cnt) = loop_step(row,s,t)
	data['s'].append(get_second_data(t))
data['r']['e']=s
print json.dumps(data)

