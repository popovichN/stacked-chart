var fs = require('fs');
var parse = require('csv-parse');

fs.readFile('new_data.json', 'utf8', function (err, data) {

var data = JSON.parse(data);

var all_excluded_countries = ['ICELAND', 'NORWAY', 'SWITZERLAND', 'AUSTRALIA', 'NEW ZEALAND','CANADA', 'INDIA','JAPAN','CHINA (MAINLAND)','UNITED STATES OF AMERICA','UNITED KINGDOM','FRANCE (INCLUDING MONACO)', 'GERMANY', 'FEDERAL REPUBLIC OF GERMANY', 'POLAND', 'ITALY (INCLUDING SAN MARINO)', 'SPAIN', 'BELGIUM', 'CZECHOSLOVAKIA', 'NETHERLANDS', 'ROMANIA', 'AUSTRIA', 'HUNGARY', 'SWEDEN', 'DENMARK', 'BULGARIA', 'GREECE', 'CZECH REPUBLIC', 'FINLAND', 'PORTUGAL', 'IRELAND', 'SLOVAKIA', 'LUXEMBOURG', 'CROATIA', 'ESTONIA', 'SLOVENIA', 'LITHUANIA', 'CYPRUS', 'LATVIA', 'MALTA', 'FORMER GERMAN DEMOCRATIC REPUBLIC'];

var groups = {
	'United States': ['UNITED STATES OF AMERICA'],
	'European Union and UK': ['UNITED KINGDOM', 'FRANCE (INCLUDING MONACO)', 'GERMANY', 'FEDERAL REPUBLIC OF GERMANY', 'POLAND', 'ITALY (INCLUDING SAN MARINO)', 'SPAIN', 'BELGIUM', 'CZECHOSLOVAKIA', 'NETHERLANDS', 'ROMANIA', 'AUSTRIA', 'HUNGARY', 'SWEDEN', 'DENMARK', 'BULGARIA', 'GREECE', 'CZECH REPUBLIC', 'FINLAND', 'PORTUGAL', 'IRELAND', 'SLOVAKIA', 'LUXEMBOURG', 'CROATIA', 'ESTONIA', 'SLOVENIA', 'LITHUANIA', 'CYPRUS', 'LATVIA', 'MALTA', 'FORMER GERMAN DEMOCRATIC REPUBLIC'],
	'Other developed': ['CANADA', 'ICELAND', 'NORWAY', 'SWITZERLAND', 'AUSTRALIA', 'NEW ZEALAND', 'JAPAN'],
	'China': ['CHINA (MAINLAND)'],
	'India': ['INDIA']
};

var new_data = {
	'United States': {},
	'European Union and UK' : {},
	'Other developed' : {},
	'China' : {},
	'India' : {},
	'Rest of world': {}
};

var rest_of_countries = [];

data.forEach(function (country) {

	//loop through groups
	Object.keys(groups).forEach(function (group) {

		var each_group = groups[group];
		if (each_group.indexOf(country.key) >= 0) {
					
			country.values.forEach(function (year_row) {
				
				if (!new_data[group][year_row.year]){
					new_data[group][year_row.year] = 0;
				}
				new_data[group][year_row.year] += year_row.emissions;
				
			});
			
		} 
	});

	//else for rest of world
	if (all_excluded_countries.indexOf(country.key) < 0) {

		rest_of_countries.push(country.key);

		country.values.forEach(function (year_row) {
			
			if (!new_data['Rest of world'][year_row.year]){
				new_data['Rest of world'][year_row.year] = 0;
			}
			new_data['Rest of world'][year_row.year] += year_row.emissions;
		});
	}

});

var reformatted_data = [];

Object.keys(new_data).forEach(function (group) {

	var reformatted_values = [];
	Object.keys(new_data[group]).forEach(function (year) {
		reformatted_values.push({
			year: +year,
			emissions: new_data[group][year]
		}) 
	})

	reformatted_data.push({
		key: group,
		values: reformatted_values
	})
});
console.log(rest_of_countries.length, ' other countries')

// fs.writeFileSync('reformatted_data.json', JSON.stringify(reformatted_data), 'utf8')	
})