const {
  addNewGroupAndAddRights,
  addRightsToGroup,
  getGroupAndNavbarById,
  updateGroup,
  deleteGroup,
  deleteRoleForGroup,
  getAllGroups,
  getAllRightsAndNavbars,
  addNavbarAGroupRel,
  removeNavbarAGroupRel
} = require("./service");

module.exports = {
  addNewGroupAndAddRights: async function (req, res) {
    try {
      const { name, rightId = [], navbarIDs = [] } = req.body;
      if (!name || !rightId.length || !navbarIDs.length) {
        return res.status(400).json({ message: "Input is incorrect" });
      }

      await addNewGroupAndAddRights(name, rightId, navbarIDs);
      return res.status(201).json({ message: "Group added" });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: err.message,
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
  getGroupAndNavbarById: async function (req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Input is incorrect" });
      }

      const group = await getGroupAndNavbarById(id);
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
      const { name, offset } = req.query;
      const groups = await getAllGroups(name, offset);
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
  getAllRightsAndNavbars: async function (req, res) {
    try {
      const rights = await getAllRightsAndNavbars()
      return res.status(200).json(rights);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: "Ups... Something went wrong!",
      });
    }
  },
  getNavbars: async (req, res) => {
      try {
          const { name, offset } = req.query;
          const result = await getNavbars(name, offset);
          result.success = true;

          return res.status(200).send(result);
      } catch(err) {
          console.log(err);
          return res.status(500).send({
              success: false,
              message: "Ups... Something went wrong!"
          });
      }
  },
  addNavbarAGroupRel: async (req, res) => {
      try {
          const { nav_id, agroup_id} = req.body;
          await addNavbarAGroupRel(nav_id, agroup_id);
          return res.status(200).send({
            success: true
          });
      } catch (err) {
          console.log(err);
          return res.status(500).send({
              success: false,
              message: "Ups... Something went wrong!"
          });
      }
  },
  removeNavbarAGroupRel: async (req, res) => {
      try {
          const { nav_id, agroup_id} = req.body;
          await removeNavbarAGroupRel(nav_id, agroup_id);
          return res.status(200).send({
            success: true
          });
      } catch (err) {
          console.log(err);
          return res.status(500).send({
              success: false,
              message: "Ups... Something went wrong!"
          });
      }
  }
};
