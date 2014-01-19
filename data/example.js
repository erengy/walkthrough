loadWalkthrough({
  "meta": {
    "title": "Example",
    "author": "erengy",
    "language": "en-us",
    "description": "<p>This is an example walkthrough.</p>"
  },
  "routes": [
    {
      "title": "Route #1",
      "id": "route-1",
      "description": "Route description here.",
      "route": [
        {
          "date": "1st Jan",
          "choices": [
            "Choice #1",
            "Choice #2",
            "Choice #3",
            {
              "choice": "Choice with a comment",
              "comment": "This is the comment"
            },
            [
              "A choice with an alternative",
              "This is the alternative choice"
            ],
            [
              {
                "choice": "Choice with a comment",
                "comment": "Some comment"
              },
              {
                "choice": "Another alternative choice",
                "comment": "Another comment"
              }
            ]
          ]
        },
        {
          "date": "2nd Jan",
          "choices": [
            {
              "save": "A"
            },
            "Choice after save",
            "Final choice",
            {
              "end": "BAD END"
            },
            {
              "load": "A"
            },
            "Choice after load",
            "Final choice",
            {
              "end": "GOOD END"
            }
          ]
        }
      ]
    }
  ]
});