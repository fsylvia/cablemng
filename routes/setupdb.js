var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var LookupType = require('../models/lookuptype.js');
var Lookup = require('../models/lookup.js');

function onBulkInsert(err, myDocuments) {
    if (err) {
        return next(err);
    }
    else {
        console.log('%count records were inserted!', myDocuments.length)
    }
}

router.post('/resetmongodb', function (req, res, next) {
    LookupType.remove({}, function (err) {
        if (err) {
            return next(err);
        } else {
            Lookup.remove({}, function(err){
                if(err) {
                    return next(err);
                }
            })
        }
    });

    var lookupTypes = [
        {'lookuptype' : 'ID_TYPE', 'createddate' : new Date(Date.now())},
        {'lookuptype' : 'AREA', 'createddate' : new Date(Date.now())},
        {'lookuptype' : 'REASON_FOR_DEACTIVATION', 'createddate' : new Date(Date.now())}
    ];
    LookupType.collection.insert(lookupTypes, onBulkInsert);

    var lookups = [
        {'lookuptype': 'AREA', 'lookupvalue': 'Anthoniar Koil Street', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Valluvar St', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Anna Nagar', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'VOC Theru', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Bharathi Theru', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'TVK St', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Cheran St', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Kennedy St', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Kannagi St', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Elango St', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Sangath St', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Kalaivanar', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Madavi St', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Kaveri Nagar', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Kozhi pannai st', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Annai Ashram', 'createddate': new Date(Date.now())},
        {'lookuptype': 'AREA', 'lookupvalue': 'Wireless Rd', 'createddate': new Date(Date.now())},
        {'lookuptype': 'ID_TYPE', 'lookupvalue': 'Passport', 'createddate': new Date(Date.now())},
        {'lookuptype': 'ID_TYPE', 'lookupvalue': 'Ration Card', 'createddate': new Date(Date.now())},
        {'lookuptype': 'ID_TYPE', 'lookupvalue': 'Driving License', 'createddate': new Date(Date.now())},
        {'lookuptype': 'ID_TYPE', 'lookupvalue': 'Aadhar Card', 'createddate': new Date(Date.now())},
        {'lookuptype': 'ID_TYPE', 'lookupvalue': 'Voter ID', 'createddate': new Date(Date.now())},
        {'lookuptype': 'REASON_FOR_DEACTIVATION', 'lookupvalue': 'Relocating town', 'createddate': new Date(Date.now())},
        {'lookuptype': 'REASON_FOR_DEACTIVATION', 'lookupvalue': 'Repeat Defaulter', 'createddate': new Date(Date.now())},
        {'lookuptype': 'REASON_FOR_DEACTIVATION', 'lookupvalue': 'Got DTH', 'createddate': new Date(Date.now())},
        {'lookuptype': 'REASON_FOR_DEACTIVATION', 'lookupvalue': 'Other reasons', 'createddate': new Date(Date.now())}
    ];
    Lookup.collection.insert(lookups, onBulkInsert);

    res.json({'jobStatus': 'MongoDB Refresh Complete - It\'s All Good!'});
});

module.exports = router;