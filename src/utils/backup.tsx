import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backupUserMessagesApi, getUserBackedupMessagesApi } from "../apis";
import { useEffect, useState } from "react";
import {
  UserMessages,
  addNewMessage,
  clearMessages,
  unsendMessage,
} from "../redux/slices/exampleSlice";

function isBackupNeeded(lastBackupTimestamp: any) {
  const threshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const currentTime = Date.now();
  return currentTime - lastBackupTimestamp > threshold;
}

function Backup() {
  const { user } = useSelector((state: RootState) => state.user);
  const userMessages = useSelector((state: RootState) =>
    state.example.userMessages.find((userMsg) => userMsg.userId === user?._id)
  );
  const [backupSuccess, setBackupSuccess] = useState<boolean>(false);
  const {
    data: backupUserMessagesData,
    isSuccess: backupUserMessagesSuccess,
    error: backupUserMessagesError,
    mutate: backupUserMessagesMutate,
  } = useMutation({
    mutationKey: ["backup-user-messages"],
    mutationFn: backupUserMessagesApi,
  });

  const queryClient = useQueryClient();

  const { data: getBackupMessagesData, refetch: getBackupMessagesRefetch } =
    useQuery({
      queryKey: ["get-backup-messages"],
      queryFn: getUserBackedupMessagesApi,
      enabled: false,
      retry: 1,
    });

  const dispatch = useDispatch();

  useEffect(() => {
    getBackupMessagesRefetch();
  }, [backupUserMessagesSuccess]);

  useEffect(() => {
    if (userMessages?.messages.length) {
      const storedTimestamp = localStorage.getItem("lastBackupTimestamp");
      let lastBackupTimestamp;

      if (storedTimestamp) {
        try {
          lastBackupTimestamp = new Date(JSON.parse(storedTimestamp));
        } catch (error) {
          console.error("Error parsing stored timestamp:", error);
          // Handle parsing error, such as using a default value
          lastBackupTimestamp = new Date();
        }
      } else {
        lastBackupTimestamp = new Date();
      }

      const backedUpMessageIds: Array<string> = JSON.parse(
        localStorage.getItem("backedUpMessagesIds") || "[]"
      );

      const messagesToBackup = userMessages?.messages.filter(
        (message) => !backedUpMessageIds.includes(message._id)
      );

      if (isBackupNeeded(lastBackupTimestamp)) {
        backupUserMessagesMutate({
          userId: user ? user._id : "",
          messages: messagesToBackup,
          _id: userMessages._id,
        });
      }
      if (backupSuccess) {
        const messageIds = [];
        for (let i = 0; i < messagesToBackup.length; i++) {
          for (let j = 0; j < messagesToBackup[i].contents.length; j++) {
            messageIds.push(messagesToBackup[i].contents[j]._id);
          }
        }
        if (messageIds.length) {
          for (let i = 0; i < messageIds.length; i++) {
            dispatch(
              unsendMessage({
                userId: user ? user._id : "",
                messageId: messageIds[i],
              })
            );
          }
        }
        localStorage.setItem("lastBackupTimestamp", String(new Date()));
      }
    }
  }, [user]);

  useEffect(() => {
    if (backupUserMessagesData && backupUserMessagesSuccess) {
      setBackupSuccess(true);
    }
    if (backupUserMessagesError) {
      setBackupSuccess(false);
    }
  }, [
    backupUserMessagesData,
    backupUserMessagesSuccess,
    backupUserMessagesError,
  ]);

  useEffect(() => {
    const backedUpMessageIds: Array<string> = JSON.parse(
      localStorage.getItem("backedUpMessagesIds") || "[]"
    );
    if (getBackupMessagesData) {
      if (getBackupMessagesData.data?.backupMessages) {
        let messagesToAdd: UserMessages[] =
          getBackupMessagesData.data?.backupMessages;
        dispatch(clearMessages());
        messagesToAdd.forEach((userMsg) =>
          userMsg.messages.map((msg) =>
            msg.contents.map((item) => {
              dispatch(
                addNewMessage({
                  userId: userMsg.userId,
                  sender: item.sender,
                  recipient: item.recipient,
                  content: item.content,
                  createdAt: item.createdAt,
                })
              );
              backedUpMessageIds.push(item._id);
            })
          )
        );

        queryClient.resetQueries({ queryKey: ["get-backup-messages"] });
      }
    }
    localStorage.setItem(
      "backedUpMessagesIds",
      JSON.stringify(backedUpMessageIds)
    );
  }, [getBackupMessagesData]);

  return <p />;
}

export default Backup;
