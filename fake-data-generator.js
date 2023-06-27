const fs = require("fs");
const faker = require("faker");

const generateDummyData = (count) => {
  const dummyDataArray = [];

  for (let i = 0; i < count; i++) {
    const dummyData = {
      "SET POINT HIGH HIGH": faker.datatype.float({ min: 150, max: 170 }),
      sapParentAvevaExternalId: faker.datatype.uuid(),
      "SAP OBJECT TYPE": faker.random.arrayElement([
        "IP-TIUT",
        "IP-KJPT",
        "IP-IOFT",
      ]),
      "HAZARDOUS ATEX MARKING": faker.random.arrayElement([
        "II 1 G",
        "II 2 G",
        "II 3 G",
        "II 4 F",
        "II 6 HJ",
        "II 9 GIJO",
        "II 39 OI",
        "II 12 oiu",
      ]),
      "PART NUMBER": faker.random.alphaNumeric(10),
      source: faker.random.arrayElement(["aveva", "sap", "external", "ION"]),
      flocBarrierElementPrimary: faker.random.alphaNumeric(12),
      "CALIBRATED RANGE MAX_UOM": faker.random.arrayElement([
        "oC",
        "oF",
        "PoC",
      ]),
      "SERIAL NUMBER": faker.datatype.uuid(),
      "SIGNAL TYPE": faker.random.arrayElement(["4-20mA", "0-10V", "Modbus"]),
      "HAZARDOUS AREA CERT NUMBER": faker.random.alphaNumeric(12),
      createdTime: faker.date.past().toISOString(),
      "SUPPLY CODE": faker.random.arrayElement(["NA", "EU", "ASIA"]),
      state: faker.random.number({ min: 0, max: 1 }).toString(),
      id: faker.datatype.number({ min: 8000000, max: 9000000 }),
      flocFunctionalLocation: faker.random.alphaNumeric(10),
      "WEIGHT (DRY)": faker.datatype.float({ min: 2.0, max: 3.0 }),
      "MODEL NUMBER": faker.random.alphaNumeric(7),
      "I/O TYPE": faker.random.arrayElement(["AI", "AO", "DI", "DO"]),
      System: faker.random.arrayElement([
        "21: CRUDE HANDLING AND METERING",
        "22: GAS PROCESSING",
        "23: UTILITIES",
        "44: Some other sys",
        "77: Ventisjon Sys",
      ]),
      "HAZARDOUS AREA TEMP RATING (AS REQUIRED)": faker.random.arrayElement([
        "T6",
        "T5",
        "T4",
      ]),
      "PARENT TAG": faker.random.alphaNumeric(10),
      flocSystemId: faker.datatype.number({ min: 1, max: 100 }),
      "SET POINT HIGH HIGH_UOM": faker.random.arrayElement([
        "oC",
        "oF",
        "oL",
        "iY",
      ]),
      flocLocation: faker.random.alphaNumeric(4),
      "SAP CATALOG PROFILE": faker.random.alphaNumeric(8),
      "FIRE AREA": faker.random.alphaNumeric(4),
      "CALIBRATED RANGE MAX": faker.datatype.float({ min: 180, max: 220 }),
      "LAST MAINTENANCE DATE": faker.date.past().toISOString(),
      "CALIBRATION DATE": faker.date.past().toISOString(),
      "LAST INSPECTION DATE": faker.date.past().toISOString(),
    };
    dummyDataArray.push(dummyData);
  }

  return dummyDataArray;
};

const dummyDataArray = generateDummyData(10000); // Change the count to the desired number of dummy data documents

const jsonData = JSON.stringify(dummyDataArray, null, 2);
fs.writeFileSync("dummy_data.json", jsonData);
console.log("Dummy data has been saved to dummy_data.json");
