function findByJobTitles(titles) {
    return db.collection.find({
      "job_position.title": { $in: titles }
    });
  }
 
  function findByNamePattern(firstNamePattern, lastNamePattern) {
    return db.collection.find({
      "first_name": { $regex: firstNamePattern, $options: "i" },
      "last_name": { $regex: lastNamePattern, $options: "i" }
    }).sort({ "last_name": 1, "first_name": 1 });
  }
 
  function findBySalaryRange(minSalary, maxSalary) {
    return db.collection.find({
      "job_position.salary": {
        $gte: minSalary,
        $lte: maxSalary
      }
    });
  }
 
  function findTopEarners(n) {
    return db.collection.aggregate([
      { $sort: { "job_position.salary": -1 } },
      { $limit: n }
    ]);
  }
 
  function findByHobbies(hobbyList) {
    return db.collection.find({
      hobbies: { $in: hobbyList }
    });
  }
 
  function findByHobbyCount(minCount) {
    return db.collection.find({
      $expr: {
        $gte: [{ $size: "$hobbies" }, minCount]
      }
    });
  }
 
  function insertPeople(peopleArray) {
    return db.collection.insertMany(peopleArray);
  }
 
  function deleteUnemployed() {
    return db.collection.deleteMany({
      "job_position": { $exists: false }
    });
  }
 
  function increaseSalary(maxSalary, increaseBy) {
    return db.collection.updateMany(
      { "job_position.salary": { $lt: maxSalary } },
      { $inc: { "job_position.salary": increaseBy } }
    );
  }