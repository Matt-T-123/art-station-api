# art-station-api

Node.js api for artstation.com using a puppeteer browser instance to webscrape their api calls.
Feel free to collaborate :)
---

## 📦 Installation

```bash
npm install artstation-api
```

# API Functions

```javascript
getUserProfile(username, options = {})
```
```javascript
getProject(projectId, options = {})
```
```javascript
searchProjects(query, page = 1, options = {})
```
```javascript
closeBrowser()
```