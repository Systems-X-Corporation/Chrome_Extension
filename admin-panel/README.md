# josepth_backend

### Admin-Panel Project

This is a MERN (MongoDB, Express, React, Node.js) stack Admin Panel project built for managing PCNs (Product Control Numbers) in an organized way. 
The admin can generate new PCNs, verify them, remove them, and get a list of all the PCNs that are currently in the system. The project also implements
JWT (JSON Web Token) authorization to ensure secure access to the admin panel.

### Installation and Setup =>

1) Clone the repository: git clone https://github.com/your-username/mern-admin-panel.git
2) Change to the project directory: cd mern-admin-panel
3) Install dependencies: npm install
4) Set up environment variables: Create a .env file in the root directory and set the following variables:
   MONGO_URI=<your-mongo-uri>
   JWT_SECRET=<your-jwt-secret>
5) Start the development server: npm start
6) Open the project in your browser at http://localhost:3000

### Usage =>

The MERN Admin Panel is designed to make it easy for admins to manage PCNs. Here are the main features:

#### Generating a new PCN => 
To generate a new PCN, click on the "Generate PCN" button on the Navigation-panel. You will be taken to a form where you can enter
the new PCN, such as the PCN number. Once you submit the form, the PCN will be added to the system.

#### Verifying a PCN => 
To verify a PCN, Click on the Verify-pcn button from navigation-panel and enter the details of pcn like pcn number and token associate with it. 
Click on the "Verify" button next to the PCN. if the pcn and token enter by you exists in the database the PCN will be marked as verified in the system.

#### Removing a PCN => 
To remove a PCN, Click on the Verify-pcn button from navigation-panel and enter the details of pcn like pcn number. Click on the "Remove" button
next to the PCN. if the pcn enter by you exists in the database the PCN will be removed from the system.

#### Getting a list of all PCNs => 
To get a list of all the PCNs in the system,  Click on the get-all-pcn button from navigation-panel it will redirect you to get-all-pcn
page where you can see all the pcn list stored in database you can also search for a specific pcn through search input at top-left corner by entering pcn number. 

### Authorization => 
The MERN Admin Panel uses JWT authorization to ensure secure access to the admin panel. When you first start the project, you will be prompted to login.
if the enter credentials exists in database, Once you are logged in, you will be redirected to the admin-panel page. you will have access to the admin panel.

### Technologies Used =>
MongoDB
Express.js
React
Node.js
JSON Web Token (JWT)

# Developer Details
   
This MERN Admin Panel project was created by Sohail Khan, a software developer with experience in building web applications using various technologies such as React, Node.js,
and MongoDB. Sohail is passionate about building user-friendly and scalable applications that can solve real-world problems. He enjoys working on challenging projects and is passionate
about creating software that is both functional and user-friendly. He is constantly learning new skills and keeping up-to-date with the latest industry trends.

You can find more about Sohail on his GitHub profile https://github.com/sohailinsta?tab=repositories or connect with him on LinkedIn https://www.linkedin.com/in/sohail-khan-617a40166/.
