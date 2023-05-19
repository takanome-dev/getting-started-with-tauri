import React from "react";
import { Text } from "@mantine/core";

const Settings = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "100px",
      }}
    >
      <Text>
        {" "}
        Yay, this is the settings page! Finally we can start building our app 🎉
      </Text>
    </div>
  );
};

export default Settings;
