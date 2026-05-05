// src/layouts/DashboardLayout.jsx
import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Bell } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import Sidebar from "../components/Sidebar";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleSidebar = () => setCollapsed(!collapsed);

  // -----------------------------
  // Fetch Emergency Notifications
  // -----------------------------
  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/api/emergency/notifications"
      );
      setNotifications(data.emergencies || []);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  // -----------------------------
  // Poll every 8 seconds
  // -----------------------------
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // -----------------------------
  // Close dropdown when clicking outside
  // -----------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // -----------------------------
  // Mark as Read
  // -----------------------------
  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/api/emergency/read/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  // -----------------------------
  // Calculate unread count
  // -----------------------------
  const unreadCount = notifications.filter(
    (n) => !n.readBy?.includes(user?._id)
  ).length;

  return (
    <div className="dashboard-container">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <div className={`dashboard-content ${collapsed ? "collapsed" : ""}`}>
        {/* 🔹 Topbar */}
        <div className="dashboard-topbar">
          <div className="topbar-left">
            <h2>Welcome, {user?.name || "User"} 👋</h2>
          </div>

          <div className="topbar-right">
            <div
              className="notification-wrapper"
              onClick={toggleDropdown}
              ref={dropdownRef}
            >
              <Bell size={28} />

              {unreadCount > 0 && !showDropdown && (
                <span className="notification-badge">
                  {unreadCount}
                </span>
              )}

              {/* Dropdown */}
              {showDropdown && (
                <div className="notification-dropdown">
                  <h5>Emergency Alerts</h5>

                  {notifications.length === 0 ? (
                    <p className="no-notifications">No alerts</p>
                  ) : (
                    notifications.map((n) => {
                      const isUnread = !n.readBy?.includes(user?._id);

                      return (
                        <div
                          key={n._id}
                          className={`notification-item ${
                            isUnread ? "unread" : ""
                          }`}
                          onClick={() => markAsRead(n._id)}
                        >
                          <div>
                            <strong>{n.sender?.name}</strong>: {n.message}
                          </div>
                          <small>
                            {new Date(n.createdAt).toLocaleString()}
                          </small>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}