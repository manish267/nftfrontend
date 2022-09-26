import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToBucket, uploadJSONToBucket } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useLocation,useNavigate } from "react-router";

export default function SellNFT () {
    const [formParams, updateFormParams] = useState({ name: '', description: '', price: ''});
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const location = useLocation();
    const navigate=useNavigate()
    const [loading, setLoading] = useState(false);

    async function OnChangeFile(e){
        var file=e.target.files[0];

        try {
            setLoading(true);
            updateMessage("Uploading Image");
            const response=await uploadFileToBucket(file);
            console.log(response);
            if(response.success===true){
                console.log("Uploaded image : " , response.data.location.Location);
                setFileURL(response.data.location.Location);
            }
            setLoading(false);
            updateMessage("");
        } catch (error) {
            console.log("Error during file upload ", e);
            setLoading(false);
            updateMessage("");


        }

    }

    async function uploadMetadataToIPFS(){

        const  {name,description,price}=formParams;

        if(!name || !description || !price || !fileURL) {
            return;
        }

        const nftJSON={
           
                key:Math.round(Math.random()*1000 + 1),
            name,description,price,image:fileURL
    }

    console.log(nftJSON)

        try {

            const response = await uploadJSONToBucket(nftJSON);
            console.log(response);
            if(response.success===true){
                console.log("Upload JSON  : ",response.data.data.Location);
                return response.data.data.Location;
            }

        }catch(e){
            console.log("Error Uploading  JSON METADATA: " + e)
        }

    }

    async function listNFT(e){
        e.preventDefault();

        try {
            const provider=new ethers.providers.Web3Provider(window.ethereum);
            console.log("provider",provider);
            const signer=provider.getSigner();
            console.log("signer",signer);
            setLoading(true)

            const metadataURL=await uploadMetadataToIPFS();


            updateMessage("Please wait ... Uploading(Upto 2 mins)")

            let contract = new ethers.Contract(Marketplace.address,Marketplace.abi,signer);
            console.log(contract);
            const price=ethers.utils.parseUnits(formParams.price,"ether");
            console.log(price);
            let listingPrice=await contract.getListPrice();
            console.log(listingPrice)

            listingPrice=listingPrice.toString();

            console.log(listingPrice)


            let transaction=await contract.createToken(metadataURL,price);
            console.log(transaction);
            await transaction.wait();


            alert("Successfully listed your NFT!!!");
            updateMessage("");
            updateFormParams({name:'',description:'',price:''});
            setLoading(false);
            navigate("/profile")
            // window.location.replace("/")

        } catch (error) {
            alert("Error Creating NFT ", error);
            setLoading(false);
        }
    }

    return (
        <div className="">
        <Navbar loading={loading}>
        <div className="flex flex-col place-items-center mt-10" id="nftForm">
            <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
            <h3 className="text-center font-bold text-purple-500 mb-8">Upload your NFT to the marketplace</h3>
                <div className="mb-4">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">NFT Name</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
                </div>
                <div className="mb-6">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="description">NFT Description</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" cols="40" rows="5" id="description" type="text" placeholder="Axie Infinity Collection" value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})}></textarea>
                </div>
                <div className="mb-6">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Price (in ETH)</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})}></input>
                </div>
                <div>
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="image">Upload Image</label>
                    <input type={"file"} onChange={OnChangeFile}></input>
                </div>
                <br></br>
                <div className="text-green text-center">{message}</div>
                <button onClick={listNFT} className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg">
                    List NFT
                </button>
            </form>
        </div>
        </Navbar>
        </div>
    )
}