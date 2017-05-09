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

		//onsole.log(nested_data)

		//loop through keys (years) and set new year if non-existent
		Object.keys(nested_data).forEach(function (country) {
						
			for (var i = 1850; i >= 1850 && i <= 2014; i++) {
				var year_data = nested_data[country][i];

				if (!year_data) {
					nested_data[country][i] = 0;
				}				
			}
		});
		//console.log(nested_data)

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

		fs.writeFileSync('new_data.json', JSON.stringify(new_data), 'utf8')	
    })

})