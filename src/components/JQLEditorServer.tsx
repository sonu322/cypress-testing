import React, { useCallback, useContext, useState /*, useEffect*/ } from "react";
import { JQLEditorAsync as JQLEditor, CustomJqlError } from "@atlassianlabs/jql-editor";
import { useAutocompleteProvider } from "@atlassianlabs/jql-editor-autocomplete-rest";
import { APIContext } from "../context/api";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import Button from "@atlaskit/button";

interface Props {
  onSearch: any,
  isEditorOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  options: any;
  jql: string,
  setJQLString: React.Dispatch<React.SetStateAction<string>>;
}

export const CustomJQLEditor = ({
  onSearch,
  isEditorOpen,
  setIsOpen,
  options,
  jql,
  setJQLString
}: Props): JSX.Element => {
  const closeModal = useCallback(() => setIsOpen(false), []);
  const [errors, setErrors] = useState<CustomJqlError[]>([]);
  // const [locale, setLocale] = useState<string>("en");
  const api = useContext(APIContext);

  // useEffect(() => {
  //   // first we need to find out the supported locale values 
  //   // by the jql editor component
  //   const setupLocale = async (): Promise<void> => {
  //     setLocale(await api.getLocale());
  //   };
  //   void setupLocale();
  // }, [api]);

  const getInitialData = async (): Promise<any> => {
    const data = await api.getAutoCompleteData();
    return {
      jqlFields: data.visibleFieldNames,
      jqlFunctions: data.visibleFunctionNames,
    };
  };

  const getSuggestions = async (url: string): Promise<any> => {
    const parts = url.split("?");
    const query = parts?.length > 1 ? parts[1] : "";
    try {
      return await api.getAutoCompleteSuggestions(query);
    } catch (err) {
      console.error(err);
    }
  };

  const submitModal = (): void => {
    if (errors.length > 0) {
      const el = document.querySelectorAll("[data-testid=\"jql-editor-search\"]");
      if (el.length > 0) {
        el[0].click();
      }
    } else {
      onJQLSearch(jql);
    }
  };

  const onJQLSearch = (jql: string): void => {
    if (errors.length === 0) {
      setIsOpen(false);
      setJQLString(jql);
      onSearch(jql);
    }
  };

  const onUpdate = (jql: string, jast: any): void => {
    setJQLString(jql);
    setErrors(jast.errors);
  };

  const autocompleteProvider = useAutocompleteProvider("", getInitialData, getSuggestions);

  return (
    <ModalTransition>
      {isEditorOpen && (
        <Modal onClose={closeModal}>
          <ModalHeader>
            <ModalTitle>{options.header}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            {options.descriptionText}
            <JQLEditor
              analyticsSource={""}
              query={jql}
              onSearch={onJQLSearch}
              onUpdate={onUpdate}
              autocompleteProvider={autocompleteProvider}
              locale={"en"} // locale is hard coded
            />
          </ModalBody>
          <ModalFooter>
            <Button appearance="primary" onClick={submitModal} autoFocus>
              {options.submitText}
            </Button>
            <Button appearance="subtle" onClick={closeModal}>
              {options.cancelText}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTransition>
  );
};