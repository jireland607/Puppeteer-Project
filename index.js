
const fs = require('fs');
const PORT = 3000;

const express = require('express');
const app = express();

app.use(express.text({limit:'100mb'}));

app.use('/api', (req, res, next) => {
    console.log("New request received");
    next()
});

app.post('/api/html/', async function (req, res)  {
    const puppeteer = require('puppeteer');
    const htmlContent = req.body;
    const browser = await puppeteer.launch({headless:'new', args:['--no-sandbox']});
    try{
        console.log('Loading page...');
        const page = await browser.newPage();  
        await page.setContent(htmlContent, { waitUntil:'domcontentloaded'});
        await page.emulateMediaType('screen');

        console.log('Converting to PDF');
        const pdf = await page.pdf({
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
            printBackground: true,
            format: 'A4'    
        });
        console.log('Closing Browser')
        await browser.close();
        console.log('Browser Closed');
        res.contentType("application/pdf");
        res.send(pdf);
    } catch(e){
        
        console.log(2);
    res.end(e.message || e.toString());
    } finally {
        await browser.close();
    }
    await browser.close();
    console.log('Finished processing, listing on port ' + PORT);
});

app.listen(PORT, () => console.log('Server listening on port ' + PORT));



