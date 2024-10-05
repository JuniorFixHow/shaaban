import { useState } from "react";
import { CoordinateProps } from "../types/Types";
import PrintScreen from "../components/PrintScreen";
import Home from "../components/Home";


const  Public=()=> {
  const [gapData, setGapData] = useState<string | null>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<CoordinateProps>({
    x: [],
    y: [],
  });
  const [qrData, setQRdata] = useState<string>('')

  return (
    <div className="flex flex-col min-h-screen items-center justify-center mx-auto relative">
    <span className="text-3xl font-bold justify-self-start" >Generate QR Codes</span>
      <PrintScreen
        coordinates={coordinates}
        openModal={openModal}
        setOpenModal={setOpenModal}
        gapData={gapData!}
        qrData={qrData}
      />
      <Home
        setOpenModal={setOpenModal}
        setGapData={setGapData}
        setCoordinates={setCoordinates}
        coordinates={coordinates}
        setQRdata={setQRdata!}
      />
    </div>
  );
}

export default Public;
