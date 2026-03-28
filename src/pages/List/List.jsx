import React, { useCallback, useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

function List({ url }) {
  const [list, setList] = useState([]);

  const fetchList = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch {
      toast.error("Server error while fetching list");
    }
  }, [url]);

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });
      if (response.data.success) {
        toast.success("Food removed successfully");
        await fetchList();
      } else {
        toast.error("Error removing food");
      }
    } catch {
      toast.error("Server error while removing food");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchList();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchList]);

  return (
    <div className="List add flex-col">
      <p>𝐀𝐋𝐋 𝐟𝐨𝐨𝐝 𝐥𝐢𝐬𝐭</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item) => {
          return (
            <div key={item._id} className="list-table-format">
              <img src={`${url}/images/${item.image}`} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p> ${item.price} </p>
              <p onClick={() => removeFood(item._id)} className="cursor">
                {" "}
                x{" "}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default List;
