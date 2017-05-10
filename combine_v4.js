var fs = require('fs');
var parse = require('csv-parse');

fs.readFile('new_data_v4_keys.json', 'utf8', function (err, data) {

var data = JSON.parse(data);

var all_excluded_countries = ['RUSSIAN FEDERATION', 'USSR', 'ICELAND', 'NORWAY', 'SWITZERLAND', 'AUSTRALIA', 'NEW ZEALAND','CANADA', 'INDIA','JAPAN','CHINA (MAINLAND)','UNITED STATES OF AMERICA','UNITED KINGDOM','FRANCE (INCLUDING MONACO)', 'GERMANY', 'FEDERAL REPUBLIC OF GERMANY', 'POLAND', 'ITALY (INCLUDING SAN MARINO)', 'SPAIN', 'BELGIUM', 'CZECHOSLOVAKIA', 'NETHERLANDS', 'ROMANIA', 'AUSTRIA', 'HUNGARY', 'SWEDEN', 'DENMARK', 'BULGARIA', 'GREECE', 'CZECH REPUBLIC', 'FINLAND', 'PORTUGAL', 'IRELAND', 'SLOVAKIA', 'LUXEMBOURG', 'CROATIA', 'ESTONIA', 'SLOVENIA', 'LITHUANIA', 'CYPRUS', 'LATVIA', 'MALTA', 'FORMER GERMAN DEMOCRATIC REPUBLIC'];

var groups = {
	'United States dev': ['UNITED STATES OF AMERICA'],
	'United Kingdom dev': [ 'UNITED KINGDOM' ],
	'European Union dev': ['FRANCE (INCLUDING MONACO)', 'GERMANY', 'FEDERAL REPUBLIC OF GERMANY', 'POLAND', 'ITALY (INCLUDING SAN MARINO)', 'SPAIN', 'BELGIUM', 'CZECHOSLOVAKIA', 'NETHERLANDS', 'ROMANIA', 'AUSTRIA', 'HUNGARY', 'SWEDEN', 'DENMARK', 'BULGARIA', 'GREECE', 'CZECH REPUBLIC', 'FINLAND', 'PORTUGAL', 'IRELAND', 'SLOVAKIA', 'LUXEMBOURG', 'CROATIA', 'ESTONIA', 'SLOVENIA', 'LITHUANIA', 'CYPRUS', 'LATVIA', 'MALTA', 'FORMER GERMAN DEMOCRATIC REPUBLIC'],
	'Other developed dev': ['CANADA', 'ICELAND', 'NORWAY', 'SWITZERLAND', 'AUSTRALIA', 'NEW ZEALAND', 'JAPAN'],
	'Russia and USSR other': [ 'RUSSIAN FEDERATION', 'USSR'],
	'China other': ['CHINA (MAINLAND)'],
	'India other': ['INDIA']
};

console.log(all_excluded_countries.length)

//var rest_of_countries = [];

var reformatted_data = {};

for (var i = 1850; i >= 1850 && i <= 2014; i++) {
	reformatted_data[i] = {};
	Object.keys(groups).forEach(function (group) {
		reformatted_data[i][group] = 0;
	});
}

//loop through original years
Object.keys(data).forEach(function (year) {

	//loop through groups
	Object.keys(groups).forEach(function (group) {

		//for each group,
		groups[group].forEach(function (country) {
			reformatted_data[year][group] += data[year][country];
		})
	});

	//rest of world
	reformatted_data[year]['Rest of world other'] = 0;

	Object.keys(data[year]).forEach(function (key_country) {
		if (all_excluded_countries.indexOf(key_country) < 0) {
			reformatted_data[year]['Rest of world other'] = reformatted_data[year]['Rest of world other'] + data[year][key_country];
		}
	})

});

var new_data = [];

Object.keys(reformatted_data).forEach(function (year) {
	reformatted_data[year]['year'] = +year;

	new_data.push(reformatted_data[year])
})

fs.writeFileSync('reformatted_data_v4.json', JSON.stringify(new_data), 'utf8')	

})