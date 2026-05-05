"use client";

import React, { useState } from "react";
import useClientStore, {
  AddProjectType,
  ProjectType,
} from "@/store/useClientStore";
import { fetchWithAuth } from "@/src/app/services/authservice";
import { Product } from "@/store/useProductStore";
import { GetOrdersType } from "@/src/app/interfaces/OrderStoreInterface";

interface ClientProfileProgramsProps {
  projects: ProjectType[];
  clientId: number;
}

interface ModalState {
  isOpen: boolean;
  mode: "add" | "edit";
  editingProject?: ProjectType;
}

interface ProjectCache {
  products: Product[];
  orders: GetOrdersType[];
  loading: boolean;
}

export default function ClientProfilePrograms({
  projects,
  clientId,
}: ClientProfileProgramsProps) {
  const { addProject, updateProject, deleteProject, fetchProjects, loading } =
    useClientStore();

  const [modal, setModal] = useState<ModalState>({ isOpen: false, mode: "add" });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [projectCache, setProjectCache] = useState<Record<number, ProjectCache>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    project: ProjectType | null;
  }>({ isOpen: false, project: null });

  const openAddModal = () => {
    setName("");
    setDescription("");
    setNameError("");
    setModal({ isOpen: true, mode: "add" });
  };

  const openEditModal = (project: ProjectType) => {
    setName(project.Name);
    setDescription(project.Description || "");
    setNameError("");
    setModal({ isOpen: true, mode: "edit", editingProject: project });
  };

  const closeModal = () => {
    setModal({ isOpen: false, mode: "add" });
    setName("");
    setDescription("");
    setNameError("");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError("Project name is required");
      return;
    }
    const payload: AddProjectType = {
      Name: name.trim(),
      ClientId: clientId,
      Description: description.trim() || undefined,
    };
    if (modal.mode === "edit" && modal.editingProject) {
      await updateProject(modal.editingProject.Id, payload, () => {
        closeModal();
        fetchProjects(clientId);
      });
    } else {
      await addProject(payload, () => {
        closeModal();
        fetchProjects(clientId);
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.project) return;
    await deleteProject(deleteConfirm.project.Id, () => {
      setDeleteConfirm({ isOpen: false, project: null });
      fetchProjects(clientId);
    });
  };

  const loadProjectData = async (projectId: number) => {
    if (projectCache[projectId]) return;
    setProjectCache((prev) => ({
      ...prev,
      [projectId]: { products: [], orders: [], loading: true },
    }));
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/products?projectId=${projectId}`
        ),
        fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${clientId}?projectId=${projectId}`
        ),
      ]);
      const productsData = productsRes.ok ? await productsRes.json() : { data: [] };
      const ordersData = ordersRes.ok ? await ordersRes.json() : { data: [] };
      setProjectCache((prev) => ({
        ...prev,
        [projectId]: {
          products: productsData.data || [],
          orders: ordersData.data || [],
          loading: false,
        },
      }));
    } catch {
      setProjectCache((prev) => ({
        ...prev,
        [projectId]: { products: [], orders: [], loading: false },
      }));
    }
  };

  const toggleExpand = (projectId: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
        loadProjectData(projectId);
      }
      return next;
    });
  };

  const getOrderStatusClass = (status: string = "") => {
    const s = status.toLowerCase();
    if (s.includes("ship") || s.includes("complet") || s.includes("deliver"))
      return "bg-green-500/20 text-green-400";
    if (s.includes("process") || s.includes("progress"))
      return "bg-blue-500/20 text-blue-400";
    if (s.includes("pending"))
      return "bg-yellow-500/20 text-yellow-400";
    return "bg-slate-700/60 text-slate-400";
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Projects</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line w-4 h-4 inline-flex items-center justify-center"></i>
          Create New Project
        </button>
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="border-2 border-dashed border-slate-700 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="ri-folder-line text-3xl text-slate-500"></i>
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">
            No projects yet
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Create a project to link products and track orders.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer"
          >
            <i className="ri-add-line w-4 h-4 inline-flex items-center justify-center"></i>
            Create New Project
          </button>
        </div>
      ) : (
        /* Project List */
        <div className="space-y-3">
          {projects.map((project) => {
            const isExpanded = expandedIds.has(project.Id);
            const cache = projectCache[project.Id];

            return (
              <div
                key={project.Id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                {/* Card Row */}
                <div className="flex items-center gap-4 px-6 py-4">
                  {/* Project Icon */}
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <i className="ri-folder-line text-blue-400 text-lg"></i>
                  </div>

                  {/* Name + Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-0.5 flex-wrap">
                      <span className="text-white font-semibold text-sm truncate">
                        {project.Name}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${
                          project.isArchived
                            ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                            : "bg-green-500/20 text-green-400 border-green-500/30"
                        }`}
                      >
                        {project.isArchived ? "Archived" : "Active"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {project.Description || "No description"}
                    </p>
                  </div>

                  {/* Stat Badges */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400">
                      <i className="ri-t-shirt-line text-blue-500"></i>
                      {cache ? cache.products.length : 0}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-400">
                      <i className="ri-shopping-bag-line text-purple-500"></i>
                      {cache ? cache.orders.length : 0}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-8 bg-slate-800 shrink-0 hidden sm:block"></div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleExpand(project.Id)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                      title={isExpanded ? "Collapse" : "View"}
                    >
                      <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                    </button>
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({ isOpen: true, project })
                      }
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                    </button>
                    <button
                      onClick={() => toggleExpand(project.Id)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title={isExpanded ? "Collapse" : "Expand"}
                    >
                      <i
                        className={`${
                          isExpanded
                            ? "ri-arrow-up-s-line"
                            : "ri-arrow-down-s-line"
                        } w-4 h-4 flex items-center justify-center`}
                      ></i>
                    </button>
                  </div>
                </div>

                {/* Expanded Accordion */}
                {isExpanded && (
                  <div className="border-t border-slate-800 px-6 py-4 bg-slate-800/30">
                    {cache?.loading ? (
                      <div className="flex items-center justify-center py-6 gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span className="text-xs text-slate-400">Loading...</span>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {/* Products Section */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-white">
                              Products
                            </span>
                            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                              {cache?.products?.length ?? 0} item(s)
                            </span>
                          </div>
                          {!cache?.products?.length ? (
                            <p className="text-xs text-slate-500">
                              No products linked to this project.
                            </p>
                          ) : (
                            <div className="space-y-1.5">
                              {cache.products.map((product) => (
                                <div
                                  key={product.Id}
                                  className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2"
                                >
                                  <span className="text-xs text-slate-300 truncate">
                                    {product.Name}
                                  </span>
                                  <span className="text-xs text-slate-500 shrink-0 ml-2">
                                    {product.ProductCategoryName}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Orders Section */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-white">
                              Orders
                            </span>
                            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                              {cache?.orders?.length ?? 0} found
                            </span>
                          </div>
                          {!cache?.orders?.length ? (
                            <p className="text-xs text-slate-500">
                              No orders found for this project.
                            </p>
                          ) : (
                            <div className="space-y-1.5">
                              {cache.orders.map((order) => (
                                <div
                                  key={order.Id}
                                  className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2"
                                >
                                  <span className="text-xs text-slate-300">
                                    {order.OrderNumber}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${getOrderStatusClass(
                                      order.StatusName
                                    )}`}
                                  >
                                    {order.StatusName}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">
                {modal.mode === "edit" ? "Edit Project" : "Add Project"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-lg w-5 h-5 flex items-center justify-center"></i>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Project Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setNameError("");
                  }}
                  placeholder="Enter project name"
                  className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors ${
                    nameError
                      ? "border-red-500/60 focus:ring-red-500/30"
                      : "border-slate-700 focus:border-blue-500/60"
                  }`}
                />
                {nameError && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <i className="ri-error-warning-line"></i>
                    {nameError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter project description (optional)"
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-colors resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800">
              <button
                onClick={closeModal}
                disabled={loading}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-medium text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-colors cursor-pointer"
              >
                {loading
                  ? "Saving..."
                  : modal.mode === "edit"
                  ? "Update"
                  : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm({ isOpen: false, project: null })}
          />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="px-6 pt-8 pb-4 text-center">
              <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-delete-bin-line text-2xl text-red-400"></i>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Delete Project
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="text-white font-medium">
                  &ldquo;{deleteConfirm.project?.Name}&rdquo;
                </span>
                ?{" "}
                <span className="text-red-400">
                  This action cannot be undone.
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3 px-6 pb-6 pt-2">
              <button
                onClick={() =>
                  setDeleteConfirm({ isOpen: false, project: null })
                }
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-medium text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-colors cursor-pointer"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
