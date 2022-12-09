# google-spreadsheet-express
A simple API for interacting with a google spreadsheet. This express server allows you to interact with a spreadsheet
in an unauthenticated manor (NOTE: anyone with the URL to the server can send requests and modify the spreadsheet).
`app.js` contains a rate limiter that you can configure to help mitigate DDoS attacks.

## Create necessary (free) Google accounts:
* Create a Google Cloud Platform Project [here](https://console.cloud.google.com/home/dashboard)
* Create a Google Service account within your project [here](https://console.cloud.google.com/iam-admin/serviceaccounts) 
* Create a private key for your Google Service account
    * On the newly created service account page, click the `Create Key` at the bottom, and choose `JSON` to download the key
* Configure your [Google Secret Manager](https://cloud.google.com/secret-manager/docs/configuring-secret-manager)
* Add the private_key and client_email values to Google Secret Manager, following [these steps](https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets) under "Console"
* Change constant values of const `PRIVATE_KEY_SECRET_VERSION` and `CLIENT_EMAIL_SECRET_VERSION` to your secret versions

    
## Share spreadsheet with Google Service account
To be able to write/read to/from the spreadsheet, you need to share the spreadsheet with the created Google Service
account above. To do this, just click `Share` from the spreadsheet and add the `client_email` of the service account
(see how to find that above). Ensure you only share permissions that you want the service account to have (only view
permissions if you only plan on reading from the spreadsheet and don't want anyone to be able to manipulate it, or
view + edit permissions if you want to be able to manipulate the spreadsheet).
    
## Usage:
* `cd functions`: All operations must be done inside the `/functions` folder
* `npm install` : Install necessary node modules
* `npm serve` : Deploy functions locally
* `npm deploy`: Deploys functions to Google Cloud

## TODO:  
* Add endpoints: create/modify/delete sheet, get/update cell, delete row
* Update API Documentation to the new V4 google-spreadsheet response

## API Documentation

## Get Spreadsheet Info

Gets information about the entire spreadsheet.

### Usage

**URL** : `/sheets/:sheetId`

**Method** : `GET`

**Parameters** : 
* **:sheetId** = The ID of the spreadsheet (can be found in the spreadsheet url (after /d/ and before /edit))

### Success Response
 
**Condition** : Sheet ID provided is valid and spreadsheet has been shared with the Google service account.

**Code** : `200 OK`

**Content example** :
```json
{"id": doc.spreadsheetId,
 "title": doc.title,
 "locale": doc.locale,
 "timeZone": doc.timeZone}
```

### Error Response

**Condition** : If provided sheet ID was invalid, or the spreadsheet was not shared with the Google Service account.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "status": 400,
    "message": "Please provide a valid spreadsheet ID and ensure the spreadsheet is shared with the Google Service account.",
    "type": "Bad Request"
}
```

## Get Worksheet Info

Gets information about a single worksheet within a spreadsheet.

### Usage

**URL** : `/sheets/:sheetId/sheetIndex/:sheetIndex`

**Method** : `GET`

**Parameters** : 
* **:sheetId** = The ID of the spreadsheet (can be found in the spreadsheet url (after /d/ and before /edit))
* **:sheetIndex** = The index of the worksheet within the spreadsheet (starts at 0)

### Success Response
 
**Condition** : Sheet ID provided is valid and spreadsheet has been shared with the Google service account. If an
invalid sheet index has been provided, an empty 200 response will be returned

**Code** : `200 OK`

**Content example** :
```json
{
    "sheetId": sheet.sheetId,
    "title": sheet.title,
    "index": sheet.index,
    "sheetType": sheet.sheetType,
    "headers": sheet.headerValues

}
```

### Error Response

**Condition** : If provided sheet ID was invalid, or the spreadsheet was not shared with the Google Service account.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "status": 400,
    "message": "Please provide a valid spreadsheet ID and ensure the spreadsheet is shared with the Google Service account.",
    "type": "Bad Request"
}
```

## Get Row Data

Gets row data for the row index passed in.

### Usage

**URL** : `/sheets/:sheetId/sheetIndex/:sheetIndex/rows/:rowIndex`

**Method** : `GET`

**Parameters** : 
* **:sheetId** = The ID of the spreadsheet (can be found in the spreadsheet url (after /d/ and before /edit))
* **:sheetIndex** = The index of the worksheet within the spreadsheet (starts at 0)
* **:rowIndex** = The index of the worksheet within the spreadsheet (starts at 0)

### Success Response
 
**Condition** : Sheet ID provided is valid and spreadsheet has been shared with the Google service account. If an
invalid sheet index or row index has been provided, an empty 200 response will be returned

**Code** : `200 OK`

**Content example** :
```json
{
    "headerRow1Col1":"valueRow1Col1", 
    "headerRow1Col2":"valueRow1Col2"
 }
```

### Error Response

**Condition** : If provided sheet ID was invalid, or the spreadsheet was not shared with the Google Service account.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "status": 400,
    "message": "Please provide a valid spreadsheet ID and ensure the spreadsheet is shared with the Google Service account.",
    "type": "Bad Request"
}
```

## Get All Row Data

Gets row data for the row index passed in.

### Usage

**URL** : `/sheets/:sheetId/sheetIndex/:sheetIndex/rows`

**Method** : `GET`

**Parameters** : 
* **:sheetId** = The ID of the spreadsheet (can be found in the spreadsheet url (after /d/ and before /edit))
* **:sheetIndex** = The index of the worksheet within the spreadsheet (starts at 0)

### Success Response
 
**Condition** : Sheet ID provided is valid and spreadsheet has been shared with the Google service account. If an
invalid sheet index has been provided, an empty 200 response will be returned

**Code** : `200 OK`

**Content example** :
```json
[  
    {"headerRow1Col1":"valueRow1Col1", "headerRow1Col2":"valueRow1Col2"},  
    {"headerRow2Col1":"valueRow2Col1"}  
]
```

### Error Response

**Condition** : If provided sheet ID was invalid, or the spreadsheet was not shared with the Google Service account.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "status": 400,
    "message": "Please provide a valid spreadsheet ID and ensure the spreadsheet is shared with the Google Service account.",
    "type": "Bad Request"
}
```

## Create a New Row

Creates a new row in the spreadsheet. The row is appended to the spreadsheet after all occupied rows.

### Usage

**URL** : `/sheets/:sheetId/sheetIndex/:sheetIndex/rows`

**Method** : `POST`

**Parameters** : 
* **:sheetId** = The ID of the spreadsheet (can be found in the spreadsheet url (after /d/ and before /edit))
* **:sheetIndex** = The index of the worksheet within the spreadsheet (starts at 0)

**Headers** :
* **Content-Type** : application/json

**Post Body Example** :
```json
{
  "First Name": "Nick",
  "Last Name": "Prozorovsky",
  "Dietary Restriction": "None",
  "Can Attend": "Yes"
}
```
Note: The key must match a header column name exactly to be written to that column. The value is the value to write to
that column. If an invalid key (header column name) is provided, it will be ignored and will not be written to the spreadsheet.

### Success Response
 
**Condition** : Sheet ID provided is valid and spreadsheet has been shared with the Google service account. If an
invalid sheet index has been provided, an empty 200 response will be returned

**Code** : `200 OK`

**Content example** :
```json
{
  "First Name": "Nick",
  "Last Name": "Prozorovsky",
  "Dietary Restriction": "None",
  "Can Attend": "Yes"
}
```
The created row object is returned to the user.

### Error Response

**Condition** : If provided sheet ID was invalid, or the spreadsheet was not shared with the Google Service account.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "status": 400,
    "message": "Please provide a valid spreadsheet ID and ensure the spreadsheet is shared with the Google Service account.",
    "type": "Bad Request"
}
```
