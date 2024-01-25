  
  // NPM packages that we installed
  import * as cheerio from 'cheerio';
  import fetch from 'node-fetch';
  import fs from 'fs';
  import moment from 'moment';
  import 'moment-timezone';
  
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
      if(row.name.includes('AR4_UNFCCC_ACT')) {
        // create array
        records.push(row.url);
      }
    });
          
    console.log(records);

    // join files
    var rows = [];
    for(const diseaseName of records){
      rows = rows.concat(await getEmissions(diseaseName));
    }    

    // write array to file
    console.log(rows);


  } catch (error) {
    console.log(error);
  }
}


  // getFileList();
  getEmissionsList();
