import React from "react";
import "./Order.css";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const Order = ({ url }) => {
  const [order, setOrder] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
    }
  }, [url]);

  const statusHandle = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchOrders();
      } else {
        toast.error(response.data.message || "Status update failed");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrders();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchOrders]);

  return (
    <div className="order add">
      <h3> order Page </h3>
      {order.map((order, index) => (
        <div className="order-item" key={index}>
          <img src={assets.parcel_icon} alt="" />
          <div>
            <p className="order-item-food">
              {order.items.map((item, idx) => {
                if (idx === order.items.length - 1) {
                  return item.name + " x " + item.quantity;
                } else {
                  return item.name + " x " + item.quantity + ", ";
                }
              })}
            </p>
            <p className="order-item-name">
              {order.address.firstName + " " + order.address.lastName}
            </p>
            <div className="order-item-address">
              <p> {order.address.street + ","} </p>
              <p>
                {" "}
                {order.address.city +
                  "," +
                  order.address.state +
                  " " +
                  order.address.country +
                  "" +
                  order.address.zipCode}{" "}
              </p>
            </div>
            <p className="order-item-phone">{order.address.phone}</p>
          </div>
          <p>Item : {order.items.length}</p>
          <p> ${order.amount}</p>
          <select
            onChange={(event) => statusHandle(event, order._id)}
            value={order.status}
          >
            <option value="Food Processing">Food Processing</option>
            <option value="Out For Delivery">Out For Delivery</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default Order;
