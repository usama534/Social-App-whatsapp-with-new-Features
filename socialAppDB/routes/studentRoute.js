import express from "express";
import studentController from "../controllers/studentController.js";
import feedController from "../controllers/feedController.js";

const router = express.Router();

router.get("/getTimetable/:sid", async (req, res) => {
  return res.json(await studentController.getTimeTable(req.params.sid));
});

router.get("/datesheets/all", async (req, res) => {
  try {
    const dateSheets = await studentController.getAllDateSheets();
    res.json({
      success: true,
      data: dateSheets,
    });
  } catch (err) {
    console.error("Error fetching all date sheets:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
router.get("/getEnrolledCourses/:sid", async (req, res) => {
  try {
    const sid = req.params.sid;
    const courses = await studentController.getEnrolledCourses(sid);
    res.json(courses);
  } catch (err) {
    console.error("Error fetching enrolled courses:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getClassWall/:uid", async (req, res) => {
  return res.json(await feedController.getClassWallPosts(req.params.uid));
});

router.get("/getStudent/:uid", async (req, res) => {
  return res.json(await studentController.getStudentData(req.params.uid));
});

export default router;
