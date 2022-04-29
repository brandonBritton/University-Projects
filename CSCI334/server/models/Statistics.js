const moment = require("moment");

const mongoose = require('mongoose')
const VaccinationRecord = require("./VaccinationRecord");
const RegisteredGeneralPublic = require("./RegisteredGeneralPublic");
const Address = require("./Address");
const CheckIn = require("./CheckIn");
const PositiveCase = require("./PositiveCase");
const BusinessUser = require("./BusinessUser");
const Business = require("./Business");
const VaccinationCentre = require("./VaccinationCentre");
const rp = require('request-promise');
const {Emailer} = require("../utils/general");
const {dailySummary} = require("../utils/general");

// Create Schema
const StatisticsSchema = new mongoose.Schema({
        covidSummary: {
            // from scraped
            totalHospitalised: {
                type: Number,
                required: true
            },
            // from scraped
            totalDeaths: {
                type: Number,
                required: true
            },
            // from scraped
            totalTests: {
                type: Number,
                required: true
            },
            // from scraped
            totalTestsLast24Hours: {
                type: Number,
                required: true
            },
            // from scraped
            totalOverseasCasesLast24Hours: {
                type: Number,
                required: true
            },
            totalPositiveCases: {
                type: Number,
                required: true
            },
            totalPositiveCasesLast24Hours: {
                type: Number,
                required: true
            },
            totalPositiveCasesByMonth: [{
                month: Number,
                year: Number,
                positiveCases: Number
            }],
            totalCurrentHotspotVenues: {
                type: Number,
                required: true
            }
        },
        businessesSummary: {
            totalBusinessesRegistered: {
                type: Number,
                required: true
            },
            businessesByState: [{
                state: String,
                numberOfBusinesses: Number
            }],
            businessRegistrationsByMonth: [{
                month: String,
                year: Number,
                numberOfBusinesses: Number
            }],
            businessesDeemedHotspot24Hours: [{
                business: mongoose.Schema.Types.ObjectId,
                dateVisited: Date
            }],
        },
        vaccinationsSummary: {
            totalVaccinations: {
                type: Number,
                required: true
            },
            vaccinationsYesterday: {
                type: Number,
                required: true
            },
            vaccinationsByType: [{
                vaccinationType: String,
                numberOfVaccinations: String,
            }],
            totalVaccinationCentres: {
                type: Number,
                required: true
            },
            vaccinationCentresByState: [{
                state: String,
                numberOfVaccinationCentres: Number,
            }],
            vaccinationsByStatus: [{
                status: String,
                numberOfVaccinations: Number,
            }]
        },
        usersSummary: {
            generalPublicUserRegistrationsByMonth: [{
                month: Number,
                year: Number,
                numberOfUsers: Number
            }],
            totalRegisteredGeneralPublicUsers: {
                type: Number,
                required: true
            },
        },
        checkinsSummary: {
            totalCheckins: {
                type: Number,
                required: true
            },
            checkinsLast24Hours: {
                type: Number,
                required: true
            },
            checkinsByMonth: [{year: Number, month: Number, numberOfCheckins: Number}],
            checkinsByUserType: [{userType: String, numberOfCheckins: Number}]
        }
    }
);

StatisticsSchema.statics.getVaccinationsByMonth = async function () {
    let docs = await VaccinationRecord.aggregate()
        .project({
                year: { $year: "$dateAdministered" },
                month: { $month: "$dateAdministered" }
        })
        .group({
                _id: { month: "$month", year: "$year" },
                numberOfVaccinations: { $sum: 1 }
        })
        .project({
            year: "$_id.year",
            month: "$_id.month",
            numberOfVaccinations: 1,
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getTotalPositiveCasesByMonth = async function () {
    let docs = await PositiveCase.aggregate()
        .project({
            year: { $year: "$testDate" },
            month: { $month: "$testDate" }
        })
        .group({
            _id: { month: "$month", year: "$year" },
            positiveCases: { $sum: 1 }
        })
        .project({
            year: "$_id.year",
            month: "$_id.month",
            positiveCases: 1,
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getCheckinByMonth = async function () {
    let docs = await CheckIn.aggregate()
        .project({
            year: { $year: "$date" },
            month: { $month: "$date" }
        })
        .group({
            _id: { month: "$month", year: "$year" },
            numberOfCheckins: { $sum: 1 }
        })
        .project({
            year: "$_id.year",
            month: "$_id.month",
            numberOfCheckins: 1,
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getCheckinsByUserType = async function () {
    let docs = await CheckIn.aggregate()
        .group({
            _id: "$userModel",
            numberOfCheckins: { $sum: 1 }
        })
        .project({
            numberOfCheckins: 1,
            userType: "$_id",
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getVaccinationsByType = async function () {
    let docs = await VaccinationRecord.aggregate()
        .group({
            _id: "$vaccinationType",
            numberOfVaccinations: { $sum: 1 }
        })
        .project({
            numberOfVaccinations: 1,
            vaccinationType: "$_id",
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getVaccinationsByStatus = async function () {
    let docs = await VaccinationRecord.aggregate()
        .group({
            _id: "$vaccinationStatus",
            numberOfVaccinations: { $sum: 1 }
        })
        .project({
            numberOfVaccinations: 1,
            status: "$_id",
            _id: 0
        })
        .exec();
    return docs;
};


StatisticsSchema.statics.getGeneralPublicUserRegistrationsByMonth = async function () {
    let docs = await RegisteredGeneralPublic.aggregate()
        .project({
            year: { $year: "$registrationDate" },
            month: { $month: "$registrationDate" }
        })
        .group({
            _id: { month: "$month", year: "$year" },
            numberOfUsers: { $sum: 1 }
        })
        .project({
            year: "$_id.year",
            month: "$_id.month",
            numberOfUsers: 1,
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getPositiveCasesByMonth = async function () {
    let docs = await PositiveCase.aggregate()
        .project({
            year: { $year: "$testDate" },
            month: { $month: "$testDate" }
        })
        .group({
            _id: { month: "$month", year: "$year" },
            numberOfPositiveCases: { $sum: 1 }
        })
        .project({
            year: "$_id.year",
            month: "$_id.month",
            numberOfPositiveCases: 1,
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getGeneralPublicRegistrationsByMonth = async function () {
    let docs = await RegisteredGeneralPublic.aggregate()
        .project({
            year: { $year: "$registrationDate" },
            month: { $month: "$registrationDate" }
        })
        .group({
            _id: { month: "$month", year: "$year" },
            numberOfRegistrations: { $sum: 1 }
        })
        .project({
            year: "$_id.year",
            month: "$_id.month",
            numberOfRegistrations: 1,
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getBusinessRegistrationsByMonth = async function () {
    let docs = await BusinessUser.aggregate()
        .project({
            year: { $year: "$registrationDate" },
            month: { $month: "$registrationDate" }
        })
        .group({
            _id: { month: "$month", year: "$year" },
            numberOfBusinesses: { $sum: 1 }
        })
        .project({
            year: "$_id.year",
            month: "$_id.month",
            numberOfBusinesses: 1,
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getVaccinationCentresByState = async function () {
    let docs = await VaccinationCentre.aggregate()
        .lookup( {
            from: Address.collection.name,
            localField: "address",
            foreignField: "_id",
            as: "address"
         })
        .unwind("$address")
        .group({_id: "$address.state", numberOfVaccinationCentres: { $sum: 1 }})
        .project({state: "$_id", numberOfVaccinationCentres: 1, _id: 0})
        .exec();
    return docs;
};

StatisticsSchema.statics.getBusinessesByState = async function () {
    let docs = await Business.aggregate()
        .lookup( {
            from: Address.collection.name,
            localField: "address",
            foreignField: "_id",
            as: "address"
        })
        .unwind("$address")
        .group({_id: "$address.state", numberOfBusinesses: { $sum: 1 }})
        .project({state: "$_id", numberOfBusinesses: 1, _id: 0})
        .exec();
    return docs;
};

StatisticsSchema.statics.getPositiveBusinessesCheckinDates = async function(){
    return PositiveCase.aggregate()
        .match({testDate: {$gte: moment().subtract(14, 'days').toDate()}})
        .lookup({
            from: CheckIn.collection.name,
            let: {user1: "$user", userModel1: "$userModel"},
            pipeline: [
                {
                    $match:
                        {
                            $expr:
                                {
                                    $and:
                                        [
                                            {$eq: ["$user", "$$user1"]},
                                            {$eq: ["$userModel", "$$userModel1"]}
                                        ]
                                }
                        }
                },
            ],
            as: "checkin"
        })
        .unwind("$checkin")
        .match({
            $and: [
                {$expr: {$gte: ["$checkin.date", "$infectiousStartDate"]}},
                {$expr: {$lte: ["$checkin.date", "$testDate"]}},
            ],
        })
        .group({_id: {business: '$checkin.business', dateVisited: {$dateToString: {date: "$checkin.date", format: "%Y-%m-%d"}}
            }})
        .project({
            _id: 0, business: "$_id.business", dateVisited: "$_id.dateVisited"
        })
        .sort({dateVisited: -1})
};

StatisticsSchema.statics.getBusinessesDeemedHotspot24Hours = async function(){
    return PositiveCase.aggregate()
        .match({testDate: {$gte: moment().subtract(1, 'days').toDate()}})
        .lookup({
            from: CheckIn.collection.name,
            let: {user1: "$user", userModel1: "$userModel"},
            pipeline: [
                {
                    $match:
                        {
                            $expr:
                                {
                                    $and:
                                        [
                                            {$eq: ["$user", "$$user1"]},
                                            {$eq: ["$userModel", "$$userModel1"]}
                                        ]
                                }
                        }
                },
            ],
            as: "checkin"
        })
        .unwind("$checkin")
        .match({
            $and: [
                {$expr: {$gte: ["$checkin.date", "$infectiousStartDate"]}},
                {$expr: {$lte: ["$checkin.date", "$testDate"]}},
            ],
        })
        .project({
            _id: 0, business: "$checkin.business", dateVisited: "$checkin.date"
        });
};

StatisticsSchema.statics.getCheckinsLast24Hours = async function () {
    let docs = await CheckIn
        .find({date: {$gte: moment().subtract(24, 'hours').toDate()}})
        .countDocuments();
    return docs;
};

StatisticsSchema.statics.getPositiveCasesLast24Hours = async function () {
    let docs = await PositiveCase
        .find({testDate: {$gte: moment().subtract(24, 'hours').toDate()}})
        .countDocuments();
    return docs;
};

StatisticsSchema.statics.getVaccinationsYesterday = async function () {
    let docs = await VaccinationRecord
        .find({$and:
                [{date: {$gte: moment().subtract(48, 'hours').toDate()}},
                    {date: {$lte: moment().subtract(24, 'hours').toDate()}}
        ]
        })
        .countDocuments();
    return docs;
};

StatisticsSchema.methods.updateData = async function(){
    // do update data
    try {
        await this.update();
    } catch (e){
        console.log(e);
    }
};

StatisticsSchema.methods.setData = async function(all=false){
    // do update data
    const covidSummaryUrl = 'https://covidlive.com.au/australia';

    const covidSummaryHtml = await rp(covidSummaryUrl);

    this.covidSummary.totalHospitalised = dailySummary(covidSummaryHtml, "Hospitalised").total();
    this.covidSummary.totalDeaths = dailySummary(covidSummaryHtml, "Deaths").total();
    this.covidSummary.totalTests = dailySummary(covidSummaryHtml, "Tests").total();
    this.covidSummary.totalTestsLast24Hours = dailySummary(covidSummaryHtml, "Tests").net();
    this.covidSummary.totalOverseasCasesLast24Hours = dailySummary(covidSummaryHtml, "Overseas").net();
    this.covidSummary.totalCases = dailySummary(covidSummaryHtml, "Cases").total();
    this.covidSummary.totalCurrentHotspotVenues = (await Statistics.getPositiveBusinessesCheckinDates()).length;
    this.covidSummary.totalPositiveCasesLast24Hours = await Statistics.getPositiveCasesLast24Hours();
    this.covidSummary.totalPositiveCases = await PositiveCase.countDocuments();
    if(all) this.covidSummary.totalPositiveCasesByMonth = await Statistics.getTotalPositiveCasesByMonth();

    this.checkinsSummary.totalCheckins = await CheckIn.countDocuments();
    this.checkinsSummary.checkinsLast24Hours = await Statistics.getCheckinsLast24Hours();
    if(all) this.checkinsSummary.checkinsByMonth = await Statistics.getCheckinByMonth();
    if(all) this.checkinsSummary.checkinsByUserType = await Statistics.getCheckinsByUserType();
    this.usersSummary.totalRegisteredGeneralPublicUsers = await RegisteredGeneralPublic.countDocuments();
    if(all) this.usersSummary.generalPublicUserRegistrationsByMonth = await Statistics.getGeneralPublicUserRegistrationsByMonth();

    this.businessesSummary.totalBusinesses = await Business.countDocuments();
    this.vaccinationsSummary.totalVaccinationCentres = await VaccinationCentre.countDocuments();
    this.vaccinationsSummary.vaccinationsYesterday = await Statistics.getVaccinationsYesterday();
    this.vaccinationsSummary.totalVaccinations = await VaccinationRecord.countDocuments();
    if(all) this.vaccinationsSummary.vaccinationsByType = await Statistics.getVaccinationsByType();
    if(all) this.vaccinationsSummary.vaccinationCentresByState = await Statistics.getVaccinationCentresByState();
    if(all) this.vaccinationsSummary.vaccinationsByStatus = await Statistics.getVaccinationsByStatus();
    this.vaccinationsSummary.totalVaccinationCentres = await VaccinationCentre.countDocuments();

    this.businessesSummary.totalBusinessesRegistered = await Business.countDocuments();
    if(all) this.businessesSummary.businessesByState = await Statistics.getBusinessesByState();
    if(all) this.businessesSummary.businessRegistrationsByMonth = await Statistics.getBusinessRegistrationsByMonth();
    this.businessesSummary.businessesDeemedHotspot24Hours = await Statistics.getBusinessesDeemedHotspot24Hours();

};

StatisticsSchema.methods.saveData = async function (){
    try {
        await this.save();
    } catch (e){
        console.log(e);
    }
};

// use Singleton pattern
StatisticsSchema.statics.getSingleton = async function (all=false) {
        let result = await this.findOne();
        if(result) {
            await result.setData(all);
            await result.updateData();
            return result;
        } else {
            let stats = new Statistics();
            await stats.setData(all);
            await stats.saveData();
            return stats;
        }
};

const removeKey = (obj, key) => obj !== Object(obj)
    ? obj
    : Array.isArray(obj)
        ? obj.map(item => removeKey(item, key))
        : Object.keys(obj)
            .filter(k => k !== key)
            .reduce((acc, x) => Object.assign(acc, { [x]: removeKey(obj[x], key) }), {});

if (!StatisticsSchema.options.toObject) StatisticsSchema.options.toObject = {};
StatisticsSchema.options.toObject.transform = function (doc, ret, options) {
    // remove the _id of every document before returning the result
    delete ret._id;
    ret = removeKey(ret, "_id");
    ret = removeKey(ret, "lastUpdated");
    ret = removeKey(ret, "__v");
    return ret;
}

function camel2title(camelCase) {
    // no side-effects
    return camelCase
        // inject space before the upper case letters
        .replace(/([A-Z])/g, function(match) {
            return " " + match;
        })
        // replace first char with upper case
        .replace(/^./, function(match) {
            return match.toUpperCase();
        });
}

StatisticsSchema.statics.sendGovernmentMessage = async function(date){
    let msg = {
        to: process.env.GOVERMENT_EMAIL,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `Statistics for ${date}`,
    }
    let stats = await Statistics.getSingleton(true);
    let statsObject = stats.toObject();

    let html = "<html><body>";
    for(let sCategory in statsObject){
        html += `<h2>${camel2title(sCategory)}</h2>`;
        for(let sCategory2 in statsObject[sCategory]){
            html += `<h3>${camel2title(sCategory2)}</h3>`;
            let sCategory2Value = statsObject[sCategory][sCategory2];
            if(typeof sCategory2Value == "number") {
                html += sCategory2Value;
            } else {
                if (Array.isArray(sCategory2Value)){
                    html += `<ul>`
                    for(let v of sCategory2Value) {
                        html += '<li>';
                        for (let sV in v) {
                            html += `${camel2title(sV)}:${v[sV]}, `;
                        }
                        html += '</li>';
                        html = html.replace(', </li>', '</li>')
                    }
                    html += `</ul>`;
                } else {
                    html += sCategory2Value;
                }
            }
        }
        if(statsObject[sCategory] instanceof Date){
            html += statsObject[sCategory];
        }
    }
    html += '</body></html>'
    msg['html'] = html
    await Emailer.sendEmail(msg)
}

const Statistics = mongoose.model('Statistics', StatisticsSchema);

module.exports = Statistics;
