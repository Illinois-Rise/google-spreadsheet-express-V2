/* eslint-disable */
const googleSheets = require("./index");

// Route parameter variables
const PARAMETER_SHEET_INDEX = "sheetIndex";
const PARAMETER_SHEET_ID = "sheetId";
const PARAMETER_ROW = "row";
const API_PREFIX_SHEETS = "sheets";

/**
 * Routes for our Google Spreadsheet API.
 *
 * @param app - the express app to add the routes to
 */
module.exports = (app) => {
  /**
     * Gets information about all worksheets.
     */
  app.get(`/${API_PREFIX_SHEETS}/:${PARAMETER_SHEET_ID}`, (req, res) => {
    googleSheets.getInfo(res, req.params[PARAMETER_SHEET_ID]);
  });

  /**
     * Gets information about a single worksheet.
     */
  app.get(`/${API_PREFIX_SHEETS}/:${PARAMETER_SHEET_ID}/sheetIndex/:${PARAMETER_SHEET_INDEX}`, (req, res) => {
    console.log("Getting Info for sheet");
    googleSheets.getWorksheetInfo(res, req.params[PARAMETER_SHEET_ID], req.params[PARAMETER_SHEET_INDEX]);
  });

  /**
     * Gets a single row associated with a spreadsheet.
     */
  app.get(`/${API_PREFIX_SHEETS}/:${PARAMETER_SHEET_ID}/sheetIndex/:${PARAMETER_SHEET_INDEX}/rows/:${PARAMETER_ROW}`, (req, res) => {
    googleSheets.getRow(res, req.params[PARAMETER_SHEET_ID], req.params[PARAMETER_ROW], req.params[PARAMETER_SHEET_INDEX]);
  });

  /**
     * Gets all rows associated with a spreadsheet.
     */
  app.get(`/${API_PREFIX_SHEETS}/:${PARAMETER_SHEET_ID}/sheetIndex/:${PARAMETER_SHEET_INDEX}/rows`, (req, res) => {
    googleSheets.getRows(res, req.params[PARAMETER_SHEET_ID], req.params[PARAMETER_SHEET_INDEX]);
  });

  /**
     * Writes a single row to a spreadsheet.
     */
  app.post(`/${API_PREFIX_SHEETS}/:${PARAMETER_SHEET_ID}/sheetIndex/:${PARAMETER_SHEET_INDEX}/rows`, (req, res) => {
    googleSheets.postRow(res, req.params[PARAMETER_SHEET_ID], req.body, req.params[PARAMETER_SHEET_INDEX]);
  });
};
