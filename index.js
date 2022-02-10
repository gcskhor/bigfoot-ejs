import express, { json } from 'express';
import { read } from './jsonFileStorage.js';

const app = express();
app.set('view engine', 'ejs');

const handleIndexPage = (request, response) => {
  read('data.json', (err, data) => {
    // const sighting = data.sightings

    response.render('index', data);
  })
}

const handleYearsPage =(request, response) => {
  read('data.json', (err, data) => {
    // create array with all years > order years in ascending order
    const arrOfSighting = []
    const dataSightings = data.sightings

    // put years directly into array [1990, 1973]
    for (let i = 0; i < dataSightings.length; i += 1) {
      if (!(arrOfSighting.includes(dataSightings[i]['YEAR']))) {
        arrOfSighting.push(dataSightings[i]['YEAR']);
      }
    }

    arrOfSighting.sort(function(a, b){return a-b});

    const yearsArr = []
    // loop years array into object
    for (let i=0; i<arrOfSighting.length; i+=1) {
      let keyValuePair = {"YEAR": arrOfSighting[i]}
      yearsArr.push(keyValuePair);
    }

    // const dataNew = arrOfSighting.map(element => {'YEAR': element})
    // console.log(dataNew)
    const data2 = {"sightings" : yearsArr}

    response.render('years', data2);
  })
}

app.get('/', handleIndexPage)

app.get('/years', handleYearsPage)


app.get('/sightings/:index/', (request, response) => {
    read('data.json', (err, data) => {
        // Respond with the name at the index specified in the URL
      const indexRequested = request.params.index
      const sighting = data.sightings[indexRequested]

      //run a loop to access all keys in the object 

      const keys = Object.keys(sighting)
      // console.log(keys)

      const newData = keys.map(element => `${element}: ${sighting[element]}`)
      const updatedData = newData.join("<br>")

      // console.log(updatedData)

      // display key-value pair
      const content = `
        <html>
          <body>
            <h1>Sighting:</h1>
            <div> ${updatedData} </div>
            <div> <a href="/"> Click here to go back to the main page. </a></div>
          </body>
        </html>
      `;
      
      response.send(content);
      }
    );
  }
)

//http://localhost:3004/year-sightings/1989

app.get('/year-sightings/:year/', (request, response) => {
    read('data.json', (err, data) => {
      //run a loop inside sightings object, check indexes that contain year 
      const sightingsArr = data.sightings
      const yearRequested = request.params.year
      console.log(yearRequested)


      const arrOfSighting = []
      for (let i =0; i<sightingsArr.length;i+=1){
        if (sightingsArr[i].YEAR === yearRequested){
          arrOfSighting.push(`Year: ${yearRequested}: State: ${(sightingsArr[i].STATE)}`)
        }
      }
      // console.log(arrOfSighting)
      const yearSightingString = arrOfSighting.join('<br>')
      //if year includes X-year, then extract that particular value of year and get that particular index
      response.send(yearSightingString);
      }
    );
  }
)

app.listen(3005);