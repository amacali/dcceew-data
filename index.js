  
  // NPM packages that we installed
  import * as cheerio from 'cheerio';
  import fetch from 'node-fetch';
  import fs from 'fs';
  import moment from 'moment';
  import 'moment-timezone';
  import { StreamParser } from '@json2csv/plainjs';

/*******************************************************************************
  getEmbedConfig()
*******************************************************************************/
async function getEmissions(filename) {

  // records
  const records = [];

  // fetch
  try {
    const response = await fetch("https://greenhouseaccounts.climatechange.gov.au/OData/" + filename);
    const body = await response.text();
    const json = JSON.parse(body); 

    // loop through each odata file available
    json.value.forEach(function(currentObject) {
      currentObject["URL"] = filename;
    });
          
    return json.value;   

  } catch (error) {
    console.log(error);
  }
}


/*******************************************************************************
  getFileList()
*******************************************************************************/
async function getEmissionsList() {

  // records
  const records = [];

  // fetch
  try {
    const response = await fetch("https://greenhouseaccounts.climatechange.gov.au/OData");
    const body = await response.text();
    const json = JSON.parse(body); 
    
    // loop through each odata file available
    json.value.forEach(row => {        
      if(row.name.includes('AR5_ParisInventory_NSW')) {
        // create array
        records.push(row.url);
      }
    });
          

    // join files
    var data = [];
    for(const diseaseName of records){
      data = data.concat(await getEmissions(diseaseName));
    }    

    const csvRows = [];

  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));
     
   
        // Loop to get value of each objects key
        for (const row of data) {
          const values = headers.map(header => {
              const val = row[header]
              return `"${val}"`;
          });
   
          // To add, separator between each value
          csvRows.push(values.join(','));
      }
   
      /* To add new line for each objects values
         and this return statement array csvRows
         to this function.*/
      const print = csvRows.join('\n');

      const fname = 'AR4_UNFCCC.csv';
      fs.writeFileSync('data/'+ fname,print);      

  } catch (error) {
    console.log(error);
  }
}


  // getFileList();
  getEmissionsList();
