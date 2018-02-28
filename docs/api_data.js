define({ "api": [
  {
    "type": " get ",
    "url": "/oauth2/authorize/successRedirect",
    "title": "Get access code redirect",
    "version": "1.0.0",
    "name": "Authorize_Redirect",
    "group": "Auth",
    "permission": [
      {
        "name": "None"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "STRING",
            "optional": false,
            "field": "code",
            "description": "<p>the access code in query.code</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "code",
            "description": "<p>returns the access code</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n    \"code\": \"jk2q43jk2dsr4qqewfds_\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/auth.routes.js",
    "groupTitle": "Auth"
  },
  {
    "type": " get ",
    "url": "/auth/token",
    "title": "Check Authentication Token",
    "version": "1.0.0",
    "name": "Check_Auth_Token",
    "group": "Auth",
    "description": "<p>Ensures that the token provided in the Authenitcation header is valid and non expired.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Auth-Token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "status",
            "description": "<p>200</p>"
          }
        ]
      }
    },
    "filename": "src/routes/auth.routes.js",
    "groupTitle": "Auth"
  },
  {
    "type": " get ",
    "url": "/oauth2/authorize",
    "title": "Get permissions",
    "version": "1.0.0",
    "name": "Get_Authorization_Data",
    "group": "Auth",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>Here the client is asking permission to use the user's account. The response of the user should be sent to POST /oauth/authorize This endpoint will return the client, the user and a transaction ID</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "STRING",
            "optional": false,
            "field": "clientId",
            "description": "<p>the id of the client requesting access</p>"
          },
          {
            "group": "Parameter",
            "type": "STRING",
            "optional": false,
            "field": "response_type",
            "description": "<p>value should be 'code'</p>"
          },
          {
            "group": "Parameter",
            "type": "STRING",
            "optional": false,
            "field": "redirect_uri",
            "description": "<p>uri of redirect upon permission granted, which is the endpoint requesting access to the user's account</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "returns",
            "description": "<p>a transaction id, user, and a client</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n  \"transactionID\": \"IRGn6Bom\",\n  \"user\": {\n      \"id\": 3,\n      \"username\": \"jreach\",\n      \"email\": \"jreach@gmail.com\",\n      \"firstName\": \"Jack\",\n      \"lastName\": \"Reacher\",\n      \"createdAt\": \"2017-12-02T19:28:53.000Z\",\n      \"updatedAt\": \"2017-12-02T19:28:53.000Z\"\n  },\n  \"client\": {\n      \"id\": 1,\n      \"clientId\": \"clientId\",\n      \"name\": \"endor_frontend\",\n      \"secret\": \"client_secret\",\n      \"createdAt\": \"2017-12-02T19:40:27.000Z\",\n      \"updatedAt\": \"2017-12-02T19:40:27.000Z\",\n      \"userId\": 3\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/auth.routes.js",
    "groupTitle": "Auth"
  },
  {
    "type": " post ",
    "url": "/oauth2/token",
    "title": "Exchange access code to create a token",
    "version": "1.0.0",
    "name": "Post_Token",
    "group": "Auth",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>The access token is deleted if the redirectURI and the access codes' client id is the same as the client requesting the new token, and then the new token is created and returned to in the response. The Authentication at this endpoint should be client authentication so as to verify that this is the client's token</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "STRING",
            "optional": false,
            "field": "code",
            "description": "<p>the access code if grant_type = authorization_code</p>"
          },
          {
            "group": "Parameter",
            "type": "STRING",
            "optional": false,
            "field": "username",
            "description": "<p>the username if grant_type = password</p>"
          },
          {
            "group": "Parameter",
            "type": "STRING",
            "optional": false,
            "field": "password",
            "description": "<p>the corresponding password if grant_type = password</p>"
          },
          {
            "group": "Parameter",
            "type": "STRING",
            "optional": false,
            "field": "grant_type",
            "description": "<p>the value should be &quot;authorization_code&quot; or &quot;password&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Param-Example:",
          "content": "{\n  \"code\": \"YxTKMd9l8ZAvof2GEwiP6w\",\n  \"grant_type\": \"authorization_code\"\n}",
          "type": "json"
        },
        {
          "title": "Param-Example:",
          "content": "{\n  \"username\": \"jreach\",\n  \"password\": \"password_of_jreach\",\n  \"grant_type\": \"password\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "returns",
            "description": "<p>the access token and the token_type (&quot;bearer&quot;)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n  \"access_token\": {\n      \"id\": 1,\n      \"value\": \"<Long String>\"\n      \"userId\": 3,\n      \"updatedAt\": \"2017-12-04T01:08:36.415Z\",\n      \"createdAt\": \"2017-12-04T01:08:36.415Z\"\n  },\n  \"token_type\": \"Bearer\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/auth.routes.js",
    "groupTitle": "Auth"
  },
  {
    "type": " post ",
    "url": "/oauth2/authorize",
    "title": "Post permissions authorized by the user",
    "version": "1.0.0",
    "name": "Post_permission",
    "group": "Auth",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>Upon success, it redirects to the redirect_URI given to GET /oauth2/authorize. To return a simple JSON indicating { success: true }, redirect to GET /oauth2/authorize/successRedirect. Sends the code in req.query.code to the redirectURI.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "STRING",
            "optional": false,
            "field": "transaction_id",
            "description": "<p>from GET /oauth2/authorize</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n   \"transaction_id\": \"3dI123d\",\n   \"allow\": true OR \"deny\":true\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "returns",
            "description": "<p>success</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n  \"success\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/auth.routes.js",
    "groupTitle": "Auth"
  },
  {
    "type": " post ",
    "url": "/auth/register",
    "title": "Register a new user",
    "version": "1.0.0",
    "name": "Register_User",
    "group": "Auth",
    "permission": [
      {
        "name": "None"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "STRING",
            "optional": false,
            "field": "username",
            "description": "<p>The new user's desired username. Must only contain letters, numbers and underscores.</p>"
          },
          {
            "group": "Parameter",
            "type": "STRING",
            "optional": false,
            "field": "email",
            "description": "<p>The new user's desired email</p>"
          },
          {
            "group": "Parameter",
            "type": "STRING",
            "optional": false,
            "field": "password",
            "description": "<p>The new user's desired password. Must have at least 8 characters, with one letter and one number.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "returns",
            "description": "<p>the new user and corresponding token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n \"user\": {\n      \"id\": 10,\n      \"username\": \"jreach6\",\n      \"updatedAt\": \"2018-01-22T02:02:12.447Z\",\n      \"createdAt\": \"2018-01-22T02:02:12.447Z\"\n  },\n  \"token\": {\n      \"expired\": false,\n      \"id\": 12,\n      \"value\": \"<a really long token value here>\"\n      \"userId\": 10,\n      \"updatedAt\": \"2018-01-22T02:02:12.473Z\",\n      \"createdAt\": \"2018-01-22T02:02:12.473Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/auth.routes.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/clients",
    "title": "Create a new client",
    "version": "1.0.0",
    "name": "Create_a_new_client",
    "group": "Clients",
    "permission": [
      {
        "name": "none"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "client",
            "description": "<p>client to be created</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "client.name",
            "description": "<p>name of the client</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "client.clientId",
            "description": "<p>clientId of the client. Must be unique</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "client.secret",
            "description": "<p>secret of the client</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "client.userId",
            "description": "<p>userId of the user who owns the client</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Param-Example:",
          "content": "{\n    \"client\": {\n      \"name\": \"endor_frontend\",\n      \"clientId\": \"clientId\",\n      \"secret\": \"client_secret\",\n      \"userId\": 3,\n     }\n   }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "client",
            "description": "<p>the newly created client</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n     \"id\": 1,\n     \"name\": \"endor_frontend\",\n     \"clientId\": \"clientId\",\n     \"secret\": \"client_secret\",\n     \"updatedAt\": \"2017-12-02T19:40:27.574Z\",\n     \"createdAt\": \"2017-12-02T19:40:27.563Z\",\n     \"userId\": 3\n   }",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/client.routes.js",
    "groupTitle": "Clients"
  },
  {
    "type": "post",
    "url": "/projects/:projectId/contributors/:user",
    "title": "Add contributor to project",
    "version": "1.0.0",
    "name": "add_contributor_to_project",
    "group": "Contributors",
    "permission": [
      {
        "name": "project owner"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>The id of the project.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>User id or username of the user to add as a contributor.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "contributors",
            "description": "<p>the contributors of the project which the user was added to</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n    {\n     \"id\": 1,\n     \"username\": \"BobSagat\",\n     \"email\": \"Bob@AFV.com\",\n     \"firstName\": \"Bob\",\n     \"lastName\": \"Sagat\",\n     \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n     \"updatedAt\": \"2017-11-12T20:26:47.000Z\",\n     \"projectContributor\": {\n         \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n         \"updatedAt\": \"2017-11-12T20:26:47.000Z\",\n         \"projectId\": 1,\n         \"userId\": 1\n     }\n    }\n  ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/contributors.routes.js",
    "groupTitle": "Contributors"
  },
  {
    "type": "get",
    "url": "/projects/:projectId/contributors/:user",
    "title": "Check if a user is a contributor",
    "version": "1.0.0",
    "name": "check_if_project_is_contributor",
    "group": "Contributors",
    "permission": [
      {
        "name": "none"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the project</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>user id or username</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "Status: 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response",
          "content": "Status: 404 Not Found",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/contributors.routes.js",
    "groupTitle": "Contributors"
  },
  {
    "type": "get",
    "url": "/projects/:projectId/contributors",
    "title": "Get contributors for a project",
    "version": "1.0.0",
    "name": "get_contributors",
    "group": "Contributors",
    "permission": [
      {
        "name": "none"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the project to get contributors for</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "contributors",
            "description": "<p>of the project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n     {\n         \"id\": 1,\n         \"username\": \"BobSagat\",\n         \"email\": \"Bob@AFV.com\",\n         \"firstName\": \"Bob\",\n         \"lastName\": \"Sagat\",\n         \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n         \"updatedAt\": \"2017-11-12T20:26:47.000Z\",\n         \"projectContributor\": {\n             \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n             \"updatedAt\": \"2017-11-12T20:26:47.000Z\",\n             \"projectId\": 1,\n             \"userId\": 1\n         }\n     }\n    ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/contributors.routes.js",
    "groupTitle": "Contributors"
  },
  {
    "type": "delete",
    "url": "/projects/:projectId/contributors/:user",
    "title": "Remove contributor from project",
    "version": "1.0.0",
    "name": "remove_contributor_from_project",
    "group": "Contributors",
    "permission": [
      {
        "name": "project owner"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>The id of the project.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>User id or username of the user to remove as a contributor.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "contributors",
            "description": "<p>the contributors of the project which the user was added to</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n {\n  \"id\": 1,\n  \"username\": \"BobSagat\",\n  \"email\": \"Bob@AFV.com\",\n  \"firstName\": \"Bob\",\n  \"lastName\": \"Sagat\",\n  \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n  \"updatedAt\": \"2017-11-12T20:26:47.000Z\",\n  \"projectContributor\": {\n      \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n      \"updatedAt\": \"2017-11-12T20:26:47.000Z\",\n      \"projectId\": 1,\n      \"userId\": 1\n  }\n }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/contributors.routes.js",
    "groupTitle": "Contributors"
  },
  {
    "type": "POST",
    "url": "/auth/github",
    "title": "Add Github Authentication Token",
    "version": "1.0.0",
    "name": "Add_Github_Authentication_Token",
    "group": "Github",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Adds a github authentication token for the user to the database. If a token already exists for the user, this function will overwrite the existing token. If it is created/updated successfully, it will return a status code of 204.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "githubToken",
            "description": "<p>the user's github token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"githubToken\": \"123abc456\",\n \"githubUsername\": \"githubUsername\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/githubauth.routes.js",
    "groupTitle": "Github"
  },
  {
    "type": " get ",
    "url": "/auth/github",
    "title": "Check Github Authentication",
    "version": "1.0.0",
    "name": "Check_Github_Authentication",
    "group": "Github",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Checks if the user is authenticated with github. It will remove the token if it is not a valid github token.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "isAuthenticated",
            "description": "<p>true if authenticated, false otherwise</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n \"isGithubAuthenticated\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/githubauth.routes.js",
    "groupTitle": "Github"
  },
  {
    "type": "DELETE",
    "url": "/auth/github",
    "title": "Delete Github Authentication Token",
    "version": "1.0.0",
    "name": "Delete_Github_Authentication_Token",
    "group": "Github",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Deletes a github authentication token for the user. If it is deleted successfully, it will return a status code of 204.</p>",
    "filename": "src/routes/githubauth.routes.js",
    "groupTitle": "Github"
  },
  {
    "type": "POST",
    "url": "/auth/github2",
    "title": "Exchange Github code for Github token",
    "version": "1.0.0",
    "name": "Exchange_for_Github_Authentication_Token",
    "group": "Github",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Exchanges a code for a github auth token and stores the github authentication token for the user to the database. If a token already exists for the user, this function will overwrite the existing token. If it is created/updated successfully, it will return a status code of 204.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>the user's github code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>the state generated for this exchange</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"code\": \"7e8d7f7f-d8ab-44c6-af9e-7b7971413708\",\n \"state\": \"8jhmm5avo0zduepbvh3bh791xi\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/githubauth.routes.js",
    "groupTitle": "Github"
  },
  {
    "type": "PUT",
    "url": "/auth/github",
    "title": "Update Github Authentication Token",
    "version": "1.0.0",
    "name": "Update_Github_Authentication_Token",
    "group": "Github",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Updates a github authentication token for the user. If it is updated successfully, it will return a status code of 204. Will return a 404 if a token did not exist previously.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "githubToken",
            "description": "<p>the user's github token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"githubToken\": \"123abc456\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/githubauth.routes.js",
    "groupTitle": "Github"
  },
  {
    "type": "POST",
    "url": "/auth/heroku",
    "title": "Add Heroku Authentication Token",
    "version": "1.0.0",
    "name": "Add_Heroku_Authentication_Token",
    "group": "Heroku",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Adds a heroku authentication token for the user to the database. If it is created/updated successfully, it will return a status code of 204. If a token already exists for the user, this function will overwrite the existing token.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "heroku",
            "description": "<p>the user's heroku token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"herokuToken\": \"123abc456\",\n \"email\": \"usersHerokuEmail@gmail.com\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/herokuauth.routes.js",
    "groupTitle": "Heroku"
  },
  {
    "type": " get ",
    "url": "/auth/heroku",
    "title": "Check Heroku Authentication",
    "version": "1.0.0",
    "name": "Check_Heroku_Authentication",
    "group": "Heroku",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Checks if the user is authenticated with heroku. It will remove the token if it is not a valid heroku token.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "isAuthenticated",
            "description": "<p>true if authenticated, false otherwise</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n \"isHerokuAuthenticated\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/herokuauth.routes.js",
    "groupTitle": "Heroku"
  },
  {
    "type": "DELETE",
    "url": "/auth/heroku",
    "title": "Delete Heroku Authentication Token",
    "version": "1.0.0",
    "name": "Delete_Heroku_Authentication_Token",
    "group": "Heroku",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Deletes a heroku authentication token for the user. If it is deleted successfully, it will return a status code of 204.</p>",
    "filename": "src/routes/herokuauth.routes.js",
    "groupTitle": "Heroku"
  },
  {
    "type": "POST",
    "url": "/auth/heroku2",
    "title": "Exchange Heroku code for Heroku token",
    "version": "1.0.0",
    "name": "Exchange_for_Heroku_Authentication_Token",
    "group": "Heroku",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Exchanges a code for a Heroku auth token and stores the Heroku authentication token for the user to the database. If a token already exists for the user, this function will overwrite the existing token. If it is created/updated successfully, it will return a status code of 204.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>the user's heroku code</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"code\": \"7e8d7f7f-d8ab-44c6-af9e-7b7971413708\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/herokuauth.routes.js",
    "groupTitle": "Heroku"
  },
  {
    "type": "PUT",
    "url": "/auth/heroku",
    "title": "Update heroku Authentication Token",
    "version": "1.0.0",
    "name": "Update_Heroku_Authentication_Token",
    "group": "Heroku",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Updates a heroku authentication token for the user. If it is updated successfully, it will return a status code of 204. Will return a 404 if a token did not exist previously.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "heroku",
            "description": "<p>the user's heroku token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"herokuToken\": \"123abc456\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/herokuauth.routes.js",
    "groupTitle": "Heroku"
  },
  {
    "type": "get",
    "url": "/",
    "title": "API Home",
    "version": "1.0.0",
    "name": "GetIndex",
    "group": "Index",
    "filename": "src/routes/index.routes.js",
    "groupTitle": "Index"
  },
  {
    "type": "put",
    "url": "/invites/:id/accept",
    "title": "Accept an invitation. May only be used on an open invite.",
    "version": "1.0.0",
    "name": "accept_contributor_invitation",
    "group": "Invites",
    "permission": [
      {
        "name": "authenticated user referenced in the invite"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>invite id of the invitation to accept</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "invite",
            "description": "<p>the accepted invitation</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "\n{\n \"id\": 1,\n \"status\": \"accepted\",\n \"daysFromCreationUntilExpiration\": 30,\n \"userInvitedId\": \"3\",\n \"projectInvitedToId\": \"1\",\n \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n \"updatedAt\": \"2017-11-27T10:22:12.000Z\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/invites.routes.js",
    "groupTitle": "Invites"
  },
  {
    "type": "put",
    "url": "/invites/:id/decline",
    "title": "Decline an invitation. May only be used on an open invite.",
    "version": "1.0.0",
    "name": "decline_contributor_invitation",
    "group": "Invites",
    "permission": [
      {
        "name": "authenticated user referenced in the invite"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>invite id of the invitation to decline</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "invite",
            "description": "<p>the declined invitation</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "\n{\n \"id\": 1,\n \"status\": \"declined\",\n \"daysFromCreationUntilExpiration\": 30,\n \"userInvitedId\": \"3\",\n \"projectInvitedToId\": \"1\",\n \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n \"updatedAt\": \"2017-11-27T10:22:12.000Z\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/invites.routes.js",
    "groupTitle": "Invites"
  },
  {
    "type": "get",
    "url": "/projects/:projectId/invites",
    "title": "Get all contributor invitations for a project",
    "version": "1.0.0",
    "name": "get_invites",
    "group": "Invites",
    "permission": [
      {
        "name": "project owner"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>the id of the project to get contributor invites to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>the status to filter results by. May be one of the following: <code>['open','accepted','declined','rescinded','expired']</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "contributor",
            "description": "<p>invites to the project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n {\n  \"id\": 1,\n  \"status\": \"open\",\n  \"daysFromCreationUntilExpiration\": 30,\n  \"userInvitedId\": \"3\",\n  \"projectInvitedToId\": \"1\",\n  \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n  \"updatedAt\": \"2017-11-12T20:26:47.000Z\"\n }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/invites.routes.js",
    "groupTitle": "Invites"
  },
  {
    "type": "post",
    "url": "/projects/:projectId/invites/:userId",
    "title": "Invite a contributor to the project",
    "version": "1.0.0",
    "name": "invite_contributor_to_the_project",
    "group": "Invites",
    "permission": [
      {
        "name": "project owner"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>the id of the project</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>the username or id of the user to invite as a contributor</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "daysUntilExpiration",
            "description": "<p>the invite will expire after this many days have passed since the invite was created. Must be a non-negative integer. Optional: Defaults to 30 days.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "invite",
            "description": "<p>the invitation</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "\n{\n \"id\": 1,\n \"status\": \"open\",\n \"daysFromCreationUntilExpiration\": 30,\n \"userInvitedId\": \"3\",\n \"projectInvitedToId\": \"1\",\n \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n \"updatedAt\": \"2017-11-12T20:26:47.000Z\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/invites.routes.js",
    "groupTitle": "Invites"
  },
  {
    "type": "put",
    "url": "/invites/:id/rescind",
    "title": "Rescind an invitation. May only be used on an open invite.",
    "version": "1.0.0",
    "name": "rescind_contributor_invitation_to_project",
    "group": "Invites",
    "permission": [
      {
        "name": "owner of the project referenced in the invitation"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>invite id of the contributor invitation to rescind</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "invite",
            "description": "<p>the rescinded invitation</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "\n{\n \"id\": 1,\n \"status\": \"rescinded\",\n \"daysFromCreationUntilExpiration\": 30,\n \"userInvitedId\": \"3\",\n \"projectInvitedToId\": \"1\",\n \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n \"updatedAt\": \"2017-11-27T10:22:12.000Z\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/invites.routes.js",
    "groupTitle": "Invites"
  },
  {
    "type": "get",
    "url": "/user/invites",
    "title": "Get invites for an authenticated user",
    "version": "1.0.0",
    "name": "user_invites",
    "group": "Invites",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>the status to filter results by. May be one of the following: <code>['open','accepted','declined','rescinded','expired']</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "invites",
            "description": "<p>list of invites for authenticated user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n {\n  \"id\": 1,\n  \"status\": \"open\",\n  \"daysFromCreationUntilExpiration\": 30,\n  \"userInvitedId\": \"3\",\n  \"projectInvitedToId\": \"1\",\n  \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n  \"updatedAt\": \"2017-11-12T20:26:47.000Z\"\n }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/invites.routes.js",
    "groupTitle": "Invites"
  },
  {
    "type": "post",
    "url": "/projects/:projectId/owners/:user",
    "title": "Add owner to project",
    "version": "1.0.0",
    "name": "add_owner_to_project",
    "group": "Owners",
    "permission": [
      {
        "name": "Project owner"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>The id of the project.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>User id or username of the user to add as an owner.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "owners",
            "description": "<p>the owners of the project which the user was added to</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n {\n  \"id\": 1,\n  \"username\": \"BobSagat\",\n  \"email\": \"Bob@AFV.com\",\n  \"firstName\": \"Bob\",\n  \"lastName\": \"Sagat\",\n  \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n  \"updatedAt\": \"2017-11-12T20:26:47.000Z\",\n  \"projectOwner\": {\n      \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n      \"updatedAt\": \"2017-11-12T20:26:47.000Z\",\n      \"projectId\": 1,\n      \"userId\": 1\n  }\n }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/owners.routes.js",
    "groupTitle": "Owners"
  },
  {
    "type": "get",
    "url": "/projects/:projectId/owners/:user",
    "title": "Check if a user is a owner",
    "version": "1.0.0",
    "name": "check_if_project_is_owner",
    "group": "Owners",
    "permission": [
      {
        "name": "none"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the project</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>user id or username</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "Status: 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response",
          "content": "Status: 404 Not Found",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/owners.routes.js",
    "groupTitle": "Owners"
  },
  {
    "type": "get",
    "url": "/projects/:projectId/owners",
    "title": "Get owners for a project",
    "version": "1.0.0",
    "name": "get_owners",
    "group": "Owners",
    "permission": [
      {
        "name": "none"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>the id of the project to get owners for</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "owners",
            "description": "<p>of the project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n {\n     \"id\": 1,\n     \"username\": \"BobSagat\",\n     \"email\": \"Bob@AFV.com\",\n     \"firstName\": \"Bob\",\n     \"lastName\": \"Sagat\",\n     \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n     \"updatedAt\": \"2017-11-12T20:26:47.000Z\",\n     \"projectOwner\": {\n         \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n         \"updatedAt\": \"2017-11-12T20:26:47.000Z\",\n         \"projectId\": 1,\n         \"userId\": 1\n     }\n }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/owners.routes.js",
    "groupTitle": "Owners"
  },
  {
    "type": "delete",
    "url": "/projects/:projectId/owners/:user",
    "title": "Remove owner from project",
    "version": "1.0.0",
    "name": "remove_owner_from_project",
    "group": "Owners",
    "permission": [
      {
        "name": "Project owner"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>The id of the project.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>User id or username of the user to add as an owner.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "owners",
            "description": "<p>the owners of the project which the user was added to</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n {\n  \"id\": 1,\n  \"username\": \"BobSagat\",\n  \"email\": \"Bob@AFV.com\",\n  \"firstName\": \"Bob\",\n  \"lastName\": \"Sagat\",\n  \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n  \"updatedAt\": \"2017-11-12T20:26:47.000Z\",\n  \"projectOwner\": {\n      \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n      \"updatedAt\": \"2017-11-12T20:26:47.000Z\",\n      \"projectId\": 1,\n      \"userId\": 1\n  }\n }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/owners.routes.js",
    "groupTitle": "Owners"
  },
  {
    "type": "delete",
    "url": "/projects/:projectId",
    "title": "Delete a project",
    "version": "1.0.0",
    "name": "delete_project",
    "group": "Projects",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "Project owner"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "project",
            "description": "<p>the deleted project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "Status: 204 No Content",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/projects/:projectId/buildstatuses",
    "title": "Get build statuses for project",
    "version": "1.0.0",
    "name": "get_build_statuses_for_project",
    "group": "Projects",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>the projectId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "limit",
            "description": "<p>set a limit of how many pull requests can be returned</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "response",
            "description": "<p>an array of builds, below are the fields</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the build id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "buildNumber",
            "description": "<p>the build number of the build</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>the state of the build</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "duration",
            "description": "<p>the duration of the build</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>the type of build, push or pull request</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>the user who made the commit</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "started_at",
            "description": "<p>when the build was started</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "finished_at",
            "description": "<p>when the build finished</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>the url to the commit</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Resonse:",
          "content": "[\n {\n    \"id\": 123456,\n    \"buildNumber\": \"1\",\n    \"state\": \"passed\",\n    \"previousState\": \"passed\",\n    \"duration\": 228,\n    \"type\": \"pull_request\",\n    \"user\": \"the user\",\n    \"started_at\": \"2018-02-10T21:35:58Z\",\n    \"finished_at\": \"2018-02-10T21:38:13Z\"\n   }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/projects/:projectId/heroku",
    "title": "Get heroku app info for project",
    "version": "1.0.0",
    "name": "get_heroku_app_info_for_project",
    "group": "Projects",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>the projectId</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>the heroku app url to the deployed application</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "updated_at",
            "description": "<p>the last time the app was updated on heroku</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\n{\n  \"url\": \"https://jack-bkuiket.herokuapp.com/\",\n  \"updated_at\": \"2018-01-26T18:57:51Z\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/projects/:projectId/issues",
    "title": "Get issues for project",
    "version": "1.0.0",
    "name": "get_issues_for_project",
    "group": "Projects",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>the projectId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>filter by the state of issue, can be 'open', 'close', or 'all'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "limit",
            "description": "<p>set a limit of how many issues can be returned</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "response",
            "description": "<p>an array of issues, below are the fields</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>the url to the issue</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "number",
            "description": "<p>the issue number</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>the user who opened the issue</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>the state of the issue, either opened or closed</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>the title of the issue</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>the description of the issue</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "created_at_date",
            "description": "<p>the date the issue was created</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "closed_at_date",
            "description": "<p>the date the issue was closed, null if it hasn't been closed</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n {\n     \"url\": \"https://api.github.com/repos/owner/repo/issues/issueNumber\",\n     \"number\": 1,\n     \"user\": \"username\",\n     \"state\": \"open\",\n     \"title\": \"the title goes here\",\n     \"description\": \"the description goes here\",\n     \"created_at_date\": \"2018-02-09T16:10:58Z\",\n     \"closed_at_date\": null\n  }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/projects/:projectId",
    "title": "Get project by id",
    "version": "1.0.0",
    "name": "get_project_by_id",
    "group": "Projects",
    "permission": [
      {
        "name": "autenticated user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Client-Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>the projectId to find by</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "project",
            "description": "<p>the project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"id\": 1,\n  \"projectName\": \"TMNT\",\n  \"description\": \"You gotta know what a crumpet is to understand cricket!\",\n  \"version\": \"1.2.3\",\n  \"license\": \"MIT\",\n  \"authors\": \"Casey Jones, Raphael\",\n  \"createdAt\": \"2017-11-12T17:08:30.000Z\",\n  \"updatedAt\": \"2017-11-12T17:08:30.000Z\",\n  \"containerizationToolId\": null,\n  \"continuousIntegrationToolId\": 1,\n  \"deploymentToolId\": 3,\n  \"webFrameworkId\": null\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/users/:user/projects",
    "title": "Get a project by user id",
    "version": "1.0.0",
    "name": "get_projects_for_user",
    "group": "Projects",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Client-Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>the user id or the username to find by</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "[Object]",
            "optional": false,
            "field": "projects",
            "description": "<p>the list of projects for a given user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"owned\": [\n        {\n            \"id\": 1,\n            \"projectName\": \"TMNT\",\n            \"description\": \"You gotta know what a crumpet is to understand cricket!\",\n            \"version\": \"1.2.3\",\n            \"license\": \"MIT\",\n            \"authors\": \"Casey Jones, Raphael\",\n            \"createdAt\": \"2017-11-12T17:08:30.000Z\",\n            \"updatedAt\": \"2017-11-12T17:08:30.000Z\",\n            \"containerizationToolId\": null,\n            \"continuousIntegrationToolId\": 1,\n            \"deploymentToolId\": 3,\n            \"webFrameworkId\": null,\n            \"projectOwner\": {\n                \"createdAt\": \"2017-11-12T17:08:30.000Z\",\n                \"updatedAt\": \"2017-11-12T17:08:30.000Z\",\n                \"projectId\": 1,\n                \"userId\": 3\n            }\n        }\n    ],\n    \"contributed\": [\n        {\n            \"id\": 1,\n            \"projectName\": \"TMNT\",\n            \"description\": \"You gotta know what a crumpet is to understand cricket!\",\n            \"version\": \"1.2.3\",\n            \"license\": \"MIT\",\n            \"authors\": \"Casey Jones, Raphael\",\n            \"createdAt\": \"2017-11-12T17:08:30.000Z\",\n            \"updatedAt\": \"2017-11-12T17:08:30.000Z\",\n            \"containerizationToolId\": null,\n            \"continuousIntegrationToolId\": 1,\n            \"deploymentToolId\": 3,\n            \"webFrameworkId\": null,\n            \"projectContributor\": {\n                \"createdAt\": \"2017-11-12T17:08:30.000Z\",\n                \"updatedAt\": \"2017-11-12T17:08:30.000Z\",\n                \"projectId\": 1,\n                \"userId\": 3\n            }\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/projects/:projectId/pullrequests",
    "title": "Get pull requests for project",
    "version": "1.0.0",
    "name": "get_pull_requests_for_project",
    "group": "Projects",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>the projectId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>filter by the state of pull requests, can be 'open', 'close', or 'all'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "limit",
            "description": "<p>set a limit of how many pull requests can be returned</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "response",
            "description": "<p>an array of pull requests, below are the fields</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>the url to the pull requests</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "number",
            "description": "<p>the pull requests number</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>the user who opened the pull requests</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>the state of the pull requests, either opened or closed</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>the title of the pull requests</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>the description of the pull requests</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "created_at_date",
            "description": "<p>the date the pull requests was created</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "closed_at_date",
            "description": "<p>the date the pull requests was closed, null if it hasn't been closed</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n {\n     \"url\": \"https://api.github.com/repos/owner/repo/pulls/number\",\n     \"number\": 1,\n     \"user\": \"username\",\n     \"state\": \"open\",\n     \"title\": \"the title goes here\",\n     \"description\": \"the description goes here\",\n     \"created_at_date\": \"2018-02-09T16:10:58Z\",\n     \"closed_at_date\": null\n  }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/projects/:projectId/pullrequests",
    "title": "Get pull requests for project",
    "version": "1.0.0",
    "name": "get_pull_requests_for_project",
    "group": "Projects",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>the projectId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "limit",
            "description": "<p>set a limit of how many pull requests can be returned</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "response",
            "description": "<p>an array of commits, below are the fields</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the commit message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>the username who made the commit</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>the date of the commit</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>the url to the commit</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n   {\n     \"message\": \"the commit message\",\n     \"user\": \"username\",\n     \"date\": \"2018-02-09T03:45:28Z\",\n     \"url\": \"url to the commit\"\n    }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "Projects"
  },
  {
    "type": "patch",
    "url": "/projects/:projectId",
    "title": "Update a project",
    "version": "1.0.0",
    "name": "patch_project",
    "group": "Projects",
    "permission": [
      {
        "name": "Project owner"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the project to update</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "project",
            "description": "<p>the updated project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"id\": 1,\n  \"projectName\": \"TMNT\",\n  \"description\": \"You gotta know what a crumpet is to understand cricket!\",\n  \"version\": \"1.2.3\",\n  \"license\": \"MIT\",\n  \"authors\": \"Casey Jones, Raphael\",\n  \"createdAt\": \"2017-11-12T17:08:30.000Z\",\n  \"updatedAt\": \"2017-11-12T17:08:30.000Z\",\n  \"containerizationToolId\": null,\n  \"continuousIntegrationToolId\": 1,\n  \"deploymentToolId\": 3,\n  \"webFrameworkId\": null\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "Projects"
  },
  {
    "type": "post",
    "url": "/user/projects",
    "title": "Create a project for an authenticated user",
    "version": "1.0.0",
    "name": "post_project_for_authenticated_user",
    "group": "Projects",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Client-Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectName",
            "description": "<p>the name of the project</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>the description to the project</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "version",
            "description": "<p>the version of the project</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "license",
            "description": "<p>the name of the license</p>"
          },
          {
            "group": "Parameter",
            "type": "[String]",
            "optional": false,
            "field": "authors",
            "description": "<p>a string of comma separated values</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "containerizationTool",
            "description": "<p>the name of the containerization tool or <None></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "continuousIntegrationTool",
            "description": "<p>the name of the continuous integration tool or <None></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deploymentTool",
            "description": "<p>the name of the deployment tool or <None></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "webFramework",
            "description": "<p>the name of the web framework or <None></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request Example:",
          "content": "{\n \"projectName\": \"hammer-io\",\n \"description\": \"Hit it with a Hammer!\",\n \"version\": \"0.0.1\",\n \"license\": \"MIT\",\n \"authors\": \"Holmgang, Jack\",\n \"containerizationTool\": \"2\",\n \"continuousIntegrationTool\": \"1\",\n \"deploymentTool\": \"3\",\n \"webFramework\": \"4\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "project",
            "description": "<p>the created project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"id\": 1,\n  \"projectName\": \"hammer-io\",\n  \"description\": \"Hit it with a Hammer!\",\n  \"version\": \"0.0.1\",\n  \"license\": \"MIT\",\n  \"authors\": \"Holmgang, Jack\",\n  \"createdAt\": \"2017-11-12T17:08:30.000Z\",\n  \"updatedAt\": \"2017-11-12T17:08:30.000Z\",\n  \"containerizationToolId\": 2,\n  \"continuousIntegrationToolId\": 1,\n  \"deploymentToolId\": 3,\n  \"webFrameworkId\": 4\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "Projects"
  },
  {
    "type": "post",
    "url": "/users/:user/projects",
    "title": "Create a project",
    "version": "1.0.0",
    "name": "post_project_for_user",
    "group": "Projects",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Client-Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>the username or userid of the user to create a project for</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectName",
            "description": "<p>the name of the project</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>the description to the project</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "version",
            "description": "<p>the version of the project</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "license",
            "description": "<p>the name of the license</p>"
          },
          {
            "group": "Parameter",
            "type": "[String]",
            "optional": false,
            "field": "authors",
            "description": "<p>a string of comma separated values</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "containerizationTool",
            "description": "<p>the name of the containerization tool or <None></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "continuousIntegrationTool",
            "description": "<p>the name of the continuous integration tool or <None></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deploymentTool",
            "description": "<p>the name of the deployment tool or <None></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "webFramework",
            "description": "<p>the name of the web framework or <None></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request Example:",
          "content": "{\n \"projectName\": \"hammer-io\",\n \"description\": \"Hit it with a Hammer!\",\n \"version\": \"0.0.1\",\n \"license\": \"MIT\",\n \"authors\": \"Holmgang, Jack\",\n \"containerizationTool\": \"2\",\n \"continuousIntegrationTool\": \"1\",\n \"deploymentTool\": \"3\",\n \"webFramework\": \"4\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "project",
            "description": "<p>the created project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"id\": 1,\n  \"projectName\": \"hammer-io\",\n  \"description\": \"Hit it with a Hammer!\",\n  \"version\": \"0.0.1\",\n  \"license\": \"MIT\",\n  \"authors\": \"Holmgang\",\n  \"createdAt\": \"2017-11-12T17:08:30.000Z\",\n  \"updatedAt\": \"2017-11-12T17:08:30.000Z\",\n  \"containerizationToolId\": 2,\n  \"continuousIntegrationToolId\": 1,\n  \"deploymentToolId\": 3,\n  \"webFrameworkId\": 4\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/projects",
    "title": "Get all public projects",
    "version": "1.0.0",
    "name": "projects",
    "group": "Projects",
    "permission": [
      {
        "name": "none"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Client-Basic Auth-Token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "projects",
            "description": "<p>List of all of the public projects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n {\n   \"id\": 1,\n   \"projectName\": \"TMNT\",\n   \"description\": \"You gotta know what a crumpet is to understand cricket!\",\n   \"version\": \"1.2.3\",\n   \"license\": \"MIT\",\n   \"authors\": \"Casey Jones, Raphael\",\n   \"createdAt\": \"2017-11-12T17:08:30.000Z\",\n   \"updatedAt\": \"2017-11-12T17:08:30.000Z\",\n   \"containerizationToolId\": null,\n   \"continuousIntegrationToolId\": 1,\n   \"deploymentToolId\": 3,\n   \"webFrameworkId\": null\n }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/user/projects",
    "title": "Get projects for an authenticated user",
    "version": "1.0.0",
    "name": "user_projects",
    "group": "Projects",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Client-Basic Auth-Token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "projects",
            "description": "<p>list of projects for authenticated user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"owned\": [\n        {\n            \"id\": 1,\n            \"projectName\": \"TMNT\",\n            \"description\": \"You gotta know what a crumpet is to understand cricket!\",\n            \"version\": \"1.2.3\",\n            \"license\": \"MIT\",\n            \"authors\": \"Casey Jones, Raphael\",\n            \"createdAt\": \"2017-11-12T17:08:30.000Z\",\n            \"updatedAt\": \"2017-11-12T17:08:30.000Z\",\n            \"containerizationToolId\": null,\n            \"continuousIntegrationToolId\": 1,\n            \"deploymentToolId\": 3,\n            \"webFrameworkId\": null,\n            \"projectOwner\": {\n                \"createdAt\": \"2017-11-12T17:08:30.000Z\",\n                \"updatedAt\": \"2017-11-12T17:08:30.000Z\",\n                \"projectId\": 1,\n                \"userId\": 3\n            }\n        }\n    ],\n    \"contributed\": [\n        {\n            \"id\": 1,\n            \"projectName\": \"TMNT\",\n            \"description\": \"You gotta know what a crumpet is to understand cricket!\",\n            \"version\": \"1.2.3\",\n            \"license\": \"MIT\",\n            \"authors\": \"Casey Jones, Raphael\",\n            \"createdAt\": \"2017-11-12T17:08:30.000Z\",\n            \"updatedAt\": \"2017-11-12T17:08:30.000Z\",\n            \"containerizationToolId\": null,\n            \"continuousIntegrationToolId\": 1,\n            \"deploymentToolId\": 3,\n            \"webFrameworkId\": null,\n            \"projectContributor\": {\n                \"createdAt\": \"2017-11-12T17:08:30.000Z\",\n                \"updatedAt\": \"2017-11-12T17:08:30.000Z\",\n                \"projectId\": 1,\n                \"userId\": 3\n            }\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/tools/containerization",
    "title": "Get  containerization tools",
    "version": "1.0.0",
    "name": "get_containerization_tools",
    "group": "Tools",
    "permission": [
      {
        "name": "none"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "tools",
            "description": "<p>Returns a list of all containerization tools.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n    {\n        \"id\": \"66e5470e-294e-4d8a-99dd-ab09137909ce\",\n        \"name\": \"Docker\",\n        \"toolType\": \"containerization\",\n        \"websiteUrl\": \"https://docker.com/\",\n        \"apiUrl\": \"https://index.docker.io/v1/\",\n        \"documentationUrl\": \"https://docs.docker.com/\",\n        \"logoSvgUrl\": null,\n        \"logoLargeUrl\": \"https://www.docker.com/sites/default/files/vertical_large.png\",\n        \"logoSmallUrl\": \"https://www.docker.com/sites/default/files/vertical_small.png\",\n        \"usageRequirements\": null,\n        \"specialConsiderations\": null,\n        \"createdAt\": \"2018-02-05T21:46:46.000Z\",\n        \"updatedAt\": \"2018-02-05T21:46:46.000Z\"\n    }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/tools.routes.js",
    "groupTitle": "Tools"
  },
  {
    "type": "get",
    "url": "/tools/ci",
    "title": "Get  continuous integration tools",
    "version": "1.0.0",
    "name": "get_continuous_integration_tools",
    "group": "Tools",
    "permission": [
      {
        "name": "none"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "tools",
            "description": "<p>Returns a list of all continuous integration tools.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n   {\n   \"id\": \"8dfcba69-fd36-4fde-a492-c4af7db13e66\",\n   \"name\": \"TravisCI\",\n   \"toolType\": \"ci\",\n   \"websiteUrl\": \"https://travis-ci.org/\",\n   \"apiUrl\": \"https://api.travis-ci.org/\",\n   \"documentationUrl\": \"https://docs.travis-ci.com/api\",\n   \"logoSvgUrl\": \"https://travis-ci.com/images/logos/TravisCI-Mascot-1.svg\",\n   \"logoLargeUrl\": \"https://travis-ci.com/images/logos/TravisCI-Mascot-1.png\",\n   \"logoSmallUrl\": null,\n   \"usageRequirements\": \"You must have created a TravisCI open source account before using this tool.\",\n   \"specialConsiderations\": \"To use the open source version of TravisCI, you must have a GitHub account.\",\n   \"createdAt\": \"2018-02-05T21:46:46.000Z\",\n   \"updatedAt\": \"2018-02-05T21:46:46.000Z\"\n   }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/tools.routes.js",
    "groupTitle": "Tools"
  },
  {
    "type": "get",
    "url": "/tools/database",
    "title": "Get  database tools",
    "version": "1.0.0",
    "name": "get_database_tools",
    "group": "Tools",
    "permission": [
      {
        "name": "none"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "tools",
            "description": "<p>Returns a list of all test database.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n {\n     \"id\": \"ff9d2ed2-e1d8-4f4e-a316-80f06f49d2a6\",\n     \"name\": \"Sequelize\",\n     \"toolType\": \"database\",\n     \"websiteUrl\": \"http://docs.sequelizejs.com/\",\n     \"apiUrl\": null,\n     \"documentationUrl\": \"http://docs.sequelizejs.com/\",\n     \"logoSvgUrl\": null,\n     \"logoLargeUrl\": null,\n     \"logoSmallUrl\": \"http://docs.sequelizejs.com/manual/asset/logo-small.png\",\n     \"usageRequirements\": null,\n     \"specialConsiderations\": null,\n     \"createdAt\": \"2018-02-05T21:46:46.000Z\",\n     \"updatedAt\": \"2018-02-05T21:46:46.000Z\"\n }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/tools.routes.js",
    "groupTitle": "Tools"
  },
  {
    "type": "get",
    "url": "/tools/deployment",
    "title": "Get  deployment tools",
    "version": "1.0.0",
    "name": "get_deployment_tools",
    "group": "Tools",
    "permission": [
      {
        "name": "none"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "tools",
            "description": "<p>Returns a list of all deployment tools.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n {\n     \"id\": \"0a75985f-d2da-4c9b-a346-f49697dc1452\",\n     \"name\": \"Heroku\",\n     \"toolType\": \"deployment\",\n     \"websiteUrl\": \"https://www.heroku.com/\",\n     \"apiUrl\": \"https://api.heroku.com/\",\n     \"documentationUrl\": \"https://devcenter.heroku.com/\",\n     \"logoSvgUrl\": \"data:image/svg+xml;utf8,<svg width=\\\"27\\\" height=\\\"30\\\" viewBox=\\\"0 0 27 30\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><title>heroku-logo</title><path d=\\\"M3 0C1.13 0 0 1.11 0 2.903v24.194C0 28.883 1.13 30 3 30h21c1.863 0 3-1.11 3-2.903V2.903C26.994 1.11 25.863 0 24 0H3zm21.042 2c.508.006.958.448.958.929V27.07c0 .487-.45.929-.958.929H2.958C2.45 28 2 27.558 2 27.071V2.93c0-.488.45-.93.958-.93h21.084zM20 25h-2.781v-8.506c0-.774-.237-1.048-.468-1.208-1.396-.959-5.414-.042-7.834.916L7 17.012 7.006 5h2.816v7.917a20.99 20.99 0 0 1 1.882-.482c2.988-.643 5.184-.47 6.616.505.787.536 1.68 1.59 1.68 3.554V25zm-6-15h3.293A16.109 16.109 0 0 0 20 5h-3.287c-.49 1.188-1.385 3.188-2.713 5zM7 25v-7l3 3.5L7 25z\\\" fill=\\\"%239E7CC1\\\" fill-rule=\\\"evenodd\\\"/></svg>\",\n     \"logoLargeUrl\": \"https://status.heroku.com/images/favicon-4d37b8350e89706867dad5caab4af5e5.ico\",\n     \"logoSmallUrl\": \"https://id.heroku.com/assets/logo-vertical.png\",\n     \"usageRequirements\": \"You must have created a Heroku account before using this tool.\",\n     \"specialConsiderations\": null,\n     \"createdAt\": \"2018-02-05T21:46:46.000Z\",\n     \"updatedAt\": \"2018-02-05T21:46:46.000Z\"\n }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/tools.routes.js",
    "groupTitle": "Tools"
  },
  {
    "type": "get",
    "url": "/tools/sourcecontrol",
    "title": "Get  source control tools",
    "version": "1.0.0",
    "name": "get_source_control_tools",
    "group": "Tools",
    "permission": [
      {
        "name": "none"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "tools",
            "description": "<p>Returns a list of all source control tools.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n {\n     \"id\": \"263d489d-e0b1-4d51-a7cc-ed85d84113cc\",\n     \"name\": \"GitHub\",\n     \"toolType\": \"sourceControl\",\n     \"websiteUrl\": \"https://github.com/\",\n     \"apiUrl\": \"https://api.github.com/\",\n     \"documentationUrl\": \"https://developer.github.com/v3/\",\n     \"logoSvgUrl\": null,\n     \"logoLargeUrl\": \"https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png\",\n     \"logoSmallUrl\": null,\n     \"usageRequirements\": null,\n     \"specialConsiderations\": null,\n     \"createdAt\": \"2018-02-05T21:46:46.000Z\",\n     \"updatedAt\": \"2018-02-05T21:46:46.000Z\"\n }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/tools.routes.js",
    "groupTitle": "Tools"
  },
  {
    "type": "get",
    "url": "/tools/test",
    "title": "Get  test tools",
    "version": "1.0.0",
    "name": "get_test_tools",
    "group": "Tools",
    "permission": [
      {
        "name": "none"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "tools",
            "description": "<p>Returns a list of all test tools.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n {\n     \"id\": \"f922c232-c327-4a64-a68a-d99dbaa2d2cf\",\n     \"name\": \"Mocha\",\n     \"toolType\": \"test\",\n     \"websiteUrl\": \"https://mochajs.org/\",\n     \"apiUrl\": null,\n     \"documentationUrl\": \"https://mochajs.org/#getting-started\",\n     \"logoSvgUrl\": null,\n     \"logoLargeUrl\": \"https://cdn.worldvectorlogo.com/logos/mocha-1.svg\",\n     \"logoSmallUrl\": null,\n     \"usageRequirements\": null,\n     \"specialConsiderations\": null,\n     \"createdAt\": \"2018-02-05T21:46:46.000Z\",\n     \"updatedAt\": \"2018-02-05T21:46:46.000Z\"\n }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/tools.routes.js",
    "groupTitle": "Tools"
  },
  {
    "type": "get",
    "url": "/tools",
    "title": "Get  tools",
    "version": "1.0.0",
    "name": "get_tools",
    "group": "Tools",
    "permission": [
      {
        "name": "none"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "tools",
            "description": "<p>Returns a list of all tools.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n {\n     \"id\": \"0a75985f-d2da-4c9b-a346-f49697dc1452\",\n     \"name\": \"Heroku\",\n     \"toolType\": \"deployment\",\n     \"websiteUrl\": \"https://www.heroku.com/\",\n     \"apiUrl\": \"https://api.heroku.com/\",\n     \"documentationUrl\": \"https://devcenter.heroku.com/\",\n     \"logoSvgUrl\": \"data:image/svg+xml;utf8,<svg width=\\\"27\\\" height=\\\"30\\\" viewBox=\\\"0 0 27 30\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><title>heroku-logo</title><path d=\\\"M3 0C1.13 0 0 1.11 0 2.903v24.194C0 28.883 1.13 30 3 30h21c1.863 0 3-1.11 3-2.903V2.903C26.994 1.11 25.863 0 24 0H3zm21.042 2c.508.006.958.448.958.929V27.07c0 .487-.45.929-.958.929H2.958C2.45 28 2 27.558 2 27.071V2.93c0-.488.45-.93.958-.93h21.084zM20 25h-2.781v-8.506c0-.774-.237-1.048-.468-1.208-1.396-.959-5.414-.042-7.834.916L7 17.012 7.006 5h2.816v7.917a20.99 20.99 0 0 1 1.882-.482c2.988-.643 5.184-.47 6.616.505.787.536 1.68 1.59 1.68 3.554V25zm-6-15h3.293A16.109 16.109 0 0 0 20 5h-3.287c-.49 1.188-1.385 3.188-2.713 5zM7 25v-7l3 3.5L7 25z\\\" fill=\\\"%239E7CC1\\\" fill-rule=\\\"evenodd\\\"/></svg>\",\n     \"logoLargeUrl\": \"https://status.heroku.com/images/favicon-4d37b8350e89706867dad5caab4af5e5.ico\",\n     \"logoSmallUrl\": \"https://id.heroku.com/assets/logo-vertical.png\",\n     \"usageRequirements\": \"You must have created a Heroku account before using this tool.\",\n     \"specialConsiderations\": null,\n     \"createdAt\": \"2018-02-05T21:46:46.000Z\",\n     \"updatedAt\": \"2018-02-05T21:46:46.000Z\"\n },\n {\n     \"id\": \"263d489d-e0b1-4d51-a7cc-ed85d84113cc\",\n     \"name\": \"GitHub\",\n     \"toolType\": \"sourceControl\",\n     \"websiteUrl\": \"https://github.com/\",\n     \"apiUrl\": \"https://api.github.com/\",\n     \"documentationUrl\": \"https://developer.github.com/v3/\",\n     \"logoSvgUrl\": null,\n     \"logoLargeUrl\": \"https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png\",\n     \"logoSmallUrl\": null,\n     \"usageRequirements\": null,\n     \"specialConsiderations\": null,\n     \"createdAt\": \"2018-02-05T21:46:46.000Z\",\n     \"updatedAt\": \"2018-02-05T21:46:46.000Z\"\n },\n {\n     \"id\": \"66e5470e-294e-4d8a-99dd-ab09137909ce\",\n     \"name\": \"Docker\",\n     \"toolType\": \"containerization\",\n     \"websiteUrl\": \"https://docker.com/\",\n     \"apiUrl\": \"https://index.docker.io/v1/\",\n     \"documentationUrl\": \"https://docs.docker.com/\",\n     \"logoSvgUrl\": null,\n     \"logoLargeUrl\": \"https://www.docker.com/sites/default/files/vertical_large.png\",\n     \"logoSmallUrl\": \"https://www.docker.com/sites/default/files/vertical_small.png\",\n     \"usageRequirements\": null,\n     \"specialConsiderations\": null,\n     \"createdAt\": \"2018-02-05T21:46:46.000Z\",\n     \"updatedAt\": \"2018-02-05T21:46:46.000Z\"\n }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/tools.routes.js",
    "groupTitle": "Tools"
  },
  {
    "type": "get",
    "url": "/tools/web",
    "title": "Get  web tools",
    "version": "1.0.0",
    "name": "get_web_tools",
    "group": "Tools",
    "permission": [
      {
        "name": "none"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "tools",
            "description": "<p>Returns a list of all web tools.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n {\n     \"id\": \"c8e0dd2b-bd60-46d7-bd6c-4993a2d7bc76\",\n     \"name\": \"Express.js\",\n     \"toolType\": \"web\",\n     \"websiteUrl\": \"http://expressjs.com/\",\n     \"apiUrl\": null,\n     \"documentationUrl\": \"http://expressjs.com/en/4x/api.html\",\n     \"logoSvgUrl\": null,\n     \"logoLargeUrl\": \"https://camo.githubusercontent.com/fc61dcbdb7a6e49d3adecc12194b24ab20dfa25b/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67\",\n     \"logoSmallUrl\": null,\n     \"usageRequirements\": null,\n     \"specialConsiderations\": null,\n     \"createdAt\": \"2018-02-05T21:46:46.000Z\",\n     \"updatedAt\": \"2018-02-05T21:46:46.000Z\"\n }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/tools.routes.js",
    "groupTitle": "Tools"
  },
  {
    "type": "POST",
    "url": "/auth/travis",
    "title": "Add Travis Authentication Token",
    "version": "1.0.0",
    "name": "Add_Travis_Authentication_Token",
    "group": "Travis",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Adds a travis authentication token for the user to the database. If a token already exists for the user, this function will overwrite the existing token. If it is created/updated successfully, it will return a status code of 204.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "travisToken",
            "description": "<p>the user's travis token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"travisToken\": \"123abc456\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/travisauth.routes.js",
    "groupTitle": "Travis"
  },
  {
    "type": " get ",
    "url": "/auth/travis",
    "title": "Check Travis Authentication",
    "version": "1.0.0",
    "name": "Check_Travis_Authentication",
    "group": "Travis",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Checks if the user is authenticated with travis. It will remove the token if it is not a valid travis token.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "isAuthenticated",
            "description": "<p>true if authenticated, false otherwise</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n \"isTravisAuthenticated\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/travisauth.routes.js",
    "groupTitle": "Travis"
  },
  {
    "type": "DELETE",
    "url": "/auth/travis",
    "title": "Delete Travis Authentication Token",
    "version": "1.0.0",
    "name": "Delete_Travis_Authentication_Token",
    "group": "Travis",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Deletes a travis authentication token for the user. If it is deleted successfully, it will return a status code of 204.</p>",
    "filename": "src/routes/travisauth.routes.js",
    "groupTitle": "Travis"
  },
  {
    "type": "PUT",
    "url": "/auth/travis",
    "title": "Update travis Authentication Token",
    "version": "1.0.0",
    "name": "Update_Travis_Authentication_Token",
    "group": "Travis",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "description": "<p>Updates a travis authentication token for the user. Will return a 404 if a token did not exist previously. If it is updated successfully, it will return a status code of 204.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "travisToken",
            "description": "<p>the user's travis token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"travisToken\": \"123abc456\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/travisauth.routes.js",
    "groupTitle": "Travis"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Create new user",
    "version": "1.0.0",
    "name": "create_user",
    "group": "Users",
    "permission": [
      {
        "name": "None"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the user.  Must only contain letters, numbers and underscores.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The email of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>The first name of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>The last name of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The password of the user. Must have at least 8 characters, with one letter and one number.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"username\": \"BobSagat\",\n \"email\": \"Bob@AFV.com\",\n \"firstName\": \"Bob\",\n \"lastName\": \"Sagat\",\n \"password\": \"SuperSecurePassword1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "user",
            "description": "<p>The user that was created</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n      \"id\": 1,\n      \"username\": \"BobSagat\",\n      \"email\": \"Bob@AFV.com\",\n      \"firstName\": \"Bob\",\n      \"lastName\": \"Sagat\",\n      \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n      \"updatedAt\": \"2017-11-12T20:26:47.000Z\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/users.routes.js",
    "groupTitle": "Users"
  },
  {
    "type": "delete",
    "url": "/users/:user",
    "title": "delete a user",
    "version": "1.0.0",
    "name": "delete_user",
    "group": "Users",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the user to delete.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "Status: 204 No Content",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/users.routes.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/user",
    "title": "Get authenticated user",
    "version": "1.0.0",
    "name": "get_authenticated_user",
    "group": "Users",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>Returns the authenticated user information.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n      \"id\": 1,\n      \"username\": \"BobSagat\",\n      \"email\": \"Bob@AFV.com\",\n      \"firstName\": \"Bob\",\n      \"lastName\": \"Sagat\",\n      \"githubUsername\": \"BobSagat\",\n      \"herokuEmail\": \"Bob@AFV.com\",\n      \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n      \"updatedAt\": \"2017-11-12T20:26:47.000Z\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/users.routes.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/users/:user",
    "title": "Get user by id or username",
    "version": "1.0.0",
    "name": "get_user_by_id_or_username",
    "group": "Users",
    "permission": [
      {
        "name": "none"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>Returns the user that was specified in the parameters.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"id\": 1,\n    \"username\": \"BobSagat\",\n    \"email\": \"Bob@AFV.com\",\n    \"firstName\": \"Bob\",\n    \"lastName\": \"Sagat\",\n    \"githubUsername\": \"BobSagat\",\n    \"herokuEmail\": \"Bob@AFV.com\",\n    \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n    \"updatedAt\": \"2017-11-12T20:26:47.000Z\"\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/users.routes.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Get all public users",
    "version": "1.0.0",
    "name": "get_users",
    "group": "Users",
    "permission": [
      {
        "name": "none"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "users",
            "description": "<p>Returns a list of all public users.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n    {\n     \"id\": 1,\n     \"username\": \"BobSagat\",\n     \"email\": \"Bob@AFV.com\",\n     \"firstName\": \"Bob\",\n     \"lastName\": \"Sagat\",\n     \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n     \"updatedAt\": \"2017-11-12T20:26:47.000Z\"\n    }\n  ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/users.routes.js",
    "groupTitle": "Users"
  },
  {
    "type": "patch",
    "url": "/users/:user",
    "title": "update a user",
    "version": "1.0.0",
    "name": "update_user",
    "group": "Users",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Auth-Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the user to update.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The email of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>The first name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>The last name of the user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"username\": \"BobSagat\",\n \"email\": \"Bob@AFV.net\",\n \"firstName\": \"Bob\",\n \"lastName\": \"Sagat\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>The updated user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n      \"id\": 1,\n      \"username\": \"BobSagat\",\n      \"email\": \"Bob@AFV.net\",\n      \"firstName\": \"Bob\",\n      \"lastName\": \"Sagat\",\n      \"createdAt\": \"2017-11-12T20:26:47.000Z\",\n      \"updatedAt\": \"2017-11-14T20:26:47.000Z\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/users.routes.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/projects/:projectId/logs/:buildNumber",
    "title": "",
    "version": "1.0.0",
    "name": "get_logs_for_build",
    "group": "projects",
    "permission": [
      {
        "name": "Authenticated User"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>the projectId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "buildNumber",
            "description": "<p>the the build number on TravisCI</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "jobId",
            "description": "<p>the job id the logs are for</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "log",
            "description": "<p>the contents of the log</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\n{\n  \"jobId\": \"1234\",\n  \"log\": \"log content here\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/projects.routes.js",
    "groupTitle": "projects"
  }
] });
