import mongoose from "mongoose";
import bcrypt from "bcrypt";

const EmployeeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      
    },
    email: {
      type: String,
      required: true,
     
    },
    mobile: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      unique:false
    },
    gender: {
      type: String,
      unique:false
    
    },
  
    courses: {
      type: [String],
      unique:false
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
    profileImageName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
EmployeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;
