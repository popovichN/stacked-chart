var fs = require('fs');
var parse = require('csv-parse');

fs.readFile('new_data.json', 'utf8', function (err, data) {

var data = JSON.parse(data);

var all_excluded_countries = ['CANADA', 'MEXICO', 'INDIA','JAPAN','CHINA (MAINLAND)','UNITED STATES OF AMERICA','UNITED KINGOM','FRANCE (INCLUDING MONACO)', 'GERMANY', 'FEDERAL REPUBLIC OF GERMANY', 'POLAND', 'ITALY (INCLUDING SAN MARINO)', 'SPAIN', 'BELGIUM', 'CZECHOSLOVAKIA', 'NETHERLANDS', 'ROMANIA', 'AUSTRIA', 'HUNGARY', 'SWEDEN', 'DENMARK', 'BULGARIA', 'GREECE', 'CZECH REPUBLIC', 'FINLAND', 'PORTUGAL', 'IRELAND', 'SLOVAKIA', 'LUXEMBOURG', 'CROATIA', 'ESTONIA', 'SLOVENIA', 'LITHUANIA', 'CYPRUS', 'LATVIA', 'MALTA', 'FORMER GERMAN DEMOCRATIC REPUBLIC'];

//var all_excluded_countries = ['UNITED STATES OF AMERICA', 'CHINA (MAINLAND)'];

var groups = {
	// 'European Union': ['FRANCE (INCLUDING MONACO)', 'GERMANY', 'FEDERAL REPUBLIC OF GERMANY', 'POLAND', 'ITALY (INCLUDING SAN MARINO)', 'SPAIN', 'BELGIUM', 'CZECHOSLOVAKIA', 'NETHERLANDS', 'ROMANIA', 'AUSTRIA', 'HUNGARY', 'SWEDEN', 'DENMARK', 'BULGARIA', 'GREECE', 'CZECH REPUBLIC', 'FINLAND', 'PORTUGAL', 'IRELAND', 'SLOVAKIA', 'LUXEMBOURG', 'CROATIA', 'ESTONIA', 'SLOVENIA', 'LITHUANIA', 'CYPRUS', 'LATVIA', 'MALTA', 'FORMER GERMAN DEMOCRATIC REPUBLIC'],
	// 'United Kingdom': [ 'UNITED KINGDOM' ]
	'United States': ['UNITED STATES OF AMERICA']
	// 'China': ['CHINA (MAINLAND)'],
	// 'Japan': ['JAPAN'],
	// 'India': ['INDIA'],
	// 'Canada and Mexico': ['CANADA', 'MEXICO']
};

// var EU = ['FRANCE (INCLUDING MONACO)', 'GERMANY', 'FEDERAL REPUBLIC OF GERMANY', 'POLAND', 'ITALY (INCLUDING SAN MARINO)', 'SPAIN', 'BELGIUM', 'CZECHOSLOVAKIA', 'NETHERLANDS', 'ROMANIA', 'AUSTRIA', 'HUNGARY', 'SWEDEN', 'DENMARK', 'BULGARIA', 'GREECE', 'CZECH REPUBLIC', 'FINLAND', 'PORTUGAL', 'IRELAND', 'SLOVAKIA', 'LUXEMBOURG', 'CROATIA', 'ESTONIA', 'SLOVENIA', 'LITHUANIA', 'CYPRUS', 'LATVIA', 'MALTA', 'FORMER GERMAN DEMOCRATIC REPUBLIC'];
// var UK = [ 'UNITED KINGOM' ]; 
// var US = ['UNITED STATES OF AMERICA'];
// var China = ['CHINA (MAINLAND)'];
// var Japan = ['JAPAN'];
// var India = ['INDIA'];
// var Canada_Mexico = ['CANADA', 'MEXICO'];

// var new_data = [
// 	{ 
// 		key: 'United States',
// 		vlaues: []
// 	},
// 	{ 
// 		key: 'China',
// 		vlaues: []
// 	}
// 	{ 
// 		key: 'European Union', 
// 		values: [] 
// 	},
// 	{ 
// 		key: 'United Kingdom',
// 		vlaues: []
// 	},
// 	{ 
// 		key: 'Japan',
// 		vlaues: []
// 	},
// 	{ 
// 		key: 'India',
// 		vlaues: []
// 	},
// 	{ 
// 		key: 'Canada and Mexico',
// 		vlaues: []
// 	},
// 	{ 
// 		key: 'Rest of world',
// 		vlaues: []
// 	}


// ];
var new_data = {
	'United States': {},
	'Rest of world': {}
};

data.forEach(function (country) {

	//
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
		else if (all_excluded_countries.indexOf(country.key) < 0) {
			//console.log(country.key )
			country.values.forEach(function (year_row) {
				
				if (!new_data['Rest of world'][year_row.year]){
					new_data['Rest of world'][year_row.year] = 0;
				}
				new_data['Rest of world'][year_row.year] += year_row.emissions;
			});
		}
	});

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

fs.writeFileSync('reformatted_data.json', JSON.stringify(reformatted_data), 'utf8')	
})