import User from "../Model/userModel.js";
import getdatauri from "../utils/datauri.js";
import cloudnary from "../Config/cloudnary.js";
import transporter from "../Config/nodemailer.js";
import { RefreshToken, AccessToken } from "../Middleware/generateToken.js";
import bcrypt from "bcryptjs";

const Userprofiler = {
  register: async (req, res) => {
    try {
      const { fname, lname, email, password } = req.body;

      if (!fname || !lname || !email || !password) {
        return res
          .status(400)
          .json({ message: "Please provide all required fields" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      let profilephotourl = null;
      if (req.file) {
        const parser = getdatauri(req.file);
        const cloudResponse = await cloudnary.uploader.upload(parser.content, {
          folder: "users-profiles",
        });
        profilephotourl = cloudResponse.secure_url;
      }
      const saltrounds =10;

      const hashedpassword = await bcrypt.hash(password, saltrounds);
      const user = new User({
        fname,
        lname,
        email,
        password: hashedpassword,
        profilephoto: profilephotourl,
      });
      await user.save();

      const mailOptions = {
        from: process.env.NODEMAILER_USERNAME,
        to: email,
        subject: "Registration Successful",
        text: `Thank you for registering with us. Your account has been created successfully.\nKindly verify your email using this link: ${process.env.CLIENT_URL}/verify_email/${user._id}`,
      };

      transporter.sendMail(mailOptions);

      res.status(201).json({
        message: `Thanks for registering, ${user.fname}`,
        success: true,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Please provide all required fields" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (user.status !== "active") {
        return res.status(403).json({ message: "Your account is not active" });
      }

      const accessToken = await AccessToken(user._id);
      const refreshToken = await RefreshToken(user._id);

      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

      const cookieOptions = {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      };

      res.cookie("AccessToken", accessToken, cookieOptions);
      res.cookie("RefreshToken", refreshToken, cookieOptions);

      res.status(201).json({
        message: `Welcome back, ${user.fname}`,
        success: true,
        data: {
          id: user._id,
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          lastLogin: user.lastLogin,
          refresh_Token: user.refresh_Token,
        },
        AccessToken: accessToken,
        RefreshToken: refreshToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  updateprofile: async (req, res) => {
    try {
      const { fname, lname, email, phone } = req.body;

      const userId = req.user; 

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const file = req.file;
      if (file) {
        const parser = getdatauri(file);
        const cloudResponse = await cloudnary.uploader.upload(parser.content, {
          folder: "users-profiles",
        });
        user.profilephoto = cloudResponse.secure_url;
      }

      if (fname) user.fname = fname;
      if (lname) user.lname = lname;
      if (email) user.email = email;
      if (phone) user.phone = phone;

      await user.save();

      res.status(201).json({
        message: `Thanks for updated profile ${user.fname}`,
        success: true,
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  
};

export default Userprofiler;
