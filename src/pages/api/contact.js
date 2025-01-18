export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Only POST requests are allowed" });
  }
  try {
    const { name, email, subject, message } = JSON.parse(req.body);
    console.log(name, email, subject, message);
    res.status(201).json({ msg: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed" });
  }
};
