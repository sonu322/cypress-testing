import URLSearchParams from "@ungap/url-search-params";

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

export const download = (type, content) => {
  let source = null;
  let file = null;
  if ("csv" === type) {
    source = `data:text/csv;charset=utf-8, + ${encodeURIComponent(content)}`;
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
