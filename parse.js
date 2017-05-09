var fs = require('fs');
var parse = require('csv-parse');

fs.readFile('countries.csv', 'utf8', function (err, data) {
	if (err) throw err;

	//read csv
	parse(data, {columns: true, trim: true}, function(err, rows) {
		
		//make new object with key = year & value = emissions data
		var nested_data = {};

		// loop through json arry to get above
		rows.forEach(function (row){
			var country = row.Nation;
			var year = +row.Year;
			var emissions = +row.Total_emissions;

			if (!nested_data[country]) {
				nested_data[country] = {};
			}
			if (year >= 1850) {
				nested_data[country][year] = emissions;
			}
		});

		//loop through keys (years) and set new year if non-existent
		Object.keys(nested_data).forEach(function (country) {
						
			for (var i = 1850; i >= 1850 && i <= 2014; i++) {
				var year_data = nested_data[country][i];

				if (!year_data) {
					nested_data[country][i] = 0;
				}				
			}
		});

		var new_data = [];

		Object.keys(nested_data).forEach(function (country) {

			var reformatted_values = [];
			Object.keys(nested_data[country]).forEach(function (year) {
				reformatted_values.push({
					year: +year,
					emissions: nested_data[country][year]
				}) 
			})

			new_data.push({
				key: country,
				values: reformatted_values
			})
		});
		//console.log(new_data)

		
		// var keys = 'year,' + 'emissions,' + 'country' + '\n';

		// fs.writeFileSync('new_data.csv', keys, 'utf8');

		// new_rows.forEach(function (row) {
		// 	var new_line = row.year + ',' + row.emissions + ',' + row.country + '\n';
		// 	fs.appendFileSync('new_data.csv', new_line, 'utf8');

		// });

		fs.writeFileSync('new_data.json', JSON.stringify(new_data), 'utf8')	
    })

})