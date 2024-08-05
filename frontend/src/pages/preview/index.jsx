import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { images, text, pdf } from '../../scripts/fileExtensions'
import { motion } from 'framer-motion';
import { getToken } from '../../scripts/authentication';
import Description from './description';
import FileNotAccessible from '../../components/fileNotAccessible'

export default function Preview(props){
    let location = useLocation();
    const extension = location.state.extension
    const [fileAccessible, setFileAccessible] = useState(true)

    if (!fileAccessible){
        return <FileNotAccessible />
    }

    // use effect to get file info

    // add support for video, and other file types
    return(
        <motion.div 
        initial={{ opacity:0 }}
        whileInView={{ opacity:1  }}
        viewport={{ once: true }}
        className="container">
            <div className="row">
                <div className="col-12 col-md-8 mt-3">
                    <FilePreview extension={extension} setFileAccessible={setFileAccessible}/>
                </div>
                <div className="col-12 col-md-4 mt-3">
                    <Description setFileAccessible={setFileAccessible}/>
                </div>
            </div>
        </motion.div>
    );
}

function FilePreview({extension, setFileAccessible}){
    const { id } = useParams();
    const [fileURL, setFileURL] = useState(null)
    useEffect(() => {
        const getFile = async () => {
            let response = await fetch(`/storage/file?file=${id}`, {
                headers: {
                    "Authorization": `Token ${getToken().token}`,
                }
            })
            if (response.status === 401){
                setFileAccessible(false)
                return
            }
            
            response = await response.blob()
            setFileURL(URL.createObjectURL(response))
        }
        getFile()
    }, [])
    return (
        <iframe src={fileURL} className='pdf'> </iframe>
    )
}