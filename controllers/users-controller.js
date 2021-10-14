const getUsers = (req, res, next) => {
  const userId = req.params.uid;
  const users = USERS.find((u) => {
    return (u.id = userId);
  });

  res.json({ users });
};

exports.getUsers = getUsers;
