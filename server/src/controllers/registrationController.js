import { Registration } from "../models/Registration.js";

// @desc    Store new event registration
// @route   POST /api/registrations
// @access  Public
export const createRegistration = async (req, res) => {
  try {
    const {
      name,
      rollNo,
      department,
      phone,
      email,
      selectedEvents,
      isTeamRegistration,
      teamName,
      teamMembers,
    } = req.body;

    // Validation
    if (!name || !rollNo || !department || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required participant fields.",
      });
    }

    if (!selectedEvents || !Array.isArray(selectedEvents) || selectedEvents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one event.",
      });
    }

    // Save registration to database
    const newRegistration = await Registration.create({
      name,
      rollNo,
      department,
      phone,
      email,
      selectedEvents,
      isTeamRegistration: Boolean(isTeamRegistration),
      teamName: teamName || "",
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
    });

    return res.status(201).json({
      success: true,
      message: "Registration stored successfully!",
      data: newRegistration,
    });
  } catch (error) {
    console.error("[Registration Error]:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error storing registration.",
    });
  }
};
