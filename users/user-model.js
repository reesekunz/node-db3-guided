const db = require("../data/db-config");
// SQL Translation: select * from posts as p
// join users as u on u.id = p.user_id
// where u.id = 2

// look at knexjs.org join methods for more info
function findUserPosts(id) {
  return (
    db("users")
      .join("posts", "users.id", "=", "posts.user_id")
      .where({ user_id: id })
      // knex was giving back user id instead of post id, so selecting the one that you want with this so the join order above doesnt matter
      // .select("posts.id", "posts.contents", "users.username")  => need to select if passing in db("posts") and joining("users") instead of the way we did it
      .then(posts => {
        return posts;
      })
  );
}

module.exports = {
  findUserPosts
};
