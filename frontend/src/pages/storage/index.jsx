import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Files from './files';
import Upload from './upload';
import Search from '../../components/multi/search';
import New from './new'
import CreateDirectory from "./createDirectory";
import { getToken } from "../../scripts/authentication";

export default function Main(){
    const [update, forceupdate] = useState(0);
    const [search, changesearch ]= useState('|<>|');
    const [directory, changeDirectory] = useState('/')
    const [showUpload, changeShowUpload] = useState(false)
    const [showNewDirectory, changeShowNewDirectory] = useState(false)

    const updateView = () => {
        forceupdate(update + 1)
        return
    }

    const uploadPopup = () => {
        if (showNewDirectory) changeShowNewDirectory(false)
        changeShowUpload(!showUpload)
        
    }
    const directoryPopup = () => {
        if (showUpload) changeShowUpload(false)
        changeShowNewDirectory(!showNewDirectory) 
    }

    return(
        <>
            <motion.div
            initial={{ opacity:0 }}
            whileInView={{ opacity:1  }}
            viewport={{ once: true }}>
                <div>
                    <div className="container">
                        <div className="row mt-3">
                            <Search changesearch={changesearch} />
                        </div>
                        <div className="row mt-3">
                            <Files update={update} params={search}/>
                        </div>
                    </div>
                    {showUpload &&
                        <Upload update={updateView} directory={directory} show={uploadPopup}/>
                    }
                    {showNewDirectory &&
                        <CreateDirectory update={updateView} directory={directory} show={directoryPopup}/>
                    }
                </div>
            </motion.div>
            <New uploadPopup={uploadPopup} directoryPopup={directoryPopup}/>
        </>
    );
};

