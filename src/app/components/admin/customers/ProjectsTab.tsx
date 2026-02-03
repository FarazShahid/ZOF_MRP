"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { ProjectType } from "@/store/useClientStore";
import useOrderStore from "@/store/useOrderStore";
import useProductStore from "@/store/useProductStore";
import { GetOrdersType } from "@/src/app/interfaces/OrderStoreInterface";
import { Product } from "@/store/useProductStore";
import DeleteProjectModal from "./DeleteProjectModal";
import AddProjectModal from "./AddProjectModal";
import ProjectCard from "./ProjectCard";
import TabActionButton from "./TabActionButton";
import useClientStore from "@/store/useClientStore";
import { Plus } from "lucide-react";

interface Props {
  clientId: number;
  projects: ProjectType[];
  onActionButtonReady?: (button: React.ReactNode) => void;
}

const ProjectsTab: React.FC<Props> = ({ clientId, projects, onActionButtonReady }) => {
  const { fetchProducts } = useProductStore();
  const { fetchOrders } = useOrderStore();
  const { fetchProjects } = useClientStore();

  // Local state to store products and orders organized by project ID
  const [productsByProjectId, setProductsByProjectId] = useState<Record<number, Product[]>>({});
  const [ordersByProjectId, setOrdersByProjectId] = useState<Record<number, GetOrdersType[]>>({});
  const [productsLoadingByProjectId, setProductsLoadingByProjectId] = useState<Record<number, boolean>>({});
  const [ordersLoadingByProjectId, setOrdersLoadingByProjectId] = useState<Record<number, boolean>>({});

  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  const clientProjects = useMemo<ProjectType[]>(
    () => (projects || []).filter((p) => p.ClientId === clientId),
    [projects, clientId]
  );

  // Extract fetch and store logic into a reusable function
  const fetchAndStoreProjectData = useCallback(
    async (projectId: number) => {
      // Set loading states
      setProductsLoadingByProjectId(prev => ({ ...prev, [projectId]: true }));
      setOrdersLoadingByProjectId(prev => ({ ...prev, [projectId]: true }));

      try {
        // Fetch products and orders for this project
        await Promise.all([
          fetchProducts(projectId),
          fetchOrders(clientId, projectId),
        ]);

        // Read fresh data from store after fetch completes
        const currentProducts = useProductStore.getState().products;
        const currentOrders = useOrderStore.getState().Orders;

        // Store products by project ID (filter from the store's products array)
        setProductsByProjectId(prev => ({
          ...prev,
          [projectId]: currentProducts.filter(p => p.ProjectId === projectId)
        }));

        // Store orders by project ID (orders are already filtered by the API)
        setOrdersByProjectId(prev => ({
          ...prev,
          [projectId]: currentOrders
        }));
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        // Clear loading states
        setProductsLoadingByProjectId(prev => ({ ...prev, [projectId]: false }));
        setOrdersLoadingByProjectId(prev => ({ ...prev, [projectId]: false }));
      }
    },
    [fetchProducts, fetchOrders, clientId]
  );

  const onExpand = useCallback(
    async (projectId: number) => {
      const isCurrentlyExpanded = expandedProjectId === projectId;
      setExpandedProjectId(isCurrentlyExpanded ? null : projectId);

      // If collapsing, don't fetch
      if (isCurrentlyExpanded) return;

      await fetchAndStoreProjectData(projectId);
    },
    [expandedProjectId, fetchAndStoreProjectData]
  );

  const refreshProjects = useCallback(async () => {
    // Refresh the projects list from the store
    await fetchProjects(clientId);
    
    // Refresh expanded project data if one is expanded
    if (expandedProjectId) {
      await fetchAndStoreProjectData(expandedProjectId);
    }
  }, [clientId, expandedProjectId, fetchProjects, fetchAndStoreProjectData]);

  const handleOpenAdd = useCallback(() => {
    setAddModalOpen(true);
  }, []);

  const handleCloseAdd = useCallback(async () => {
    setAddModalOpen(false);
    await refreshProjects();
  }, [refreshProjects]);

  const handleOpenEdit = useCallback((projectId: number) => {
    // Set both states together - React batches state updates
    setEditingProjectId(projectId);
    setEditModalOpen(true);
  }, []);

  const handleCloseEdit = useCallback(async () => {
    setEditModalOpen(false);
    setEditingProjectId(null);
    await refreshProjects();
  }, [refreshProjects]);

  const handleOpenDelete = useCallback((projectId: number) => {
    // Store the projectId to delete separately - don't expand the UI
    setDeletingProjectId(projectId);
    setDeleteModalOpen(true);
  }, []);

  const handleCloseDelete = useCallback(async () => {
    setDeleteModalOpen(false);
    setDeletingProjectId(null);
    await refreshProjects();
  }, [refreshProjects]);

  // Provide action button to parent component
  const actionButton = useMemo(
    () => (
      <TabActionButton
        icon={Plus}
        label="Create New Project"
        onClick={handleOpenAdd}
      />
    ),
    [handleOpenAdd]
  );

  useEffect(() => {
    onActionButtonReady?.(actionButton);
  }, [onActionButtonReady, actionButton]);


  if (!clientProjects.length) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[220px] border border-dashed rounded-2xl dark:border-gray-700 border-gray-200 bg-white dark:bg-slate-900">
          <div className="text-center px-6 py-10">
            <div className="text-gray-700 font-semibold">No projects yet</div>
            <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Create a project to link products and track orders.
            </div>
          </div>
        </div>
        <AddProjectModal
          isOpen={addModalOpen}
          isEdit={false}
          clientId={clientId}
          onClose={handleCloseAdd}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-3">
          {clientProjects.map((proj) => {
            const isOpen = expandedProjectId === proj.Id;
            const projProducts = productsByProjectId[proj.Id] ?? [];
            const projOrders = ordersByProjectId[proj.Id] ?? [];
            const isLoadingProducts = Boolean(productsLoadingByProjectId[proj.Id]);
            const isLoadingOrders = Boolean(ordersLoadingByProjectId[proj.Id]);

            return (
              <ProjectCard
                key={proj.Id}
                project={proj}
                isOpen={isOpen}
                productCount={projProducts.length}
                orderCount={projOrders.length}
                products={projProducts}
                orders={projOrders}
                productsLoading={isLoadingProducts}
                ordersLoading={isLoadingOrders}
                onToggle={() => onExpand(proj.Id)}
                onEdit={() => handleOpenEdit(proj.Id)}
                onDelete={() => handleOpenDelete(proj.Id)}
              />
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      <AddProjectModal
        key="add-project-modal"
        isOpen={addModalOpen}
        isEdit={false}
        clientId={clientId}
        onClose={handleCloseAdd}
      />

      {/* Edit Modal - Always render to prevent remounting issues */}
      <AddProjectModal
        key="edit-project-modal"
        isOpen={editModalOpen && !!editingProjectId}
        isEdit={true}
        projectId={editingProjectId}
        clientId={clientId}
        onClose={handleCloseEdit}
      />

      {/* Delete Modal */}
      <DeleteProjectModal
        isOpen={deleteModalOpen}
        projectId={deletingProjectId}
        onClose={handleCloseDelete}
      />
    </>
  );
};

export default ProjectsTab;
