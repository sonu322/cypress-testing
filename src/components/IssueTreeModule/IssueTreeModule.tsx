import React, { useEffect, useState, useContext } from "react";
import { Toolbar } from "./Toolbar";
import { IssueTree } from "./IssueTree";
import { ErrorsList } from "../common/ErrorsList";
import TreeUtils from "../../util/TreeUtils";
import { APIContext } from "../../context/api";
import { IssueField, IssueTreeFilter } from "../../types/api";
import styled from "styled-components";

const Container = styled.div`
  min-height: 20rem;
`;
export const IssueTreeModule = () => {
  const api = useContext(APIContext);
  const treeUtils = new TreeUtils(api);

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [options, setOptions] = useState({});
  const [filter, setFilter] = useState<IssueTreeFilter>({
    priorities: [],
    issueTypes: [],
    linkTypes: [],
  });
  const [tree, setTree] = useState(treeUtils.getRootTree());
  const [issueFields, setIssueFields] = useState<IssueField[]>([]);
  const [selectedIssueFieldIds, setSelectedIssueFieldIds] = useState<string[]>(
    []
  );

  const handleNewError = (error) => {
    setErrors((prevErrors) => [...prevErrors, error] as any);
  };
  const clearAllErrors = (): void => {
    setErrors([]);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await Promise.all([
          api.getPriorities(),
          api.getIssueTypes(),
          api.getIssueLinkTypes(),
          api.getIssueFields(),
        ]);

        const priorities = result[0],
          issueTypes = result[1],
          linkTypes = result[2],
          fields = result[3];

        const filterObj = {
          priorities: priorities.map((option) => option.id),
          issueTypes: issueTypes.map((option) => option.id),
          linkTypes: linkTypes.map((option) => option.id),
        };
        setFilter(filterObj);
        setOptions({ priorities, issueTypes, linkTypes });

        const selectedFieldIds = fields.map((field) => field.id);
        setSelectedIssueFieldIds(selectedFieldIds);
        setIssueFields(fields);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        handleNewError(error);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilteredKeyOptions = (key, keyOptions) => {
    setFilter((prevFilter) => {
      let newFilter = { ...prevFilter };
      newFilter[key] = keyOptions;
      return newFilter;
    });
  };

  const filterDropdowns = [
    { key: "priorities", label: "Priority" },
    { key: "linkTypes", label: "Link type" },
    { key: "issueTypes", label: "Issue type" },
  ];

  return isLoading ? (
    <div>Loading data ...</div>
  ) : (
    <Container>
      {errors && errors.length > 0 && <ErrorsList errors={errors} />}

      <Toolbar
        exportTree={() => treeUtils.exportTree(tree)}
        isExportDisabled={Object.keys(tree.items).length <= 1}
        options={options}
        filter={filter}
        updateFilteredKeyOptions={updateFilteredKeyOptions}
        filterDropdowns={filterDropdowns}
        issueCardOptions={issueFields}
        selectedIssueFieldIds={selectedIssueFieldIds}
        setSelectedIssueFieldIds={setSelectedIssueFieldIds}
      />
      <IssueTree
        tree={tree}
        treeUtils={treeUtils}
        setTree={setTree}
        filter={filter}
        issueFields={issueFields}
        selectedIssueFieldIds={selectedIssueFieldIds}
        handleError={handleNewError}
        clearAllErrors={clearAllErrors}
      />
    </Container>
  );
};
