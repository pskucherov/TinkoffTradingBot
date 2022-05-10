const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { logger } = require('../logger');

const demoOrderBookFile = path.resolve(__dirname, '../../../data/cachedorderbooks/FUTMGNT06220/06.05.2022.json');
const bufOrderBookFile = path.resolve(__dirname, '../../../data/cachedorderbooks/FUTMGNT06220/buf.json');

try {
    const getOBFromFile = fileName => {
        const file = fs.readFileSync(fileName, 'utf8');

        return file && file.split('\r\n');
    };

    const orderBookCompressor = () => {
        const ob = getOBFromFile(demoOrderBookFile);

        const newOrderBook = {};

        ob.forEach(s => {
            if (!s) {
                return;
            }

            const oneString = JSON.parse(s);
            const t = new Date(oneString.time);

            t.setMilliseconds(0);
            t.setSeconds(0);

            newOrderBook[t.getTime()] = {
                ...oneString,
                time: t.getTime(),
                figi: undefined,
            };
        });

        fs.writeFileSync(bufOrderBookFile, JSON.stringify(newOrderBook));
    };

    orderBookCompressor();

    module.exports = {
        orderBookCompressor,
    };
} catch (error) {
    logger(0, error);
}