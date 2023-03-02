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

export const download = (type, content) => {
  let source = null;
  let file = null;
  if (type === "csv") {
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
