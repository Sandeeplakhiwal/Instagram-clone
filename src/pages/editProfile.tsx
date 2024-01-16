import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  UpdateNameEmail,
  UpdatePassword,
  changeAvatarApi,
  deleteMyProfileApi,
  updateNameEmailApi,
  updatePasswordApi,
} from "../apis";
import { useFormik } from "formik";
import { updateNameEmailSchema, updatePasswordSchema } from "../schema";
import { WhiteLittleLoader } from "../components/littleLoader";
import toast from "react-hot-toast";
import Header from "../components/header";
import { isAxiosError } from "axios";
import {
  SelectedFile,
  readFileAsync,
} from "../components/newPost/imgDropComponent";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../constants/routes";

function EditProfile() {
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [usernameEditToggled, setUserNameEditToggled] = useState(false);
  const [emailEditToggled, setEmailEditToggled] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);

  const { user } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  const updateProfileInitialValues: UpdateNameEmail = {
    newName: "",
    newEmail: "",
  };

  const updatePasswordInitialValues: UpdatePassword = {
    oldPassword: "",
    newPassword: "",
  };

  const {
    mutateAsync: updateNameEmailMutate,
    isPending: updateNameEmailPending,
  } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: updateNameEmailApi,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });

  const {
    mutateAsync: updatePasswordMutate,
    isPending: updatePasswordPending,
  } = useMutation({
    mutationKey: ["update-password"],
    mutationFn: updatePasswordApi,
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error) => {
      if (error) {
        if (isAxiosError(error) && error?.message === "Network Error") {
          toast.error("Network error");
        }

        if (isAxiosError(error) && error.response && error.response.data) {
          const errorMessage = (error.response.data as { message: string })
            .message;
          toast.error(errorMessage);
        }
      }
    },
  });

  const { mutateAsync: changeAvatarMutate, isPending: changeAvatarPending } =
    useMutation({
      mutationKey: ["change-avatar"],
      mutationFn: changeAvatarApi,
      onSuccess: () => {
        toast.success("Avatar changed successfully");
      },
      onError: (error) => {
        if (error) {
          if (isAxiosError(error) && error?.message === "Network Error") {
            toast.error("Network error");
          }

          if (isAxiosError(error) && error.response && error.response.data) {
            const errorMessage = (error.response.data as { message: string })
              .message;
            toast.error(errorMessage);
          }
        }
      },
    });

  const { values, errors, handleChange, handleBlur, touched, handleSubmit } =
    useFormik({
      initialValues: updateProfileInitialValues,
      validationSchema: updateNameEmailSchema,
      onSubmit: () => {
        updateNameEmailMutate(values);
      },
    });

  const {
    values: updatePasswordValues,
    errors: updatePasswordError,
    handleChange: updatePassowordHandleChange,
    touched: updatePasswordTouched,
    handleBlur: updatePasswordHandleBlur,
    handleSubmit: updatePasswordHandleSubmit,
    setErrors,
  } = useFormik({
    initialValues: updatePasswordInitialValues,
    validationSchema: updatePasswordSchema,
    onSubmit: () => {
      updatePasswordMutate(updatePasswordValues);
    },
  });

  const {
    refetch: deleteAccountRefetch,
    isLoading: deleteAccountLoading,
    isSuccess: deleteAccountSuccess,
    data: deleteAccountData,
    error: deleteAccountError,
  } = useQuery({
    queryKey: ["delete-account"],
    queryFn: deleteMyProfileApi,
    enabled: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (deleteAccountSuccess && deleteAccountData) {
      toast.success("Account has been deleted");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate(LOGIN);
      queryClient.resetQueries({ queryKey: ["delete-account"] });
    }
    if (deleteAccountError) {
      if (
        isAxiosError(deleteAccountError) &&
        deleteAccountError?.message === "Network Error"
      ) {
        toast.error("Network error");
      }

      if (
        isAxiosError(deleteAccountError) &&
        deleteAccountError.response &&
        deleteAccountError.response.data
      ) {
        const errorMessage = (
          deleteAccountError.response.data as { message: string }
        ).message;
        toast.error(errorMessage);
      }
    }
  }, [deleteAccountSuccess, deleteAccountError, deleteAccountData]);

  const DeleteAccountHandler = () => {
    deleteAccountRefetch();
  };

  const handlePasswordUpdateBtnClick = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
    updatePasswordValues.oldPassword = "";
    setErrors({});
  };

  const changeAvatarSubmitHandler = () => {
    if (selectedFile) {
      changeAvatarMutate({
        avatar: selectedFile?.dataUrl,
        id: user ? user._id : "",
      });
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      try {
        const dataUrl = await readFileAsync(file);
        setSelectedFile({ file, dataUrl });
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  useEffect(() => {
    if (selectedFile?.dataUrl) {
      changeAvatarSubmitHandler();
    }
  }, [selectedFile]);

  return (
    <div className=" ">
      <Header />
      <div className=" bg-white w-full sm:w-4/6  min-h-screen mx-auto shadow-lg p-4">
        <h1 className=" w-full text-center font-semibold mb-2">Edit Profile</h1>
        <hr className=" mb-8" />
        <div className=" h-16 bg-[#efefef] w-full xl:w-1/2 mx-auto mb-8 flex items-center px-8 rounded-md">
          <div className=" mr-2">
            <img
              src={
                selectedFile
                  ? selectedFile.dataUrl
                  : user?.avatar
                  ? user?.avatar?.url
                  : "/images/avatars/default.png"
              }
              alt={user?.name}
              className=" h-9 w-9 rounded-full"
            />
          </div>
          <p className=" flex-grow text-xs font-bold">
            {user ? user.name : "Username"}
          </p>
          <label
            htmlFor="change-profile-input"
            className=" bg-blue-medium rounded px-2 py-1 text-white text-xs cursor-pointer"
          >
            {changeAvatarPending ? "Changing.." : "Change Profile"}
          </label>
          <input
            type="file"
            name="change-profile"
            id="change-profile-input"
            className=" hidden"
            onChange={(e) => handleFileChange(e)}
            accept="image/*"
          />
        </div>

        <h2 className=" flex flex-row items-center gap-2 px-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#448EE4"
            className="w-6 h-6"
          >
            <path
              fill-rule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clip-rule="evenodd"
            />
          </svg>
          <span className="uppercase font-bold text-gray-base">
            Account settings
          </span>
        </h2>
        <div className="px-8 pt-6 pb-8 mb-4 w-full sm:w-8/12">
          <div className="mb-4">
            <div className=" flex items-center w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 flex-grow"
                htmlFor="newName"
              >
                Username
              </label>
              <button
                className=" pr-1 pb-1 text-blue-medium"
                onClick={() => {
                  setUserNameEditToggled(!usernameEditToggled);
                  values.newName = "";
                }}
              >
                {usernameEditToggled ? "Cancel" : "Edit"}
              </button>
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
              id="newName"
              name="newName"
              value={values.newName}
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              placeholder={user ? user.name : "Username"}
              disabled={usernameEditToggled ? false : true}
            />
            {errors.newName && touched.newName ? (
              <p className=" text-red-primary text-xs">*{errors.newName}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <div className=" flex items-center w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 flex-grow"
                htmlFor="newEmail"
              >
                Email
              </label>
              <button
                className=" pr-1 pb-1 text-blue-medium"
                onClick={() => {
                  setEmailEditToggled(!emailEditToggled);
                  values.newEmail = "";
                }}
              >
                {emailEditToggled ? "Cancel" : "Edit"}
              </button>
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
              id="newEmail"
              name="newEmail"
              type="email"
              value={values.newEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={user ? user.email : "abc@example.com"}
              disabled={emailEditToggled ? false : true}
            />
            {errors.newEmail && touched.newEmail ? (
              <p className=" text-red-primary text-xs">*{errors.newEmail}</p>
            ) : null}
          </div>
          <div className="flex items-center justify-between mb-2">
            <button
              className=" bg-blue-500 hover:bg-blue-700 text-white bg-blue-medium font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline text-xs"
              type="button"
              onClick={() => handleSubmit()}
            >
              {updateNameEmailPending ? <WhiteLittleLoader /> : "Update"}
            </button>
          </div>
          <div className="mb-2 mt-4">
            <div className=" flex items-center w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 flex-grow"
                htmlFor="oldPassword"
              >
                Password
              </label>
              <button
                className=" pr-1 pb-1 text-blue-medium"
                onClick={handlePasswordUpdateBtnClick}
              >
                {isNewPasswordVisible ? "Cancel" : "Edit"}
              </button>
            </div>
            {updatePasswordError.oldPassword &&
            updatePasswordTouched.oldPassword ? (
              <p className=" text-red-primary text-xs">
                *{updatePasswordError.oldPassword}
              </p>
            ) : null}
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="oldPassword"
              name="oldPassword"
              value={updatePasswordValues.oldPassword}
              onChange={updatePassowordHandleChange}
              onBlur={updatePasswordHandleBlur}
              type="password"
              placeholder={
                isNewPasswordVisible ? "Old Password" : "******************"
              }
              disabled={isNewPasswordVisible ? false : true}
            />
            {updatePasswordError.newPassword &&
            updatePasswordError.newPassword ? (
              <p className=" text-red-primary text-xs">
                *{updatePasswordError.newPassword}
              </p>
            ) : null}
            <input
              className={`shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                isNewPasswordVisible ? "visible" : "hidden"
              }`}
              id="newPassword"
              name="newPassword"
              value={updatePasswordValues.newPassword}
              onChange={updatePassowordHandleChange}
              onBlur={updatePasswordHandleBlur}
              type="password"
              placeholder="New Password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white bg-blue-medium font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline text-xs"
              type="button"
              onClick={() => updatePasswordHandleSubmit()}
            >
              {updatePasswordPending ? <WhiteLittleLoader /> : "Update"}
            </button>
          </div>
          <div className=" mt-14">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 flex-grow text-red-primary"
              htmlFor="delete-my-account-button"
            >
              Delete Account
            </label>
            <button
              className=" bg-[#efefef] py-2 px-5 text-xs font-bold text-red-primary rounded"
              id="delete-my-account-button"
              onClick={() => DeleteAccountHandler()}
            >
              {deleteAccountLoading ? "Wait.." : "Delete My Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
