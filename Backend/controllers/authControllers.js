
export const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.json({ message: "Logged out" });
};
