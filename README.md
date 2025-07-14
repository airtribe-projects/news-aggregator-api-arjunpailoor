### Step 1 - Project Setup
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19928942&assignment_repo_type=AssignmentRepo)

---

### Step 2 - User login & registration
- Install bcrypt and jsonwebtoken using: `npm install bcrypt jsonwebtoken`
- Install nodemon (optional) using: `npm install nodemon --save-dev`
- Add this line in `scripts` inside `package.json`: `"start": "node app.js"`

- Create an in-memory database file: `users.js` and export it
- Create a `routes/` folder and a file called `auth.js` inside it
- Implement user registration and login logic in `auth.js`
- Import `auth.js` in `app.js`
- Start the server using: `npm start`

- to test the code in POSTMAN, do as follows
- enter URL <http://localhost:3000/register>, enter credentials in JSON format, observe the outputs, user successfully registered or user already exists.
- enter URL <http://localhost:3000/login>, enter credentials in JSON format, observe the outputs, invalid username or password if cred mismatch, else token will be generated upon successful login.


### Step 3 - User preferences & API Authentication
- create a `middleware` folder and add auth.js to verify JWT tokens
- update `routes/auth.js` to include GET /preferences and PUT /preferences
- test both endpoints in Postman by adding Authorization: Bearer <your_token> header

### Step 4 News - Fetching
- install `axios` using `npm install axios`
- register on <newsapi.org> to get your API key
- include the line `const NEWS_API_KEY = '46bc80dd1460480b8a759f4024a345d0'` in `routes/auth.js`
- Create GET `/news` endpoint in `routes/auth`
- Test in Postman for GET method, url .../news.

### Step 5 - Input validation & error handling
- update POST `register` & `login` in `routes/auth.js` to require validation check.
- test the changes in POSTMAN