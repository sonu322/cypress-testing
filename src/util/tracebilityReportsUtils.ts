import { download, toTitleCase } from "./index";
export const exportReport = (selectedTableFieldIds, filteredIssues) => {
  const upsurt = (holder, link, links) => {
    const issue = link.inwardIssue ?? link.outwardIssue;
    if (
      selectedTableFieldIds
        .get("issueTypes")
        .includes(issue.fields.issuetype.id)
    ) {
      let name = link.inwardIssue ? link.type.inward : link.type.outward;
      name = toTitleCase(name);
      if (!links.includes(name)) {
        links.push(name);
      }
      if (!holder[name]) holder[name] = [];
      holder[name].push(issue);
    }
  };
  console.log("table field ids!!");
  console.log(selectedTableFieldIds);
  const links = [];
  const classifieds = [];
  filteredIssues.forEach((issue) => {
    const fields = issue.fields;
    const classified = {
      issue,
      subtasks: fields.subtasks.filter((issue) =>
        selectedTableFieldIds
          .get("issueTypes")
          .includes(issue.fields.issuetype.id)
      ),
    };
    if (
      fields.parent &&
      selectedTableFieldIds
        .get("issueTypes")
        .includes(fields.parent.fields.issuetype.id)
    ) {
      classified.parent = fields.parent;
    }
    if (fields.issuelinks) {
      fields.issuelinks.forEach((link) => {
        console.log("checking links!!!!!!!");
        console.log(selectedTableFieldIds.get("linkTypes"));
        console.log(link);
        if (selectedTableFieldIds.get("linkTypes").includes(link.type.id)) {
          upsurt(classified, link, links);
        }
      });
    }
    classifieds.push(classified);
  });
  links.sort();
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
    console.log(content);
  });
  download("csv", content);
};
