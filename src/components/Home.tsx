import { useRef, useState } from "react"
import { CodeProps } from "./PrintScreen"
import Papa from 'papaparse'
import { formatArraysAsString } from "../functions/Functions";

const Home = ({setCoordinates, setGapData, coordinates, setOpenModal, setQRdata}:CodeProps ) => {
    const [fileSected, setFileSelected] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    // const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
    //     setCoordinates((pre)=>({
    //         ...pre, [e.target.name]: e.target.value
    //     }))
    // }

    const generateButton = ()=>{
        if(coordinates?.x.length !== coordinates?.y.length){
            setError(true);
        }else{
            if(coordinates){
                setQRdata!(formatArraysAsString(coordinates?.x, coordinates?.y))
                setOpenModal(true);
            }
        }
    }

    const fileRef = useRef<HTMLInputElement|null>(null);
    const handleRemoveFile = ()=>{
        if(fileRef.current){
            fileRef.current.value = ''
            setFileSelected(false)
        }
    }
    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileSelected(true)
            Papa.parse<string[]>(file, {
                complete: (results) => {
                    const xValues:number[] = [];
                    const yValues:number[] = [];

                    results.data.forEach((row) => {
                        // console.log(index)
                         if (row.length >= 3) {
                            const xValue = parseFloat(row[1]);
                            const yValue = parseFloat(row[2]);

                            // Check if the parsed values are valid numbers
                            if (!isNaN(xValue)) xValues.push(xValue);
                            if (!isNaN(yValue)) yValues.push(yValue);
                        }
                    });
                    console.log(xValues)
                    setCoordinates!({x:xValues, y:yValues});
                },
                header: false, // Set to true if your CSV has headers
            });
        }
      };
    // console.log(coordinates)
  return (
    <div className="flex items-center flex-col gap-4 bg-white p-4 md:p-8 w-[90%] shadow-lg rounded-xl md:w-[70%] lg:w-[50%]" >
        
        {/* <div className="flex flex-col md:flex-row w-full lg:w-[70%] justify-between gap-8 ">
            <div className="flex flex-col gap-2">
                <span className="text-xl mb-2 font-bold" >X Coordinates</span>
                <input onChange={handleChange} name="x1" className="border border-slate-400 rounded-md outline-none p-1" type="number" min={0} placeholder=" Enter X1" />
                <input onChange={handleChange} name="x2" className="border border-slate-400 rounded-md outline-none p-1" type="number" min={0} placeholder=" Enter X2" />
                <input onChange={handleChange} name="x3" className="border border-slate-400 rounded-md outline-none p-1" type="number" min={0} placeholder=" Enter X3" />
                <input onChange={handleChange} name="x4" className="border border-slate-400 rounded-md outline-none p-1" type="number" min={0} placeholder=" Enter X4" /> 
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-xl mb-2 font-bold" >Y Coordinates</span>
                <input onChange={handleChange} name="y1" className="border border-slate-400 rounded-md outline-none p-1" type="number" min={0} placeholder=" Enter Y1" />
                <input onChange={handleChange} name="y2" className="border border-slate-400 rounded-md outline-none p-1" type="number" min={0} placeholder=" Enter Y2" />
                <input onChange={handleChange} name="y3" className="border border-slate-400 rounded-md outline-none p-1" type="number" min={0} placeholder=" Enter Y3" />
                <input onChange={handleChange} name="y4" className="border border-slate-400 rounded-md outline-none p-1" type="number" min={0} placeholder=" Enter Y4" /> 
            </div>
        </div> */}

        <div className="flex flex-col gap-2 w-full lg:w-[70%] ">
            <span className="text-xl font-bold" >GAPA number</span>
            <input onChange={(e)=>setGapData!(e.target.value)} className="border border-slate-400 rounded-md outline-none p-1 w-full" type="text" placeholder=" Enter GAPA number" /> 
        </div>

        <div className="flex flex-col gap-2 w-full lg:w-[70%] ">
            <span className="text-xl font-bold" >Upload CSV</span>
            <input ref={fileRef} onChange={handleCSVUpload} accept='.csv' className="border border-slate-400 rounded-md outline-none p-1 w-full" type="file" placeholder="Pick csv file" /> 
        </div>

        <div className="flex flex-col gap-2 w-full lg:w-[70%] ">
            {
                error && <small className="text-red-600" >Invalid dataset</small>
            }
            {
             fileSected  &&
             <>
            <button onClick={handleRemoveFile} type="button" className="bg-red-600 border-none rounded-md text-white py-2 hover:bg-red-500" >Remove file</button>
            <button onClick={generateButton} type="button" className="bg-blue-600 border-none rounded-md text-white py-2 hover:bg-blue-500" >Generate Codes</button>
             </>
            }
        </div>
        
    </div>
  )
}

export default Home