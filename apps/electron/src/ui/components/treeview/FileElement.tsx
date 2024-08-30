import Path from "path-browserify";
import React, { type FC, useState } from "react";

import "react-toastify/dist/ReactToastify.css";
import { Bounce, toast } from "react-toastify";

import { useGlobalContext } from "ui/components/context/GlobalContext";
import { ShareFileModal } from "ui/components/ShareFileModal";

interface FileDescription {
  filename: string;
  creationDate: number;
}

interface FileToShare {
  filename: string;
  creationDate: number;
}

const getDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

interface Props {
  fileDescription: FileDescription;
  callbackDeleteFile: () => void;
}

//Simpler version of FileElement
export const FileElement: FC<Props> = ({ fileDescription, callbackDeleteFile }) => {
  const [selectFile, setSelectFile] = useState<FileToShare | null>(null);
  const { selectedPath } = useGlobalContext();
  const fullPath = Path.join(selectedPath, fileDescription.filename);

  const handleDeleteFile = () => {
    if (!window.confirm(`Are you sure you want to delete ${fullPath}?`)) {
      return;
    }

    electron.ipcRenderer.fs.deleteDirOrFile(fullPath).then((result) => {
      if (result.isSuccessful) {
        callbackDeleteFile(); //Inform parent
      }
    });
  };

  const handleDownloadFile = () => {
    electron.ipcRenderer.fs.readFile(fullPath).then((result) => {
      console.log("hello: " + JSON.stringify(result, null, 2));
      if (result.isSuccessful) {
        console.log("success");
        toast.success("File has been downloaded.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "dark",
          transition: Bounce,
        });
      }
    });
  };

  return (
    <div className='loc-card card-active' style={{ marginTop: "20px" }}>
      <div className='loc-h-card-content-con'>
        <div className='loc-h-card-content'>
          <img src='assets/images/svg/ic_pdf.svg' alt='' />
          <div>
            <h4 style={{ marginBottom: "5px" }}>{fileDescription.filename}</h4>
            <h5>{getDateTime(fileDescription.creationDate)}</h5>
          </div>
        </div>
        <div className='loc-h-tools'>
          <div className='dropdown'>
            <img
              className='dropdown-toggle'
              src='assets/images/svg/ic_team_dropdown.svg'
              alt='more-options'
              id='dropdownMenuButton1'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            />
            <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
              <li className='dropdown-item'>
                <img style={{ width: "35px" }} src={"assets/images/svg/user_default.svg"} alt='user' />
                <div onClick={() => electron.ipcRenderer.fs.shareFile(fullPath, "jason")}>Jason Roy (Share Test)</div>
              </li>
              <li className='dropdown-item'>
                <img style={{ width: "35px" }} src={"assets/images/svg/user_default.svg"} alt='user' />
                <div>Jos Butler</div>
              </li>
              <li className='dropdown-item'>
                <img style={{ width: "35px" }} src={"assets/images/svg/user_default.svg"} alt='user' />
                <div>Ian Bell</div>
              </li>
            </ul>
          </div>
          <img
            style={{ cursor: "pointer" }}
            src={"assets/images/svg/ic_share.svg"}
            alt='more-options'
            data-bs-toggle='modal'
            data-bs-target='#shareModal'
            onClick={() => setSelectFile(fileDescription)}
          />
          <div className='dropdown'>
            <img
              className='dropdown-toggle'
              style={{ width: "5px" }}
              src={"assets/images/svg/ic_3_dots.svg"}
              alt='more-options'
              id='dropdownMenuButton2'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            />
            <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton2'>
              <li className='dropdown-item' onClick={handleDeleteFile}>
                Delete
              </li>
              <li className='dropdown-item' onClick={handleDownloadFile}>
                Download
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ShareFileModal selectedFile={selectFile} setSelectedFile={setSelectFile} />
    </div>
  );
};
