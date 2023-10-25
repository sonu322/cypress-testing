import { TreeTestCase } from "../types";

export const testcases: TreeTestCase[] = [
  {
    filter: {
      priority: ["Medium"]
    },
    expected: {
      "roots": [{
        "name": "P3-1",
        "children": [{
          "name": "Subtasks",
          "children": [{
            "name": "P3-11",
            "children": []
          }, {
            "name": "P3-12",
            "children": []
          }]
        }, {
          "name": "is blocked by",
          "children": [{
            "name": "PROJ-21",
            "children": []
          }]
        }, {
          "name": "clones",
          "children": [{
            "name": "PROJ-31",
            "children": []
          }]
        }, {
          "name": "Custom Outward Link",
          "children": [{
            "name": "PROJ-31",
            "children": []
          }]
        }, {
          "name": "Custom Inward Link",
          "children": [{
            "name": "PROJ-4",
            "children": []
          }]
        }, {
          "name": "Child issues",
          "children": [{
            "name": "P3-9",
            "children": []
          }, {
            "name": "P3-7",
            "children": []
          }, {
            "name": "P3-3",
            "children": []
          }, {
            "name": "P3-2",
            "children": []
          }]
        }]
      }]
    }
  }
];