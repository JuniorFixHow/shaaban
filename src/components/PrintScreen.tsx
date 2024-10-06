import Modal from "@mui/material/Modal"
import { Dispatch, SetStateAction, useEffect,  useRef,  useState } from "react"
import { CoordinateProps } from "../types/Types"
import { averageAndRound } from "../functions/Functions"
import { Document,  Page,   View } from "@react-pdf/renderer"
import { QRCodeSVG } from "qrcode.react"
import Barcode from "react-barcode"

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
 
    const [pin, setPin] = useState<string>('');
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const handleClose = ()=>{
        setOpenModal(false);
    }


    useEffect(() => {
        if (coordinates) {
          const barcodeData = 'GA' + averageAndRound(coordinates.y) + '-' + averageAndRound(coordinates.x);
          setPin(barcodeData)
          console.log("Barcode Data:", barcodeData); // Log barcode data
    
          // Create a barcode element with a ref
         
    
          // Append the barcode element to the DOM
         
          
        }
      }, [coordinates]);

    

  

   

    //   console.log('barCodeBase64: ', barCodeBase64)

    const MyDocument = ()=>{
        return(
        <Document  style={{width:'100%'}} >
            <Page id="printableDiv" style={{width:'100%', height:'100%'}} size='A5' >
                <View style={{width:'100%', height:'100%', alignItems:'flex-start', display:'flex', paddingTop:30, flexDirection:'row', justifyContent:'space-between', paddingHorizontal:30 }} >

                    <View style={{flexDirection:'column',  alignItems:'flex-start'}} >
                            <View style={{display:'flex', gap:8, flexDirection:'column', marginLeft:10, marginBottom:40}}>
                                {qrData && <QRCodeSVG value={qrData} size={90} className='w-16 h-16' />}
                            </View>

                            <View style={{flexDirection:'column', paddingTop:20, alignItems:'center', }} >
                                { pin && <Barcode height={30} margin={0} textMargin={0} fontSize={15} width={1} value={pin} />}
                           
                            </View>
                    </View>
                    {
                        gapData &&
                        <View style={{display:'flex', gap:8, flexDirection:'column', alignItems:'center'}}>
                            <QRCodeSVG value={gapData} size={90} className='w-16 h-16' />
                        </View>
                    }
                </View>
            </Page>
        </Document>
        )
    }

    const printDiv = () => {
        const printWindow = iframeRef.current?.contentWindow;
        if(printWindow){

                printWindow.document.write("<html><head><title>TogbeCodeGen</title>");
                printWindow.document.write(`
                    <style>
                        @media print {
                            body {
                                margin: 0;
                                padding: 3rem 2rem 0 2rem;
                                width: 210mm; /* A4 width */
                                height: 297mm; /* A4 height */
                                overflow: hidden; /* Prevent overflow */
                            }
                            @page {
                                size: A4; /* Set page size to A4 */
                                margin: 0; /* Set margins to prevent clipping */
                            }
                            .no-print {
                                display: none;
                            }
                        }
                    </style>
                `);
                printWindow.document.write('</head><body>');
                printWindow.document.write(document.getElementById('printableDiv')!.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
        }
    };

  return (
    <Modal
    open={openModal!}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >

        <div   className="flex w-full h-screen items-center justify-center absolute">

            <div className="flex flex-col items-center gap-8 justify-between w-[90%] md:w-[70%] lg:w-[50%] p-4 md:p-8 shadow-lg bg-white h-[calc(100vh-5rem)]">
                <MyDocument />
                <div className="flex flex-row justify-between w-full">
                    <button onClick={()=>setOpenModal(false)} type='button' className="p-2 bg-red-600 rounded-lg hover:bg-red-500 text-white w-1/3" >Close</button>
                    
                    <button onClick={printDiv} type='button' className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 text-white w-1/3" >Print</button>
                    <iframe
                        ref={iframeRef}
                        className=' hidden'
                        title="print-iframe"
                    />
                </div>
            </div>
        </div>
    </Modal>
  )
}

export default PrintScreen