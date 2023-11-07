const csv = require('csvtojson');
const fs = require('fs');

// Input CSV file path
const csvFilePath = 'techtemp.csv';

// Read and convert the CSV to JSON
csv()
	.fromFile(csvFilePath)
	.then((jsonArrayObj) => {
		// Output JSON file path
		const jsonFilePath = 'techoutput.json';

		// Write the JSON data to a file
		fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArrayObj, null, 2));
		console.log(`CSV converted to JSON and saved to ${jsonFilePath}`);
	});
