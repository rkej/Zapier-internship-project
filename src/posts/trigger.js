var url = require('url');
var authentication = require('../common/authentication.js');
var postRes = new Array();
module.exports = {
  key: 'post_trigger',
  noun: 'Post',
  display: {
  important: true,
    label: 'New Post',
    description: 'Triggers when a new post is added.'
  },
  operation: {
    inputFields: [{
      key: 'project_id',
      type: 'string',
      label: 'Fetch Post from my followers or a Team',
      helpText: 'If you do not select a Team, then by default company posts will be fetched',
      dynamic: 'hiddensearch.id.name', //dynamic field will make a dropdown list and also call the hidden(hs.js) trigger

    }],

    perform: (z, bundle) => { //perform call
      if (isNaN(bundle.inputData.project_id) == false) {
        const promise = z.request({
          url: 'https://{{bundle.authData.subdomain}}/api/posts.json',
          method: 'GET',
          params: {

            all_post: 'T', //T is True
            _token: bundle.authData.session_id,
            _secret: bundle.authData.session_hash,
            _user_id: bundle.authData.id, //must be an integer
            external_preview: 'Y',
            conversation_id: bundle.inputData.project_id,
          },

          headers: {
            'content-type': 'application/json'
          },
        });

        return promise.then((response) => {
          var errors = JSON.parse(response.content);
          if (errors.ms_errors) {
            var mess = JSON.parse(response.content);
            var err = mess.ms_errors.error.message

            throw new Error(err)
          } else if (response["json"]["ms_response"]["posts"].length == 0) {
            throw new Error("\n\nNo Post found!");
          } else {
            var post = response["json"]["ms_response"]["posts"];
            var postlength = post.length - 1;
            for (i = 0; i <= postlength; i++) {

              postRes[i] =
                //selective fields
                {
                  "id": post[i]["id"],
                  "title": post[i]["title"],
                  "created_name": post[i]["created_name"],
                  "creator_by": post[i]["creator_by"],
                  "team_id": post[i]["conversation_id"],
                  "team_name": post[i]["conversation_name"],
                  "mlink": post[i]["mlink"],
                  "content": post[i]["content"]
                }
            }

            return postRes;
          }
        });
      } else {
        const promise = z.request({
          url: 'https://{{bundle.authData.subdomain}}/api/posts.json',
          method: 'GET',
          params: {

            all_post: 'T', //T is True
            _token: bundle.authData.session_id,
            _secret: bundle.authData.session_hash,
            _user_id: bundle.authData.id, //must be an integer
            external_preview: 'Y',
          },

          headers: {
            'content-type': 'application/json'
          },
        });
        return promise.then((response) => {
          var errors = JSON.parse(response.content);
          if (errors.ms_errors) {
            var mess = JSON.parse(response.content);
            var err = mess.ms_errors.error.message;
            throw new Error(err)
          } else if (response["json"]["ms_response"]["posts"].length == 0) {
            throw new Error("\n\nNo Post found!");
          } else {

            var post = response["json"]["ms_response"]["posts"];

            var postlength = post.length - 1;
            for (i = 0; i <= postlength; i++) {

              postRes[i] =
                //selective fields
                {
                  "id": post[i]["id"],
                  "title": post[i]["title"],
                  "created_name": post[i]["created_name"],
                  "creator_by": post[i]["creator_by"],
                  "team_id": post[i]["conversation_id"],
                  "team_name": post[i]["conversation_name"],
                  "mlink": post[i]["mlink"],
                  "content": post[i]["content"]
                }
            }
            return postRes;
          }
        });

      }
    },
    sample: {
      "id": 1234, //sample data
      "title": "post",
      "created_name": "John",
      "creator_by": 112233,
      "team_id": 001122,
      "team_name": "team",
      "description": "this is a sample post"
    },
  }
};
