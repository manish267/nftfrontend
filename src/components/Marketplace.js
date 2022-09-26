import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import Loader from "./Loader";
import { useEffect } from "react";

export default function Marketplace() {
const sampleData = [
    {
        "name": "NFT#1",
        "description": "Alchemy's First NFT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "NFT#2",
        "description": "Alchemy's Second NFT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmdhoL9K8my2vi3fej97foiqGmJ389SMs55oC5EdkrxF2M",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "NFT#3",
        "description": "Alchemy's Third NFT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
];
const [data, updateData] = useState([]);
const [dataFetched, updateFetched] = useState(false)
const [loading, setLoading] = useState(false);


async function getAllNFTs() {

    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    setLoading(true)
    
    let transaction = await contract.getAllNFTs()
    console.log(transaction)
    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        console.log(tokenURI);

        let dataA=await fetch(tokenURI);
        dataA=await dataA.json();
        let meta=dataA
        console.log(dataA);
        // return;
        

        // var config = {
        //     method: 'get',
        //     url: tokenURI,
        //     headers: {'Access-Control-Allow-Origin' : '*' }
        //   };

        // let meta = await axios(config)
        // .then(function (response) {
        //   console.log(JSON.stringify(response.data));
        //   meta=response.data;
        // })
        // .catch(function (error) {
        //   console.log(error);
        // });
//         let meta = await axios.get(tokenURI,{
//             withCredentials: false,
//   headers: {
//     "Accept": "*/*",
//     'Access-Control-Allow-Origin' : '*',
//     'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//     }

//         });
        // meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
    setLoading(false);

}

useEffect(()=>{
    // setLoading(true)
    getAllNFTs();
    // setLoading(false)

},[])   

return (
    <div>
        <Navbar loading={loading}>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white">
                Top NFTs
            </div>
            {data && 
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
             
             }

             {data.length==0 && <div>
                  <div className="text-xxl font-bold text-white mt-20">
                No Data Found ( Are You Connected with Wallet ? )
            </div>
             </div> }
        </div>   
        </Navbar>         
    </div>
);

}