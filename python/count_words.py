import csv,time,datetime
from collections import Counter

def twtime_to_unix(str):
	#print str
	return time.strptime(str,'%a %b %d %H:%M:%S +0000 %Y')
	
def tweet_escape(s):
	s = s.lower()
	s = s.replace("&lt;", "<")
	s = s.replace("&gt;", ">")
	# this has to be last:
	s = s.replace("&amp;", "&")
	return s
	
def word_escape(w):
	return w.strip('.,!?"\':()[];')


word_list = []

#get word list
with open('words.csv') as csvfile:
	rd = csv.reader(csvfile,skipinitialspace=True,delimiter=',')
	rd.next() #read header
	word_list = [row[0] for row in rd if row[2]=='1']
	
words = Counter()

infile = 'all.csv'

with open(infile) as csvfile:
	tweet_rd = csv.reader(csvfile,skipinitialspace=True)
	tweet_rd.next()#skip header row
	for row in tweet_rd:
		for word in set([word_escape(w) for w in tweet_escape(row[1]).split()]):
			words[word] += 1

with open('out.csv','wb') as outfile:
	writer = csv.writer(outfile)
	writer.writerow(('word','count'))
	for word,count in words.iteritems():
		writer.writerow((word,count))
		