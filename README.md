# Agility User Generated Content API - JS SDK
JavaScript Library to facilitate client-side interaction with Agility UGC API. Currently, this only supports being used in the browser.

## Installation
```
npm install agility-ugc
```

## Initialize Client
You must intialize the client with several values specific to you, you will then hash it and pass the values to the UGC SDK. The SDK will automatically look for this variable in your global namespace. The AccessHash should be computed server-side in order to protect your SecretKey.

**You need an Access Key and Secret Key in order to generate your access hash. Contact support@agilitycms.com if do you do not have one.**

``` javascript
//set a global window variable with the following values:
var _AgilityUGCSettings = { 
    'Url': 'https://ugc.agilitycms.com/Agility-UGC-API-JSONP.svc',
    'AccessKey': '553901D2-F5E1-4BBA-B346-159xxxxxxx', //the website API Access Key provided to you
    'Seconds': '567353588', //is the number of seconds that have elapsed since Jan 1/2001.
    'RandomNumber': '205', //just a random number between 1-1000
    'ProfileRecordID': '-1', //the profile record ID of the logged-in website user, -1 is anonymous
    'AccessHash': '7c690bdac92defff3a676e24ded04c5xxxxxxx' //The SHA hash of all the above variables
                                                           //(Seconds.ProfileID.SecretKey.AccessKey.Random)
};
```

*See Generating a [UGC Access Hash in .NET Core](https://github.com/AgilityInc/GenerateUGCAccessHash-NetCore) for a code sample on how to generate your hash and initialize your client.*

## Usage
``` javascript
import ugcClient from 'agility-ugc'

ugcClient.GetRecord(1027, function(data) {	
    if (data.ResponseType != ugcClient.ResponseType.OK) {
        //error occurred
        alert("An error occurred: " + data.Message);			
    } else {
        //data.ResponseData is a "Record" object
        var record = data.ResponseData;
        console.log(record);
    }
})
```

