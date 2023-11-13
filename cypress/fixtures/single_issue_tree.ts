import { tcConfig } from "./config";
import {
  TreeTestCase
} from "../types";

export const testcases: TreeTestCase[] = [
  {
    issueId: tcConfig.firstIssueId,
    filter: {
      priority: ["Highest", "High", "On Hold"],
      issueCardFields: ["Priority"],
      globalbutton:"exportCSV"
    },
    expected: {
      "roots": [{
        "name": "STP-1",
        "children": [{
          "name": "Parent",
          "children": [{
            "name": "STP-5",
            "children": []
          }]
        }, {
          "name": "Subtasks",
          "children": [{
            "name": "STP-6",
            "children": []
          }, {
            "name": "STP-7",
            "children": []
          }]
        }, {
          "name": "is blocked by",
          "children": [{
            "name": "STP-2",
            "children": []
          }]
        }, {
          "name": "Causes",
          "children": [{
            "name": "BTP-8",
            "children": []
          }]
        }]
      }]
    }
  },
  {
    issueId: tcConfig.firstIssueId,
    filter: {
      priority: ["High"]
    },
    
    expected: {
      "roots": [{
        "name": "STP-1",
        "children": [{
          "name": "Subtasks",
          "children": [{
            "name": "STP-7",
            "children": []
          }]
        }, {
          "name": "is blocked by",
          "children": [{
            "name": "STP-2",
            "children": []
          }]
        }]
      }]
    }
  },
  {
    issueId: tcConfig.firstIssueId,
    filter: {
      priority: ["Not Set"]
    },
    
expected: {
      "roots": [{
        "name": "STP-1",
        "children": []
      }]
    }
  },
  {
    issueId: tcConfig.firstIssueId,
    filter: {
      linkType: ["Parent", "Causes", "Relates To"]
    },
    
expected: {
      "roots": [{
        "name": "STP-1",
        "children": [{
          "name": "Parent",
          "children": [{
            "name": "STP-5",
            "children": []
          }]
        }, {
          "name": "Causes",
          "children": [{
            "name": "BTP-8",
            "children": []
          }]
        }, {
          "name": "relates to",
          "children": [{
            "name": "STP-15",
            "children": []
          }, {
            "name": "STP-13",
            "children": []
          }]
        }]
      }]
    }
  },
  {
    issueId: tcConfig.firstIssueId,
    filter: {
      linkType: ["Is Duplicated By"]
    },
    
expected: {
      "roots": [{
        "name": "STP-1",
        "children": [{
          "name": "is duplicated by",
          "children": [{
            "name": "STP-10",
            "children": []
          }]
        }]
      }]
    }
  },
  {
    issueId: tcConfig.firstIssueId,
    filter: {
      issueType: ["Bug", "Task", "Story", "Observations"]
    },
    
expected: {
      "roots": [{
        "name": "STP-1",
        "children": [{
          "name": "is blocked by",
          "children": [{
            "name": "STP-2",
            "children": []
          }]
        }, {
          "name": "Causes",
          "children": [{
            "name": "BTP-8",
            "children": []
          }]
        }, {
          "name": "clones",
          "children": [{
            "name": "BTP-4",
            "children": []
          }]
        }, {
          "name": "is duplicated by",
          "children": [{
            "name": "STP-10",
            "children": []
          }]
        }, {
          "name": "relates to",
          "children": [{
            "name": "STP-15",
            "children": []
          }]
        }]
      }]
    }
  },
  {
    issueId: tcConfig.firstIssueId,
    filter: {
      issueType: ["Sub-task"]
    },
    
expected: {
      "roots": [{
        "name": "STP-1",
        "children": [{
          "name": "Subtasks",
          "children": [{
            "name": "STP-6",
            "children": []
          }, {
            "name": "STP-7",
            "children": []
          }]
        }, {
          "name": "Is Caused By",
          "children": [{
            "name": "BTP-6",
            "children": []
          }]
        }]
      }]
    }
  },
  {
    issueId: tcConfig.firstIssueId,
    filter: {
      priority: ["Medium", "On Hold", "Low", "High"],
      linkType: ["Parent", "Subtasks", "is caused by", "duplicates", "Causes", "Relates To", "Blocks"],
      issueType: ["Task", "Sub-task", "Goal", "Observations", "Sub Goal"],
    },
    
expected: {
      "roots": [{
        "name": "STP-1",
        "children": [{
          "name": "Subtasks",
          "children": [{
            "name": "STP-7",
            "children": []
          }]
        }, {
          "name": "Causes",
          "children": [{
            "name": "BTP-8",
            "children": []
          }]
        }, {
          "name": "Is Caused By",
          "children": [{
            "name": "BTP-6",
            "children": []
          }]
        }, {
          "name": "relates to",
          "children": [{
            "name": "STP-15",
            "children": []
          }]
        }]
      }]
    }
  },
  {
    issueId: tcConfig.firstIssueId,
    filter: {
      // priority: [],
      linkType: ["Parent", "Subtasks", "Child Issues"],
      // issueType: [],
    },
    
expected: {
      "roots": [{
        "name": "STP-1",
        "children": [{
          "name": "Parent",
          "children": [{
            "name": "STP-5",
            "children": []
          }]
        }, {
          "name": "Subtasks",
          "children": [{
            "name": "STP-6",
            "children": []
          }, {
            "name": "STP-7",
            "children": []
          }]
        }]
      }]
    }
  },
  {
    issueId: tcConfig.firstIssueId,
    filter: {
      priority: [],
      linkType: [],
      issueType: [],
    },
    
expected: {
      "roots": [{
        "name": "STP-1",
        "children": [{
          "name": "Parent",
          "children": [{
            "name": "STP-5",
            "children": []
          }]
        }, {
          "name": "Subtasks",
          "children": [{
            "name": "STP-6",
            "children": []
          }, {
            "name": "STP-7",
            "children": []
          }]
        }, {
          "name": "is blocked by",
          "children": [{
            "name": "STP-2",
            "children": []
          }]
        }, {
          "name": "Causes",
          "children": [{
            "name": "BTP-8",
            "children": []
          }]
        }, {
          "name": "Is Caused By",
          "children": [{
            "name": "BTP-6",
            "children": []
          }]
        }, {
          "name": "clones",
          "children": [{
            "name": "BTP-4",
            "children": []
          }]
        }, {
          "name": "is duplicated by",
          "children": [{
            "name": "STP-10",
            "children": []
          }]
        }, {
          "name": "relates to",
          "children": [{
            "name": "STP-15",
            "children": []
          }, {
            "name": "STP-13",
            "children": []
          }]
        }]
      }]
    }
  },

  // {
  //   filter: {
  //     key: ["STP-1"], 
  //   },
  //   expected: {
];