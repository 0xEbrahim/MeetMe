import { Query } from "mongoose";

class ApiFeatures<T> {
  private query: Query<T[], T>;
  private queryString: Record<string, any>;
  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  paginate = () => {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 30;
    const skip = limit * (page - 1);
    this.query = this.query.find().skip(skip).limit(limit);
    return this;
  };

  sort = () => {
    if (this.queryString.sort) {
      let { sort } = this.queryString;
      sort = sort.split(",").join(" ");
      this.query = this.query.sort(sort);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  };

  limit = () => {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  };

  filter = () => {
    const exec = ["page", "sort", "limit", "fields"];
    const queryObj = { ...this.queryString };
    exec.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  };

  exec = async () => {
    const docs = await this.query.exec();
    return docs;
  };
}

export default ApiFeatures;
