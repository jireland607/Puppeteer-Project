const puppeteer = require('puppeteer');
const fs = require('fs');
const PORT = 8080;

const express = require('express');
const app = express();

app.use(express.text({limit:'100mb'}));

app.use('/api', (req, res, next) => {
    console.log("New request received");
    next()
});

app.post('/api/html/', async function (req, res)  {
    try{
        var pdfDoc = await buildPDF(req.body);
        res.send(pdfDoc);
    }   catch(e){
        res.end(e.message || e.toString());
    }
});


async function buildPDF(htmlContent){
    console.log(htmlContent);
    return(htmlContent);
};



app.listen(PORT, () => console.log('Server listening on port ' + PORT));



(async()=> {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const html = fs.readFileSync('sample.html', 'utf-8');


    await page.setContent(html, { waitUntil:'domcontentloaded'});

    await page.emulateMediaType('screen');

    const pdf = await page.pdf({
        path: 'result.pdf',
        margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
        printBackground: true,
        format: 'A4',
    });

    await browser.close()
})();
