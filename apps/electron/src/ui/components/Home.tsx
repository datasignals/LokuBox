import React, { type ChangeEvent, type FC, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, useResolvedPath } from "react-router-dom";
import "../css/loc-h-content.css";
import "../css/loc-layout.css";
import "../css/loc-login.css";
import "../css/main.css";
import "react-toastify/dist/ReactToastify.css";

// import {type FileDescription} from "@repo/common/Models";
interface FileDescription {
  filename: string;
  creationDate: number;
}

import { MenuChannels } from "src/channels/menuChannels";
import { useWallet } from "ui/components/context/WalletContext";
import { CreateDirectoryModal } from "ui/components/CreateDirectoryModal";
// import { Layout } from 'ui/components/Layout';
import { Layout } from "ui/components/Layout";
import { FileElement } from "ui/components/treeview/FileElement";
import { UploadFileModal } from "ui/components/UploadFileModal";

import { DirectoryElement } from "./treeview/DirectoryElement";

export const Home: FC<{ routePath: string }> = ({ routePath }) => {
  const navigate = useNavigate();
  // const { currentAccount, setCurrentAccount, isWalletConnected } = useWallet();
  const setCurrentAccount = (_s: string): any => null;
  const isWalletConntect = true;

  const [files, setFiles] = useState<FileDescription[]>([]);
  const [directories, setDirectories] = useState<string[]>([]);
  const [filesselected, setFilesselected] = useState<FileDescription | null>(null);
  const [provenanceData, setProvenanceData] = useState<any[]>([]); // Provenance
  const [errors, setErrors] = useState("");
  const [uploadFileModalVisible, setUploadFileModalVisible] = useState(false);
  const [createDirectoryModalVisible, setCreateDirectoryModalVisible] = useState(false);

  const { "*": splat } = useParams<{ "*": string }>();

  const path = splat ? `/${splat}` : "/";
  const nfsPath = "/tmp/nfs" + path;

  console.log("path: " + path);
  console.log("nfsPath: " + path);

  // const {provenanceAddress} = useGlobalContext();

  const fetchNfsContents = (): void => {
    electron.readDir(nfsPath).then((contents) => {
      setFiles(contents.files);
      setDirectories(contents.directories);
    });
  };

  useEffect(() => {
    fetchNfsContents();
  }, [path]); //Hook to a path so that it will refresh file contents when path changes

  const handleFileSelect = (file: FileDescription): void => {
    // Here you can handle the file selection, such as fetching its provenance
    setFilesselected(file);
    // void fetchProvenance(file.filename);
  };

  const handleDirectorySelect = (dirName: string): void => {
    console.log("path: " + path);
    console.log("debug: " + window.location.pathname);
    console.log("handle dir select: " + `${location.pathname}/${dirName}`);
    // navigate(`${location.pathname}/${dirName}`);
    navigate(`/home/${dirName}`);
  };

  // const fetchProvenance = async (filename: string) => {
  //     console.log("INSIDE FETCH", filename)
  //     console.log("DA", filesselected)
  //     try {
  //         console.log("RESPONSE OBJECT", currentAccount, filename);
  //         // const response = await fetch('http://localhost:3005/events/accountId?accountId=5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
  //         const accountId = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  //         const fileName = 'abc.txt';
  //         const response = await fetch(`${provenanceAddress}/events/filerecords?accountId=5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY&fileName=${filename}`);
  //         // const response = await fetch(`${provenace.server}/events/filerecords?accountId=${currentAccount}&fileName=${fileName}`);
  //         // const response = await fetch('http://localhost:3005/events/filerecords?accountId=5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY&fileName=abc.txt');
  //         // / Log the entire response for debugging
  //         console.log("RESPONSE OBJECT", response);
  //         if (!response.ok) {
  //             throw new Error('Network response was not ok');
  //         }
  //         const data = await response.json();
  //         console.log("DATA", data, typeof (data.data.value))
  //         if (data.success === true && data.status === "Connected") {
  //             console.log("DATA IN IF", typeof (data.data.value))
  //             setProvenanceData(data.data.value);
  //             console.log("PRO", provenanceData);
  //         }
  //     } catch (error) {
  //         console.error("FETCH ERROR", error);
  //     }
  // };

  // Function to format the timestamp
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);

    const optionsDate: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };

    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    const formattedDate = date.toLocaleDateString("en-US", optionsDate);
    const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
    const formattedYear = date.getFullYear();

    // Combine all parts to form the required format
    return `${formattedDate} ${formattedTime} ${formattedYear.toString()}`;
  };

  const handleGoDirUp = (): void => {
    if (path === "/" || path === routePath) {
      return;
    }

    const trimmedPath = path.replace(/\/$/, "");
    const lastSlashIndex = trimmedPath.lastIndexOf("/");
    const slicedPath = trimmedPath.substring(0, lastSlashIndex);

    navigate(routePath + slicedPath);
  };

  useEffect(() => {
    // console.log('isWalletConnected', isWalletConnected);
    if (localStorage.getItem("currentAccount")) {
      const add = localStorage.getItem("currentAccount");
      if (add !== null) {
        setCurrentAccount(add);
        localStorage.setItem("currentAccount", add);
      }
      console.log("add", localStorage.getItem("currentAccount"));
    }
  });

  const handleDeleteFile = (index: number) => () => {
    setFiles((prevState) => {
      prevState.splice(index, 1);
      return prevState;
    });
  };

  const allFilesElement = files
    .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
    .map((file, index) => (
      <div key={file.filename} onClick={() => handleFileSelect(file)}>
        <FileElement
          key={file.filename}
          currentPath={path}
          fileDescription={file}
          callbackDeleteFile={handleDeleteFile(index)}
        />
      </div>
    ));

  const allDirectoriesElement = directories.map((dirName) => (
    <div key={dirName}>
      <DirectoryElement key={dirName} dirName={dirName} callbackEnterDirectory={() => handleDirectorySelect(dirName)} />
    </div>
  ));

  return (
    <div>
      <Layout />
      <div className='loc-content-container'>
        <div className='loc-h-content-o'>
          <div className='row'>
            <div className='col-12'>
              <div className='loc-card loc-h'>
                <div className='position-relative' style={{ width: "350px" }}>
                  <input style={{ width: "350px" }} type='text' className='loc-form-control' placeholder='Search' />
                  {path !== "/" ? (
                    <button type='button' onClick={handleGoDirUp}>
                      DIR UP
                    </button>
                  ) : null}
                  <img
                    style={{ position: "absolute", top: "12px", right: "15px" }}
                    src='assets/images/svg/ic_search.svg'
                    alt=''
                  />
                </div>
              </div>
              <div>
                {allFilesElement}
                {allDirectoriesElement}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='loc-h-content-details'>
        <div className='loc-h-content-title'>Provenance Report</div>
        <div className='loc-card' style={{ marginTop: "20px" }}>
          <div className='loc-card-content'>
            <div className='loc-h-card-content'>
              <img src='assets/images/svg/ic_pdf.svg' alt='' />
              <div>
                <h4 style={{ marginBottom: "5px" }}>{filesselected ? filesselected.filename : "No file selected"}</h4>
                <h5 style={{ marginBottom: "5px" }}>10mb</h5>
                <h5>{filesselected ? formatDate(filesselected.creationDate) : ""}</h5>
              </div>
            </div>
          </div>
        </div>
        <div className='loc-h-activity-content-con'>
          <h4 style={{ fontSize: "14px", marginLeft: "20px" }}>Activities</h4>
          <div className='loc-card-provnance' style={{ height: "100%" }}>
            <ErrorsComponent errors={errors} provenanceData={provenanceData} />
          </div>
        </div>
      </div>
      <UploadFileModal
        currentPath={path}
        errors={errors}
        setErrors={setErrors}
        modalVisible={uploadFileModalVisible}
        setModalVisible={setUploadFileModalVisible}
        callbackAddFile={(f: FileDescription) => setFiles((prevState) => [...prevState, f])}
      />

      <CreateDirectoryModal
        currentPath={path}
        errors={errors}
        setErrors={setErrors}
        modalVisible={createDirectoryModalVisible}
        setModalVisible={setCreateDirectoryModalVisible}
        callbackAddDirectory={(s: string) => setDirectories((prevState) => [...prevState, s])}
      />

      <button
        data-bs-toggle='modal'
        data-bs-target='#exampleModal'
        className='loc-transparent-img-btn'
        style={{ position: "fixed", bottom: "40px", right: "420px", zIndex: 50 }}
      >
        <img src={"assets/images/svg/ic_upload_file.svg"} onClick={() => setUploadFileModalVisible(true)} alt='' />
      </button>
      <button
        type='button'
        onClick={() => {
          setCreateDirectoryModalVisible(true);
          console.log("setting some modal to true");
        }}
        style={{ position: "fixed", bottom: "40px", right: "750px", zIndex: 50 }}
      >
        Add Directory
      </button>
    </div>
  );
};

interface ErrorsProps {
  errors: string;
  provenanceData: any[];
}

const ErrorsComponent: FC<ErrorsProps> = ({ errors, provenanceData }) => {
  if (errors) {
    return <div style={{ fontSize: "14px", color: "red" }}>{errors}</div>;
  } else if (provenanceData.length > 0) {
    return (
      <div>
        {provenanceData.map((item, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "14px" }}>
              <strong>Accessed On:</strong> {item.value.creationtime}
            </div>
            <div style={{ fontSize: "14px" }}>
              <strong>Accessed by:</strong> {item.value.eventkey}
            </div>
            <div style={{ fontSize: "14px" }}>
              <strong>Action:</strong> {item.value.eventtype}
            </div>
            <hr style={{ margin: "10px 0", border: "1px solid #ccc" }} />
          </div>
        ))}
      </div>
    );
  } else {
    return <div style={{ fontSize: "14px" }}>No File Selected.</div>;
  }
};
