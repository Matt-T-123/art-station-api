import puppeteer from 'puppeteer';

let browser;
const BASE_URL = 'https://www.artstation.com';

async function initBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }
    return browser;
}

async function fetchJSON(url) {
    const browser = await initBrowser();
    const page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0'
    );

    await page.goto(url, { waitUntil: 'networkidle2' });

    const content = await page.evaluate(() => document.body.innerText);

    await page.close();

    return JSON.parse(content);
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => {
        if (acc && typeof acc === 'object' && part in acc) {
            return acc[part];
        }
        return undefined;
    }, obj);
}

function pickFields(obj, fields) {
    const result = {};
    for (const field of fields) {
        const value = getNestedValue(obj, field);
        if (value !== undefined) {
            const parts = field.split('.');
            let current = result;

            parts.forEach((part, index) => {
                if (index === parts.length - 1) {
                    current[part] = value;
                } else {
                    current[part] = current[part] || {};
                    current = current[part];
                }
            });
        }
    }
    return result;
}

function maybeFilter(data, fields) {
    if (!fields || !Array.isArray(fields) || fields.length === 0) {
        return data;
    }
    if (Array.isArray(data)) {
        return data.map(item => pickFields(item, fields));
    }
    return pickFields(data, fields);
}

// ---------- API Functions ----------

// Get a user profile with optional filter
export async function getUserProfile(username, options = {}) {
    const { fields } = options;
    const url = `${BASE_URL}/users/${username}.json`;
    const data = await fetchJSON(url);
    return maybeFilter(data, fields);
}

// Get a project with optional filter
export async function getProject(projectId, options = {}) {
    const { fields } = options;
    const url = `${BASE_URL}/projects/${projectId}.json`;
    const data = await fetchJSON(url);
    return maybeFilter(data, fields);
}

// Search projects with optional filter
export async function searchProjects(query, page = 1, options = {}) {
    const { fields } = options;
    const url = `${BASE_URL}/projects.json?query=${encodeURIComponent(query)}&page=${page}`;
    const data = await fetchJSON(url);

    if (data.data && Array.isArray(data.data)) {
        data.data = maybeFilter(data.data, fields);
        return data;
    }

    return maybeFilter(data, fields);
}

// Close the Puppeteer browser instance
export async function closeBrowser() {
    if (browser) {
        await browser.close();
        browser = null;
    }
}

// ---------------------------------

process.on('exit', async () => {
    await closeBrowser();
});