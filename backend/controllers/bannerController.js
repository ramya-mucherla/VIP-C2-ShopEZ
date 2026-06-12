const Banner = require("../models/Banner");
const ActivityLog = require("../models/ActivityLog");

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a banner (Admin only)
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
  try {
    const { title, image, linkUrl, active } = req.body;

    if (!title || !image) {
      return res.status(400).json({ message: "Title and image are required" });
    }

    const banner = new Banner({
      title,
      image,
      linkUrl,
      active: active !== undefined ? active : true,
    });

    const createdBanner = await banner.save();

    // Log Activity
    await ActivityLog.create({
      action: "New Banner Added",
      details: `Banner "${title}" was created.`,
      adminId: req.user?.id,
    });

    res.status(201).json(createdBanner);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a banner (Admin only)
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
  try {
    const { title, image, linkUrl, active } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    banner.title = title || banner.title;
    banner.image = image || banner.image;
    banner.linkUrl = linkUrl !== undefined ? linkUrl : banner.linkUrl;
    banner.active = active !== undefined ? active : banner.active;

    const updatedBanner = await banner.save();

    // Log Activity
    await ActivityLog.create({
      action: "Banner Updated",
      details: `Banner "${banner.title}" details were modified.`,
      adminId: req.user?.id,
    });

    res.json(updatedBanner);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a banner (Admin only)
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    await Banner.deleteOne({ _id: req.params.id });

    // Log Activity
    await ActivityLog.create({
      action: "Banner Deleted",
      details: `Banner "${banner.title}" was removed.`,
      adminId: req.user?.id,
    });

    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
