import { Router } from "express";
import path from "path";
import multer, { diskStorage } from "multer";

import communityController from "../controllers/communityController.js";

let destination = "/static/community"
const storage = diskStorage({
  destination: "." + destination,
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}_${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});


const router = Router();

const communityAvatars = multer({ storage });

router.get("/", (req, res) => res.send("Y"));

router.post("/newCommunity/:createrId", communityAvatars.single("image"), async (req, res) => {
  let id = await communityController.newCommunity(
    req.params.createrId,
    req.body.title,
    req.file ? `${destination}/${req.file.filename}` : undefined,
    req.body.about
  );

  return res.json({ id, message: "Community Created!" });
});

router.post("/addGroup/:cid", async (req, res) => {
  await communityController.addGroupToCommunity(
    req.params.cid,
    req.body.type,
    req.body.gid
  );
  return res.json({ message: "success" });
});

// ✅
router.post("/addMember/:cid/:uid", async (req, res) => {
  await communityController.addMember(req.params.cid, req.params.uid);
  return res.json({ message: "success" });
});

// ✅
router.get("/getCommunity/:cid/:rid", async (req, res) => {
  return res.json(
    await communityController.getCommunity(req.params.cid, req.params.rid)
  );
});

router.get("/getCommunities/:uid", async (req, res) => {
  return res.json(
    await communityController.getCommunities(req.params.uid)
  );
});


// ✅
router.post("/addAdmins/:cid", async (req, res) => {
  await communityController.addAdmins(req.params.cid, req.body.admins);
  return res.json({ message: "Admins Added!" });
});

// ✅
router.post("/removeAdmins/:cid", async (req, res) => {
  await communityController.removeAdmins(req.params.cid, req.body.admins);
  return res.json({ message: "Admins Removed!" });
});


// ✅
router.put("/leaveCommunity/:cid/:uid", async (req, res) => {
  await communityController.leaveCommunity(req.params.cid, req.params.uid);
  return res.json({ message: "success" });
});


///

router.get("/getCommunities/:uid", async (req, res) => {
  return res.json(await communityController.getCommunities(req.params.uid));
});

router.get("/getAdmins/:cid", async (req, res) => {
  try {
    const admins = await communityController.getCommunityAdmins(req.params.cid);
    return res.json({ success: true, admins });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch community admins",
      error: error.message
    });
  }
});

router.get("/getMembers/:cid", async (req, res) => {
  try {
    const members = await communityController.getCommunityMembers(req.params.cid);
    return res.json({ success: true, members });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch community members",
      error: error.message
    });
  }
});

router.post("/removeGroup/:cid", async (req, res) => {
  const { type, gid } = req.body;

  try {
    await communityController.removeGroupFromCommunity(
      req.params.cid,
      type,
      gid
    );
    return res.json({
      success: true,
      message: `${type} removed from community successfully`
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Failed to remove ${type} from community`,
      error: error.message
    });
  }
});

router.put(
  "/editCommunity/:cid",
  communityAvatars.single("image"),
  async (req, res) => {
    try {
      const { title, aboutCommunity } = req.body;
      const imgUrl = req.file
        ? `/${req.file.path.replaceAll("\\", "/")}`
        : undefined;

      await communityController.editCommunity(req.params.cid, {
        title,
        aboutCommunity,
        imgUrl,
      });

      return res.json({
        success: true,
        message: "Community updated successfully!",
      });
    } catch (error) {
      console.error("Edit Community Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update community",
        error: error.message,
      });
    }
  }
);
router.get("/getCommunityGroups/:cid", async (req, res) => {
  return res.json(await communityController.getCommunityGroups(req.params.cid));
});

router.get("/getAllGroupChats/:uid", async (req, res) => {
  try {
    const data = await chatGroupController.getAllGroupChats(req.params.uid);
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
