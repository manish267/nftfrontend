import Navbar from "./Navbar";
import axie from "../tile.jpeg";
import {useLocation, useParams,useNavigate } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { BigNumber} from 'ethers';
// const ethers = require("ethers");
// import  ethers  from "ethers";

export default function NFTPage (props) {
    const ethers =require("ethers");

    const [data, updateData] = useState({});
    const [dataFetched, updateDataFetched] = useState(false);
    const [message, updateMessage] = useState("");
    const [currAddress, updateCurrAddress] = useState("0x");
    const [loading, setLoading] = useState(false);

    const navigate=useNavigate();


async function getNFTData(tokenId) {
    console.log("called")
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    setLoading(true)
    const tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedForTokenId(tokenId);


    let dataA=await fetch(tokenURI);
        dataA=await dataA.json();
        let meta=dataA
        console.log(dataA);

    // let meta = await axios.get(tokenURI);
    // meta = meta.data;
    console.log(listedToken);

    let item = {
        price: meta.price,
        tokenId: tokenId,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
    }
    console.log(item);
    updateData(item);
    updateDataFetched(true);
    console.log("address", addr)
    updateCurrAddress(addr);
    setLoading(false);
}

async function buyNFT(tokenId) {
    try {
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        let salePrice =ethers.utils.parseUnits(data.price , "ether");


        //run the executeSale function
        setLoading(true);
        
        let transaction = await contract.executeSale(tokenId,{value:salePrice});
        // let transaction = await contract.executeSale(tokenId);
        updateMessage("Buying the NFT... Please Wait (Upto 2-3 mins)")
        await transaction.wait();

        alert('You successfully bought the NFT!');
        updateMessage("");
        setLoading(false);
        navigate("/profile")

    }
    catch(e) {
        alert(e.message);
        console.log(e.message)
        updateMessage("");
        setLoading(false);


    }
}

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)  getNFTData(tokenId);

    return(
        <div style={{"min-height":"100vh"}}>
            <Navbar loading={loading} >
            <div className="flex ml-20 mt-20 mb-20">
                <img src={data.image} alt="" className="w-2/5" />
                <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
                    <div>
                        Name: {data.name}
                    </div>
                    <div>
                        Description: {data.description}
                    </div>
                    <div>
                        Price: <span className="">{data.price + " ETH"}</span>
                    </div>
                    <div>
                        Owner: <span className="text-sm">{data.owner}</span>
                    </div>
                    <div>
                        Seller: <span className="text-sm">{data.seller}</span>
                    </div>
                    <div>
                    { currAddress == data.owner || currAddress == data.seller ?
                        <div className="text-emerald-700">You are the owner of this NFT</div>
                        : <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={()=>buyNFT(tokenId)}>Buy this NFT</button>
                    }
                    
                    <div className="text-green text-center mt-3">{message}</div>
                    </div>
                </div>
            </div>
            </Navbar>
        </div>
    )
}