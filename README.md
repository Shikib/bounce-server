#Bounce Server
Repository for Bounce's server-side functionality.

###Documentation

####/api/post

get:

Description: Get the next 10 posts for a user. Only posts that were bounced within 10km are retrieved. Posts must also have been bounced within the last 24 hours.

Input: latitude, longitude, offset

Output: 10 post objects
Example:

```
$.get(hostName + '/api/post', {lat: 1, lng: 2, offset: 20}, function(posts) {
  console.log(posts);
});
```

post:

Description: Post a new post.

Input: text, user_id, latitude, longitude

Output: Confirmation
Example:

```
$.post(hostName + '/api/post', {text: "Bounce is awesome!", user_id: "4hkas91x", lat: 4, lng: 3}, function(message) {
  console.log(message);
});
```

####/api/bounce

post:

Description: Bounce a post with a given id. Updates the last bounce time of the post.

Input: post id, latitude, longitude, user id

Output: Confirmation Message
Example:

```
$.post(hostName + '/api/bounce', {lat: 1, lng: 2, user_id: "s8n33aacx", post_id: "41sacxa"}, function(message) {
  console.log(message);
});
```

get:

Description: Retrieve all of the posts bounced by a given user

Input: user id

Output: A list of posts that were bounced
Example:

```
$.get(hostName + '/api/bounce', {user_id: "s8n33aacx"}, function(posts) {
  console.log(posts);
});
```

####/api/my_posts

get:

Description: Retrieve all of the posts bounced by a given user

Input: user id

Output: A list of posts that were bounced
Example:

```
$.get(hostName + '/api/my_posts', {user_id: "s8n33aacx"}, function(posts) {
  console.log(posts);
});
```

###/api/post_bounces

Description: Retrieve all of the bounces for a given post

Input: post id

Output: A list of bounces for a post
Example:

```
$.get(hostName + '/api/post_bounces', {post_id: "s8nsadsadsaxxa33aacx"}, function(bounces) {
  console.log(bounces);
});
```
