const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const contactsSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: "user",
  },
});

contactsSchema.plugin(mongoosePaginate);
const Contact = mongoose.model("contact", contactsSchema);

module.exports = Contact;
