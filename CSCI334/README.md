# CSCI334

--How to clone this repo-- <br />
Make sure you have git installed on your computer <br />
Create a new directory <br />
cd to that directory and type the command: git clone https://github.com/steamedHams11/CSCI334.git <br />
<br />
--How to run the client project-- <br />
Make sure you have npm installed on your computer <br />
Via terminal (or command line), make sure you are located within the git repo folder 'CSCI334' <br />
Type the command: npm run client-install <br />
This will add all the external dependencies needed to run the app <br />
Once installation is complete, type the command: npm run dev-client <br />
This will open your browser at localhost:3000 by default <br />
Once everything has compiled, add '/login' at the end of the browser URL to see the sample login page I have created <br />

--How to run the server project-- <br />
You need to set CSCI334_MONGODB_USER and CSCI334_MONGODB_PASS environment variables to respective values <br />
Make sure you have npm installed on your computer <br />
Via terminal (or command line), make sure you are located within the git repo folder 'CSCI334' <br />
Type the command: npm run server-install <br />
This will add all the external dependencies needed to run the app <br />
Once installation is complete, type the command: npm run dev-server <br />
Then you can open your browser at localhost:5000 <br />
Once everything has compiled, add '/api' at the end of the browser URL to see the sample message I have created <br />

--How to run the client & server project-- <br />
You need to set CSCI334_MONGODB_USER and CSCI334_MONGODB_PASS environment variables to respective values <br />
Make sure you have npm installed on your computer <br />
Via terminal (or command line), make sure you are located within the git repo folder 'CSCI334' <br />
Type the command: npm run all-install <br />
This will add all the external dependencies needed to run the app <br />
Once installation is complete, type the command: npm run dev <br />
This will open your browser at localhost:3000 by default <br />
Once everything has compiled, add '/login' at the end of the browser URL to see the sample login page I have created <br />
Then you can open your browser at localhost:5000 <br />
Once everything has compiled, add '/api' at the end of the browser URL to see the sample message I have created <br />
Other environment variables that can be set are GOVERMENT_EMAIL, REACT_APP_GOOGLE_API_KEY, SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, SENDGRID_TO_EMAIL, PRODUCTION_DB_NAME
