import React from 'react';
import { useState } from "react";

export const AddPhoto = (props) => {

const [image, setImage] = useState('');
const [description, setDescription] = useState('');


  return <div>
      <form>
  <div class="form-row">
    
      <input type="text" class="form-control" value={image}
           onChange={(e) => setImage(e.target.value)} placeholder="image"/>
           
      <input type="text" class="form-control mt-2" value={description}
           onChange={(e) => setDescription(e.target.value)} placeholder="description"/>

      <button type="button" onClick={()=>props.addPhoto(image, description)} class="btn btn-dark mt-2">Add Photo</button>
  </div>
</form>
  </div>;
};
