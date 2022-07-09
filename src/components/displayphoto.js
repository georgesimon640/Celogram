import React from "react";
import { useState } from "react";

export const Photos = (props) => {
  const [newDescription, setNewDescription] = useState("");
  const [ammount, setAmmount] = useState("");

  return (
    <div className="card-container">
      {props.photos.map((p) => (
        <div className="card">
          <img className="card-img-top" src={p.image} alt="Card cap" />
          <div className="card-body">
            <h5 className="card-title">{p.likes} Likes</h5>
            <h5 className="card-title">{p.rewards} Rewards</h5>
            <p className="card-text">{p.description}</p>
            {props.walletAddress !== p.owner && (
              <button
                type="button"
                onClick={() => props.likePhoto(p.index)}
                className="btn btn-info mt-2"
              >
                Like Photo
              </button>
            )}

            {props.walletAddress === p.owner && (
              <form>
                <div className="form-r">
                  <input
                    type="text"
                    className="form-control mt-4"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="edit description"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      props.editDescription(p.index, newDescription)
                    }
                    className="btn btn-info mt-2"
                  >
                    edit description
                  </button>
                </div>
              </form>
            )}

            {props.walletAddress !== p.owner && p.likes > 0 && (
              <form>
                <div className="form-r">
                  <input
                    type="text"
                    className="form-control mt-4"
                    value={ammount}
                    onChange={(e) => setAmmount(e.target.value)}
                    placeholder="enter ammount"
                  />
                  <button
                    type="button"
                    onClick={() => props.rewardPhoto(p.index, ammount)}
                    className="btn btn-info mt-2"
                  >
                    Reward Photo
                  </button>
                </div>
              </form>
            )}

            {props.walletAddress === p.owner && (
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
  );
};
