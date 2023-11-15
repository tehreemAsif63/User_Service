import mongoose, { SchemaDefinition } from "mongoose";

export type Unboxed<T> = T extends String
  ? string
  : T extends Number
  ? number
  : T extends Boolean
  ? boolean
  : T;

  export type MongooseModel<Schema extends mongoose.SchemaDefinition> = {
  [K in keyof Schema]: Schema[K] extends (infer T)[] //Array
    ? T extends SchemaDefinition
      ? MongooseModel<T>[] //Nested schema
      : MappedField<T>[]
    : Schema[K] extends { type: MapConstructor; of: infer V } //Map type
    ? Record<string | number, V>
    : Schema[K] extends SchemaDefinition //Nested schema
    ? MongooseModel<Schema[K]>
    : MappedField<Schema[K]>;
};

export type MappedField<F> = F extends { type: infer T }
  ? T extends new (...args: any) => infer S
    ? Unboxed<S>
    : T
  : F extends new (...args: any) => infer T
  ? Unboxed<T>
  : boolean;

  