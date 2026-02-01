import { useState } from "react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { client } from "@/lib/config";
import clsx from "clsx";

const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_PLANT_REGISTRY_ADDRESS as `0x${string}`;

interface PhotoProofModalProps {
    plantId: bigint;
    isOpen: boolean;
    onClose: () => void;
}

export function PhotoProofModal({ plantId, isOpen, onClose }: PhotoProofModalProps) {
    const [photo, setPhoto] = useState<File | null>(null);
    const account = useActiveAccount();
    const { mutateAsync: sendTransaction, isPending } = useSendTransaction();

    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!REGISTRY_ADDRESS) return;
        if (!account) {
            alert("Please connect your wallet");
            return;
        }
        if (!photo) {
            alert("Please select a photo");
            return;
        }

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", photo);

            const uploadRes = await fetch("/api/files", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");
            const { cid } = await uploadRes.json();

            const contract = getContract({
                client,
                chain: sepolia,
                address: REGISTRY_ADDRESS,
            });

            const transaction = prepareContractCall({
                contract,
                method: "function photoProof(uint256 plantId, string memory photoIPFS)",
                params: [plantId, cid],
            });

            await sendTransaction(transaction);
            setIsSuccess(true);
        } catch (err) {
            console.error(err);
            setError(err as Error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-green-950/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 overflow-hidden transform transition-all border border-green-100">
                {/* Decorative header blob */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-100 rounded-full blur-2xl opacity-50"></div>

                <h2 className="text-2xl font-bold text-gray-900 font-serif mb-2 relative">Log Plant Care 📸</h2>
                <p className="text-gray-500 text-sm mb-6 relative">
                    Upload a recent photo to prove your plant is healthy and thriving.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Photo Evidence</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-2xl hover:bg-gray-50 hover:border-green-300 transition-all cursor-pointer group">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-green-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label htmlFor="proof-upload" className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                                        <span>Upload a file</span>
                                        <input id="proof-upload" name="proof-upload" type="file" className="sr-only" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                {photo && <p className="text-sm font-bold text-green-700 mt-2 bg-green-50 py-1 px-2 rounded">{photo.name}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white text-gray-700 border border-gray-300 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || isUploading}
                            className={clsx(
                                "flex-1 border border-transparent font-bold py-3 px-4 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all text-white",
                                (isPending || isUploading)
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-green-500/30"
                            )}
                        >
                            {isUploading ? "Uploading..." : isPending ? "Submitting..." : "Submit Proof"}
                        </button>
                    </div>

                    {isSuccess && (
                        <div className="rounded-xl bg-green-50 p-4 border border-green-100">
                            <h3 className="text-sm font-bold text-green-800">Verified!</h3>
                            <p className="text-sm text-green-700 mt-1">Your care has been recorded on-chain.</p>
                        </div>
                    )}
                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                            <h3 className="text-sm font-bold text-red-800 mb-1">Error</h3>
                            <p className="text-sm text-red-700 break-words">{error.message}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
