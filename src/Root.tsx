import React from "react";
import { Text } from "@mantine/core";

const Root = () => {
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
        Yay, this is the Root page! Finally we can start building our app 🎉
      </Text>
    </div>
  );
};

export default Root;
