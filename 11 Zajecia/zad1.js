const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/peopleDB', {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB:', err.message);
    console.log('Please make sure MongoDB is running on localhost:27017');
    process.exit(1);
  });

const personSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  gender: String,
  birth_date: Date,
  pesel: String,
  hobbies: [String],
  address: {
    locality: String,
    street: String,
    house_number: Number,
    postal_code: String
  },
  job_position: {
    title: String,
    salary: Number
  }
});

const Person = mongoose.model('Person', personSchema, 'people');

// 1. Find city with most people of specified gender
async function cityWithMostPeopleByGender(gender) {
  try {
    const result = await Person.aggregate([
      { $match: { gender: gender } },
      { $group: { _id: "$address.locality", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    if (result.length === 0) return { city: "No data", count: 0 };
    return { city: result[0]._id, count: result[0].count };
  } catch (err) {
    console.error('Error in cityWithMostPeopleByGender:', err.message);
    return null;
  }
}

// 2. Find city with least people born in specified month
async function cityWithLeastPeopleByBirthMonth(month) {
  try {
    const result = await Person.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$birth_date" }, month] } } },
      { $group: { _id: "$address.locality", count: { $sum: 1 } } },
      { $sort: { count: 1 } },
      { $limit: 1 }
    ]);

    if (result.length === 0) return { city: "No data", count: 0 };
    return { city: result[0]._id, count: result[0].count };
  } catch (err) {
    console.error('Error in cityWithLeastPeopleByBirthMonth:', err.message);
    return null;
  }
}

// 3. Count people living in multi-apartment buildings
async function countPeopleInApartments() {
  try {
    const result = await Person.aggregate([
      { $match: { "address.apartment_number": { $exists: true, $ne: null } } },
      { $count: "peopleInApartments" }
    ]);

    return result.length > 0 ? result[0].peopleInApartments : 0;
  } catch (err) {
    console.error('Error in countPeopleInApartments:', err.message);
    return null;
  }
}

// 4. Find city with most unemployed adults
async function cityWithMostUnemployedAdults() {
  const today = new Date();
  const adultDate = new Date(today);
  adultDate.setFullYear(adultDate.getFullYear() - 18);

  try {
    const result = await Person.aggregate([
      {
        $match: {
          birth_date: { $lte: adultDate },
          "job_position.title": { $exists: false }
        }
      },
      { $group: { _id: "$address.locality", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    if (result.length === 0) return { city: "No data", count: 0 };
    return { city: result[0]._id, count: result[0].count };
  } catch (err) {
    console.error('Error in cityWithMostUnemployedAdults:', err.message);
    return null;
  }
}

// 5. Find positions and count people from specified cities
async function positionsByCities(cities) {
  try {
    const result = await Person.aggregate([
      {
        $match: {
          "address.locality": { $in: cities },
          "job_position.title": { $exists: true }
        }
      },
      { $group: { _id: "$job_position.title", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return result.map(item => ({ position: item._id, count: item.count }));
  } catch (err) {
    console.error('Error in positionsByCities:', err.message);
    return null;
  }
}

// 6. Find cities with minimum number of people
async function citiesByPopulation(minPopulation) {
  try {
    const result = await Person.aggregate([
      { $group: { _id: "$address.locality", count: { $sum: 1 } } },
      { $match: { count: { $gte: minPopulation } } },
      { $sort: { count: -1 } }
    ]);

    return result.map(item => ({ city: item._id, population: item.count }));
  } catch (err) {
    console.error('Error in citiesByPopulation:', err.message);
    return null;
  }
}

// 7. Find cities with average salary
async function citiesByAverageSalary(minAvgSalary) {
  try {
    const result = await Person.aggregate([
      {
        $addFields: {
          effectiveSalary: { $ifNull: ["$job_position.salary", 0] }
        }
      },
      {
        $group: {
          _id: "$address.locality",
          avgSalary: { $avg: "$effectiveSalary" }
        }
      },
      { $match: { avgSalary: { $gte: minAvgSalary } } },
      { $sort: { avgSalary: -1 } }
    ]);

    return result.map(item => ({
      city: item._id,
      averageSalary: Math.round(item.avgSalary * 100) / 100
    }));
  } catch (err) {
    console.error('Error in citiesByAverageSalary:', err.message);
    return null;
  }
}

// 8. Find hobbies not in the excluded list
async function hobbiesNotInList(excludedHobbies) {
  try {
    const result = await Person.aggregate([
      { $unwind: "$hobbies" },
      { $match: { hobbies: { $nin: excludedHobbies } } },
      { $group: { _id: "$hobbies", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return result.map(item => ({ hobby: item._id, count: item.count }));
  } catch (err) {
    console.error('Error in hobbiesNotInList:', err.message);
    return null;
  }
}

// 9. Find total hobbies by cities in list
async function totalHobbiesByCities(cities) {
  try {
    const result = await Person.aggregate([
      { $match: { "address.locality": { $in: cities } } },
      {
        $project: {
          locality: "$address.locality",
          hobbyCount: { $size: { $ifNull: ["$hobbies", []] } }
        }
      },
      {
        $group: {
          _id: "$locality",
          totalHobbies: { $sum: "$hobbyCount" }
        }
      },
      { $sort: { totalHobbies: -1 } }
    ]);

    return result.map(item => ({ city: item._id, totalHobbies: item.totalHobbies }));
  } catch (err) {
    console.error('Error in totalHobbiesByCities:', err.message);
    return null;
  }
}

// Execute and test all functions
async function runAllQueries() {
  try {
    console.log("1. City with most females:", await cityWithMostPeopleByGender("k"));
    console.log("2. City with least people born in January:", await cityWithLeastPeopleByBirthMonth(1));
    console.log("3. People living in apartments:", await countPeopleInApartments());
    console.log("4. City with most unemployed adults:", await cityWithMostUnemployedAdults());
    console.log("5. Positions by cities:", await positionsByCities(["Gdańsk", "Władysławowo", "Tczew"]));
    console.log("6. Cities with at least 5 people:", await citiesByPopulation(5));
    console.log("7. Cities by average salary (min 3000):", await citiesByAverageSalary(3000));
    console.log("8. Hobbies excluding some:", await hobbiesNotInList(["joga", "paintball", "inwestowanie"]));
    console.log("9. Total hobbies by cities:", await totalHobbiesByCities(["Gdańsk", "Władysławowo", "Tczew"]));

    // Close connection after all operations
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error("Error running queries:", err);
  }
}

// Run all the queries
runAllQueries();