const USER_TYPE = require("./server/_constants/usertypes");

const rp = require('request-promise');
const csv = require('csv-parser');
const fs = require('fs');

fs.createReadStream('users_raw.csv')
    .pipe(csv())
    .on('data', async (row) => {
        let url;
        if(USER_TYPE.GENERAL === row.userType) {
            url = 'http://localhost:5000/api/registeredgeneralpublic/auth/login';
        } else if(USER_TYPE.HEALTH === row.userType){
            url = 'http://localhost:5000/api/healthprofessional/auth/login';
        } else {
            url = 'http://localhost:5000/api/businessowner/auth/login';
        }
        let options = {
            method: 'POST',
            uri: url,
            body: {
                email: row.email,
                password: row.password
            },
            json: true // Automatically stringifies the body to JSON
        };
        setTimeout(async () =>  {
            try {
                let parsedBody = await rp(options);
                console.log(parsedBody);
            } catch (err){
                console.error(err)
            }
        }, Math.random() * 100000);

    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
