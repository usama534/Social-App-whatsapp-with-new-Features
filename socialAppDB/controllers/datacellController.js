import { StudentAttendance } from "../database/models/models.js";
import { parseAttendance } from "../xlparser.js";

export const updateAttendance = async (filePath /*, threshold*/) => {
    let attendanceData = await parseAttendance(filePath, 75);

    if (!attendanceData) return undefined;

    await StudentAttendance.bulkWrite(attendanceData, { ordered: false });

    return true;
};
export const getCourses = async (req, res) => {
    try {
        const data = await StudentAttendance.find({ regno: req.params.regno })
            .select("course percentage isShort");
        return res.json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch attendance." });
    }
};

// Detailed attendance for a specific course
export const getCourseAttendance = async (req, res) => {
    try {
        const detail = await StudentAttendance.findOne({
            regno: req.params.regno,
            course: req.params.course,
        });

        if (!detail) return res.status(404).json({ message: "Not found" });
        return res.json(detail);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch attendance detail." });
    }
};