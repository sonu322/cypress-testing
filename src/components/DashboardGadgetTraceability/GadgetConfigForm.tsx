import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_GADGET_HEIGHT,
  DEFAULT_GADGET_TITLE,
  MIN_GADGET_HEIGHT,
} from "../../constants/tree";
import { TreeGadgetConfig } from "../../types/app";
import Form, {
  Field,
  ErrorMessage,
  FormHeader,
  FormSection,
  FormFooter,
} from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
import Button, { ButtonGroup } from "@atlaskit/button";
import { DashboardContext } from "../common/Dashboard/DashboardContext";
import JiraCloudImpl from "../../impl/jira/Cloud";
import APIImpl from "../../impl/Cloud";
import { ErrorsList } from "../common/ErrorsList";
import { useTranslation } from "react-i18next";
import Select, {
  components,
  OptionProps,
  SingleValueProps,
  ValueType,
  CreatableSelect,
} from "@atlaskit/select";
import { ViewSelect } from "./ViewSelect";

interface Option {
  label: string;
  value: string;
}

interface IssueViewOption extends Option {
  label: "Issue Type View";
}

interface LinkViewOption extends Option {
  label: "Link Type View";
}

interface TreeViewOption extends Option {
  label: "Tree View";
}

type ViewOption = IssueViewOption | LinkViewOption | TreeViewOption;

interface FormValues {
  view: ValueType<ViewOption>;
}

const options: ViewOption[] = [
  { label: "Issue Type View", value: "issue" },
  { label: "Link Type View", value: "link" },
  { label: "Tree View", value: "tree" },
];
interface Category {
  colors?: ValueType<Option>;
  icecream?: ValueType<Option[]>;
  suit?: ValueType<Option[]>;
}
type ValidationError = Record<string, string>;

const createAPI = () => {
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);

  return api;
};

export const GadgetConfigurationForm: React.FC = () => {
  const [inputConfig, setInputConfig] = useState<any>({
    title: DEFAULT_GADGET_TITLE,
    view: "",
    height: DEFAULT_GADGET_HEIGHT,
  });
  const [apiResponseErrors, setApiResponseErrors] = useState<Error[]>([]);
  // const [options, setOptions] = useState([
  //   { label: "Issue Type View", value: "issue" },
  //   { label: "Link Type View", value: "link" },
  //   { label: "Tree View", value: "tree" },
  // ]);
  const dashboardContext = useContext(DashboardContext);
  const {
    dashboardId,
    dashboardItemId,
    config: savedConfig,
    updateConfig: updateSavedConfig,
    updateIsConfiguring,
  } = dashboardContext;
  const { t } = useTranslation();

  const api = useMemo(() => createAPI(), []);
  useEffect(() => {
    if (savedConfig !== undefined) {
      setInputConfig(savedConfig);
    }
  }, [savedConfig, setInputConfig]);
  const handleCancelFormSubmission = (): void => {
    updateIsConfiguring(false);
  };
  const handleSave = async (): ValidationError => {
    console.log("handle save called");
    setApiResponseErrors([]);
    const errors = validate(inputConfig);
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      return errors;
    }
    try {
      console.log("calling apis");

      await Promise.all([
        api.editDashboardItemProperty(
          dashboardId,
          dashboardItemId,
          "config",
          inputConfig
        ),
        api.editDashboardItemTitle(
          dashboardId,
          dashboardItemId,
          inputConfig.title
        ),
      ]);
      console.log("called apis done");
      updateIsConfiguring(false);
      updateSavedConfig(inputConfig);
    } catch (error) {
      console.error(error);
      setApiResponseErrors((prevErrors) => [...prevErrors, error]);
    }
  };

  const handleInputChange = (name, value, type): void => {
    console.log("HANDLE INPUT CHANGE CALLED");
    let parsedValue: unknown = value;
    if (type === "number") {
      parsedValue = parseFloat(value);
    }
    setInputConfig((prevConfig) => ({
      ...prevConfig,
      [name]: parsedValue,
    }));
  };
  const configureLabel = t("otpl.lxp.gadget.configure-label");
  const configureFormDescription = t(
    "otpl.lxp.gadget.configure-form.description"
  );
  const filterLabel = t("otpl.lxp.gadget.configure-form.fields.filter");
  const titleLabel = t("otpl.lxp.gadget.configure-form.fields.title");
  const heightLabel = t("otpl.lxp.gadget.configure-form.fields.height");
  const noTitleError = t("otpl.lxp.gadget.configure-form.errors.no-title");
  const badTtileError = t("otpl.lxp.gadget.configure-form.errors.bad-title");
  const submitButtonLabel = t("otpl.lxp.gadget.configure-form.buttons.submit");
  const cancelButtonLabel = t("otpl.lxp.gadget.configure-form.buttons.cancel");
  const badHeightError = t("otpl.lxp.gadget.configure-form.errors.bad-height");
  const validate = (values: TreeGadgetConfig): ValidationError => {
    const errors: ValidationError = {};
    const titleRegex =
      /^[a-zA-Z][a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]{0,49}$/;
    if (values.title === undefined || values.title === "") {
      errors.title = noTitleError;
    } else if (!titleRegex.test(values.title)) {
      errors.title = badTtileError;
    }
    if (values.height < MIN_GADGET_HEIGHT) {
      errors.height = `${badHeightError} : ${MIN_GADGET_HEIGHT} `;
    }
    return errors;
  };

  return (
    <div>
      <ErrorsList errors={apiResponseErrors} />
      <Form onSubmit={handleSave}>
        {({ formProps }) => {
          return (
            <form {...formProps}>
              <FormHeader
                title={configureLabel}
                description={configureFormDescription}
              />
              <FormSection>
                <ViewSelect
                  name={"view"}
                  label={"Select a view"}
                  options={options}
                  value={inputConfig.view}
                  handleInputChange={handleInputChange}
                />
                <Field
                  name="height"
                  label={heightLabel}
                  defaultValue={MIN_GADGET_HEIGHT}
                >
                  {({ fieldProps, error }) => (
                    <>
                      <TextField
                        {...fieldProps}
                        value={inputConfig.height}
                        type="number"
                        min={MIN_GADGET_HEIGHT}
                        step="1"
                        onChange={(value) =>
                          handleInputChange("height", value, "number")
                        }
                      />
                      {Boolean(error) && <ErrorMessage>{error}</ErrorMessage>}
                    </>
                  )}
                </Field>
              </FormSection>
              <FormFooter>
                <ButtonGroup>
                  <Button
                    appearance="subtle"
                    onClick={handleCancelFormSubmission}
                  >
                    {cancelButtonLabel}
                  </Button>
                  <Button
                    appearance="primary"
                    type="submit"
                    onClick={handleSave}
                  >
                    {submitButtonLabel}
                  </Button>
                </ButtonGroup>
              </FormFooter>
            </form>
          );
        }}
      </Form>
    </div>
  );
};
