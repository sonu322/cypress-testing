import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

interface GadgetProps {
  title: string;
  url: string;
}

interface GadgetData {
  id: number;
  name: string;
}

export const Gadget: React.FC<GadgetProps> = ({ title, url }) => {
  const [data, setData] = useState<GadgetData[]>([]);

  useEffect(() => {
    // Use the AP.context.getToken() method to get the authentication token for the user making the request
    const authToken = AP.context.getToken();

    // Use the token to make API requests to your app's backend
    // ...

    // For this example, we'll just fetch some data from a public API
    fetch(url)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, [url]);

  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

Gadget.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};
