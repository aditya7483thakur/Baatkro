import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message) => {
  const token = jwt.sign({ _id: user._id }, "iweriouskjferio");
  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 20 * 60 * 1000,
      sameSite: "none",
      secure: true,
      path: "/",
    })
    .json({
      user: user.name,
      success: true,
      message,
    });
};
