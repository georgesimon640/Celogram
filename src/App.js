
import './App.css';

import { NavigationBar } from './components/topbar';
import { AddPhoto } from './components/addphoto';
import { Photos } from './components/displayphoto';
import { useState, useEffect, useCallback } from "react";


import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";


import celogram from "./contracts/celogram.abi.json";
import IERC from "./contracts/IERC.abi.json";


const ERC20_DECIMALS = 18;



const contractAddress = "0x8f4AB0223ecb3ee4C36ae0097E7acb1ac405c042";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";



function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [photos, setPhotos] = useState([]);
  

  // connect user wallet to app
  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  // get user balance from app
  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(celogram, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);



  // get all photos from contract
  const getPhotos = useCallback(async () => {
    const photosLength = await contract.methods.getPhotosLength().call();
    const photos = [];
    for (let index = 0; index < photosLength; index++) {
      let _photos = new Promise(async (resolve, reject) => {
      let photo = await contract.methods.getPhoto(index).call();

        resolve({
          index: index,
          owner: photo[0],
          image: photo[1],
          description: photo[2],
          likes: photo[3],
          rewards: photo[4]   
        });
      });
      photos.push(_photos);
    }


    const _photos = await Promise.all(photos);
    setPhotos(_photos);
  }, [contract]);


  // add new photo to contract
  const addPhoto = async (
    _image,
    _description,
 
  ) => {
    
    try {
      await contract.methods
        .addPhoto(_image, _description)
        .send({ from: address });
      getPhotos();
    } catch (error) {
      alert(error);
    }
  };

  // edit description of photo at index @_index
  const editDescription = async (_index, _newDescription) => { 
    try {
      await contract.methods.editDescription(_index, _newDescription).send({ from: address });
      getPhotos();
      alert("you have successfully edited the description");
    } catch (error) {
      alert(error);
    }};



    // like photo at index @_index
    const likePhoto = async (_index) => { 
      try {
        await contract.methods.like(_index).send({ from: address });
        getPhotos();
        alert("you have successfully liked this photo");
      } catch (error) {
        alert(error);
      }};

// delete photo at index @_index
  const deletePhoto = async (
    _index
  ) => {
    try {
      await contract.methods
        .deletePhoto(_index)
        .send({ from: address });
      getPhotos();
    } catch (error) {
      alert(error);
    }
  };

  // reward photo at index @_index with @_ammount
  const rewardPhoto = async (_index, _ammount) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
      let ammount = new BigNumber(_ammount).shiftedBy(ERC20_DECIMALS).toString();
      await cUSDContract.methods
        .approve(contractAddress, ammount)
        .send({ from: address });
      await contract.methods.rewardPhoto(_index, ammount).send({ from: address });
      getPhotos();
      getBalance();
      alert("you have successfully reward this photo");
    } catch (error) {
      alert(error);
    }};


  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getPhotos();
    }
  }, [contract, getPhotos]);
  
  return (
    <div className="App">
      <NavigationBar cUSDBalance={cUSDBalance} />
      <Photos photos={photos} rewardPhoto={rewardPhoto} likePhoto={likePhoto} walletAddress={address} editDescription={editDescription} deletePhoto={deletePhoto}/>
      <AddPhoto addPhoto={addPhoto} />
    </div>
  );
}

export default App;