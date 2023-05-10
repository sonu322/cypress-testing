import i18n from "../../i18n";
import { ISSUE_TYPE_VIEW_ID } from "./traceabilityReport";

const { t } = i18n;
export const noIssueKeyError = t(
  "otpl.lxp.tree-gadget.configure-form.errors.no-issue-key"
);
export const badIssueKeyError = t(
  "otpl.lxp.tree-gadget.configure-form.errors.bad-issue-key"
);
export const badHeightError = t(
  "otpl.lxp.gadget-common.configure-form.errors.bad-height"
);
export const DASHBOARD_GADGET_CONFIG_KEY = "config";
export const DEFAULT_GADGET_HEIGHT = 500;
export const MIN_GADGET_HEIGHT = 200;

export const HEIGHT_FIELD_NAME = "height";
export const VIEW_TYPE_FIELD_NAME = "viewTypeId";
export const JQL_FIELD_NAME = "jql";
export const TABLE_FIELDS_DROPDOWN_NAME = "tableFieldsDropdown";
export const SELECTED_ISSUE_TYPE_IDS_KEY = "selectedIssueTypeIds";
export const SELECTED_LINK_TYPE_IDS_KEY = "selectedLinkTypeIds";
export const ISSUE_CARD_FIELDS_DROPDOWN_NAME = "issueCardFieldsDropdown";
export const PAGE_SIZE_DROPDOWN_NAME = "pageSizeDropdown";
export const defaultGadgetConfig = {
  [VIEW_TYPE_FIELD_NAME]: ISSUE_TYPE_VIEW_ID,
  [HEIGHT_FIELD_NAME]: DEFAULT_GADGET_HEIGHT,
  [SELECTED_ISSUE_TYPE_IDS_KEY]: undefined,
  [SELECTED_LINK_TYPE_IDS_KEY]: undefined,
  [ISSUE_CARD_FIELDS_DROPDOWN_NAME]: undefined,
  [PAGE_SIZE_DROPDOWN_NAME]: 20,
  [JQL_FIELD_NAME]: undefined,
};

export const initializationGadgetConfig = {
  [VIEW_TYPE_FIELD_NAME]: "",
  [HEIGHT_FIELD_NAME]: DEFAULT_GADGET_HEIGHT,
  [SELECTED_ISSUE_TYPE_IDS_KEY]: undefined,
  [SELECTED_LINK_TYPE_IDS_KEY]: undefined,
  [ISSUE_CARD_FIELDS_DROPDOWN_NAME]: undefined,
  [PAGE_SIZE_DROPDOWN_NAME]: 20,
  [JQL_FIELD_NAME]: undefined,
};