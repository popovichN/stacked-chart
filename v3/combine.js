var fs = require('fs');
var parse = require('csv-parse');

fs.readFile('new_data.json', 'utf8', function (err, data) {

var data = JSON.parse(data);

var all_excluded_countries = ['CANADA', 'MEXICO', 'INDIA','JAPAN','CHINA (MAINLAND)','UNITED STATES OF AMERICA','UNITED KINGDOM','FRANCE (INCLUDING MONACO)', 'GERMANY', 'FEDERAL REPUBLIC OF GERMANY', 'POLAND', 'ITALY (INCLUDING SAN MARINO)', 'SPAIN', 'BELGIUM', 'CZECHOSLOVAKIA', 'NETHERLANDS', 'ROMANIA', 'AUSTRIA', 'HUNGARY', 'SWEDEN', 'DENMARK', 'BULGARIA', 'GREECE', 'CZECH REPUBLIC', 'FINLAND', 'PORTUGAL', 'IRELAND', 'SLOVAKIA', 'LUXEMBOURG', 'CROATIA', 'ESTONIA', 'SLOVENIA', 'LITHUANIA', 'CYPRUS', 'LATVIA', 'MALTA', 'FORMER GERMAN DEMOCRATIC REPUBLIC'];

var groups = {
	'European Union': ['FRANCE (INCLUDING MONACO)', 'GERMANY', 'FEDERAL REPUBLIC OF GERMANY', 'POLAND', 'ITALY (INCLUDING SAN MARINO)', 'SPAIN', 'BELGIUM', 'CZECHOSLOVAKIA', 'NETHERLANDS', 'ROMANIA', 'AUSTRIA', 'HUNGARY', 'SWEDEN', 'DENMARK', 'BULGARIA', 'GREECE', 'CZECH REPUBLIC', 'FINLAND', 'PORTUGAL', 'IRELAND', 'SLOVAKIA', 'LUXEMBOURG', 'CROATIA', 'ESTONIA', 'SLOVENIA', 'LITHUANIA', 'CYPRUS', 'LATVIA', 'MALTA', 'FORMER GERMAN DEMOCRATIC REPUBLIC'],
	'United Kingdom': [ 'UNITED KINGDOM' ],
	'United States': ['UNITED STATES OF AMERICA'],
	'China': ['CHINA (MAINLAND)'],
	'Japan': ['JAPAN'],
	'India': ['INDIA'],
	'Canada and Mexico': ['CANADA', 'MEXICO']
};

var new_data = {
	'United States': {},
	'Canada and Mexico' : {},
	'European Union' : {},
	'United Kingdom' : {},
	'Japan' : {},
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

console.log(new_data)

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

fs.writeFileSync('reformatted_data.json', JSON.stringify(reformatted_data), 'utf8')	
})