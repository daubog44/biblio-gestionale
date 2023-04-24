"use client";
import {
  checkUpdate,
  installUpdate,
  onUpdaterEvent,
} from '@tauri-apps/api/updater';
import { useEffect, useState } from 'react';

export default function Home() {
  const [version, setVersion] = useState<string | undefined>("Some");

  useEffect(() => {
    let unlisten: () => void;
    (async function () {
      unlisten = await onUpdaterEvent(({ error, status }) => {
        // This will log all updater events, including status updates and errors.
        console.log('Updater event', error, status)
      })

      try {
        const { shouldUpdate, manifest } = await checkUpdate()

        if (shouldUpdate) {
          // You could show a dialog asking the user if they want to install the update here.
          setVersion(manifest?.version);
          console.log(
            `Installing update ${manifest?.version}, ${manifest?.date}, ${manifest?.body}`
          )
        }
      } catch (error) {
        console.error(error)
      }
    })();

    return () => {
      unlisten()
    }
  }, [])


  return (
    <>
      {version ? version : "not updates"}
    </>
  )
}
