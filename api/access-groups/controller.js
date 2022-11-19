const {
  addNewGroup,
  addRightsToGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  deleteRoleForGroup,
  getAllGroups,
  getAllRights
} = require("./service");

module.exports = {
  addNewGroup: async function (req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Input is incorrect" });
      }

      await addNewGroup(name);
      return res.status(201).json({ message: "Group added" });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: "Ups... Something went wrong!",
      });
    }
  },
  addRightsToGroup: async function (req, res) {
    try {
      const { groupId, rightId } = req.body;
      if (!groupId || !rightId) {
        return res.status(400).json({ message: "Input is incorrect" });
      }

      await addRightsToGroup(groupId, rightId);
      return res.status(201).json({ message: "Right added for this group." });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: "Ups... Something went wrong!",
      });
    }
  },
  getGroupById: async function (req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Input is incorrect" });
      }

      const group = await getGroupById(id);
      return res.status(200).json(group);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: "Ups... Something went wrong!",
      });
    }
  },
  getAllGroups: async function (req, res) {
    try {
      const groups = await getAllGroups();
      return res.status(200).json(groups);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: "Ups... Something went wrong!",
      });
    }
  },
  updateGroup: async function (req, res) {
    try {
      const { id, name } = req.body;
      if (!id || !name) {
        return res.status(400).json({ message: "Input is incorrect" });
      }

      await updateGroup(id, name);
      return res.status(204).json({ message: "Group updated" });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: "Ups... Something went wrong!",
      });
    }
  },
  deleteGroup: async function (req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Input is incorrect" });
      }

      await deleteGroup(id);
      return res.status(204).json({ message: "Group deleted" });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: "Ups... Something went wrong!",
      });
    }
  },
  deleteRoleForGroup: async function (req, res) {
    try {
      const { groupId, rightId } = req.body;
      if (!groupId || !rightId) {
        return res.status(400).json({ message: "Input is incorrect" });
      }

      await deleteRoleForGroup(groupId, rightId);
      return res.status(204).json({ message: "Right deleted for this group." });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: "Ups... Something went wrong!",
      });
    }
  },
  getAllRights: async function (req, res) {
    try {
      const rights = await getAllRights()
      return res.status(200).json(rights);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: "Ups... Something went wrong!",
      });
    }
  }
};
