import React, { type FC } from "react";

interface FileToShare {
  filename: string;
  creationDate: number;
}

interface Props {
  selectedFile: FileToShare | null;
  setSelectedFile: (_f: FileToShare | null) => void;
}

const getDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const ShareFileModal: FC<Props> = ({ selectedFile, setSelectedFile }) => {
  const shareuserfile = (): void => {
    alert("Wrok under progress.");
  };

  return (
    selectedFile && (
      <div
        className='modal fade show'
        style={{ display: "block" }}
        tabIndex={-1}
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
          <div className='modal-content' style={{ borderRadius: "20px", padding: "30px" }}>
            <button
              type='button'
              style={{ position: "absolute", top: "20px", right: "20px", zIndex: 999, fontSize: "10px" }}
              className='btn-close'
              onClick={() => {
                setSelectedFile(null);
              }}
              aria-label='Close'
            />
            <div className='loc-h-share-title'>Share File</div>
            <div className='loc-h-share-content'>
              <img src='assets/images/svg/ic_pdf.svg' alt='' />
              <div style={{ marginLeft: "10px" }}>
                <h4 style={{ marginBottom: "5px" }}>{selectedFile.filename}</h4>
                <h5>{getDateTime(selectedFile.creationDate)}</h5>
              </div>
            </div>
            <div
              className='modal-body'
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                marginTop: "20px",
              }}
            >
              <form style={{ width: "100%" }}>
                <div style={{ width: "100%", marginTop: "20px", fontSize: "10px", color: "" }}>
                  <label htmlFor='loc-login-select' className='loc-label'>
                    Enter User's Wallet address
                  </label>
                  <input className='form-control' />
                </div>
              </form>
              <button
                className='loc-btn'
                type='button'
                style={{ marginTop: "30px", width: "200px" }}
                onClick={shareuserfile}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
