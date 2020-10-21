export function multipleMongooseToObject(mongoose: any): object {
  return mongoose.map((mongoose: any) => mongoose.toObject());
}

export function mongooseToObject(mongoose: any): object {
  return mongoose ? mongoose.toObject() : mongoose;
}
