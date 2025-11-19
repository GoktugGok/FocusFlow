import { Router } from "express";
import Lofi from "../models/Lofi.js";
import { authenticateToken } from "../../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /lofis:
 *   post:
 *     summary: Create a new Lofi (Authenticated Users Only)
 *     description: Create a new lofi track. Requires authentication.
 *     tags: [Lofis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - artist
 *               - category
 *               - audioUrl
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Chill Lofi Beat"
 *               artist:
 *                 type: string
 *                 example: "Lofi Producer"
 *               category:
 *                 type: string
 *                 example: "study"
 *                 enum: [study, chill, sleep, focus]
 *               audioUrl:
 *                 type: string
 *                 example: "https://example.com/audio.mp3"
 *               videoUrl:
 *                 type: string
 *                 example: "https://example.com/video.mp4"
 *               coverImg:
 *                 type: string
 *                 example: "https://example.com/cover.jpg"
 *     responses:
 *       201:
 *         description: Lofi created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lofi created successfully"
 *                 lofi:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                     title:
 *                       type: string
 *                       example: "Chill Lofi Beat"
 *                     artist:
 *                       type: string
 *                       example: "Lofi Producer"
 *                     category:
 *                       type: string
 *                       example: "study"
 *                     audioUrl:
 *                       type: string
 *                       example: "https://example.com/audio.mp3"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-09-01T12:00:00.000Z"
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const lofi = new Lofi({
      ...req.body,
      createdBy: req.user.userId
    });

    await lofi.save();

    req.io.emit("lofiCreated", lofi);

    res.json(lofi);
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

/**
 * @swagger
 * /lofis:
 *   get:
 *     summary: Get all Lofi tracks
 *     description: Retrieve all lofi tracks. Public endpoint - no authentication required.
 *     tags: [Lofis]
 *     responses:
 *       200:
 *         description: List of all lofi tracks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 lofis:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                       title:
 *                         type: string
 *                         example: "Chill Lofi Beat"
 *                       artist:
 *                         type: string
 *                         example: "Lofi Producer"
 *                       category:
 *                         type: string
 *                         example: "study"
 *                       audioUrl:
 *                         type: string
 *                         example: "https://example.com/audio.mp3"
 */
router.get("/", async (req, res) => {
  try {
    const lofis = await Lofi.find();
     res.json(lofis);
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

/**
 * @swagger
 * /lofis/{id}:
 *   delete:
 *     summary: Delete a Lofi track (Authenticated Users Only)
 *     description: Delete a specific lofi track. Requires authentication.
 *     tags: [Lofis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lofi ID
 *     responses:
 *       200:
 *         description: Lofi deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lofi not found
 */
router.delete("/:id",authenticateToken, async (req, res) => {
  try {
    const deletedLofi = await Lofi.findByIdAndDelete(req.params.id.trim());
    if (!deletedLofi) return res.status(404).json({ message: "Lofi not found" })
    
    req.io.emit("lofiDeleted", deletedLofi._id);

    res.json({
      success: true,
      message: "Lofi deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

/**
 * @swagger
 * /lofis/{id}:
 *   put:
 *     summary: Update a Lofi track (Authenticated Users Only)
 *     description: Update a specific lofi track. Requires authentication.
 *     tags: [Lofis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lofi ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lofi updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lofi not found
 */
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updatedLofi = await Lofi.findByIdAndUpdate(req.params.id.trim(), req.body, { new: true });

    if (!updatedLofi) {
      return res.status(404).json({ message: "Lofi not found" });
    }

    req.io.emit("lofiUpdated", updatedLofi);

    res.json({
      success: true,
      message: "Lofi updated successfully",
      updatedLofi
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lofi = await Lofi.findOne({ _id: req.params.id });
    if (!lofi) return res.status(404).json({ message: "Lofi not found" });
    res.json(lofi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
