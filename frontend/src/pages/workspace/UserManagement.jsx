import React, { useState, useEffect } from "react";
import {
  getAdminUsers,
  updateUserRole,
  deleteUser,
} from "../../services/api.js";
import Alert from "../../components/Alert.jsx";
import Modal from "../../components/Modal.jsx";
import Button from "../../components/Button.jsx";
import { FaUsers, FaMagnifyingGlass, FaTrashCan } from "react-icons/fa6";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setError("");
      await updateUserRole(userId, newRole);
      setSuccess("User role updated successfully");
      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to update user role");
    }
  };

  const handleDeleteUser = async () => {
    try {
      setError("");
      await deleteUser(selectedUserId);
      setSuccess("User deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedUserId(null);
      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  return (
    <>
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FaUsers className="text-primary" /> User Management
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage user roles and access permissions across the platform.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <FaMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={14}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full rounded-[10px] border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground py-12 text-center">
            Loading users...
          </p>
        ) : (
          <div className="bg-card rounded-[10px] border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border text-foreground font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">User</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Joined Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-muted-foreground"
                      >
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const initial = (u.name || u.email || "U")
                        .charAt(0)
                        .toUpperCase();
                      return (
                        <tr
                          key={u.id}
                          className="hover:bg-muted/35 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                                {initial}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate">
                                  {u.name || "Unnamed"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {u.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={u.role}
                              onChange={(e) =>
                                handleRoleChange(u.id, e.target.value)
                              }
                              className={`border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-xs`}
                            >
                              <option value="USER">USER</option>
                              <option value="REVIEWER">REVIEWER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-xs font-medium">
                            {new Date(u.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="destructive"
                              size="md"
                              onClick={() => {
                                setSelectedUserId(u.id);
                                setIsDeleteModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 text-sm"
                            >
                              <FaTrashCan size={14} />
                              <span>Delete</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
        footer={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" size="md" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </>
        }
      >
        <p className="text-sm text-foreground/85">
          Are you sure you want to delete this user? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
}
