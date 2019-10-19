const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const User = mongoose.model('User');
const Tenant = mongoose.model('Tenant');
// const Payment = mongoose.model('Payment');
const csv = require('csv-parser')
const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const bs64 = require('base-x')(BASE64);
const BufferStream = require('../../utils/BufferStream.js')
const fs = require('fs');




router.post('/payments/user', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then((user) => {
        if (!user) { return res.sendStatus(401); }

        const trimmedB64Str = req.body.file.fileData.split("base64,")[1];
        const filePath = './tmp/tempFile.csv';

        let writeStream = fs.createWriteStream(filePath);
        writeStream.write(trimmedB64Str, 'base64');

        writeStream.on('finish', () => {
            console.log('wrote all data to file');
        });
        // // close the stream
        writeStream.end();

        // // new read the tempFile we created
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                for (let index = 0; index < results.length; index++) {
                    const paymentObj = results[index];
                    for (const [key, value] of Object.entries(paymentObj)) {
                        console.log(key, value); // key and val of every obj
                        Tenant.findOne({ nick: 'noname' }, function (err, obj) { console.log(obj); });
                    }
                    return;

                }

            });

        fs.unlinkSync(filePath);
        return res.sendStatus(200); ß
    })

})


module.exports = router;


