# art-station-api

Node.js api for artstation.com using a puppeteer browser instance to webscrape their api calls.
Feel free to collaborate :)
---

## 📦 Installation

```bash
npm install artstation-api

# API Functions

```javascript
getUserProfile(username, options = {})
getProject(projectId, options = {})
searchProjects(query, page = 1, options = {})
closeBrowser()