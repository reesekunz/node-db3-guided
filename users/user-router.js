const express = require("express");

const db = require("../data/db-config.js");

const router = express.Router();

router.get("/", (req, res) => {
  db("users")
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to get users" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db("users")
    .where({ id })
    .then(users => {
      const user = users[0];

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "Could not find user with given id." });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to get user" });
    });
});

router.post("/", (req, res) => {
  const userData = req.body;

  db("users")
    .insert(userData)
    .then(ids => {
      res.status(201).json({ created: ids[0] });
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to create new user" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db("users")
    .where({ id })
    .update(changes)
    .then(count => {
      if (count) {
        res.json({ update: count });
      } else {
        res.status(404).json({ message: "Could not find user with given id" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to update user" });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db("users")
    .where({ id })
    .del()
    .then(count => {
      if (count) {
        res.json({ removed: count });
      } else {
        res.status(404).json({ message: "Could not find user with given id" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to delete user" });
    });
});

// GET at localhost:9000/api/users/2/posts

// SQL Translation: select * from posts as p
// join users as u on u.id = p.user_id
// where u.id = 2

// look at knex.js join methods for more info
router.get("/:id/posts", (request, response) => {
  const { id } = request.params;
  db("posts")
    .join("users", "users.id", "=", "posts.user_id")
    .where({ user_id: id })
    .then(posts => {
      response.status(200).json(posts);
    })
    .catch(error => {
      response.status(500).json({ message: "Failed to get user posts" });
    });
});

module.exports = router;
