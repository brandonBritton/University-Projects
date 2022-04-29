const moment = require("moment");

const RegisteredGeneralPublic = require('../models/RegisteredGeneralPublic');
const Address = require('../models/Address');
const Business = require('../models/Business');
const BusinessUser = require('../models/BusinessUser');
const HealthProfessional = require('../models/HealthProfessional');
const GeneralPublicUser = require('../models/GeneralPublic');
const VaccinationRecord = require('../models/VaccinationRecord');
const PositiveCase = require("../models/PositiveCase");
const CheckIn = require('../models/CheckIn');
const {parse} = require('json2csv');
const statesMap = {
    "Tasmania": "TAS",
    "Australian Capital Territory": "ACT",
    "South Australia": "SA",
    "Western Australia": "WA",
    "Northern Territory": "NT",
    "New South Wales": "NSW",
    "Queensland": "QLD",
    "Victoria": "VIC"
}

// generate fake data for seeding database
const faker = require('faker/locale/en_AU');
const db = require('../db');
const mongoose = require("mongoose");
const fs = require("fs");
const VaccinationCentre = require("../models/VaccinationCentre");
const Coordinates = require("../models/Coordinates");
const USER_TYPE = require("../_constants/usertypes");
const {random_coordinate} = require("./general");
faker.seed(0);

class MockData {
    static async createMockRegisteredGeneralPublicUsers(save = false, numUsers = 1) {
        let users = {};
        for (let i = 0; i < numUsers; i++) {
            let user = new RegisteredGeneralPublic();
            user.firstName = faker.name.firstName();
            user.lastName = faker.name.lastName();
            user.email = faker.internet.email(user.firstName, user.lastName);
            let password = faker.internet.password();
            user.password = password;
            user.rawPassword = password;
            user.phone = faker.phone.phoneNumber("0#########");
            user.registrationDate = faker.date.recent(150);
            user.setAccessToken();
            if (user.email in users) continue
            users[user.email] = user;
        }
        try {
            if (save) await RegisteredGeneralPublic.insertMany(Object.values(users), {ordered: false});
        } catch (e) {
            console.error(e);
        }
        return Object.values(users);
    }

    static async createMockAddresses(save = false, numAddresses = 1, addCoordinates = false, coordinates = false) {
        let addresses = [];
        for (let i = 0; i < numAddresses; i++) {
            let address = new Address();
            address.addressLine1 = faker.address.streetAddress();
            // need to update this
            address.suburb = faker.address.city();
            address.city = faker.address.city();
            address.state = statesMap[faker.address.state()];
            address.postcode = faker.address.zipCode();
            if (addCoordinates) {
                if (coordinates) {
                    address.coordinates = coordinates;
                } else {
                    address.coordinates = (await MockData.createMockCoordinates(save, 1, address.state))[0];
                }
            }

            addresses.push(address);
        }
        try {
            if (save) await Address.insertMany(addresses);
        } catch (e) {
            console.error(e);
        }
        return addresses;
    }

    static async createMockBusinesses(save = false, numBusinesses = 1, address = null) {
        let businesses = [];
        for (let i = 0; i < numBusinesses; i++) {
            let business = new Business();
            business.abn = faker.phone.phoneNumber("###########");
            // need to update this
            business.name = faker.company.companyName();
            if (address) {
                business.address = address;
            } else {
                business.address = (await MockData.createMockAddresses(save, 1, true))[0];
            }
            businesses.push(business);
        }
        try {
            if (save) await Business.insertMany(businesses);
        } catch (e) {
            console.error(e);
        }
        return businesses;
    }

    static async createMockBusinessUsers(save = false, numUsers = 1, business = null) {
        let users = {};
        for (let i = 0; i < numUsers; i++) {
            let user = new BusinessUser();
            user.firstName = faker.name.firstName();
            user.lastName = faker.name.lastName();
            user.email = faker.internet.email(user.firstName, user.lastName);
            let password = faker.internet.password();
            user.password = password;
            user.rawPassword = password;
            user.phone = faker.phone.phoneNumber("0#########");
            user.setAccessToken();
            if (business) {
                user.business = business;
            } else {
                user.business = (await MockData.createMockBusinesses(save))[0];
            }
            if (user.email in users) continue
            user.registrationDate = faker.date.recent(150);
            users[user.email] = user;
        }
        try {
            if (save) await BusinessUser.insertMany(Object.values(users), {ordered: false});
        } catch (e) {
            console.error(e);
        }
        return Object.values(users);
    }

    static async createMockHealthProfessionalUsers(save = false, numUsers = 1) {
        let users = {};
        for (let i = 0; i < numUsers; i++) {
            let user = new HealthProfessional();
            user.firstName = faker.name.firstName();
            user.lastName = faker.name.lastName();
            user.email = faker.internet.email(user.firstName, user.lastName);
            let password = faker.internet.password();
            user.password = password;
            user.rawPassword = password;
            user.phone = faker.phone.phoneNumber("0#########");
            user.healthID = faker.phone.phoneNumber("###########");
            user.setAccessToken();
            if (user.email in users) continue
            users[user.email] = user;
            user.registrationDate = faker.date.recent(150);
        }
        try {
            if (save) await HealthProfessional.insertMany(Object.values(users), {ordered: false});
        } catch (e) {
            console.error(e);
        }
        return Object.values(users);
    }

    static async createMockGeneralPublicUsers(save = false, numUsers = 1) {
        let users = {};
        for (let i = 0; i < numUsers; i++) {
            let user = new GeneralPublicUser();
            user.firstName = faker.name.firstName();
            user.lastName = faker.name.lastName();
            user.email = faker.internet.email(user.firstName, user.lastName);
            user.phone = faker.phone.phoneNumber("0#########");
            if (user.email in users) continue
            users[user.email] = user;
        }
        try {
            if (save) await GeneralPublicUser.insertMany(Object.values(users), {ordered: false});
        } catch (e) {
            console.error(e);
        }
        return Object.values(users);
    }

    static async createMockCheckIns(save = false, numCheckIns = 1, user = null, business = null, userType = USER_TYPE.UNREGISTERED, checkinDate=null) {
        let checkins = [];
        for (let i = 0; i < numCheckIns; i++) {
            let checkin = new CheckIn();
            if(checkinDate){
                checkin.date = checkinDate;
            } else {
                checkin.date = faker.date.recent(150);
            }
            if (user) {
                checkin.user = user;
                checkin.userModel = user.constructor.modelName;
            } else {
                let user;
                if (userType === USER_TYPE.GENERAL) {
                    user = (await MockData.createMockRegisteredGeneralPublicUsers(save))[0];
                } else {
                    user = (await MockData.createMockGeneralPublicUsers(save))[0];
                }
                checkin.user = user;
                checkin.userModel = user.constructor.modelName;
            }
            if (business) {
                checkin.business = business;
            } else {
                checkin.business = (await MockData.createMockBusinesses(save))[0];
            }

            checkins.push(checkin);
        }

        if (save) await CheckIn.insertMany(checkins);

        return checkins;
    }

    static async createMockPositiveCases(save = false, numCases = 1, user = null, userType = USER_TYPE.UNREGISTERED, testDate =null) {
        let pCases = [];
        for (let i = 0; i < numCases; i++) {
            let pCase = new PositiveCase();
            if(testDate){
                pCase.testDate = testDate;
            } else {
                pCase.testDate = faker.date.recent(150);
            }
            pCase.infectiousStartDate = moment(pCase.testDate).subtract(faker.datatype.number({
                'min': 1,
                'max': 10
            }), 'days').toDate();
            if (user) {
                pCase.user = user;
                pCase.userModel = user.constructor.modelName;
            } else {
                let user;
                if (userType === USER_TYPE.GENERAL) {
                    user = (await MockData.createMockRegisteredGeneralPublicUsers(save))[0];
                } else {
                    user = (await MockData.createMockGeneralPublicUsers(save))[0];
                }
                pCase.user = user;
                pCase.userModel = user.constructor.modelName;
            }

            pCases.push(pCase);
        }

        if (save) await PositiveCase.insertMany(pCases);

        return pCases;
    }

    static async createMockVaccinationRecord(save = false, numRecords = 1, user = null) {
        let vRecords = [];
        for (let i = 0; i < numRecords; i++) {
            let vRecord = new VaccinationRecord();
            vRecord.dateAdministered = faker.date.recent(150);
            vRecord.vaccinationType = faker.random.arrayElement(VaccinationRecord.schema.path('vaccinationType').enumValues);
            vRecord.vaccinationStatus = faker.random.arrayElement(VaccinationRecord.schema.path('vaccinationStatus').enumValues);
            if (user) {
                vRecord.patient = user;
            } else {
                vRecord.patient = (await MockData.createMockRegisteredGeneralPublicUsers(save))[0];
            }

            vRecords.push(vRecord);
        }

        if (save) await VaccinationRecord.insertMany(vRecords);

        return vRecords;
    }

    static async createMockVaccinationCentres(save = false, numCentres = 1, address = null) {
        let vaccinationCentres = [];
        for (let i = 0; i < numCentres; i++) {
            let vaccinationCentre = new VaccinationCentre();
            vaccinationCentre.clinicName = faker.company.companyName();
            vaccinationCentre.phone = faker.phone.phoneNumber("0#########");
            if (address) {
                vaccinationCentre.address = address;
            } else {
                vaccinationCentre.address = (await MockData.createMockAddresses(save, 1, true))[0];
            }

            vaccinationCentres.push(vaccinationCentre);
        }

        if (save) await VaccinationCentre.insertMany(vaccinationCentres);

        return vaccinationCentres;
    }

    static async createMockCoordinates(save = false, numCoordinates = 1, state="NSW") {
        let coordinates = [];
        for (let i = 0; i < numCoordinates; i++) {
            let coordinate = new Coordinates();
            let coords = random_coordinate(state);
            coordinate.latitude = coords[1];
            coordinate.longitude = coords[0];

            coordinates.push(coordinate);
        }

        if (save) await Coordinates.insertMany(coordinates);

        return coordinates;
    }
}

function getRawUserData(users) {
    let rawUsers = []
    for (let user of users) {
        let u = {id: user.id, password: user.rawPassword, email: user.email, userType: user.type}
        rawUsers.push(u);
    }
    return rawUsers;
}

async function createDevData() {
    await db.connect();
    await mongoose.connection.db.dropDatabase();
    let registeredGeneralPublicUsers = await MockData.createMockRegisteredGeneralPublicUsers(true, 10000);
    console.log("Registered General Public Users created");
    let registeredGeneralPublicUsersRaw = getRawUserData(registeredGeneralPublicUsers);
    let healthProfessionalUsers = await MockData.createMockHealthProfessionalUsers(true, 1500);
    console.log("Health Professional Users created");
    let healthProfessionalUsersRaw = getRawUserData(healthProfessionalUsers);
    let businessUsers = await MockData.createMockBusinessUsers(true, 1500);
    console.log("Business Users created");
    let businessUsersRaw = getRawUserData(businessUsers);

    const fields = ['userType', 'email', 'password', "id"];
    const opts = {fields};

    try {
        const csv = parse([].concat(registeredGeneralPublicUsersRaw, businessUsersRaw, healthProfessionalUsersRaw), opts);
        const path = 'users_raw.csv';
        fs.writeFile(path, csv, function (err, data) {
        });
    } catch (err) {
        console.error(err);
    }
    console.log("users file created");

    let generalPublicUsers = await MockData.createMockGeneralPublicUsers(true, 10000);
    console.log("general public users created")


    for (let i = 0; i < Math.min(registeredGeneralPublicUsers.length, generalPublicUsers.length); i++) {
        let checkins = [];
        let positiveCases = [];
        let vaccinationRecords = [];
        let rUser = registeredGeneralPublicUsers[i];
        let gUser = generalPublicUsers[i];
        for (let _ of Array(faker.datatype.number({
            'min': 0,
            'max': 20
        }))) {
            checkins.push(...await MockData.createMockCheckIns(false, faker.datatype.number({
                'min': 1,
                'max': 5
            }), rUser, businessUsers[faker.datatype.number({
                'min': 0,
                'max': businessUsers.length - 1
            })].business, USER_TYPE.GENERAL));

            checkins.push(...await MockData.createMockCheckIns(false, faker.datatype.number({
                'min': 1,
                'max': 5
            }), gUser, businessUsers[faker.datatype.number({
                'min': 0,
                'max': businessUsers.length - 1
            })].business));
        }
        if (faker.datatype.number({
            'min': 0,
            'max': 100
        }) === 0) {
            positiveCases.push(...await MockData.createMockPositiveCases(false, 1, rUser));
            positiveCases.push(...await MockData.createMockPositiveCases(false, 1, gUser));
        }
        if (faker.datatype.number({
            'min': 0,
            'max': 5
        }) === 0) {
            vaccinationRecords.push(...await MockData.createMockVaccinationRecord(false, 1, rUser));
        }
        await CheckIn.insertMany(checkins);
        //console.log("checkins created");
        await PositiveCase.insertMany(positiveCases);
        //console.log(positiveCases);
        //console.log("positive cases created")
        await VaccinationRecord.insertMany(vaccinationRecords);
        //console.log("vaccination records created");
    }

    await MockData.createMockVaccinationCentres(true, 1000);
    console.log("dev data created");
}

module.exports = {
    MockData,
    createDevData
}