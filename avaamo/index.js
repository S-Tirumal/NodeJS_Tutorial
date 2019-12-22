const http = require('http');
const https = require('https');
const APIkey = 'dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf';

//read big.txt file
http.get('http://norvig.com/big.txt', (resp) => {
  let data = '';
  
  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    let strarr = data.split(" ");
	let i = 0;
	let map = {};
	//crating map with word and count as value
	for( i=0; i< strarr.length; i++){
		var element = strarr[i];
		//Skip if string is empty
		if(element !== ''){
			if(map[element] == null)
				map[element] = 1;
			else
				map[element]++;  
		}
	}
	strarr = [];
	//converting map to array
	for(let idx in map){
		strarr.push([idx,map[idx]]);
	}
	
	//sorting array 
	strarr.sort(function(a, b){
		return b[1] - a[1];
	});
	
	//getting to 10 word with highest occurrence
	for(i=0 ; i < 10; i++){
		getWordInfo(strarr[i][0], strarr[i][1]);
	}
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

/**
*	Get relative details from Yandex API and print in console
*/
function getWordInfo(word, count){
	https.get('https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key='+APIkey+'&lang=en-en&text=' + word+'&flags=8', (resp) => {
	  let data = '';

	  resp.on('data', (chunk) => {
		data += chunk;
	  });

	  resp.on('end', () => {
		data = JSON.parse(data);
		let obj = {};
		obj['Word'] = word;
		let out = {};
		out['CountOfOccurrence'] = count;
		if(data !==undefined && data.def !== undefined && data.def.length > 0){
			if(data.def[0].tr !== undefined && data.def[0].tr.length > 0){
				let str = "";
				if(data.def[0].tr[0].syn !== undefined){
					for(let i=0; i<data.def[0].tr[0].syn.length; i++){
						if(i!=0){
							str += ", ";
						}
						str += data.def[0].tr[0].syn[i].text;
						
					}
				}
				out['Synonyms'] = str;
			}
			out['Pos'] = data.def[0].pos === undefined ? "" : data.def[0].pos;
		}else{
			out['Synonyms'] = "";
			out['Pos'] = "";
		}
		obj['Output'] = out;
		console.log(obj);
	  });

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
}

/*
-----------------------
Output of program
-----------------------
{ Word: 'in',
  Output:
   { CountOfOccurrence: 17459,
     Synonyms: 'inside, during',
     Pos: 'preposition' } }
{ Word: 'that',
  Output: { CountOfOccurrence: 9842, Synonyms: '', Pos: 'conjunction' } }
{ Word: 'he',
  Output: { CountOfOccurrence: 8366, Synonyms: '', Pos: '' } }
{ Word: 'to',
  Output:
   { CountOfOccurrence: 24888,
     Synonyms: 'of, towards',
     Pos: 'preposition' } }
{ Word: 'a',
  Output: { CountOfOccurrence: 17581, Synonyms: '', Pos: 'determiner' } }
{ Word: 'and',
  Output: { CountOfOccurrence: 30996, Synonyms: '', Pos: 'conjunction' } }
{ Word: 'of',
  Output:
   { CountOfOccurrence: 34754,
     Synonyms: 'to, with, among, toward',
     Pos: 'preposition' } }
{ Word: 'the',
  Output: { CountOfOccurrence: 61197, Synonyms: '', Pos: '' } }
{ Word: 'was',
  Output: { CountOfOccurrence: 9753, Synonyms: '', Pos: '' } }
{ Word: 'is',
  Output: { CountOfOccurrence: 8260, Synonyms: '', Pos: '' } }
*/