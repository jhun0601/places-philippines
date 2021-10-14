const express = require("express");
const router = express.Router();

const usersControllers = require("../controllers/users-controller");
const USERS = [
  {
    id: 1,
    first_name: "Jhunmark",
    last_name: "Ng",
  },
];
router.get("/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const users = USERS.find((u) => {
    return (u.id = userId);
  });

  res.json({ users });
});

router.get("/:uid", placesControllers.getPlaceById);

module.exports = router;
