const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const cron = require('node-cron');
const { RetrieveOnly, CustomTask } = require('./schema');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/yourDatabaseName')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));  

// Retrieve Only task
cron.schedule('0 0 * * *', async () => {
    const retrieveOnlyTasks = await RetrieveOnly.find();
    for (const task of retrieveOnlyTasks) {
        await fetchWebsiteContent(task.url, task.name);
    }
});

// Custom task with prompt
cron.schedule('0 0 * * *', async () => {
    const customTasks = await CustomTask.find();
    for (const task of customTasks) {
        const scrapedData = await fetchWebsiteContent(task.url, task.name);
        // Langchain integration goes here
    }
});

app.post('/internetdata', async (req, res) => {
    const newRetrieveOnlyTask = new RetrieveOnly(req.body);
    try {
        await newRetrieveOnlyTask.save();
        res.status(200).send('Internet data added successfully');
    } catch (err) {
        res.status(500).send('Failed to add internet data');
    }
}); 

app.post('/yourtasks', async (req, res) => {
    const newCustomTask = new CustomTask(req.body);
    try {
        await newCustomTask.save();
        res.status(200).send('Task added successfully');
    } catch (err) {
        res.status(500).send('Failed to add task');
    }
});  





async function fetchWebsiteContent(url, name) {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    let text = '';
    $('h1, h2, h3, h4, h5, h6, p, span').each((index, element) => {
        text += $(element).text() + ' ';
    });

    console.log(text);

    fs.writeFile(`${name}-output.txt`, text, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data saved to file.');
        }
    });

    return text;
}

const port = 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`)); 