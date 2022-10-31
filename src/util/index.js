import URLSearchParams from "@ungap/url-search-params";
export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
export const UUID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
};

export const csv = function (rows, header) {
  let content = "";
  if (header) {
    content += `"indent","key","link","summary","type","status","priorty"\n`;
  } else {
    content += `"","","","","","",""\n`;
  }

  rows.forEach((row) => {
    const { indent, key, link, summary, type, status, priority } = row;
    content += `"${indent}","${key}","${link}","${summary}","${type}","${status}","${priority}"\n`;
  });

  return content;
};
export const reportCsv = function (classifieds, links) {
  links.unshift("subtasks");
  console.log("from report csv");
  console.log(classifieds);
  console.log(links);
  let content = "";
  let headerLinks = ["Issue", "Parent"];
  links.forEach((link) => {
    headerLinks.push(`"${toTitleCase(link)}"`);
  });
  let header = headerLinks.toString();
  header = header += "\n";
  // if (header) {
  content += header;
  console.log(header);
  // } else {
  //   content += `"","","","","","",""\n`;
  // }

  classifieds.forEach((classified) => {
    const rowItems = [];
    links.forEach((link) => {
      let item = [];
      if (classified[link] && classified[link].length > 0) {
        classified[link].forEach((issue) => {
          console.log("issue");
          console.log(issue);
          if (issue && issue.key) {
            item.push(issue.key);
          } else {
            item.push("err");
          }
        });
        item = item.toString();
      } else {
        item = "--";
      }
      rowItems.push(`"${item}"`);
    });
    // if(classified.subtasks) {
    //   subtasks.forEach(subtask => {
    //     rowItems.push(`"${subtask.key}"`)
    //   });
    // } else {
    //   rowItems.push("")
    // }
    if (classified.parent) {
      rowItems.unshift(`"${classified.parent.key}"`);
    } else {
      rowItems.unshift("--");
    }
    rowItems.unshift(`"${classified.issue.key}"`);

    let rowContent = rowItems.toString();
    rowContent = rowContent += "\n";
    content += rowContent;
  });
  return content;
};


export const download = (type, content) => {
  let source = null;
  let file = null;
  if ("csv" === type) {
    source = `data:text/csv;charset=utf-8,${encodeURIComponent(content)}`;
    file = "links-explorer.csv";
  }

  if (source && file) {
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = file;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  }
};

export const getStatusAppearance = (category) => {
  const know = ["default", "inprogress", "moved", "new", "removed", "success"];
  let color = category.colorName;
  let type = "default";
  if (know.includes(category.key)) {
    type = category.key;
  } else {
    if (color.includes("gray")) {
      type = "default";
    } else if (color.includes("green")) {
      type = "success";
    } else if (color.includes("blue")) {
      type = "inprogress";
    } else if (color.includes("red")) {
      type = "removed";
    } else if (color.includes("yellow")) {
      type = "moved";
    }
  }

  return type;
};
export const getQueryParam = (paramName) => {
  const searcher = new URLSearchParams(location.search);
  const paramValue = searcher.get(paramName);
  return paramValue;
};
export const getFieldIds = (issueFields) => {
  const fieldIds = [];
  for (let field of issueFields.values()) {
    fieldIds.push(field.id);
  }
  return fieldIds;
};