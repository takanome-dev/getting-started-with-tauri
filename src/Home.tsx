import React from "react";
import { Text, Anchor, Space, Button, Title, TextInput } from "@mantine/core";
import * as fs from "@tauri-apps/api/fs";
import * as tauriPath from "@tauri-apps/api/path";
import * as shell from "@tauri-apps/api/shell";
import { invoke } from "@tauri-apps/api/tauri";

import { useTauriContext } from "./context/tauri-provider";
import { APP_NAME, RUNNING_IN_TAURI } from "./utils/constants";
import useTauriStore from "./hooks/useTauriStore";
import { notify } from "./utils/notify";

const Home = () => {
  const { downloads } = useTauriContext();
  console.log({ downloads });
  const [data, setData, loading] = useTauriStore("data", "");

  if (loading) return <div>Loading...</div>;

  async function createFile() {
    // run only in desktop/tauri env
    if (RUNNING_IN_TAURI) {
      // https://tauri.app/v1/api/js/modules/fs
      const filePath = `${downloads}/example_file.txt`;
      await fs.writeTextFile(
        "example_file.txt",
        "oh this is from TAURI! COOLIO.\n",
        { dir: fs.BaseDirectory.Download }
      );
      // show in file explorer: https://github.com/tauri-apps/tauri/issues/4062
      await shell.open(downloads as string);
      await invoke("process_file", { filepath: filePath }).then(msg => {
        console.log(msg === "Hello from Rust!");
        notify("Message from Rust", msg as string);
        // notifications.show({ title: 'Message from Rust', message: msg });
      });
    }
  }

  return (
    <div>
      <Text>Messing around with the file system 😃</Text>
      <Space h="md" />
      <Button onClick={createFile}>
        Create an example file in your downloads folder
      </Button>
      <Space h="md" />
      {/* <Button onClick={() => notifications.show({ title: 'Mantine Notification', message: 'test v6 breaking change'})}>Notification example</Button> */}
      <TextInput
        label="Persistent data"
        value={data}
        onChange={e => setData(e.currentTarget.value)}
      />
    </div>
  );
};

export default Home;
