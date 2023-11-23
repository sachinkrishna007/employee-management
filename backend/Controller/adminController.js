import asyncHandler from "express-async-handler";
import Employee from "../models/EmployeeModel.js";
import Admin from "../models/adminModel.js";
import AdmingenarateToken from "../utils/adminGenerateToken.js";
import cloudinary from "../config/cloudinary.js";
const adminAuth = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    AdmingenarateToken(res, admin._id);

    res.json({
      _id: admin._id,

      email: admin.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});


  const registerUser = asyncHandler(async (req, res) => {
    console.log('here');
    console.log(req.body);
    const {
      name,
      email,
      password,
      profileImage,
      gender,
      courses,
      mobile,
      designation,
    } = req.body;
    const result = await cloudinary.uploader.upload(profileImage, {
      folder: "profilepic",
    });
    const userExists = await Employee.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await Employee.create({
      name,
      email,
      password,
      profileImageName: result.secure_url,
      mobile,
      gender,
      courses,
      designation,
    });

    if (user) {
    

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  });


const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const AdminExists = await Admin.findOne({ email });

  if (AdminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const admin = await Admin.create({
    email,
    password,
  });

  if (admin) {
    AdmingenarateToken(res, admin._id);

    res.status(201).json({
      _id: admin._id,

      email: admin.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "loggout successful" });
});

const getUsers = asyncHandler(async (req, res) => {
  const userData = await Employee.find({});
  if (userData) {
    res.status(200).json({ userData });
  } else {
    res.status(404);

    throw new Error("Users data fetch failed.");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  const deletedUser = await Employee.findByIdAndDelete(userId);
  if (deletedUser) {
    res.status(200).json("sucesss");
  } else {
    res.status(404);

    throw new Error("user delete failed");
  }
});
const BlockUser = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  console.log(userId);
  const BlockUser = await Employee.findByIdAndUpdate(userId, { isBlocked: true });
  console.log(BlockUser);
  if (BlockUser) {
    res.status(200).json({success:true});
  } else {
    res.status(404);

    throw new Error("user delete failed");
  }
});
const UnBlockUser = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  const UNBlockUser = await Employee.findByIdAndUpdate(userId, {
    isBlocked: false,
  });
  if (UNBlockUser) {
    res.status(200).json({ success: true });
  } else {
    res.status(404);

    throw new Error("user delete failed");
  }
});

const updateUserData = async (req, res) => {
  console.log(req.body);
  try {
    const {
      userId,
      name,
      email,
      password,
      profileImage,
      gender,
      courses,
      mobile,
      designation,
    } = req.body;

    if (!userId) {
      res.status(404);
      throw new Error("UserId not received in request. User update failed.");
    }
    const result = await cloudinary.uploader.upload(profileImage, {
      folder: "profilepic",
    });
 console.log("Cloudinary Result:", result);
    const user = await Employee.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    user.name = name;
    user.email = email;
    user.mobile = mobile;
    user.profileImageName=result.secure_url,
    user.gender=gender
    user.courses=courses
    user.designation=designation

    await user.save();

    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "User update failed." });
  }
};

    

export {
  adminAuth,
  registerAdmin,
  registerUser,
  logout,
  getUsers,
  deleteUser,
  updateUserData,
  BlockUser,
  UnBlockUser,
};
