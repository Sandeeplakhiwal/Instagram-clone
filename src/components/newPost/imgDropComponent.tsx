import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewPostApi } from "../../apis";
import toast from "react-hot-toast";

interface ImageDragAndDropProps {
  closeModal: () => void;
}

const ImageDragAndDrop: FC<ImageDragAndDropProps> = ({ closeModal }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [dragging, setDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        if (reader.readyState === 2) {
          setSelectedFile(file);
        }
      };
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        if (reader.readyState === 2) {
          setSelectedFile(file);
        }
      };
    }
  };

  const [caption, setCaption] = useState("");

  const queryClient = useQueryClient();

  const { isPending: MutationPending, mutateAsync } = useMutation({
    mutationKey: ["Share-post"],
    mutationFn: createNewPostApi,
    onSuccess: () => {
      closeModal();
      setCaption("");
      setSelectedFile(null);
      toast.success("Post Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["postsOfFollowing"] });
    },
  });

  const handlePostSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutateAsync({ caption, image: selectedFile });
  };

  console.log(selectedFile);
  // console.log(URL.createObjectURL(selectedFile));

  console.log(MutationPending);

  return (
    <div className="flex flex-col sm:flex-row justify-center text-center gap-5 sm:gap-0">
      <div
        className={`flex flex-col items-center justify-center h-[150px] sm:h-[250px] mt-4 rounded-md mx-auto ${
          selectedFile ? "visible w-[80%] sm:w-[40%]" : "invisible w-0"
        }`}
      >
        {selectedFile && (
          <img
            alt="Uploaded Image"
            className="object-cover w-full h-full rounded-md"
            height={200}
            src={URL.createObjectURL(selectedFile)} // Use createObjectURL to display the selectedFile
            style={{
              aspectRatio: "200/200",
              objectFit: "cover",
            }}
            width={200}
          />
        )}
        <button
          type="button"
          className=" text-blue-medium font-bold text-xs my-2"
          onClick={() => setSelectedFile(null)}
        >
          Change Image
        </button>
      </div>
      {selectedFile ? (
        <div className=" w-[100%] sm:w-[40%] p-4 sm:p-0 text-center">
          <div className=" flex items-center mb-1">
            <img
              src="/images/avatars/dali.jpg"
              alt="dali"
              className=" h-7 w-7 rounded-full mr-1"
            />
            <p className=" font-bold text-xs">Sandeep Lakhiwal</p>
          </div>
          <form className=" flex flex-col gap-4">
            <textarea
              id="caption"
              title="caption"
              placeholder="Write a caption.."
              rows={4}
              className=" border-gray-primary p-2 outline-none text-gray-base italic"
              style={{ backgroundColor: "#fafafa" }}
              onChange={(e) => setCaption(e.target.value)}
              value={caption}
            />
            <button
              type="button"
              className={`text-blue-medium  font-bold rounded w-6/12 mx-auto py-1 ${
                !selectedFile && !caption ? "opacity-50" : ""
              }`}
              disabled={!selectedFile && !caption}
              onClick={(e) => handlePostSubmit(e)}
            >
              {MutationPending ? "Sharing.." : "Share"}
            </button>
          </form>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center mx-auto rounded-md bg-gray-100 dark:bg-gray-800 outline-none border-none ${
            selectedFile ? "w-[80%] sm:w-[50%]" : "w-full"
          }`}
        >
          <div
            className="flex flex-col items-center justify-center space-y-2"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <UploadIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            {dragging ? (
              <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                Drop the image here
              </h2>
            ) : (
              <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                Drag & Drop your image here
              </h2>
            )}
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-blue-medium text-white py-2 px-4 rounded-md inline-block my-4"
            >
              Choose File
            </label>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={(e) => handleFileChange(e)}
              accept="image/*"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDragAndDrop;

interface UploadIconProps {
  className?: string;
}

function UploadIcon({ className }: UploadIconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
