"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Textarea, Card } from "@heroui/react";
import PermissionGuard from "../../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { RiFeedbackLine } from "react-icons/ri";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { MdAccessTime } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import useOrderStore, { OrderComment } from "@/store/useOrderStore";

type Feedback = {
    id: string;
    text: string;
    createdAt: number;
    createdBy: string;
};

const MAX_LEN = 500;

function getInitials(name: string) {
    if (!name) return "U";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
    return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}

export default function FeedbackTab({ orderId }: { orderId: number }) {
    const [newComment, setNewComment] = useState<string>("");
    const { orderCommentsByOrderId, getOrderComments, addOrderComment, loading } = useOrderStore();
    const commentsForOrder: OrderComment[] = orderCommentsByOrderId?.[orderId] || [];

    useEffect(() => {
        if (orderId) {
            getOrderComments(orderId);
        }
    }, [orderId, getOrderComments]);

    const canSubmit = useMemo(() => newComment.trim().length > 0, [newComment]);

    const handleAddComment = () => {
        if (!canSubmit) return;
        const payload = { Comment: newComment.trim() };
        addOrderComment(orderId, payload).then(() => {
            setNewComment("");
        });
    };

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <span className="inline-flex p-2 rounded-lg bg-primary/10 text-primary">
                        <RiFeedbackLine size={18} />
                    </span>
                    <h3 className="text-lg font-semibold">Comments and Feedback</h3>
                    <span className="text-xs opacity-70">({commentsForOrder.length})</span>
                </div>
                {commentsForOrder.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm opacity-70">
                        <HiOutlineUserCircle /> No comments yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {commentsForOrder.map((c) => (
                            <Card key={c.Id} className="p-4 border-0 shadow-md">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-semibold">
                                            {getInitials(c.CreatedBy)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <HiOutlineUserCircle className="opacity-70" />
                                                <span className="text-sm font-medium">{c.CreatedBy}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] opacity-70">
                                                <MdAccessTime />
                                                <span>{new Date(c.CreatedOn).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm leading-relaxed mt-2">{c.Comment}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Card className="p-4 border-0 shadow-xl">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex p-2 rounded-lg bg-primary/10 text-primary">
                            <RiFeedbackLine size={18} />
                        </span>
                        <h3 className="text-lg font-semibold">Add Comment</h3>
                    </div>
                    <PermissionGuard required={PERMISSIONS_ENUM.ORDER.UPDATE}>
                        <div className="flex flex-col gap-2">
                            <Textarea
                                minRows={3}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value.slice(0, MAX_LEN))}
                                placeholder="Write your feedback or comment..."
                                className="w-full"
                            />
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] opacity-60">
                                    {newComment.length}/{MAX_LEN}
                                </span>
                                <Button
                                    color="primary"
                                    className="px-4"
                                    isDisabled={!canSubmit || loading}
                                    onPress={handleAddComment}
                                >
                                    <span className="flex items-center gap-2">
                                        <IoSend size={16} /> Send
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </PermissionGuard>
                </div>
            </Card>
        </div>
    );
}


