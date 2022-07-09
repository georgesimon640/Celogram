import React from 'react';
import { useState } from "react";

export const Photos = (props) => {

  const [newDescription, setNewDescription] = useState('');
  const [ammount, setAmmount] = useState('');


  return <div className="card-container">

{props.photos.map((p) =>(
    <div class="card">
    <img class="card-img-top" src={p.image} alt="Card image cap" />
    <div class="card-body">
      <h5 class="card-title">{p.likes} Likes</h5>
      <h5 class="card-title">{p.rewards} Rewards</h5>
      <p class="card-text">{p.description}</p>
      { props.walletAddress !== p.owner &&(
      <button type="button" onClick={()=>props.likePhoto(p.index)} class="btn btn-primary mt-2">Like Photo</button>
      )
}

{ props.walletAddress === p.owner && (
     <form>
  <div class="form-r">
      <input type="text" class="form-control mt-4" value={newDescription}
           onChange={(e) => setNewDescription(e.target.value)} placeholder="edit description"/>
      <button type="button" onClick={()=>props.editDescription(p.index, newDescription)} class="btn btn-primary mt-2">edit description</button>
      
  </div>
</form>
)}


{ props.walletAddress !== p.owner && (
     <form>
  <div class="form-r">
      <input type="text" class="form-control mt-4" value={ammount}
           onChange={(e) => setAmmount(e.target.value)} placeholder="enter ammount"/>
      <button type="button" onClick={()=>props.rewardPhoto(p.index, ammount)} class="btn btn-primary mt-2">Reward Photo</button>
      
  </div>
</form>
)}


      { props.walletAddress === p.owner &&(
                    <button
                      type="submit"
                      onClick={() => props.deletePhoto(p.index)}
                      className="btn btn-dark m-3"
                    >
                      remove this photo
                    </button>
                       )}
    </div>
  </div>
  ))}

</div>
};
