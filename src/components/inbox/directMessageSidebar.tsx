import { useSelector } from "react-redux";
import InboxMessangerProfile, {
  InboxMessangerSuggestedProfile,
} from "./inboxMessangerProfile";
import { RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import { User } from "../../redux/slices/userSlice";

function DirectMessageSidebar() {
  const { userMessages } = useSelector((state: RootState) => state.example);
  const { user } = useSelector((state: RootState) => state.user);
  const userIndex = userMessages.findIndex(
    (userMsg) => userMsg.userId === user?._id
  );

  return (
    <>
      {userIndex !== -1 ? (
        <>
          {userMessages[userIndex].messages.map((msg, index) => (
            <Link to={`/direct/t/${msg.sender}`}>
              <InboxMessangerProfile key={index} message={msg} />
            </Link>
          ))}
          <p className=" text-xs font-bold m-2 hidden sm:block">Suggestions</p>
          {user &&
            user.following.map((profile: User, index) => (
              <Link to={`/direct/t/${profile._id}`}>
                <InboxMessangerSuggestedProfile
                  key={index}
                  userId={profile._id}
                />
              </Link>
            ))}
        </>
      ) : (
        <>
          <p>Suggestions</p>
          {user &&
            user.following.map((profile: User, index) => (
              <Link to={`/direct/t/${profile._id}`}>
                <InboxMessangerSuggestedProfile
                  key={index}
                  userId={profile._id}
                />
              </Link>
            ))}
        </>
      )}
    </>
  );
}

export default DirectMessageSidebar;
