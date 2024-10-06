import Modal from "@mui/material/Modal"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { CoordinateProps } from "../types/Types"
import { averageAndRound } from "../functions/Functions"
import { Document, Image, Page, PDFDownloadLink,  View } from "@react-pdf/renderer"
import { QRCodeSVG } from "qrcode.react"
import QRCode from 'qrcode'
import Barcode from "react-barcode"
import ReactDOM from "react-dom"

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
    const [barCodeBase64, setBarCodeBase64] = useState<string | null>(null);
    const [pin, setPin] = useState<string>('');
    const handleClose = ()=>{
        setOpenModal(false);
    }
    const barcodeRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        if (coordinates) {
          const barcodeData = 'GA' + averageAndRound(coordinates.y) + '-' + averageAndRound(coordinates.x);
          setPin(barcodeData)
          console.log("Barcode Data:", barcodeData); // Log barcode data
    
          // Create a barcode element with a ref
          const barcodeElement = (
            <div ref={barcodeRef}>
              <Barcode height={40} fontSize={13} width={1} value={barcodeData} />
            </div>
          );
    
          // Append the barcode element to the DOM
          const container = document.createElement('div');
          document.body.appendChild(container);
          ReactDOM.render(barcodeElement, container);
    
          // Wait for the barcode to render
          setTimeout(() => {
            const svgElement = container.querySelector('svg');
            if (svgElement) {
              const svgData = new XMLSerializer().serializeToString(svgElement);
              console.log("SVG Output:", svgData); // Log SVG output
    
              const data = new Blob([svgData], { type: 'image/svg+xml' });
              const url = URL.createObjectURL(data);
              const img = new window.Image();
    
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 150; // Set desired width
                canvas.height = 75; 
                
                 // Set desired height
                const ctx = canvas.getContext('2d');
                if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Set image smoothing quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                  ctx.drawImage(img, 0, 0);
                  const base64Image = canvas.toDataURL('image/png');
                  console.log("Base64 Image:", base64Image); // Log Base64 image
                  setBarCodeBase64(base64Image);
                }
              };
    
              img.src = url; // Load the SVG Blob URL
            }
            // Clean up
            document.body.removeChild(container);
          }, 100); // Adjust timeout if necessary
        }
      }, [coordinates]);

    

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

    //   console.log('barCodeBase64: ', barCodeBase64)

    const MyDocument = ()=>{
        return(
        <Document style={{width:'100%', height:'100%',}} >
            <Page style={{width:'100%', height:'100%'}} size='A4' >
                <View style={{width:'100%', height:'100%', alignItems:'flex-start', display:'flex', paddingTop:30, flexDirection:'row', justifyContent:'space-between', paddingHorizontal:30 }} >

                    <View style={{flexDirection:'column', gap:10, alignItems:'flex-start'}} >
                            <View style={{display:'flex', gap:8, flexDirection:'column', alignItems:'center'}}>
                                {qrData && <QRCodeSVG value={qrData} className='w-12 h-12 md:w-24 md:h-24' />}
                                {qrCodeBase64 && <Image src={qrCodeBase64} style={{width:80, height:80}} />}
                            </View>

                            <View style={{flexDirection:'column', alignItems:'center', }} >
                                { pin && <Barcode height={30} width={1} value={pin} />}
                           
                                {barCodeBase64 && 
                                <>
                                <Image src={barCodeBase64} style={{width:105, height:60,  objectFit:'contain'}} />
                                {/* <Text>{pin}</Text> */}
                                </>
                                }
                            </View>
                    </View>

                    
                    {
                        gapData &&
                        <View style={{display:'flex', gap:8, flexDirection:'column', alignItems:'center'}}>
                            <QRCodeSVG value={gapData} className='w-12 h-12 md:w-24 md:h-24' />
                            {gapCodeBase64 && <Image src={gapCodeBase64} style={{width:75, height:75}} />}
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