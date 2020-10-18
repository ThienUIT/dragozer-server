module.exports = {
  multipleMongooseToObject(mongoose: any): object {
    return mongoose.map((mongoose: any) => mongoose.toObject());
  },
  mongooseToObject: function (mongoose: any): object {
    return mongoose ? mongoose.toObject() : mongoose;
  },
};
