class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //BUILD QUERY
  const queryObj = {...this.queryString};
  //even if someone sends queries regarding page sort limit fields, we will be discarding them.
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]); 

  //ADVANCED FILTERING - necessary to pass the advanced filtering parameters like gte gt lte lt because we need to convert them into 'gte' -> '$gte' to make them work in mongoose.
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  // console.log(JSON.parse(queryStr));
    
  // let query = Tour.find(JSON.parse(queryStr));
   this.query = this.query.find(JSON.parse(queryStr));
  // console.log(req.query, queryObj);
  return this;
  }

  sort() {
    //SORTING BY PRICE, THEN IF TIE, THEN BY RATINGSAVERAGE
  if(this.queryString.sort) {
    const sortBy = this.queryString.query.sort.split(',').join(' ');
    this.query = this.query.sort(sortBy);
  } else {
    this.query = this.query.sort('-createdAt'); //if user doesn't provide a sorting method, we sort the results in descending order of createdAt, so that the newest tour appears first.
  }
  return this;
  }

  paginate() {
    //PAGINATION
  const page = this.queryString.page * 1 || 1;
  const limit = this.queryString.limit * 1 || 100;
  const skip = (page - 1) * limit;

  //page=3&limit=10, 1-10 : page-1, 11-20 : page-2 ...
  this.query = this.query.skip(skip).limit(limit);

  return this;
  }
}

module.exports = APIFeatures;