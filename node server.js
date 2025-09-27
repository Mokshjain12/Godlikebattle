const express = require('express');
const multer = require('multer');
const Parse = require('parse/node');

const app = express();
const upload = multer();

Parse.initialize("Vxi5gO09USDRDt6XxHvduwKg1p8LdmconmLLFvNw", null, "7QNlIeuFa3NVwIp1kJ8alFWkUed8lclmpC1pqICp");
Parse.serverURL = "https://parseapi.back4app.com";

// CORS headers to allow your website to talk to your server
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/upload', upload.single('paymentScreenshot'), async (req, res) => {
    try {
        const { playerName, playerUID, whatsappNo } = req.body;
        
        // Handle case where no file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: "Payment screenshot is required." });
        }

        const base64 = req.file.buffer.toString('base64');
        const parseFile = new Parse.File(req.file.originalname, { base64 }, req.file.mimetype);
        await parseFile.save({ useMasterKey: true });

        const Registration = new Parse.Object('Registration');
        Registration.set('playerName', playerName);
        Registration.set('playerUID', playerUID);
        Registration.set('whatsappNo', whatsappNo);
        Registration.set('paymentScreenshot', parseFile);

        await Registration.save(null, { useMasterKey: true });
        res.json({ success: true, message: "Registration saved successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


app.listen(3000, () => console.log('Server running on 3000'));




