const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getCreds } = require('./credentials.js');
const ERROR_MESSAGE_BAD_REQUEST = 'Please provide a valid spreadsheet ID and ensure the spreadsheet is shared with the Google Service account.';
/**
 * API for interacting with Google Spreadsheets.
 */
module.exports = {

    /**
     * Gets general information about the document.
     *
     * @param res - response to send data to
     * @param sheetId - id of our spreadsheet
     */
    getInfo: async (res, sheetId) => {
        const doc = new GoogleSpreadsheet(sheetId);
        const creds = await getCreds();
        try {
            await doc.useServiceAccountAuth(creds);
            await doc.loadInfo()
            const info = {"id": doc.spreadsheetId,
                "title": doc.title,
                "locale": doc.locale,
                "timeZone": doc.timeZone}
                res.status(200).json(info);
        } catch (e) {
            res.status(400).send({ status: 400, message: ERROR_MESSAGE_BAD_REQUEST, type: 'Bad Request' });
        }
        
    },

    /**
     * Gets general information about a single worksheet.
     *
     * @param res - response to send data to
     * @param sheetId - id of our spreadsheet
     * @param sheetIndex - optional sheet index
     */
    getWorksheetInfo: async (res, sheetId, sheetIndex = 1) => {
        const doc = new GoogleSpreadsheet(sheetId);
        const creds = await getCreds();
        try {
            await doc.useServiceAccountAuth(creds);
            await doc.loadInfo()
            const sheet = doc.sheetsByIndex[sheetIndex]
            info = {
                "sheetId": sheet.sheetId,
                "title": sheet.title,
                "index": sheet.index,
                "sheetType": sheet.sheetType,
                "headers": sheet.headerValues

            }
            res.status(200).json(info);
        } catch (e) {
            res.status(400).send({ status: 400, message: ERROR_MESSAGE_BAD_REQUEST, type: 'Bad Request' });
        }
    },

    /**
     * Reads all rows (reads just row spreadsheet data).
     *
     * @param res - response to send data to
     * @param sheetId - id of our spreadsheet
     * @param sheetIndex - optional sheet index
     */
    getRows: async (res, sheetId, sheetIndex = 1) => {
        const doc = new GoogleSpreadsheet(sheetId);
        const creds = await getCreds();
        try {
            await doc.useServiceAccountAuth(creds);
            await doc.loadInfo()
            const sheet = doc.sheetsByIndex[sheetIndex]
            const rows = await sheet.getRows()
            const headers = sheet.headerValues
            const info = []
            rows.forEach((row) => {
                const rowinfo = {}
                headers.forEach((header) => {
                    rowinfo[header] = row[header]
                })
                info.push(rowinfo)
            })
            res.status(200).json(info);
        } catch (e) {
            res.status(400).send({ status: 400, message: ERROR_MESSAGE_BAD_REQUEST, type: 'Bad Request' });
        }
    },

    /**
     * Reads a single row (reads just row spreadsheet data).
     *
     * @param res - response to send data to
     * @param sheetId - id of our spreadsheet
     * @param rowIndex - row data to write to our spreadsheet
     * @param sheetIndex - optional sheet index
     */
    getRow: async (res, sheetId, rowIndex, sheetIndex = 1) => {
        const doc = new GoogleSpreadsheet(sheetId);
        const creds = await getCreds();
        try {
            await doc.useServiceAccountAuth(creds);
            await doc.loadInfo()
            const sheet = doc.sheetsByIndex[sheetIndex]
            const rows = await sheet.getRows()
            const headers = sheet.headerValues
            const info = []
            const rowinfo = {}
            headers.forEach((header) => {
                rowinfo[header] = rows[rowIndex][header]
            })
            info.push(rowinfo)
            res.status(200).json(info);
        } catch (e) {
            res.status(400).send({ status: 400, message: ERROR_MESSAGE_BAD_REQUEST, type: 'Bad Request' });
        }
    },

    /**
     * Writes a single row to our spreadsheet.
     *
     * @param res - response to send data to
     * @param sheetId - id of our spreadsheet
     * @param rowData - row data to write to our spreadsheet
     * @param sheetIndex - optional sheet index
     */
    postRow: async (res, sheetId, rowData, sheetIndex = 1) => {
        const doc = new GoogleSpreadsheet(sheetId);
        const creds = await getCreds();
        try {
            await doc.useServiceAccountAuth(creds);
            await doc.loadInfo()
            const sheet = doc.sheetsByIndex[sheetIndex]
            const row = await sheet.addRow(rowData)
            res.status(200).json(rowData)

        } catch (e) {
            res.status(400).send({ status: 400, message: ERROR_MESSAGE_BAD_REQUEST, type: 'Bad Request' });
        }
    },

    /**
     * DEPRECATED
     * Loops through all given rows and strips out everything
     * other than the actual spreadsheet row data.
     *
     * @param rows - rows to strip data out of
     * @returns {Array} of stripped rows
     */
    //stripRowsData: (rows) => rows.map((row) => module.exports.stripRowData(row)),

    /**
     * DEPRECATED
     * Strips everything other than the actual row data
     * out of our spreadsheet row object.
     *
     * @param row - row to strip data out of
     * @returns a stripped row
     */
    /*
    stripRowData: (row) => {
        if(row) {
            delete row['id'];
            delete row['_xml'];
            delete row['app:edited'];
            delete row['_links'];
        }
        return row;
    }
    */
};