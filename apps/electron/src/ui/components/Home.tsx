import Path from "path-browserify";
import React, { type FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/loc-h-content.css";
import "../css/loc-layout.css";
import "../css/loc-login.css";
import "../css/main.css";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "ui/components/context/GlobalContext";
import { CreateDirectoryModal } from "ui/components/CreateDirectoryModal";
import { Layout } from "ui/components/Layout";
import { FileElement } from "ui/components/treeview/FileElement";
import { UploadFileModal } from "ui/components/UploadFileModal";

import { DirectoryElement } from "./treeview/DirectoryElement";

interface FileDescription {
  filename: string;
  creationDate: number;
}

export const Home: FC = () => {
  const [files, setFiles] = useState<FileDescription[]>([]);
  const [directories, setDirectories] = useState<string[]>([]);
  const [filesselected, setFilesselected] = useState<FileDescription | null>(null);
  const [provenanceData, setProvenanceData] = useState<any[]>([]); // Provenance
  const [errors, setErrors] = useState("");
  const [uploadFileModalVisible, setUploadFileModalVisible] = useState(false);
  const [createDirectoryModalVisible, setCreateDirectoryModalVisible] = useState(false);

  const [searchText, setSearchText] = useState("");

  const { nfsPath, selectedPath, setSelectedPath, mountNfs, isNfsMounted, askMountOnce, setAskMountOnce } =
    useGlobalContext();

  const fetchNfsContents = (): void => {
    electron.ipcRenderer.fs.readDir(selectedPath).then((contents) => {
      if (searchText.length > 0) {
        const filteredFiles = contents.files.filter((e) => e.filename.toLowerCase().includes(searchText));
        const filteredDirectories = contents.directories.filter((e) => e.toLowerCase().includes(searchText));

        setFiles(filteredFiles);
        setDirectories(filteredDirectories);
      } else {
        setFiles(contents.files);
        setDirectories(contents.directories);
      }
    });
  };

  useEffect(() => {
    // if (localStorage.getItem("currentAccount")) {
    //   const add = localStorage.getItem("currentAccount");
    //   if (add !== null) {
    //     setCurrentAccount(add);
    //     localStorage.setItem("currentAccount", add);
    //   }
    //   console.log("add", localStorage.getItem("currentAccount"));
    // }

    if (isNfsMounted) {
      fetchNfsContents();
    } else if (isNfsMounted === false) {
      if (!askMountOnce && confirm(`Would you like to Mount NFS at: ${nfsPath}`)) {
        mountNfs();
      } else {
        setAskMountOnce(true);
        setFiles([]);
        setDirectories([]);
      }
    }
  }, [selectedPath, nfsPath, isNfsMounted /*, files, directories*/]); //Hook to a path so that it will refresh file contents when path changes

  const handleFileSelect = (file: FileDescription): void => {
    // Here you can handle the file selection, such as fetching its provenance
    setFilesselected(file);
    // void fetchProvenance(file.filename);
  };

  const handleDirectorySelect = (dirName: string): void => {
    // setNfsPath(dirName);
    setSearchText("");
    setSelectedPath(dirName);
  };

  const handleFilterNodesBySearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    setSearchText(searchText);

    // if (searchText.length > 0) {
    //   const filteredFiles = files.filter((e) => e.filename.toLowerCase().includes(searchText));
    //   const filteredDirectories = directories.filter((e) => e.toLowerCase().includes(searchText));
    //
    //   setFiles(filteredFiles);
    //   setDirectories(filteredDirectories);
    // }
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
    if (selectedPath === "/") {
      return;
    }

    setSelectedPath(Path.dirname(selectedPath));
  };

  const handleDeleteFile = (index: number) => () => {
    setFiles((prevState) => {
      return prevState.filter((_, i) => i !== index);
    });
  };

  const handleDeleteDirectory = (index: number) => {
    console.log("delete dir");
    setDirectories((prevState) => {
      const result = prevState.filter((_, i) => i !== index);
      console.log("result delete: " + JSON.stringify(result, null, 2));
      return result;
    });
  };

  const allFilesElement = files
    .filter((e) => e.filename.toLowerCase().includes(searchText))
    .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
    .map((file, index) => (
      <div key={file.filename} onClick={() => handleFileSelect(file)}>
        <FileElement key={file.filename} fileDescription={file} callbackDeleteFile={handleDeleteFile(index)} />
      </div>
    ));

  const allDirectoriesElement = directories
    .filter((e) => e.toLowerCase().includes(searchText))
    .map((dirName, index) => (
      <div key={dirName}>
        <DirectoryElement
          key={dirName + index}
          dirName={dirName}
          callbackEnterDirectory={() => {
            handleDirectorySelect(Path.join(selectedPath, dirName));
          }}
          callbackDeleteDirectory={() => handleDeleteDirectory(index)}
        />
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
                <div className='d-flex align-items-center'>
                  {selectedPath !== nfsPath ? (
                    <button
                      className='loc-transparent-img-btn loc-h-back-btn'
                      style={{ marginRight: "15px" }}
                      type='button'
                      onClick={handleGoDirUp}
                    >
                      <img src='assets/images/svg/ic_back.svg' />
                    </button>
                  ) : null}
                  <div className='position-relative loc-h-' style={{ width: "350px" }}>
                    <input
                      style={{ width: "350px" }}
                      type='text'
                      className='loc-form-control'
                      value={searchText}
                      placeholder='Search'
                      onChange={handleFilterNodesBySearchText}
                    />
                    <img
                      style={{ position: "absolute", top: "12px", right: "15px" }}
                      src='assets/images/svg/ic_search.svg'
                      alt=''
                    />
                  </div>
                </div>
                <div>
                  <button type='button' className='loc-btn px-3' onClick={() => setCreateDirectoryModalVisible(true)}>
                    Add Directory
                  </button>
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
        currentPath={selectedPath}
        errors={errors}
        setErrors={setErrors}
        modalVisible={uploadFileModalVisible}
        setModalVisible={setUploadFileModalVisible}
        callbackAddFile={(f: FileDescription) => setFiles((prevState) => [...prevState, f])}
      />

      <CreateDirectoryModal
        currentPath={selectedPath}
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
