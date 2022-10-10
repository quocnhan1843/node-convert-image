const express = require('express')
const bodyParser = require('body-parser');
const nodeHtmlToImage = require('node-html-to-image')
const mergeImages = require('merge-images')
const fs = require("fs");
const { Canvas, Image } = require('canvas');

const app = express()
const port = 3000

const IMAGE_TYPE = 'png'

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/convert-html-to-image', (req, res) => {
    const {html, name, width, height} =  req.body

    console.time('layoutTime');

    nodeHtmlToImage({
        puppeteerArgs: {
            defaultViewport: { width, height },
        },
        output: `./${name}.${IMAGE_TYPE}`,
        html: html,
        type: IMAGE_TYPE
    })
        .then(() => {
            console.log('The image was created successfully!')
            console.timeEnd('layoutTime');
        })

    res.send('Generate HTML to image successful')
})


app.post('/convert-number-to-image', (req, res) => {
    const {html, name, width, height} =  req.body

    console.time('numberTime');

    const content = []

    for (let number = 0; number < 60 ; number++) {
        const firstNumber =parseInt(number / 10);
        const secondNumber = parseInt(number % 10);
        const imageName = `${name}_number_${number}`

        content.push({ firstNumber, secondNumber, output: `./${imageName}.${IMAGE_TYPE}` })
    }

    nodeHtmlToImage({
        puppeteerArgs: { defaultViewport: { width, height }},
        content,
        html: html
    })
    .then(() => {
        console.log('The image was created successfully!')
        console.timeEnd('numberTime');
    })

    res.send('Generate HTML to image successful')
})


app.post('/merge-image', (req, res) => {
    // const {html, name, width, height} =  req.body

    mergeImages([
        { src: './layout_1.png', x: 0, y: 0 },
        { src: './number_1.png', x: 0.28751302083333335 * 1200, y: 0.20535714285714285 * 112 },
    ], {
        Canvas: Canvas,
        Image: Image
    })
        .then((base64) => {
            const buffer = Buffer.from(base64, "base64");

            fs.writeFileSync("result.png", buffer);
        })
        .then(() => console.log('The image was merged successfully!'))

    res.send('Generate HTML to image successful')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
