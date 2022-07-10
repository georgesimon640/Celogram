import React from 'react';
import { useState, useEffect } from "react";

export const Photos = (props) => {
  const [ammount, setAmmount] = useState('');
  const [allDesc, setAllDesc] = useState({});

  const descArr = () => {
    props.photos.forEach((photo) => {      
      setAllDesc((prev) => {
       return { ...prev, [photo.index]: "" };      
    });
  })}

  const handleDescChange = (index, description) => {  
    setAllDesc(prev => {
        return {...prev, [index]: description}
    })
  };

  const handleDesc = (index) => {
    const desc = allDesc[index];
    props.editDescription(index, desc)
  };

  useEffect(() => {
    descArr();
  }, []);


  return <div className="card-container">

{props.photos.map((p) =>(
    <div class="card">
    <img class="card-img-top" src={p.image} alt="Card image cap" />
    <div class="card-body">
      <h5 class="card-title">{p.likes} Likes</h5>
      <h5 class="card-title">{p.rewards} Rewards</h5>
      <p class="card-text">{p.description}</p>
      { props.walletAddress !== p.owner &&(
      <button type="button" onClick={()=>props.likePhoto(p.index)} class="btn btn-info mt-2">Like Photo</button>
      )
}

{/* only owner can edit description */}
{ props.walletAddress === p.owner && (
     <form>
  <div class="form-r">
      <input type="text" class="form-control mt-4" value={allDesc[p.index]}
           onChange={(e) => handleDescChange(p.index, e.target.value)} placeholder="edit description"/>
      <button type="button" onClick={()=> handleDesc(p.index)} class="btn btn-info mt-2">edit description</button>
      
  </div>
</form>
)}

{/* all users except owner can reward photo */}
{ props.walletAddress !== p.owner && p.likes > 0 && (
     <form>
  <div class="form-r">
      <input type="text" class="form-control mt-4" value={ammount}
           onChange={(e) => setAmmount(e.target.value)} placeholder="enter ammount"/>
      <button type="button" onClick={()=>props.rewardPhoto(p.index, ammount)} class="btn btn-info mt-2">Reward Photo</button>
      
  </div>
</form>
)}


      { props.walletAddress === p.owner &&(
                    <button
                      type="submit"
                      onClick={() => props.deletePhoto(p.index)}
                      className="btn btn-info m-3"
                    >
                      remove this photo
                    </button>
                       )}
    </div>
  </div>
  ))}

</div>
};
