import Modal from "@mui/material/Modal"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { CoordinateProps } from "../types/Types"
import { averageAndRound } from "../functions/Functions"
import { Document, Image, Page, PDFDownloadLink, Text, View } from "@react-pdf/renderer"
import { QRCodeSVG } from "qrcode.react"
import QRCode from 'qrcode'

export type CodeProps = {
    setCoordinates?: Dispatch<SetStateAction<CoordinateProps>>,
    coordinates?: CoordinateProps,
    openModal?:boolean,
    setOpenModal: Dispatch<SetStateAction<boolean>>,
    gapData?:string,
    qrData?:string,
    setGapData?:Dispatch<SetStateAction<string | null>>,
    setQRdata?:Dispatch<SetStateAction<string>>,
}
const PrintScreen = ({coordinates, gapData,  openModal, qrData, setOpenModal}:CodeProps ) => {
    const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
    const [gapCodeBase64, setGapCodeBase64] = useState<string | null>(null);
    const handleClose = ()=>{
        setOpenModal(false);
    }

    useEffect(() => {
        if (qrData) {
          QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' })
            .then(url => {
              setQrCodeBase64(url);
            })
            .catch(err => {
              console.error(err);
            });
        }
      }, [qrData]);

    useEffect(() => {
        if (gapData) {
          QRCode.toDataURL(gapData, { errorCorrectionLevel: 'H' })
            .then(url => {
              setGapCodeBase64(url);
            })
            .catch(err => {
              console.error(err);
            });
        }
      }, [gapData]);

    const MyDocument = ()=>{
        return(
        <Document style={{width:'100%', height:'100%',}} >
            <Page style={{width:'100%', height:'100%'}} size='A4' >
                <View style={{width:'100%', height:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between' }} >

                    <View style={{display:'flex', gap:8, flexDirection:'column'}}>
                        <Text style={{fontSize:11, fontWeight:'bold'}} >GPL Pin</Text>
                        {
                            coordinates &&
                            <Text style={{fontSize:11,}} >{'GA'+averageAndRound(coordinates?.y)+'-'+averageAndRound(coordinates?.x)}</Text>
                        }
                    </View>
                    {
                        gapData &&
                        <View style={{display:'flex', gap:8, flexDirection:'column', alignItems:'center'}}>
                            <Text style={{fontSize:11, fontWeight:'bold'}} >GAPA Number</Text>
                            <QRCodeSVG value={gapData} className='w-12 h-12 md:w-24 md:h-24' />
                            {gapCodeBase64 && <Image src={gapCodeBase64} style={{width:100, height:100}} />}
                        </View>
                    }
                    {
                        qrData &&
                        <View style={{display:'flex', gap:8, flexDirection:'column', alignItems:'center'}}>
                            <Text style={{fontSize:11, fontWeight:'bold'}} >Coordinates</Text>
                            <QRCodeSVG value={qrData} className='w-12 h-12 md:w-24 md:h-24' />
                            {qrCodeBase64 && <Image src={qrCodeBase64} style={{width:120, height:120}} />}
                        </View>
                    }
                </View>
            </Page>
        </Document>
        )
    }
  return (
    <Modal
    open={openModal!}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >

        <div   className="flex w-full h-screen items-center justify-center absolute">

            <div className="flex flex-col items-center gap-8  w-[90%] md:w-[70%] lg:w-[50%] p-4 md:p-8 shadow-lg bg-white h-[calc(100vh-5rem)]">
                <MyDocument />
                <div className="flex flex-row justify-between w-full">
                    <button onClick={()=>setOpenModal(false)} type='button' className="p-2 bg-red-600 rounded-lg hover:bg-red-500 text-white w-1/3" >Close</button>
                    <PDFDownloadLink
                    className="w-1/3"
                        document={<MyDocument />}
                        fileName={`${new Date().toLocaleDateString()}.pdf`}
                    >
                    <button type='button' className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 text-white w-full" >Print</button>
                    </PDFDownloadLink>
                </div>
            </div>
        </div>
    </Modal>
  )
}

export default PrintScreen