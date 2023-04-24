import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { DEFAULT_GADGET_HEIGHT } from "../../constants/gadgetTraceability";

import Form, { FormSection, FormFooter } from "@atlaskit/form";
import Spinner from "@atlaskit/spinner";
import { APIContext } from "../../context/api";
import { TreeGadgetConfig } from "../../types/app";
import { Gadget } from "./Gadget";
import { GadgetConfigurationForm } from "./GadgetConfigForm";
import APIImpl from "../../impl/Cloud";
import JiraCloudImpl from "../../impl/jira/Cloud";
import { getQueryParam } from "../../util/index";
import { DashboardContext } from "../common/Dashboard/DashboardContext";
import { IssueKeyField } from "./IssueKeyField";
import {
  badIssueKeyError,
  DASHBOARD_GADGET_CONFIG_KEY,
  defaultGadgetConfig,
  HEIGHT_FIELD_NAME,
  ISSUE_KEY_FIELD_NAME,
  noIssueKeyError,
} from "../../constants/gadgetTree";
import { useTranslation } from "react-i18next";
import { ErrorsList } from "../common/ErrorsList";
import LXPAPI from "../../types/api";

interface ContainerProps {
  height: number;
}
type ValidationError = Record<string, string>;
const Container = styled.div<ContainerProps>`
  height: ${({ height }) => height}px;
  overflow: auto;
`;

const InlineContainer = styled.div`
  display: inline-block;
`;
const SpinnerContainer = styled.span`
  display: flex;
  min-width: 24px;
  width: 24px;
  height: 64px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
  padding-top: 8px;
`;

const createAPI = (): LXPAPI => {
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);

  return api;
};
const validate = (issueKey: string): ValidationError => {
  const errors: ValidationError = {};
  const issueKeyRegex = /^[A-Z][A-Z0-9]{0,9}-\d+$/; // Regex for issue key pattern
  if (issueKey === undefined || issueKey === "") {
    errors.issueKey = noIssueKeyError;
  } else if (!issueKeyRegex.test(issueKey)) {
    errors.issueKey = badIssueKeyError;
  }
  return errors;
};
const DashboardGadget: React.FC = () => {
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [config, setConfig] = useState<TreeGadgetConfig>();
  const [dashboardId, setDashboardId] = useState();
  const [dashboardItemId, setDashboardItemId] = useState();
  const [inputIssueKey, setInputIssueKey] = useState<string>();
  const [apiResponseErrors, setApiResponseErrors] = useState<Error[]>([]);
  const { t } = useTranslation();
  const updateConfig = (config: TreeGadgetConfig): void => {
    setConfig(config);
  };
  const updateIsConfiguring = (isConfiguring: boolean): void => {
    setIsConfiguring(isConfiguring);
  };

  const api = useMemo(() => createAPI(), []);

  useEffect(() => {
    if (config?.height !== undefined) {
      api.resizeWindow("100%", config.height);
    }
    setInputIssueKey(config?.issueKey);
  }, [config, api]);

  const issueKeyLabel = t(
    "otpl.lxp.tree-gadget.configure-form.fields.issue-key"
  );

  useEffect(() => {
    const getConfig = async (): Promise<void> => {
      try {
        const config = await api.getDashboardGadgetConfig(
          dashboardId,
          dashboardItemId
        );
        setConfig(config.value);
        setIsConfiguring(false);
      } catch (error: unknown) {
        setConfig(defaultGadgetConfig);
        setIsConfiguring(true);
      }
    };
    const dashboardId = getQueryParam("dashboardId");
    const dashboardItemId = getQueryParam("dashboardItemId");
    if (dashboardId !== undefined) {
      setDashboardId(dashboardId);
    }
    if (dashboardItemId !== undefined) {
      setDashboardItemId(dashboardItemId);
    }
    if (dashboardId !== undefined && dashboardItemId !== undefined) {
      void getConfig();
    }
  }, [api]);

  // event handler to handle click on configure button provided by jira
  AP.require(["jira"], function (jira) {
    jira.DashboardItem.onDashboardItemEdit(function () {
      // render dashboard item configuration now
      setIsConfiguring(true);
    });
  });

  const handleInputIssueKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;
    setInputIssueKey(value);
  };

  const handleInputIssueKeySubmit = async (): Promise<ValidationError> => {
    setApiResponseErrors([]);
    const errors = validate(inputIssueKey);
    if (Object.keys(errors).length > 0) {
      return errors;
    }
    setConfig((prevConfig) => ({
      ...prevConfig,
      [ISSUE_KEY_FIELD_NAME]: inputIssueKey,
    }));

    try {
      await api.editDashboardItemProperty(
        dashboardId,
        dashboardItemId,
        DASHBOARD_GADGET_CONFIG_KEY,
        { ...config, issueKey: inputIssueKey }
      );
    } catch (error) {
      console.error(error);
      setApiResponseErrors([error]);
    }
  };

  if (
    dashboardId !== undefined &&
    dashboardItemId !== undefined &&
    config !== undefined
  ) {
    return (
      <APIContext.Provider value={api}>
        <DashboardContext.Provider
          value={{
            dashboardId,
            dashboardItemId,
            config,
            updateConfig,
            isConfiguring,
            updateIsConfiguring,
          }}
        >
          <Container
            height={config?.[HEIGHT_FIELD_NAME] ?? DEFAULT_GADGET_HEIGHT}
          >
            {apiResponseErrors?.length > 0 && (
              <ErrorsList errors={apiResponseErrors} />
            )}
            {isConfiguring ? (
              <GadgetConfigurationForm
                setApiResponseErrors={setApiResponseErrors}
              />
            ) : (
              <>
                <Form onSubmit={handleInputIssueKeySubmit}>
                  {({ formProps }) => {
                    return (
                      <form {...formProps}>
                        <FormSection>
                          <InlineContainer>
                            <IssueKeyField
                              issueKeyLabel={issueKeyLabel}
                              selectedIssueKey={inputIssueKey}
                              handleInputChange={handleInputIssueKeyChange}
                            />
                          </InlineContainer>
                        </FormSection>
                        <FormFooter />
                      </form>
                    );
                  }}
                </Form>
                <Gadget
                  issueKey={
                    config[ISSUE_KEY_FIELD_NAME]?.length > 0
                      ? config[ISSUE_KEY_FIELD_NAME]
                      : "TNG31-12"
                  }
                />
              </>
            )}
          </Container>
        </DashboardContext.Provider>
      </APIContext.Provider>
    );
  } else {
    return (
      <SpinnerContainer>
        <Spinner size={"large"} />
      </SpinnerContainer>
    );
  }
};
const App = document.getElementById("app");
ReactDOM.render(<DashboardGadget />, App);
