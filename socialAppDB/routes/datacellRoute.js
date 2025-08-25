import { Router } from "express";
import multer from "multer";
import { updateAttendance, getCourses, getCourseAttendance } from "../controllers/datacellController.js";
import path from "path"
const destination = "/static/application";

const storage = multer.diskStorage({
    destination: `.${destination}`,
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
        cb(
            null,
            `${file.fieldname}_${uniqueSuffix}${path.extname(file.originalname)}`
        );
    },
});

const attachements = multer({ storage });
const router = Router();

router.post(
    "/updateAttendance",
    attachements.single("attendance"),
    async (req, res) => {
        const filePath = `/${req.file?.path.replaceAll("\\", "/")}`;

        const result = await updateAttendance(filePath/*, req.body.threshold*/);

        if (result) return res.json({ success: true });

        return res.status(422).json({ message: "Invalid File Format!" });
    }
);
router.get("/getCourses/:regno", getCourses);
router.get("/getCourseAttendance/:regno/:course", getCourseAttendance);

export default router;