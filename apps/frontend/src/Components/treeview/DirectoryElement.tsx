import React, {type FC} from 'react';

interface Props {
    dirName: string;
    callbackEnterDirectory: () => void
}

export const DirectoryElement: FC<Props> = ({dirName, callbackEnterDirectory}) =>
    <div className="loc-card card-active" style={{marginTop: '20px'}}>
        <div className="loc-h-card-content-con">
            <div className="loc-h-card-content">
                <img src="/images/svg/s_files.svg" alt=""/>
                <div>
                    <h4 style={{marginBottom: '5px'}}>{dirName}</h4>
                    <h5 style={{marginBottom: '5px'}}>Directory</h5>
                </div>
            </div>
            <div className="loc-h-tools">
                <div className="dropdown">
                    <img style={{cursor: 'pointer', width: "30px", padding: "4px", margin: "4px"}} src={'/images/svg/enter_1_placeholder.svg'}
                         alt="more-options"
                         data-bs-toggle="modal" data-bs-target="#shareModal"
                         onClick={callbackEnterDirectory}/>

                    <img className="dropdown-toggle" src={'/images/svg/ic_team_dropdown.svg'}
                         alt="more-options" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"/>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li className="dropdown-item">
                            <img style={{width: "35px"}} src={'/images/svg/user_default.svg'}
                                 alt="user"/>
                            <div>Jason Roy</div>
                        </li>
                        <li className="dropdown-item">
                            <img style={{width: "35px"}} src={'/images/svg/user_default.svg'}
                                 alt="user"/>
                            <div>Jos Butler</div>
                        </li>
                        <li className="dropdown-item">
                            <img style={{width: "35px"}} src={'/images/svg/user_default.svg'}
                                 alt="user"/>
                            <div>Ian Bell</div>
                        </li>
                    </ul>
                </div>

                <div className="dropdown">
                    <img className="dropdown-toggle" style={{width: "5px"}}
                         src={'/images/svg/ic_3_dots.svg'} alt="more-options" id="dropdownMenuButton2"
                         data-bs-toggle="dropdown" aria-expanded="false"/>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                        <li className="dropdown-item" onClick={() => alert("not included")}>Delete</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>